class Intent {
  constructor({ name, slots }) {
    this.name = name;
    this.slots = {};
    if (slots) {
      for (const key in Object.keys(slots)) {
        if (typeof slots[key] === 'object') {
          this.slots[key] = slots[key].value;
        } else {
          this.slots[key] = slots[key];
        }
      }
    }
  }

  get(key) {
    return this.slots[key];
  }
}

module.exports = Intent;
