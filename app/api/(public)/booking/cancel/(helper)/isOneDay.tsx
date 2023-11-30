export const morethanOneDay = (arrivalDate: Date):boolean => {
 
  const currentTime = new Date();

  const timeDifference = arrivalDate.getTime() - currentTime.getTime() ;

  const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

  if (timeDifferenceInHours < 24) {
    return false;
  } else {
    return true;
  }
};
