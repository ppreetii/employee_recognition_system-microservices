export const getMondays = (dateValue: string) => {
  const date = new Date(dateValue);
  const daysUntilMonday =
    date.getDay() === 0 ? 6 : date.getDay() - 1 === 0 ? 7 : date.getDay() - 1;

  const lastMonday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - daysUntilMonday
  );

  const nextMonday =
    date.getDay() !== 1
      ? new Date(
          lastMonday.getFullYear(),
          lastMonday.getMonth(),
          lastMonday.getDate() + 7
        )
      : date;

  return {
    lastMonday: formatDate(lastMonday.toLocaleString()),
    nextMonday: formatDate(nextMonday.toLocaleString()),
  };
};

export function formatDate(dateString: string) {
  const dateParts = dateString.split(/[/: ,]/);
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[0]);

  const monthString = month.toString().padStart(2, "0"); // Pad month component with leading zero if necessary
  const formattedDate = `${year}-${monthString}-${day
    .toString()
    .padStart(2, "0")}`;

  return formattedDate;
}
