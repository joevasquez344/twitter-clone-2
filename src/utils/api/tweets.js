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

export const createTweet = async (input, authUser) => {
  const data = {
    uid: authUser.id,
    userRef: doc(db, `users/${authUser.id}`) ,
    name: authUser.name,
    email: authUser.email,
    username: authUser.username,
    message: input,
    media: "",
    avatar: "",
    timestamp: serverTimestamp(),
    postType: "tweet",
  };

  const createdTweetRef = await addDoc(collection(db, "tweets"), data);

  const userTweetsRef = doc(
    db,
    `users/${authUser.id}/tweets/${createdTweetRef.id}`
  );
  const createdTweet = await getDoc(doc(db, `tweets/${createdTweetRef.id}`));

  const batch = writeBatch(db);
  batch.set(userTweetsRef, { ...createdTweet.data() });
  await batch.commit();
};

const deleteTweetById = async (id) => {};

export const getTweetById = async (id) => {
  const tweetRef = doc(db, "tweets", id);
  const tweet = await getDoc(tweetRef);
  const likes = await (
    await getDocs(collection(db, `tweets/${id}/likes`))
  ).docs.map((doc) => ({ id: doc.id }));

  return {
    id: tweet.id,
    likes,
    ...tweet.data(),
  };
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

export const unlikeTweetById = async (id) => {
  const tweet = await getTweetById(id);

  const userId = auth.currentUser.uid;
  const match = tweet.likes?.find((like) => like.uid === userId);

  const likes = tweet.likes.filter((like) => like.uid !== match.uid);
  await updateDoc(tweet, { likes });

  return likes;
};

const createComment = async () => {};

const likeCommentById = async (id) => {};

const unlikeCommentById = async (id) => {};

const deleteCommentById = async (id) => {};

const getComments = async (id) => {};
