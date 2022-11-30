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

export const createComment = async (input, replyToPost, media, user, postType) => {
  const batch = writeBatch(db);

  const userData = {
    name: user.name,
    username: user.username,
  };

  if (postType === "comment") {
    const data = {
      ...userData,
      message: input,
      timestamp: serverTimestamp(),
      postType: "comment",
      avatar: user.avatar,
      media: media ? media : "",
      replyTo: doc(db, `/posts/${replyToPost.id}/`),
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
      pinnedPost: false,
    };

    const postsReplyToRef = collection(db, `posts/${replyToPost.id}/replyTo`);

    const replyTosDocs = await getDocs(postsReplyToRef);

    const replyTosIds = await Promise.all(
      replyTosDocs.docs.map((doc) => doc.id)
    );

    const createdPostRef = await addDoc(collection(db, "posts"), data);
    
    const userPostsRef = doc(db, `users/${user.id}/posts/${createdPostRef.id}`);
    const replyToRef = doc(db, `posts/${createdPostRef.id}/replyTo/${replyToPost.id}`);

    batch.set(replyToRef, { timestamp: replyToPost.timestamp });
    batch.set(userPostsRef, {});

    replyTosDocs.docs.map((document) =>
      batch.set(doc(db, `posts/${createdPostRef.id}/replyTo/${document.id}`), {
        timestamp: document.data().timestamp,
      })
    );

    await batch.commit();

    const postRef = doc(db, `posts/${createdPostRef.id}`);
    
    const post = await getDoc(postRef);

    const createdPost = {id: post.id, ...post.data()}

    return createdPost;
  }

  if (postType === "tweet") {
    const data = {
      ...userData,
      message: input,
      timestamp: serverTimestamp(),
      postType: "comment",
      media: media ? media : "",
      avatar: user.avatar,
      replyTo: doc(db, `/posts/${replyToPost.id}/`),
      userRef: doc(db, `/users/${user.id}/`),
      uid: user.id,
      pinnedPost: false,
    };

    const postsReplyToRef = collection(db, `posts/${replyToPost.id}/replyTo`);

    const replyTosDocs = await getDocs(postsReplyToRef);

    const replyTosIds = await Promise.all(
      replyTosDocs.docs.map((doc) => doc.id)
    );

    const createdPostRef = await addDoc(collection(db, "posts"), data);


    const userPostsRef = doc(db, `users/${user.id}/posts/${createdPostRef.id}`);
    const replyToRef = doc(db, `posts/${createdPostRef.id}/replyTo/${replyToPost.id}`);

    batch.set(replyToRef, { timestamp: replyToPost.timestamp });
    batch.set(userPostsRef, {});

    replyTosDocs.docs.map((document) =>
      batch.set(doc(db, `posts/${createdPostRef.id}/replyTo/${document}`), {
        timestamp: document.data().timestamp,
      })
    );

    await batch.commit();

    const postRef = doc(db, `posts/${createdPostRef.id}`);
    const post = await getDoc(postRef);

    const createdPost = {id: post.id, ...post.data()}

    return createdPost
  }
};
