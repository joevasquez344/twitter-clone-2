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
import { db } from "../../../firebase/config";
import { getFollowers } from "../../../utils/api/users";

export const getPostDetailsLikes = async (likes) => {
  // const ref = collection(db, `posts/${postId}/likes`);

  // const snapshot = await getDocs(ref);
  const users = await Promise.all(
    likes.map(async (id) => await getDoc(doc(db, `users/${id}`)))
  );

  return await Promise.all(
    users.map(async (user) => ({
      id: user.id,
      ...user.data(),
      followers: await getFollowers(user.id),
    }))
  );
};
