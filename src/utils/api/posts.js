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
  addDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/config";
import { getPosts } from "../../redux/home/home.actions";
import { deleteLikeById } from "./likes";
import { getFollowers } from "./users";

export const fetchPosts = async (filter, authId) => {
  const postsRef = collection(db, `posts`);

  console.log("Ref: ", postsRef);

  if (filter.where === null) {
    const postsQuery = query(postsRef, orderBy(...filter.orderBy));

    const postsQueryLimit = query(postsRef, orderBy(...filter.orderBy));

    const postsSnapshot = await getDocs(
      filter.where === null ? postsQueryLimit : postsQuery
    );

    let posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => await populatePost(doc))
    );

    posts = posts.map((post) => ({
      ...post,
      replyToUsers: post.replyToUsers.posts,
    }));

    return posts;
  } else {
    const postsQuery = query(
      postsRef,
      where(...filter.where),
      orderBy(...filter.orderBy),
      limit(filter.limit)
    );

    const postsQueryLimit = query(postsRef, orderBy(...filter.orderBy));

    const postsSnapshot = await getDocs(
      filter.where === null ? postsQueryLimit : postsQuery
    );

    let posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => ({
        id: doc.id,
        followers: await getFollowers(doc.data().uid),
        likes: await getLikes(doc.id),
        comments: await getComments(doc.id),
        // replyToUsers: await getPostsByThreadId({ id: doc.id, ...doc.data() }),
        bookmarkedByAuthUser: await getBookmarks(authId),
        ...doc.data(),
      }))
    );
    posts = posts.map((post) => ({
      ...post,
      // replyToUsers: post.replyToUsers.posts,
      bookmarkedByAuthUser: post.bookmarkedByAuthUser.find(
        (p) => p.id === post.id
      )
        ? true
        : false,
    }));

    return posts;
  }
};

export const getPostById = async (id) => {
  const ref = doc(db, `posts/${id}`);
  const post = await getDoc(ref);

  let postDetails = await populatePost(post);

postDetails = {
  ...postDetails,
  replyToUsers: postDetails.replyToUsers.posts,

}

  return postDetails;
};

export const fetchPinnedPost = async (username) => {
  // const userRef = doc(db, `users/${profileId}`);
  const profilesRef = collection(db, "users");
  const profilesQuery = query(profilesRef, where("username", "==", username));
  const profilesSnapshot = await getDocs(profilesQuery);
  const profilesPinnedPost = profilesSnapshot.docs[0].data().pinnedPost;

  // const postsRef = collection(db, "posts");
  // const postsQuery = query(
  //   postsRef,
  //   where("username", "==", username),
  //   where("pinnedPost", "==", true)
  // );
  // const postsSnapshot = await getDocs(postsQuery);

  // console.log("Posts snapshot: ", postsSnapshot.docs[0]);

  // if (postsSnapshot.docs[0]) {
  //   let pinnedPost = await populatePost(postsSnapshot.docs[0]);

  //   pinnedPost = {
  //     ...pinnedPost,
  //     replyToUsers: pinnedPost.replyToUsers.posts,
  //   };

  //   return pinnedPost;
  // } else {
  //   return {};
  // }

  if (profilesPinnedPost?.id) {
    const postRef = doc(db, `posts/${profilesPinnedPost.id}`);
    const postDoc = await getDoc(postRef);

    let post = await populatePost(postDoc);

    console.log("Post: ", post);

    post = {
      ...post,
      replyToUsers: post.replyToUsers.posts,
    };

    return post;
  } else {
    return {};
  }
};

export const refreshPost = async (postId) => {
  const post = await getPostById(postId);

  return post;
};

export const getLikes = async (id) => {
  const likes = await getDocs(collection(db, `posts/${id}/likes`));
  // const likeDocs = await Promise.all(
  //   likeIds.docs.map(async (user) => await getDoc(doc(db, `users/${user.id}`)))
  // );
  // const likes = likeDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const likeIds = likes.docs.map((user) => user.id);

  return likeIds;
};

