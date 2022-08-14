export const findItemById = (arr, item) => {
  const value = arr.find((i) => i.id === item.id);

  return value;
};
