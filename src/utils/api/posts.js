import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  where,
  orderBy
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/config";

export const fetchPosts = async (query) => {
  const postsRef = (db, `posts`);

  const postsQuery = query(
    postsRef,
    where(query.where),
    orderBy(query.orderBy)
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

  return posts
}

export const getPostById = async (id) => {
  const ref = doc(db, "posts", id);
  const post = await getDoc(ref);

const likes = await getPostLikes(id);

  return {
    id: post.id,
    likes,
    followers: await (await getDocs(collection(db, `users/${post.data().uid}/followers`))).docs.map(doc => ({id: doc.id, ...doc.data()})),
    ...post.data(),
  };
};

export const getPostLikes = async (id) => {
  const userIds = await getDocs(collection(db, `posts/${id}/likes`));
  const userDocs = await Promise.all(
    userIds.docs.map(async (user) => await getDoc(doc(db, `users/${user.id}`)))
  );
  const users = userDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return users
}

export const toggleLikePost = async (id) => {
  const batch = writeBatch(db);

  const userId = auth.currentUser.uid;

  const userLikesRef = doc(db, `users/${userId}/likes/${id}`);
  const postLikesRef = doc(db, `posts/${id}/likes/${userId}`);

  const postLikesCollection = collection(db, `posts/${id}/likes`);
  const postLikes = await getDocs(postLikesCollection);

  const match = postLikes.docs.find((like) => like.id === userId);

  if (!match) {
    batch.set(userLikesRef, {});
    batch.set(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `posts/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    batch.delete(userLikesRef, {});
    batch.delete(postLikesRef, {});

    await batch.commit();

    const likes = await getDocs(collection(db, `posts/${id}/likes`));

    return likes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
};
