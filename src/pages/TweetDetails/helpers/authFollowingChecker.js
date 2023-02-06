const isAuthFollowingPostDetailsUser = (following, post) => {
    const match = following.find((userId) => userId === post.uid);
    if (match) {
      return true;
    } else {
      return false;
    }
  };

  export default isAuthFollowingPostDetailsUser