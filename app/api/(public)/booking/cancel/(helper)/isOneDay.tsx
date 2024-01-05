export const morethanOneDay = (arrivalDate: Date):boolean => {
 
  const amesterdam = new Date();

    amesterdam.setHours(amesterdam.getHours() + 1);
  
    amesterdam.setMinutes(amesterdam.getMinutes());

    

  const timeDifference = arrivalDate.getTime() - amesterdam.getTime() ;

  const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

  if (timeDifferenceInHours < 24) {
    return false;
  } else {
    return true;
  }
};
