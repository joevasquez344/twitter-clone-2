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


export const createComment = async (input, post, user, postType) => {
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
      replyTo: doc(db, `/posts/${post.id}/`),
      replyToUsers: [...post.replyToUsers, { ...post }],
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
    };

    const createdPostRef = await addDoc(collection(db, "posts"), data);
    const userPostsRef = doc(db, `users/${user.id}/posts/${createdPostRef.id}`);

    const batch = writeBatch(db);
    batch.set(userPostsRef, {});
    await batch.commit();
  }

  if (postType === "tweet") {
    const data = {
      ...userData,
      message: input,
      timestamp: serverTimestamp(),
      postType: "comment",
      avatar: "",
      replyTo: doc(db, `/posts/${post.id}/`),
      replyToUsers: [{ ...post }],
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
    };
    const createdPostRef = await addDoc(collection(db, "posts"), data);
    const userPostsRef = doc(db, `users/${user.id}/posts/${createdPostRef.id}`);

    const batch = writeBatch(db);
    batch.set(userPostsRef, {});
    await batch.commit();
  }
};

