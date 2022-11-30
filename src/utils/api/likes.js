import { doc, getDocs, deleteDoc, collection } from "firebase/firestore/lite";
import { auth, db } from "../../firebase/config";

export const deleteLikeById = async (postId) => {
  const postLikesref = collection(db, `posts/${postId}/likes`);
  const userIds = await getDocs(postLikesref);

  await Promise.all(
    userIds.docs.map(
      async (d) => await deleteDoc(doc(db, `posts/${postId}/likes/${d.id}`))
    )
  );
};
