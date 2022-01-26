export const formatDate = (item, date) => {
  let fullDate;
  const dateString = new Date(date).toLocaleDateString();
  const timeString = new Date(date).toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
  });

  fullDate = `${dateString}, ${timeString}`;

  if (item.date !== date) {
    fullDate = dateString;
  }

  return fullDate;
};

export const calculateDays = (callback, dueDate, date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(dueDate);
  const secondDate = new Date(date);
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  callback(diffDays);
};

export const formatDueDate = (difference) => {
  if (difference === 0) {
    return 'Today';
  }
  if (difference === 1) {
    return 'Tomorrow';
  }
  return `${difference} days left`;
};
