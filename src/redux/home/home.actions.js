import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
  getDoc,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import { fetchPosts, getComments, getPostById, toggleLikePost } from "../../utils/api/posts";
import { getProfileFollowing } from "../../utils/api/users";
import { GET_POSTS, REFRESH_POST, TOGGLE_LIKE_POST } from "./home.types";

const getPosts = (user) => async (dispatch) => {

     const query = {
      where: null,
      orderBy: ["timestamp", "desc"],
    };
  const posts = await fetchPosts(query);
 
  // const following = await getProfileFollowing(user.id);

  // let uids = following.map((profile) => profile.id);

  // const postIds = await Promise.all(
  //   uids.map(
  //     async (id) =>
  //       await getDocs(
  //         query(
  //           collection(db, `posts`),
  //           where("uid", "==", id),
  //           // where("userRef", "==", userRef),
  //           orderBy("timestamp", "desc")
  //         )
  //       )
  //   )
  // );

  // let ids = [];
  // postIds.forEach((doc) => doc.docs.map((post) => ids.push(post.id)));

  // let posts = await Promise.all(
  //   ids.map(async (id) => await getDoc(doc(db, `posts/${id}`)))
  // );

  // const newPosts = await Promise.all(
  //   posts.map(async (doc) => ({
  //     id: doc.id,
  //     followers: await (
  //       await getDocs(collection(db, `users/${doc.data().uid}/followers`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     likes: await (
  //       await getDocs(collection(db, `posts/${doc.id}/likes`))
  //     ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     comments: await getComments(doc.id),

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
};

export { getPosts, likePost, refreshPost };
