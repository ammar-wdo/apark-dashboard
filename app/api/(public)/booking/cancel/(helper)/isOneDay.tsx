export const isOneDay = (date: Date):boolean => {
  const bookingCreatedAt = date;
  const currentTime = new Date();

  const timeDifference = currentTime.getTime() - bookingCreatedAt.getTime();

  const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

  if (timeDifferenceInHours < 24) {
    return false;
  } else {
    return true;
  }
};
