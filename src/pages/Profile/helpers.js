import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
  where,
  orderBy,
  query,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/config";
import { getPostById } from "../../utils/api/posts";
const getTweets = async (profile) => {
  let pinnedPost = {};

  const tweetsRef = collection(db, `posts`);
  const tweetsQuery = query(
    tweetsRef,
    where("uid", "==", profile.id),
    where("postType", "==", "tweet"),
    orderBy("timestamp", "desc")
  );
  const tweetsData = await Promise.all(
    await (
      await getDocs(tweetsQuery)
    ).docs.map(async (doc) => ({
      id: doc.id,
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );

  const userRef = doc(db, `users/${profile.id}`)
  const userSnapshot = await getDoc(userRef);

  const user = userSnapshot.data();

  if (user.pinnedPost.id) {
    const post = await getPostById(user.pinnedPost.id);
    pinnedPost = post;
  }

  return { tweetsData, pinnedPost };
};

const getTweetsAndReplies = async (profileId) => {
  

  const postsRef = collection(db, `posts`);
  const userRef = doc(db, `users/${profileId}`);

  const postsQuery = query(
    postsRef,
    where("userRef", "==", userRef),
    orderBy("timestamp", "desc")
  );
  const posts = await Promise.all(
    await (
      await getDocs(postsQuery)
    ).docs.map(async (doc) => ({
      id: doc.id,
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );

  return posts;
};

const getLikedPosts = async (profileId) => {
  const likesRef = collection(db, `users/${profileId}/likes`);
  const postIds = await getDocs(likesRef);

  const postDocs = await Promise.all(
    postIds.docs.map(async (post) => await getDoc(doc(db, `posts/${post.id}`)))
  );

  const posts = await Promise.all(
    postDocs.map(async (doc) => ({
      id: doc.id,
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );

  return posts;

};

export {getTweets, getTweetsAndReplies, getLikedPosts}
