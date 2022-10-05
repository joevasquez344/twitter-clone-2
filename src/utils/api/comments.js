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
import { addPostToThread } from "./posts";

export const createComment = async (input, post, user, postType) => {
  const batch = writeBatch(db);

  const userData = {
    name: user.name,
    username: user.username,
  };

  if (postType === "comment") {
    const users = post.replyToUsers.filter(
      (user) => user.username !== post.username
    );

    const data = {
      ...userData,
      message: input,
      timestamp: serverTimestamp(),
      postType: "comment",
      avatar: "",
      media: "",
      replyTo: doc(db, `/posts/${post.id}/`),
      replyToUsers: [...post.replyToUsers, { ...post }],
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
      pinnedPost: false,
    };

    const postsReplyToRef = collection(db, `posts/${post.id}/replyTo`);

    const replyTosDocs = await getDocs(postsReplyToRef);

    const replyTosIds = await Promise.all(
      replyTosDocs.docs.map((doc) => doc.id)
    );

    const createdPostRef = await addDoc(collection(db, "posts"), data);
    const postRef = doc(db, `posts/${createdPostRef.id}`);
    const userPostsRef = doc(db, `users/${user.id}/posts/${createdPostRef.id}`);
    const replyToRef = doc(db, `posts/${createdPostRef.id}/replyTo/${post.id}`);

    // const threadId = await addPostToThread(createdPostRef.id, post.threadId);

    // batch.update(postRef, { threadId });
    batch.set(replyToRef, { timestamp: post.timestamp });
    batch.set(userPostsRef, {});

    replyTosDocs.docs.map((document) =>
      batch.set(doc(db, `posts/${createdPostRef.id}/replyTo/${document.id}`), {
        timestamp: document.data().timestamp
      })
    );

    await batch.commit();
  }

  if (postType === "tweet") {
    const data = {
      ...userData,
      message: input,
      timestamp: serverTimestamp(),
      postType: "comment",
      media: "",
      avatar: "",
      replyTo: doc(db, `/posts/${post.id}/`),
      replyToUsers: [{ ...post }],
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
      pinnedPost: false,
    };

    const postsReplyToRef = collection(db, `posts/${post.id}/replyTo`);

    const replyTosDocs = await getDocs(postsReplyToRef);

    const replyTosIds = await Promise.all(
      replyTosDocs.docs.map((doc) => doc.id)
    );

    const createdPostRef = await addDoc(collection(db, "posts"), data);
    const postRef = doc(db, `posts/${createdPostRef.id}`);
    const userPostsRef = doc(db, `users/${user.id}/posts/${createdPostRef.id}`);
    const replyToRef = doc(db, `posts/${createdPostRef.id}/replyTo/${post.id}`);

    const threadId = await addPostToThread(createdPostRef.id, post.threadId);

    batch.update(postRef, { threadId });
    batch.set(replyToRef, { timestamp: post.timestamp });
    batch.set(userPostsRef, {});

    replyTosIds.map((id) =>
      batch.set(doc(db, `posts/${createdPostRef.id}/replyTo/${id}`), {
        timestamp: serverTimestamp(),
      })
    );

    await batch.commit();
  }
};
