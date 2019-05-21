module.exports = promisifiedList = (array) => {
  return array.reduce(function(promise, p) {
    return promise = promise.then(p);
  }, Promise.resolve());
}