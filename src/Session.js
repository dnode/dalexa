class Session {
  constructor(json) {
    this.json = json;
    this.application = json.application;
    this.attributes = json.attributes || {};
    this.shouldEndSession = true;
    this.sessionId = json.sessionId;
    this.user = json.user;
  }

  clear() {
    this.attributes = {};
    return this;
  }

  set(key, value) {
    this.attributes[key] = value;
    return this;
  }

  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
    return this;
  }

  get(key) {
    return this.attributes[key];
  }

  getJSON(key) {
    let value = this.get(key);
    if (value) {
      value = JSON.parse(value);
    }
    return value;
  }
}

module.exports = Session;
