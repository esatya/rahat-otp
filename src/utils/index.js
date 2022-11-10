module.exports = {
  db: require('./db'),
  getUnixTimestamp(date) {
    if (date) return parseInt((date.getTime() / 1000).toFixed(0));
    return parseInt((new Date().getTime() / 1000).toFixed(0));
  }
};
