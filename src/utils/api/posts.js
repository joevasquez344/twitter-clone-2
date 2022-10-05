import { getAuth } from "firebase/auth";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

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
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/config";
import { getPosts } from "../../redux/home/home.actions";

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

    // const imageRef = ref(storage, ``);

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
        // replyToUsers: await getReplyToPosts(doc.data().threadId),
        // media: () => {
        //  listAll(ref(storage, `${doc.data().uid}/uploaded`))
        //     .then((res) => {
        //       const match = res.items.find(item => {
        //         getDownloadURL(item).then(url => {

        //         })
        //       })
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
        // },
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
        // replyToUsers: await getReplyToPosts(doc.data().threadId),
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
    comments: await getComments(post.id),
    // replyToUsers: await getReplyToPosts(doc.data().threadId),

    ...post.data(),
  };
};

export const refreshPost = async (postId) => {
  const post = await getPostById(postId);

  return post;
};

export const getPostLikes = async (id) => {
  const likeIds = await getDocs(collection(db, `posts/${id}/likes`));
  const likeDocs = await Promise.all(
    likeIds.docs.map(async (user) => await getDoc(doc(db, `users/${user.id}`)))
  );
  const likes = likeDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return likes;
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

export const deletePostById = async (postId, authId) => {
  const postRef = doc(db, `posts/${postId}`);
  const postSnapshot = await getDoc(postRef);

  const likesRef = doc(db, `users/${authId}/likes/${postId}`);
  const bookmarkRef = doc(db, `bookmarks/${postId}`);

  const postLikesref = collection(db, `posts/${postId}/likes`);
  const userIds = await getDocs(postLikesref);

  await Promise.all(
    userIds.docs.map(
      async (d) => await deleteDoc(doc(db, `posts/${postId}/likes/${d.id}`))
    )
  );

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
    batch.delete(bookmarkRef, { userRef: authUserRef });
    batch.delete(likesRef, {});

    // const replyToRef = doc(db, post.replyTo);
    // const replyToDoc = await getDoc(replyToRef);

    // batch.update(replyToRef, {
    //   replyToUsers: post.replyToUsers.filter((p) => p.id !== replyToDoc.id),
    // });

    await batch.commit();

    const postsRef = collection(db, `posts`);
    const postsQuery = query(postsRef, where("replyTo", "==", postRef));
    const postsSnapshot = await getDocs(postsQuery);
    // await Promise.all(
    //   postsSnapshot.docs.map(
    //     async (d) =>
    //       await updateDoc(doc(db, `posts/${d.id}`), {
    //         replyTo: `/posts/null`,
    //       })
    //   )
    // );

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
    await updateDoc(postRef, { pinnedPost: true });

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
    await updateDoc(postRef, { pinnedPost: false });

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
      pinnedPost:
        usersPinnedPost.id === doc.id
          ? { id: usersPinnedPost.id, ...usersPinnedPost.data() }
          : {},
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

export const getUsersPostsCount = async (userId) => {
  const userRef = doc(db, `users/${userId}`);
  const postsRef = collection(db, "posts");

  const postsQuery = query(postsRef, where("userRef", "==", userRef));

  const postsSnapshot = await getDocs(postsQuery);

  const usersPostsCount = postsSnapshot.docs.length;

  return usersPostsCount;
};

export const getReplyToPosts = async (post) => {
  const postsRef = collection(db, `posts`);
  // const originalPostRef = doc(db, `posts/${post.replyToUsers[0].id}`);

  const postIds = post.replyToUsers?.map((post) => post.id);

  const postDocs = await Promise.all(
    postIds.map(async (id) => await getDoc(doc(db, `posts/${id}`)))
  );

  console.log("POSTS DOCS: ", postDocs);

  const posts = await Promise.all(
    postDocs
      .filter((doc) => doc._document !== null)
      .map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        comments: await getComments(doc.id),
        // media: () => {
        //  listAll(ref(storage, `${doc.data().uid}/uploaded`))
        //     .then((res) => {
        //       const match = res.items.find(item => {
        //         getDownloadURL(item).then(url => {

        //         })
        //       })
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
        // },
        ...doc.data(),
      }))
  );

  // const postsQuery = query(postsRef, where("replyTo", "==", originalPostRef));

  // const postsSnapshot = await getDocs(postsQuery);

  // const posts = await Promise.all(
  //   postsSnapshot.docs.map(async (doc) => ({
  //     id: doc.id,
  //     followers: await (
  //       await getDocs(collection(db, `users/${doc.data().uid}/followers`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     likes: await (
  //       await getDocs(collection(db, `posts/${doc.id}/likes`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     comments: await getComments(doc.id),
  //     // media: () => {
  //     //  listAll(ref(storage, `${doc.data().uid}/uploaded`))
  //     //     .then((res) => {
  //     //       const match = res.items.find(item => {
  //     //         getDownloadURL(item).then(url => {

  //     //         })
  //     //       })
  //     //     })
  //     //     .catch((err) => {
  //     //       console.log(err);
  //     //     });
  //     // },
  //     ...doc.data(),
  //   }))
  // );

  console.log("POSTS WORK: ", posts);

  return [...posts, { userDeletedPost: true }];
};

