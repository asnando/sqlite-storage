const promisifiedList = array => array.reduce((promise, p) => {
  const resolved = promise.then(p);
  return resolved;
}, Promise.resolve());

module.exports = promisifiedList;
