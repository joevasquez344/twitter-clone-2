import { removeDuplicateUsernames } from "./helpers";

export const handleActiveTab = (tabId, feeds, tabs, profile, setTabs) => {
  const updatedTabs = tabs.map((tab) => {
    tab.isActive = false;
    if (tab.id === tabId) {
      tab.isActive = true;

      if (tab.text === "Tweets") {
        if (feeds[0].length === 0 && tab.clickCount === 0) {
          tab.clickCount = tab.clickCount + 1;
          tab.fetchData(profile);
        }
      } else if (tab.text === "Tweets & Replies" && tab.clickCount === 0) {
        if (feeds[1].length === 0) {
          tab.clickCount = tab.clickCount + 1;
          tab.fetchData(profile);
        }
      } else if (tab.text === "Media" && tab.clickCount === 0) {
        if (feeds[2].length === 0) {
          tab.clickCount = tab.clickCount + 1;
          tab.fetchData(profile);
        }
      } else if (tab.text === "Likes" && tab.clickCount === 0) {
        if (feeds[3].length === 0) {
          tab.clickCount = tab.clickCount + 1;
          tab.fetchData(profile);
        }
      }
    }

    return tab;
  });

  setTabs(updatedTabs);
};

export const handleAuthLayout = (profile, setIsFollowing, user) => {
  const match = profile?.followers?.find((u) => u.id === user.id);

  if (match) {
    setIsFollowing(true);
  } else {
    setIsFollowing(false);
  }
};

export const handleProfileCreatedAt = (profile) => {
  const arr = profile?.createdAt.split(" ");
  const month = arr[2];
  const year = arr[3];

  return `Joined ${month} ${year}`;
};

export const handlePostIsLiked = (likes, setIsLiked, authUser) => {
  const liked = likes?.find((like) => like === authUser.id);

  if (liked) setIsLiked(true);
  else setIsLiked(false);
};

export const handleReplyToUsernames = (replyToUsers, post) => {
  let usernames = removeDuplicateUsernames(replyToUsers);

  // if (usernames.length > 1)
  //   usernames = usernames.filter(username => username !== post.username)

  return usernames;
};
