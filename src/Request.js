const Intent = require('./Intent');

class Request {
  constructor(json) {
    this.json = json;
    this.error = json.error;
    this.locale = json.locale;
    this.reason = json.reason;
    this.requestId = json.requestId;
    this.timestamp = json.timestamp;
    this.type = json.type;
    if (intent) {
      this.intent = new Intent(json.intent);
    }
  }

  get(key) {
    if (this.intent) {
      return this.intent.get(key);
    }
  }
}

module.exports = Request;
