class Intent {
  constructor(json) {
    this.json = json;
    this.name = json.name;
    this.slots = {};
    if (json.slots) {
      for (const key in Object.keys(json.slots)) {
        if (typeof json.slots[key] === 'object') {
          this.slots[key] = json.slots[key].value;
        } else {
          this.slots[key] = json.slots[key];
        }
      }
    }
  }

  get(key) {
    return this.slots[key];
  }
}

module.exports = Intent;
