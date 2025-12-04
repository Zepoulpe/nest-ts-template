import dayjsNotifier, { type Dayjs } from 'dayjs';

export const formatDate = (date: string | Date | Dayjs, format = 'YYYY-MM-DD'): string => {
  return dayjsNotifier(date).format(format);
};

export default dayjsNotifier;
