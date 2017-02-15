const Intent = require('./Intent');

class Request {
  constructor({ error, intent, locale, reason, requestId, timestamp, type }) {
    this.error = error;
    this.locale = locale;
    this.reason = reason;
    this.requestId = requestId;
    this.timestamp = timestamp;
    this.type = type;
    if (intent) {
      this.intent = new Intent(intent);
    }
  }

  get(key) {
    if (this.intent) {
      return this.intent.get(key);
    }
  }
}

module.exports = Request;
