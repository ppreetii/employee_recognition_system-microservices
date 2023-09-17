export const formatDateIST = (providedDate: string | Date) => {
  const date = new Date(providedDate);
  date.setMinutes(date.getMinutes() + 330);  // for IST time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const addDaysToDate = (providedDate: string | Date, days: number) => {
  const date = new Date(providedDate);
  date.setMinutes(date.getMinutes() + 330);  // for IST time

  date.setDate(date.getDate() + Math.floor(days));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
