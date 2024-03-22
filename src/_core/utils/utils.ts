import dayjs from 'dayjs';

export const isEmpty = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  return false;
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format('MMM D, YYYY; hh:mm A');
};
