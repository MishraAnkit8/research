const currentTimestamp = Date.now();
const currentDate = new Date(currentTimestamp);

const rTokenvalidity = '2023-11-24T13:38:57.000Z';
const tokenTimestamp = 1700832633048;
const tokenDate = new Date(tokenTimestamp);

console.log('currentTimestamp >>>', currentTimestamp)
console.log('currentDate >>>', currentDate)
console.log('rTokenvalidity >>>', rTokenvalidity)
console.log('tokenTimestamp >>>', tokenTimestamp)
console.log('tokenDate >>>', tokenDate)

console.log('is valid >>>> ', tokenTimestamp > currentTimestamp);


// console.log(currentDate.toLocaleString()); // This will display the date in local time
// console.log(currentDate.toISOString());   // This will display the date in UTC


