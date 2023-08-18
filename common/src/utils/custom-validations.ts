export const isValidDate = (value: String, helpers: any) => {
  // Date format: YYYY-MM-DD
  const datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  // Check if the date string format is a match
  const matchArray = value.match(datePattern);
  if (matchArray == null) {
    return helpers.error("any.invalid");
  }

  // Remove any non digit characters
  const dateString = value.replace(/\D/g, "");

  // Parse integer values from the date string
  const year = parseInt(dateString.substr(0, 4));
  const month = parseInt(dateString.substr(4, 2));
  const day = parseInt(dateString.substr(6, 2));

  // Define the number of days per month
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    daysInMonth[1] = 29;
  }

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return helpers.error("any.invalid");
  }
  return value;
};
