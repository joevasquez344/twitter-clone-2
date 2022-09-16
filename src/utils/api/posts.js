import { getAuth } from "firebase/auth";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
  where,
  orderBy,
  query,
  deleteDoc,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/config";

export const fetchPosts = async (filter) => {
  const postsRef = collection(db, `posts`);
  // const replyToRef = doc(db, `users/${}`)
  // const replyToRef = doc(db, `posts/${replyTo}`);

  if (filter.where === null) {
    const postsQuery = query(postsRef, orderBy(...filter.orderBy));

    const postsQueryLimit = query(postsRef, orderBy(...filter.orderBy));

    const postsSnapshot = await getDocs(
      filter.where === null ? postsQueryLimit : postsQuery
    );

    const posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        comments: await getComments(doc.id),

        ...doc.data(),
      }))
    );

    return posts;
  } else {
    const postsQuery = query(
      postsRef,
      where(...filter.where),
      orderBy(...filter.orderBy)
    );

    const postsQueryLimit = query(postsRef, orderBy(...filter.orderBy));

    const postsSnapshot = await getDocs(
      filter.where === null ? postsQueryLimit : postsQuery
    );

    const posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        comments: await getComments(doc.id),

        ...doc.data(),
      }))
    );

    return posts;
  }
};

export const getPostById = async (id) => {
  const ref = doc(db, "posts", id);
  const post = await getDoc(ref);

  const likes = await getPostLikes(id);

  return {
    id: post.id,
    likes,
    followers: await (
      await getDocs(collection(db, `users/${post.data().uid}/followers`))
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ...post.data(),
  };
};

export const refreshPost = async (postId) => {
  const post = await getPostById(postId);

  return post;
};

export const getPostLikes = async (id) => {
  const userIds = await getDocs(collection(db, `posts/${id}/likes`));
  const userDocs = await Promise.all(
    userIds.docs.map(async (user) => await getDoc(doc(db, `users/${user.id}`)))
  );
  const users = userDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return users;
};

export const toggleLikePost = async (id) => {
  const batch = writeBatch(db);

  const userId = auth.currentUser.uid;

  const userLikesRef = doc(db, `users/${userId}/likes/${id}`);
  const postLikesRef = doc(db, `posts/${id}/likes/${userId}`);

  const postLikesCollection = collection(db, `posts/${id}/likes`);
  const postLikes = await getDocs(postLikesCollection);

  const match = postLikes.docs.find((like) => like.id === userId);

  if (!match) {
    batch.set(userLikesRef, {});
    batch.set(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `posts/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    batch.delete(userLikesRef, {});
    batch.delete(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `posts/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
};

export const deletePost = async (postId, authId) => {
  const postRef = doc(db, `posts/${postId}`);
  const postSnapshot = await getDoc(postRef);

  // const followersSubCollection = collection(db, `users/${authId}/followers`);
  const likesRef = doc(db, `users/${authId}/likes/${postId}`);

  

  const authUserRef = doc(db, `users/${authId}`);
  const authUserSnapshot = await getDoc(authUserRef);

  const pinnedPost = authUserSnapshot.data().pinnedPost;

  const post = { id: postSnapshot.id, ...postSnapshot.data() };

  if (post && post.uid === authId) {
    const batch = writeBatch(db);

    if (pinnedPost.id === post.id) {
      batch.update(authUserRef, { pinnedPost: {} });
    }

    batch.delete(postRef, {});
    // batch.delete(followersSubCollection, {});
    batch.delete(likesRef, {});

    await batch.commit();

    return post.id;
  }
};

export const pinPost = async (postId, authId) => {
  const userRef = doc(db, `users/${authId}`);
  const postRef = doc(db, `posts/${postId}`);

  const postSnapshot = await getDoc(postRef);
  const post = { id: postSnapshot.id, ...postSnapshot.data() };
  const likes = await getPostLikes(post.id);

  if (post.uid === authId) {
    await updateDoc(userRef, { pinnedPost: post });

    return { ...post, likes };
  }
};
export const unpinPost = async (postId, authId) => {
  const userRef = doc(db, `users/${authId}`);
  const postRef = doc(db, `posts/${postId}`);

  const postSnapshot = await getDoc(postRef);
  const post = { id: postSnapshot.id, ...postSnapshot.data() };
  const likes = await getPostLikes(post.id);

  if (post.uid === authId) {
    await updateDoc(userRef, { pinnedPost: {} });

    return { ...post, likes };
  }
};

export const addBookmark = async (postId, authId) => {
  const userRef = doc(db, `users/${authId}`);
  await setDoc(doc(db, "bookmarks", postId), { userRef });
};

export const getBookmarks = async (userId) => {
  const userRef = doc(db, `users/${userId}`);
  const usersPinnedPost = await getDoc(userRef);
  const bookmarksRef = collection(db, "bookmarks");
  const bookmarksQuery = query(bookmarksRef, where("userRef", "==", userRef));
  const bookmarkIds = await getDocs(bookmarksQuery);

  const bookmarkDocs = await Promise.all(
    bookmarkIds.docs.map(async (d) => await getDoc(doc(db, `posts/${d.id}`)))
  );

  const bookmarks = await Promise.all(
    bookmarkDocs.map(async (doc) => ({
      id: doc.id,
      pinnedPost: usersPinnedPost.id === doc.id ? usersPinnedPost.data() : {},
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      likes: await getPostLikes(doc.id),
      comments: await getComments(doc.id),
      ...doc.data(),
    }))
  );
  return bookmarks;
};

export const clearBookmarks = async (userId) => {
  const userRef = doc(db, `users/${userId}`);

  const ref = collection(db, "bookmarks");
  const filter = query(ref, where("userRef", "==", userRef));

  const ids = await getDocs(filter);

  const bookmarks = await Promise.all(
    ids.docs.map(async (d) => await deleteDoc(doc(db, `bookmarks/${d.id}`)))
  );

  if (bookmarks[0] === undefined) {
    return {
      message: "Bookmarks deleted",
      success: true,
    };
  } else {
    return {
      message: "Error",
      success: false,
    };
  }
};

export const deleteBookmark = async (postId, userId) => {
  const bookmarkRef = doc(db, `bookmarks/${postId}`);
  const userRef = doc(db, `users/${userId}`);

  const batch = writeBatch(db);

  batch.delete(bookmarkRef, { userRef: userRef });

  await batch.commit();
};

export const getComments = async (replyTo) => {
  console.log("reply: ", replyTo);
  const postsRef = collection(db, `posts`);
  const replyToRef = doc(db, `posts/${replyTo}`);

  const filter = query(postsRef, where("replyTo", "==", replyToRef));

  const commentsSnapshot = await getDocs(filter);

  const comments = commentsSnapshot.docs.map((post) => ({
    id: post.id,
    ...post.data(),
  }));

  return comments ? comments : [];
};
