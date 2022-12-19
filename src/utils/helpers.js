export const findItemById = (arr, item) => {
  const value = arr.find((i) => i.id === item.id);

  return value;
};

export const removeDuplicateUsernames = (replyToUsers) => {
  const usernames = replyToUsers?.map((user) => user.username);
  return [...new Set(usernames)].reverse();
};

export const updatePostInFeeds = (feeds, postId, targetKey, targetValue) => {
  let arrayOfFeeds = [...feeds];
  const newFeeds = [];
  arrayOfFeeds = arrayOfFeeds.map((arr) => {
    arr.map((item) => {
      if (item.id === postId) {
        return {
          ...item,
          [targetKey]: targetValue,
        };
      }

      return item;
    });

    return arr;
  });

  arrayOfFeeds.forEach((arr) => {
    newFeeds.push(arr);
  });

  console.log("Feeds: ", newFeeds);

  return newFeeds;
};

export const resetTabsClickCount = (tabs, setTabs) => {
  const updatedTabs = tabs.map((tab) => {
    tab.clickCount = 0;

    return tab;
  });

  setTabs(updatedTabs);
};
