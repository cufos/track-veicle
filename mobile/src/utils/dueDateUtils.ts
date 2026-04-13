export type DueDateStatus =
  | { type: "expired"; days: number }
  | { type: "urgent"; days: number }
  | { type: "upcoming"; days: number }
  | { type: "normal"; friendlyDate: string };

import i18n from "../i18n";

export function getDueDateStatus(dueDate: string): DueDateStatus {
  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const friendlyDate = due.toLocaleDateString(i18n.locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (diffDays < 0) {
    return { type: "expired", days: Math.abs(diffDays) };
  }

  if (diffDays <= 7) {
    return { type: "urgent", days: diffDays };
  }

  if (diffDays <= 30) {
    return { type: "upcoming", days: diffDays };
  }

  return { type: "normal", friendlyDate };
}
