import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import { getPostById } from "../../utils/api/posts";
import { GET_POSTS, REFRESH_POST, TOGGLE_LIKE_POST } from "./home.types";

const fetchPosts = (user) => async (dispatch) => {
  const userRef = doc(db, `users/${user.id}`);
  const postsRef = collection(db, `posts`);

  const postsQuery = query(
    postsRef,
    where("postType", "==", "tweet"),
    orderBy("timestamp", "desc")
  );

  const postsSnapshot = await getDocs(postsQuery);

  const posts = await Promise.all(
    postsSnapshot.docs.map(async (doc) => ({
      id: doc.id,
      followers: await (await getDocs(collection(db, `users/${doc.data().uid}/followers`))).docs.map(doc => ({id: doc.id, ...doc.data()})),
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );


  console.log("POSTY: ", posts);

  dispatch({
    type: GET_POSTS,
    payload: posts,
  });
};

const refreshPost = (postId) => async dispatch => {
  const post = await getPostById(postId)

  dispatch({
    type: REFRESH_POST,
    payload: post
  })
}

const toggleLikePost = (postId, userId) => async (dispatch) => {
  const batch = writeBatch(db);

  const likesRef = collection(db, `posts/${postId}/likes`);
  const likedUserRef = doc(db, `posts/${postId}/likes/${userId}`);

  const postLikedByUserRef = doc(db, `users/${userId}/likes/${postId}`);

  const likesSnapshot = await getDocs(likesRef);

  const likes = likesSnapshot.docs.map((doc) => doc.id);

  const match = likes.find((user) => user === userId);

  if (!match) {
    batch.set(likedUserRef, {});
    batch.set(postLikedByUserRef, {});

    await batch.commit();

    const likesSnapshot = await getDocs(likesRef);
    const likes = likesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({
      type: TOGGLE_LIKE_POST,
      payload: {
        postId,
        likes,
      },
    });
  } else {
    batch.delete(likedUserRef, {});
    batch.delete(postLikedByUserRef, {});

    await batch.commit();

    const likesSnapshot = await getDocs(likesRef);
    const likes = likesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch({
      type: TOGGLE_LIKE_POST,
      payload: {
        postId,
        likes,
      },
    });
  }
};

export { fetchPosts, toggleLikePost, refreshPost };
