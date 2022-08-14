import {
  GET_TWEETS,
  CREATE_TWEET,
  LIKE_TWEET,
  UNLIKE_TWEET,
  GET_TWEET_DETAILS,
  UNLIKE_COMMENT,
  LIKE_COMMENT,
} from "./tweets.types";
// import {firebase} from '../../firebase/config'
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
} from "firebase/firestore";
import { auth } from "../../firebase/config";

import {
  createTweet,
  fetchTweets,
  getTweetById,
  toggleLikeTweet,
  untoggleLikeTweet,
} from "../../utils/api/tweets";

const getTweets = () => async (dispatch) => {
  const tweets = await fetchTweets();

  dispatch({
    type: GET_TWEETS,
    payload: tweets,
  });
};

const likeTweet = (tweetId) => async (dispatch) => {
  const likes = await toggleLikeTweet(tweetId)

  console.log('LIKES FROM ACTIONS: ', likes)

  dispatch({
    type: LIKE_TWEET,
    payload: {
      tweetId,
      likes
    }
  })
  // const tweetRef = doc(db, "tweets", tweetId);
  // const tweetSnap = await getDoc(tweetRef);
  // const likes = tweetSnap.data().likes;

  // const userId = auth.currentUser.uid;

  // const userRef = doc(db, "users", userId);
  // const userSnap = await getDoc(userRef);
  // const user = userSnap.data();

  // const match = likes.find((like) => like.uid === userId);

  // if (match) {
  //   const newLikes = likes.filter((like) => like.uid !== match.uid);
  //   await updateDoc(tweetRef, { likes: newLikes });

  //   const ref = doc(db, "tweets", tweetId);
  //   const snap = await getDoc(ref);

  //   const updatedLikes = snap.data().likes;

  //   dispatch({
  //     type: UNLIKE_TWEET,
  //     payload: {
  //       tweetId,
  //       likes: updatedLikes,
  //     },
  //   });
  // } else {
  //   await updateDoc(tweetRef, {
  //     likes: [
  //       ...likes,
  //       {
  //         uid: userId,
  //         username: user.username,
  //         name: user.name,
  //         bio: user.bio,
  //       },
  //     ],
  //   });

  //   const ref2 = doc(db, "tweets", tweetId);
  //   const snap2 = await getDoc(ref2);
  //   const newLikes = snap2.data().likes;

  //   console.log("Updat: ", newLikes);

  //   console.log("New likes array with like inserted: ", newLikes);

  //   dispatch({
  //     type: LIKE_TWEET,
  //     payload: {
  //       tweetId,
  //       replyTo: null,
  //       likes: newLikes,
  //     },
  //   });
  // }
};

const getTweetDetails = (tweetId) => async (dispatch) => {
  // Query For Tweet Details
  const tweetRef = doc(db, "tweets", tweetId);
  const tweetSnap = await getDoc(tweetRef);
  const tweet = tweetSnap.data();

  // const tweetsRef = collection(db, "tweets");
  // const tweetsQuery = query(tweetsRef, where("replyTo", "==", tweetSnap.id));

  // const tweetsQuerySnapshot = await getDocs(tweetsQuery);

  // const comments = tweetsQuerySnapshot.docs.map(doc => ({
  //   id: doc.id,
  //   data: doc.data()
  // }))

  // console.log('COMMMENTS: ', comments)

  // console.log("TWEEEET:", tweetsQuery);
  // // Query For Comments
  // const commentsCollection = collection(db, "comments");
  // const commentsCollectionOrdered = query(
  //   commentsCollection,
  //   orderBy("timestamp", "desc")
  // );
  // const commentsSnapshot = await getDocs(commentsCollectionOrdered);
  // const comments = commentsSnapshot.docs.map((doc) => ({
  //   id: doc.id,
  //   data: doc.data(),
  // }));

  const payload = {
    tweetId: tweetSnap.id,
    tweet,
  };

  console.log("Payload: ", payload);

  dispatch({
    type: GET_TWEET_DETAILS,
    payload,
  });
};

export { getTweets, likeTweet, getTweetDetails };
