export const findItemById = (arr, item) => {
  const value = arr.find((i) => i.id === item.id);

  return value;
};

export const removeDuplicateUsernames = (replyToUsers) => {
  const usernames = replyToUsers?.map((user) => user.username);
  return [...new Set(usernames)].reverse();
};