export const getProfilesLikedPosts = async (profileId) => {
  const likesRef = collection(db, `users/${profileId}/likes`);
  const likeDocs = await getDocs(likesRef);
  const likeIds = await Promise.all(
    likeDocs.docs.map(async (doc) => doc(db, `posts/${doc.id}`))
  );
  // const likeIds = await Promise.all(
  //   likeDocs.docs.map(async (doc) => await getDoc(doc(db, `posts/${doc.id}`)))
  // );
  const likes = likeIds.map((doc) => doc.id);

  console.log("Likes: ", likes);
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
    batch.set(userLikesRef, { timestamp: serverTimestamp() });
    batch.set(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `posts/${id}/likes`));

    return likes.docs.map((doc) => doc.id);
  } else {
    batch.delete(userLikesRef, {});
    batch.delete(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `posts/${id}/likes`));

    return likes.docs.map((doc) => doc.id);
  }
};

export const deletePostById = async (postId, authId) => {
  const postRef = doc(db, `posts/${postId}`);
  const likesRef = doc(db, `users/${authId}/likes/${postId}`);
  const authUserRef = doc(db, `users/${authId}`);
  const bookmarkRef = doc(db, `bookmarks/${postId}`);

  const postSnapshot = await getDoc(postRef);
  const authUserSnapshot = await getDoc(authUserRef);

  const pinnedPost = authUserSnapshot.data().pinnedPost;
  const post = { id: postSnapshot.id, ...postSnapshot.data() };

  if (post && post.uid === authId) {
    const batch = writeBatch(db);

    if (pinnedPost.id === post.id) {
      batch.update(authUserRef, { pinnedPost: {} });
    }

    batch.delete(postRef, {});
    batch.delete(bookmarkRef, { userRef: authUserRef });
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
  const likes = await getLikes(post.id);

  if (post.uid === authId) {
    await updateDoc(userRef, { pinnedPost: post });
    // await updateDoc(postRef, { pinnedPost: true });

    // if (currentPinnedPost.id) {
    //   const currentPinnedPostRef = doc(db, `posts/${currentPinnedPost.id}`);
    //   await updateDoc(currentPinnedPostRef, { pinnedPost: false });
    // }

    return { ...post, likes };
  }
};
export const unpinPost = async (postId, authId) => {
  const userRef = doc(db, `users/${authId}`);
  const postRef = doc(db, `posts/${postId}`);

  const postSnapshot = await getDoc(postRef);
  const post = { id: postSnapshot.id, ...postSnapshot.data() };
  const likes = await getLikes(post.id);

  if (post.uid === authId) {
    await updateDoc(userRef, { pinnedPost: {} });
    // await updateDoc(postRef, { pinnedPost: false });

    return { ...post, likes };
  }
};


export const addBookmarkById = async (postId, authId) => {
  const userRef = doc(db, `users/${authId}`);
  await setDoc(doc(db, "bookmarks", postId), { userRef });

  return postId;
};

export const getBookmarks = async (userId) => {
  const userRef = doc(db, `users/${userId}`);
  const bookmarksRef = collection(db, "bookmarks");
  const bookmarksQuery = query(bookmarksRef, where("userRef", "==", userRef));
  const bookmarkIds = await getDocs(bookmarksQuery);

  const bookmarkDocs = await Promise.all(
    bookmarkIds.docs.map(async (d) => await getDoc(doc(db, `posts/${d.id}`)))
  );

  let bookmarks = await Promise.all(
    bookmarkDocs.map(async (doc) => await populatePost(doc))
  );

  bookmarks = bookmarks.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));

  return bookmarks;
};

