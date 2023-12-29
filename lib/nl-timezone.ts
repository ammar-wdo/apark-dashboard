




export const NLtimezone = (date: Date,type:'Europe/Amsterdam' | 'UTC' = 'Europe/Amsterdam') => {
  const formattedDate = date.toLocaleString("en-NL", {
    timeZone: type,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',

  });

  return formattedDate
};
