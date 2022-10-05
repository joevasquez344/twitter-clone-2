import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore/lite";
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
  onSnapshot,
} from "firebase/firestore";

export const getUserDetails = async (username) => {
  const ref = collection(db, "users");

  const userQuery = query(ref, where("username", "==", username));

  const snapshot = await getDocs(userQuery);

  const userId = snapshot.docs.map((doc) => doc.id);

  const followersRef = collection(db, `users/${userId}/followers`);
  const followingRef = collection(db, `users/${userId}/following`);

  const followers = await getDocs(followersRef);
  const following = await getDocs(followingRef);

  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    followers: followers.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    following: following.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ...doc.data(),
  }));

  return user[0];
};

export const unfollowUser = async (profileId, authId) => {
  const batch = writeBatch(db);

  const profile = await getDoc(doc(db, `users/${profileId}`));

  const followingRef = doc(db, `users/${authId}/following/${profileId}`);
  const followersRef = doc(db, `users/${profileId}/followers/${authId}`);

  batch.delete(followingRef, {});
  batch.delete(followersRef, {});

  await batch.commit();

  const following = await getProfileFollowing(profile.id);
  const followers = await getProfileFollowers(profile.id);

  return { following, followers };
};

export const followUser = async (profileId, authId) => {
  const batch = writeBatch(db);

  const profile = await getDoc(doc(db, `users/${profileId}`));
  const authUser = await getDoc(doc(db, `users/${authId}`));

  const followingRef = doc(db, `users/${authId}/following/${profileId}`);
  const followersRef = doc(db, `users/${profileId}/followers/${authId}`);

  batch.set(followingRef, { ...profile.data() });
  batch.set(followersRef, { ...authUser.data() });

  await batch.commit();

  const following = await getProfileFollowing(profile.id);
  const followers = await getProfileFollowers(profile.id);

  return { following, followers };
};

export const getProfileFollowers = async (profileId) => {
  const ref = collection(db, `users/${profileId}/followers`);
  const snapshot = await getDocs(ref);
  const followers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return followers;
};
export const getProfileFollowing = async (profileId) => {
  const ref = collection(db, `users/${profileId}/following`);
  const snapshot = await getDocs(ref);
  const following = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return following;
};