export const getPostsByThreadId = async (threadId, post) => {
  // const threadPostsRef = collection(db, `threads/${threadId}/posts`);
  // const threadPostsQuery = query(threadPostsRef, orderBy("timestamp", "asc"));
  // const threadPostsSnapshot = await getDocs(threadPostsQuery);
  // const threadPostsIds = await Promise.all(
  //   threadPostsSnapshot.docs.map(
  //     async (document) => await getDoc(doc(db, `posts/${document.id}`))
  //   )
  // );

  // const ref = collection(db, "posts");
  // const filter = query(
  //   ref,
  //   where("threadId", "==", threadId),
  //   where("postType", "==", "tweet")
  // );
  // const snapshot = await getDocs(filter);

  // const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // const d = docs[0];

  // const originalPostRef = doc(db, `posts/${d.id}`);
  // const originalPostSnapshot = await getDoc(originalPostRef);
  // const originalTweet = {
  //   id: originalPostSnapshot.id,
  //   ...originalPostSnapshot.data(),
  // };

  // const postRef = doc(db, `posts/${post.id}`);
  // const postSnapshot = await getDoc(postRef);
  // const postDetails = { id: postSnapshot.id, ...postSnapshot.data() };

  // const replyToQuery = query(ref, where("replyTo", "==", originalPostRef));

  // const replyToSnapshot = await getDocs(replyToQuery);

  const replyTosRef = collection(db, `posts/${post.id}/replyTo`);

  const replyTosQuery = query(replyTosRef, orderBy("timestamp", "asc"));

  const replyTosDocs = await getDocs(replyTosQuery);

  let replyTos = await Promise.all(
    replyTosDocs.docs.map(
      async (document) => await getDoc(doc(db, `posts/${document.id}`))
    )
  );

  let deletedPosts = replyTos.filter((doc) => !doc.data());

  const deletedPostIds = deletedPosts.map((doc) => doc.id);

  console.log("Deleted Posts: ", deletedPostIds);

  replyTos = replyTos.filter((doc) => doc.data());

  const posts = await Promise.all(
    replyTos.map(async (doc) => ({
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

  console.log("POSTS: ", posts);

  return { posts, deletedPostIds };

  // const replyTos = replyToSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

  // const replyTos = await Promise.all(
  //   replyToSnapshot.docs.map(async (d) => ({
  //     id: d.id,
  //     threadTo: await getDoc(doc(db, `posts/${d.data().replyTo.id}`)),
  //     ...d.data(),
  //   }))
  // );

  // This array will include the TweetDetails post that is a replyTo to the
  // original tweet (top level tweet that is not a comment type) and any other posts
  // that is a replyTo to the original tweet

  // const newPosts = replyTos.map((item) => ({
  //   // threadTo.data() is not working (once it works, move on to the Structure process below)
  //   ...item,
  //   threadTo: item.threadTo.data(),
  // }));

  // Structure:
  // [
  //    { fetch the top level tweet that is not a comment },
  //    [map the newPosts but filter out the post that is the TweetDetailsPost
  //    - map over each value but return a nested array with 2 items (item, and the item.threadTo)
  //            - this will create a daisy chain effect coupling 2 items that are mapped together as an array
  //              (nested arrays within the 1 original array)
  //    ],
  //    {TweetDetails Post}
  //    [Comments]
  // ]

  // let posts = await Promise.all(
  //   threadPostsIds.map(async (d) => ({
  //     id: d.id,
  //     followers: await (
  //       await getDocs(collection(db, `users/${d.data().uid}/followers`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     likes: await (
  //       await getDocs(collection(db, `posts/${d.id}/likes`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     comments: await getComments(d.id),
  //     threadTo: await getDoc(doc(db, `posts/${d.data().replyTo.id}`)),
  //     // replyToUsername: await getDoc(
  //     //   query(
  //     //     doc(
  //     //       db,
  //     //       JSON.stringify(d.data().replyTo)
  //     //         .split("/")
  //     //         .filter((item, idx) => idx !== 0)
  //     //         .join()
  //     //     ),
  //     //     where("replyTo", "==", d.data().replyTo)
  //     //   )
  //     // ).data().username,
  //     ...d.data(),
  //   }))
  // );

  // posts = posts.map((item) => ({
  //   // threadTo.data() is not working (once it works, move on to the Structure process below)
  //   ...item,
  //   threadTo: { id: item.threadTo.id, ...item.threadTo.data() },
  // }));

  // posts = posts
  //   .filter((post) => post.threadTo !== undefined)
  //   .map((post) => {
  //     post = [post.threadTo, post];
  //     return post;
  //   });

  // console.log("New Posts: ", posts);

  // let arr = [];

  // posts.forEach((post) => {
  //   arr.push(post[0]);
  //   arr.push(post[1]);
  // });

  // posts = arr;

  // const ids = posts.map((o) => o.id);
  // const removedDuplicates = posts.filter(
  //   ({ id }, index) => !ids.includes(id, index + 1)
  // );

  // posts = removedDuplicates;

  // console.log("POSTS: ", posts);
  // posts = posts.filter((post) => post.id !== "null");

  // let thread = [];

  // thread = postDetails.replyToUsers;

  // const postIds = thread.map((post) => post.id);

  // const postDocs = await Promise.all(
  //   postIds.map(async (d) => await getDoc(doc(db, `posts/${d.id}`)))
  // );

  // const tweets = await Promise.all(
  //   postDocs.map(async (doc) => ({
  //     id: doc.id,
  //     // followers: await (
  //     //   await getDocs(collection(db, `users/${doc.data().uid}/followers`))
  //     // ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     likes: await (
  //       await getDocs(collection(db, `posts/${doc.id}/likes`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     comments: await getComments(doc.id),
  //     ...doc.data(),
  //   }))
  // );

  // console.log("TWEETS: ", tweets);

  // return tweets;

  // posts = posts
  //   .filter((post) => post.id !== "null")
  //   .filter((post) => post.replyTo.id !== postDetails.id)
  //   // .filter((post, idx) => postDetailsReplyToIndex > idx)
  //   .filter((post) => post.id !== originalTweet.id);
  // console.log("POSTS: ", posts);

  // const postDetailsIndex = posts.findIndex((object) => {
  //   return object.id === postDetails.id;
  // });
  // const postDetailsReplyToIndex = posts.findIndex((object) => {
  //   return object.id === postDetails.replyTo.id;
  // });

  // posts = posts.filter((post, idx) => postDetailsReplyToIndex >= idx);

  // console.log("INDEX: ", postDetailsIndex);
  // console.log("REPLY TO INDEX: ", postDetailsReplyToIndex);

  // // posts = posts.map((post, idx) => idx)

  // const newArr = [originalTweet, ...posts];

  // return newArr;
};

export const addPostToThread = async (postId, threadId) => {
  const batch = writeBatch(db);
  if (threadId !== null) {
    const threadRef = doc(db, `threads/${threadId}/posts/${postId}`);
    const threadsRef = collection(db, "threads");

    await addDoc(threadsRef, {});

    batch.set(threadRef, {
      timestamp: serverTimestamp(),
    });

    await batch.commit();

    return threadId;
  } else {
    const threadsRef = collection(db, "threads");
    const docRef = await addDoc(threadsRef, {});
    const threadRef = doc(db, `threads/${docRef.id}/posts/${postId}`);

    batch.set(threadRef, {
      timestamp: serverTimestamp(),
    });

    await batch.commit();

    return docRef.id;
  }
};

export const fetchMediaPosts = async (profileId) => {
  const postsRef = collection(db, "posts");

  const filter = query(
    postsRef,
    where("uid", "==", profileId),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(filter);

  const posts = await Promise.all(
    snapshot.docs
      .filter((doc) => doc.data().media !== "")
      .map(async (doc) => ({
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
};
