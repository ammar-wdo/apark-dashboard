export const NLtimezone = (date: Date) => {
  const formattedDate = date.toLocaleString("en-NL", {
    timeZone: "UTC",
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',

  });

  return formattedDate
};
