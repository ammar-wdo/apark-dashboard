



export const processBookingPerDay = (
  bookingsRange: Record<string, number>,
  currentYear: number,
  currentMonth: number,
  lastDayOfMonth: number
) => {
  let refinedBookings = Object.entries(bookingsRange).map(([key, value]) => {
    const name = key;
    const total = value;
    return { name, total };
    // You can use `return` instead of `console.log()` if within a function
  });
  refinedBookings.sort((a, b) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA.getTime() - dateB.getTime();
  });

  const processedData = refinedBookings.map((obj) => ({
    name: new Date(obj.name).getDate().toString(),
    total: obj.total,
  }));

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const resultArray = Array.from({ length: lastDayOfMonth }, (_, index) => ({
    name: (index + 1).toString(),
    total: 0,
  }));

  processedData.forEach((obj) => {
    const dayIndex = +obj.name - 1;
    if (dayIndex >= 0 && dayIndex < resultArray.length) {
      resultArray[dayIndex].total = obj.total;
    }
  });

  return resultArray;
};
