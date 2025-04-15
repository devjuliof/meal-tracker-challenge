export const isFutureDateTime = (date: string) => {
  const now = new Date();
  const inputDateTime = new Date(date);
  return inputDateTime > now;
};