export const getBookmarkIds = async (userId) => {
  const userRef = doc(db, `users/${userId}`);
  const bookmarksRef = collection(db, "bookmarks");
  const bookmarksQuery = query(bookmarksRef, where("userRef", "==", userRef));
  const bookmarkDocs = await getDocs(bookmarksQuery);
  console.log("Query: ", bookmarksQuery);

  const bookmarkIds = bookmarkDocs.docs.map((doc) => doc.id);

  return bookmarkIds;
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

export const deleteBookmarkById = async (postId, userId) => {
  const bookmarkRef = doc(db, `bookmarks/${postId}`);
  const userRef = doc(db, `users/${userId}`);

  const batch = writeBatch(db);

  batch.delete(bookmarkRef, { userRef: userRef });

  await batch.commit();

  return postId;
};

export const getComments = async (replyTo) => {
  const postsRef = collection(db, `posts`);
  const replyToRef = doc(db, `posts/${replyTo}`);

  const filter = query(postsRef, where("replyTo", "==", replyToRef));

  const comments = await getDocs(filter);

  const commentIds = comments.docs.map((comment) => comment.id);

  // const comments = await Promise.all(
  //   commentsSnapshot.docs.map(async (post) => await populatePost(post))
  // );

  return comments ? commentIds : [];
};

export const getUsersPostsCount = async (userId) => {
  const userRef = doc(db, `users/${userId}`);
  const postsRef = collection(db, "posts");

  const postsQuery = query(postsRef, where("userRef", "==", userRef));

  const postsSnapshot = await getDocs(postsQuery);

  const usersPostsCount = postsSnapshot.docs.length;

  return usersPostsCount;
};

export const getPostsByThreadId = async (postId) => {
  const replyTosRef = collection(db, `posts/${postId}/replyTo`);
  const replyTosQuery = query(replyTosRef, orderBy("timestamp", "asc"));
  const replyTosDocs = await getDocs(replyTosQuery);

  let replyTos = await Promise.all(
    replyTosDocs.docs.map(
      async (document) => await getDoc(doc(db, `posts/${document.id}`))
    )
  );

  let deletedPosts = replyTos.filter((doc) => !doc.data());

  const deletedPostIds = deletedPosts.map((doc) => doc.id);

  replyTos = replyTos.filter((doc) => doc.data());

  const posts = await Promise.all(
    replyTos.map(async (doc) => await populatePost(doc))
  );

  return { posts, deletedPostIds };
};

export const fetchProfileTweets = async (username) => {
  const postsRef = collection(db, "posts");
  // const profileRef = doc(db, `users/${profileId}`);
  // const profilesRef = collection(db, "users");
  // const profilesQuery = query(profilesRef, where("username", "==", username));
  // const profilesSnapshot = await getDocs(profilesQuery);
  // const profile = {
  //   id: profilesSnapshot.docs[0].id,
  //   ...profilesSnapshot.docs[0].data(),
  // };

  // console.log("profile: ", profile);

  const postsQuery = query(
    postsRef,
    where("username", "==", username),
    where("postType", "==", "tweet"),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  const postsSnapshot = await getDocs(postsQuery);

  let posts = await Promise.all(
    postsSnapshot.docs.map(async (doc) => await populatePost(doc))
  );

  posts = posts.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));

  return posts;
};

export const fetchProfileTweetsAndReplies = async (username) => {
  const postsRef = collection(db, "posts");
  // const profilesRef = collection(db, "users");
  // const profilesQuery = query(profilesRef, where("username", "==", username));
  // const profilesSnapshot = await getDocs(profilesQuery);
  // const profile = {
  //   id: profilesSnapshot.docs[0].id,
  //   ...profilesSnapshot.docs[0].data(),
  // };

  const postsQuery = query(
    postsRef,
    where("username", "==", username),
    orderBy("timestamp", "desc"),
    limit(10)
  );
  const postsSnapshot = await getDocs(postsQuery);

  let posts = await Promise.all(
    postsSnapshot.docs.map(async (doc) => await populatePost(doc))
  );

  posts = posts.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));

  return posts;
};

export const fetchProfileMediaPosts = async (username) => {
  const postsRef = collection(db, "posts");
  // const profilesRef = collection(db, "users");
  // const profilesQuery = query(profilesRef, where("username", "==", username));
  // const profilesSnapshot = await getDocs(profilesQuery);
  // const profile = {
  //   id: profilesSnapshot.docs[0].id,
  //   ...profilesSnapshot.docs[0].data(),
  // };

  const postsQuery = query(
    postsRef,
    where("username", "==", username),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(postsQuery);

  let posts = await Promise.all(
    snapshot.docs
      .filter((doc) => doc.data().media !== "")
      .map(async (doc) => await populatePost(doc))
  );

  posts = posts.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));

  return posts;
};

export const populatePost = async (doc) => ({
  ...doc.data(),
  id: doc.id,
  followers: await getFollowers(doc.data()?.uid),
  likes: await getLikes(doc.id),
  comments: await getComments(doc.id),
  replyToUsers: await getPostsByThreadId(doc.id),
});
