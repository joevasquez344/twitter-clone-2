import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import {
  serverTimestamp,
  setDoc,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  query,
  limit,
  where,
  getDoc,
  getDocFromServer,
  writeBatch,
} from "firebase/firestore";
import { auth } from "../../firebase/config";

export const getCommentsByTweetId = async (tweetRefId, postType) => {
  if (postType === "tweet") {
    const tweetRef = doc(db, "tweets", tweetRefId);

    const ref = collection(db, "comments");
    const commentsQuery = query(
      ref,
      where("tweetRef", "==", tweetRef),
      orderBy("timestamp", "desc")
    );

    const commentIds = await getDocs(commentsQuery);

    const comments = await Promise.all(
      commentIds.docs.map(async (doc) => ({
        id: doc.id,
        likes: await (
          await getDocs(collection(db, `comments/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id })),
        ...doc.data(),
      }))
    );

    return comments;
  }
  if (postType === "comment") {
    const tweetRef = doc(db, "comments", tweetRefId);

    const ref = collection(db, "comments");
    const commentsQuery = query(
      ref,
      where("tweetRef", "==", tweetRef),
      orderBy("timestamp", "desc")
    );

    const commentIds = await getDocs(commentsQuery);
    const comments = await Promise.all(
      commentIds.docs.map(async (doc) => ({
        id: doc.id,
        likes: await (
          await getDocs(collection(db, `comments/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id })),
        ...doc.data(),
      }))
    );

    return comments;
  }
};

export const getCommentsByUserId = async (userId) => {
  const userRef = doc(db, "users", userId);

  const ref = collection(db, "comments");
  const commentsQuery = query(
    ref,
    where("userRef", "==", userRef),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(commentsQuery);

  const comments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return comments;
};

export const createComment = async (input, postId, user, postType) => {
    const userData = {
      name: user.name,
      username: user.username,
    };
    const data = {
      ...userData,
      message: input,
      timestamp: serverTimestamp(),
      postType: "comment",
      avatar: "",
      replyTo: doc(db, `/posts/${postId}/`),
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
    };
    const createdPostRef = await addDoc(collection(db, "posts"), data);
    const userPostsRef = doc(
      db,
      `users/${user.id}/posts/${createdPostRef.id}`
    );

    const batch = writeBatch(db);
    batch.set(userPostsRef, {});
    await batch.commit();
};

export const getCommentById = async (id) => {
  const commentRef = doc(db, "comments", id);
  const comment = await getDoc(commentRef);

  const likes = await (
    await getDocs(collection(db, `comments/${id}/likes`))
  ).docs.map((doc) => ({ id: doc.id }));

  return {
    id: comment.id,
    likes,
    ...comment.data(),
  };
};

export const toggleLikeComment = async (id) => {
  const batch = writeBatch(db);

  const userId = auth.currentUser.uid;

  const userLikesRef = doc(db, `users/${userId}/likes/${id}`);
  const postLikesRef = doc(db, `posts/${id}/likes/${userId}`);

  const postRef = doc(db, `comments/${id}`);
  const userRef = doc(db, `users/${userId}`);

  const tweet = await getDoc(postRef);
  const user = await getDoc(userRef);

  const postLikesCollection = collection(db, `posts/${id}/likes`);
  const postLikes = await getDocs(postLikesCollection);

  const match = postLikes.docs.find((like) => like.id === userId);

  if (!match) {
    batch.set(userLikesRef, { ...tweet.data() });
    batch.set(postLikesRef, { ...user.data() });

    await batch.commit();

    const likes = await getDocs(collection(db, `comments/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    batch.delete(userLikesRef, {});
    batch.delete(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `comments/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
};

export const deleteCommentById = async (id) => {};
