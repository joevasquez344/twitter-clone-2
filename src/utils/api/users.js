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

export const getAllUsers = async () => {
  const ref = collection(db, "users");
  const snapshot = await getDocs(ref);

  const users = await Promise.all(
    snapshot.docs.map(async (user) => ({
      ...user.data(),
      id: user.id,
      followers: await getFollowers(user.id),
      following: await getProfileFollowing(user.id),
    }))
  );

  return users;
};

export const unfollowUser = async (profileId, authId) => {
  const profileRef = doc(db, `users/${authId}/following/${profileId}`);
  const authRef = doc(db, `users/${profileId}/followers/${authId}`);

  const profile = await getDoc(doc(db, `users/${profileId}`));

  let followers = null;

  followers = await getFollowers(profile.id);

  const isFollowing = followers.find((follower) => follower.id === authId);

  if (isFollowing) {
    const batch = writeBatch(db);

    batch.delete(profileRef, {});
    batch.delete(authRef, {});

    await batch.commit();

    const following = await getProfileFollowing(profile.id);
    followers = await getFollowers(profile.id);

    return { following, followers };
  } else {
    window.alert("Already Following User");
  }
};

export const getLikedPosts = async (profileId) => {
  const ref = collection(db, `users/${profileId}/likes`);
  const snapshot = await getDocs(ref);
  const likedPosts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return likedPosts;
};

export const toggleFollow = async (profileId, authId) => {
  const batch = writeBatch(db);

  const profile = await getDoc(doc(db, `users/${profileId}`));
  const authUser = await getDoc(doc(db, `users/${authId}`));

  const followingRef = doc(db, `users/${authId}/following/${profileId}`);
  const followersRef = doc(db, `users/${profileId}/followers/${authId}`);
  const profileRef = doc(db, `users/${authId}/following/${profileId}`);
  const authRef = doc(db, `users/${profileId}/followers/${authId}`);

  let followers = null;
  let following = null;

  followers = await getFollowers(profileId);
  following = await getProfileFollowing(authId);

  const isFollowing = followers.find((follower) => follower.id === authId);

  if (!isFollowing) {
    batch.set(followingRef, { ...profile.data() });
    batch.set(followersRef, { ...authUser.data() });

    await batch.commit();

    followers = [...followers, { id: authUser.id, ...authUser.data() }];
    following = [...following, { id: profile.id, ...profile.data() }];

    return { following, followers };
  } else {
    batch.delete(profileRef, {});
    batch.delete(authRef, {});

    await batch.commit();

    const following = await getProfileFollowing(profile.id);
    followers = await getFollowers(profile.id);

    return { following, followers };
  }
};

export const followUser = async (profileId, authId) => {
  const profile = await getDoc(doc(db, `users/${profileId}`));
  const authUser = await getDoc(doc(db, `users/${authId}`));

  const followingRef = doc(db, `users/${authId}/following/${profileId}`);
  const followersRef = doc(db, `users/${profileId}/followers/${authId}`);

  let followers = null;
  let following = null;

  followers = await getFollowers(profileId);
  following = await getProfileFollowing(authId);

  const isFollowing = followers.find((follower) => follower.id === authId);

  if (!isFollowing) {
    const batch = writeBatch(db);

    batch.set(followingRef, { ...profile.data() });
    batch.set(followersRef, { ...authUser.data() });

    await batch.commit();

    followers = [...followers, { id: authUser.id, ...authUser.data() }];
    following = [...following, { id: profile.id, ...profile.data() }];

    return { following, followers };
  }
};

export const getFollowers = async (profileId) => {
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

export const getAvatar = async (profileId) => {
  const ref = collection(db, `users/${profileId}`);
  const snapshot = await getDoc(ref);
  const avatar = snapshot.data().avatar;

  return avatar;
};
