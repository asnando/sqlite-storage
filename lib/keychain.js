class KeyChain {

  constructor() {
    this.chain = new Map();
  }

  saveKey(idx, key) {
    if (key) this.chain.set(idx, key);
  }

  getKey(idx) {
    return this.chain.get(idx);
  }

}

module.exports = KeyChain;