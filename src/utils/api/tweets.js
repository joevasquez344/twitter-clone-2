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
} from "firebase/firestore";
import { auth } from "../../firebase/config";

export const fetchTweets = async () => {
  const tweetsCollection = collection(db, "tweets");

  const tweetsQuery = query(tweetsCollection, orderBy("timestamp", "desc"));
  const tweetIds = await getDocs(tweetsQuery);

  const tweets = await Promise.all(
    tweetIds.docs.map(async (doc) => ({
      likes: await (
        await getDocs(collection(db, `tweets/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id })),
      id: doc.id,
      ...doc.data(),
    }))
  );

  return tweets;
};


export const toggleLikeTweet = async (id) => {
  const batch = writeBatch(db);

  const userId = auth.currentUser.uid;

  const userLikesRef = doc(db, `users/${userId}/likes/${id}`);
  const tweetLikesRef = doc(db, `tweets/${id}/likes/${userId}`);

  const tweetRef = doc(db, `tweets/${id}`);
  const userRef = doc(db, `users/${userId}`);

  const tweet = await getDoc(tweetRef);
  const user = await getDoc(userRef);

  const tweetLikesCollection = collection(db, `tweets/${id}/likes`);
  const tweetLikes = await getDocs(tweetLikesCollection);

  const match = tweetLikes.docs.find((like) => like.id === userId);

  if (!match) {
    batch.set(userLikesRef, { ...tweet.data() });
    batch.set(tweetLikesRef, { ...user.data() });

    await batch.commit();

    const likes = await getDocs(collection(db, `tweets/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    batch.delete(userLikesRef, {});
    batch.delete(tweetLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `tweets/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
};
