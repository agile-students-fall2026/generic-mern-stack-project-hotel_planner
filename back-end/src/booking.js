function isValidDateRange(checkIn, checkOut) {
  return checkOut > checkIn;
}

module.exports = { isValidDateRange };