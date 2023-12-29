




export const NLtimezone = (date: Date,type?:'Europe/Amsterdam' | 'UTC' ) => {
  const formattedDate = date.toLocaleString("en-NL", {
   ...(type && {timeZone:type}),
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',

  });

  return formattedDate
};
