export const getDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getMaintenanceStatus = (
  dueDate: string,
  reminderDaysBefore: number
): 'expired' | 'upcoming' | 'ok' => {
  const daysRemaining = getDaysRemaining(dueDate);

  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= reminderDaysBefore) return 'upcoming';
  return 'ok';
};
