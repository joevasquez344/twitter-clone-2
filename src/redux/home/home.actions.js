import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import { fetchPosts, getPostById, toggleLikePost } from "../../utils/api/posts";
import { GET_POSTS, REFRESH_POST, TOGGLE_LIKE_POST } from "./home.types";

const getPosts = (query) => async (dispatch) => {
  const postsRef = collection(db, `posts`);

  const posts = await fetchPosts(query);

  // const postsQuery = query(
  //   postsRef,
  //   where("postType", "==", "tweet"),
  //   orderBy("timestamp", "desc")
  // );

  // const postsSnapshot = await getDocs(postsQuery);

  // const posts = await Promise.all(
  //   postsSnapshot.docs.map(async (doc) => ({
  //     id: doc.id,
  //     followers: await (await getDocs(collection(db, `users/${doc.data().uid}/followers`))).docs.map(doc => ({id: doc.id, ...doc.data()})),
  //     likes: await (
  //       await getDocs(collection(db, `posts/${doc.id}/likes`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     ...doc.data(),
  //   }))
  // );

  dispatch({
    type: GET_POSTS,
    payload: posts,
  });
};

const refreshPost = (postId) => async (dispatch) => {
  const post = await getPostById(postId);

  dispatch({
    type: REFRESH_POST,
    payload: post,
  });
};

const likePost = (postId) => async (dispatch) => {
  const likes = await toggleLikePost(postId);

  dispatch({
    type: TOGGLE_LIKE_POST,
    payload: {
      postId,
      likes,
    },
  });
  // const likedUserRef = doc(db, `posts/${postId}/likes/${userId}`);
  // const postLikedByUserRef = doc(db, `users/${userId}/likes/${postId}`);

  // const likesRef = collection(db, `posts/${postId}/likes`);
  // const likesSnapshot = await getDocs(likesRef);
  // const likes = likesSnapshot.docs.map((doc) => doc.id);

  // const match = likes.find((user) => user === userId);

  // const batch = writeBatch(db);

  // if (!match) {
  //   batch.set(likedUserRef, {});
  //   batch.set(postLikedByUserRef, {});

  //   await batch.commit();

  //   const likesSnapshot = await getDocs(likesRef);
  //   const likes = likesSnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));

  //   dispatch({
  //     type: TOGGLE_LIKE_POST,
  //     payload: {
  //       postId,
  //       likes,
  //     },
  //   });
  // } else {
  //   batch.delete(likedUserRef, {});
  //   batch.delete(postLikedByUserRef, {});

  //   await batch.commit();

  //   const likesSnapshot = await getDocs(likesRef);
  //   const likes = likesSnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));

  //   dispatch({
  //     type: TOGGLE_LIKE_POST,
  //     payload: {
  //       postId,
  //       likes,
  //     },
  //   });
  // }
};

export { fetchPosts, likePost, refreshPost };
