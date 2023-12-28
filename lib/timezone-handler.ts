export const handleTimezone = (valueStatrt:Date,valueEnd:Date)=>{


    const startDate = valueStatrt;
const endDate = valueEnd;

const timezoneOffsetStart = startDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
const timezoneOffsetEnd = endDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds

const adjustedStartDate = new Date(startDate.getTime() - timezoneOffsetStart);
const adjustedEndDate = new Date(endDate.getTime() - timezoneOffsetEnd);

console.log(adjustedStartDate,adjustedEndDate)

const startDateString = adjustedStartDate.toISOString().split('T')[0];
const endDateString = adjustedEndDate.toISOString().split('T')[0];


return {startDateString,endDateString,adjustedStartDate,adjustedEndDate}
}
