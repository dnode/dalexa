class Session {
  constructor({ sessionId, application, attributes, user }) {
    this.sessionId = sessionId;
    this.application = application;
    this.attributes = attributes;
    this.newAttributes = null;
    this.user = user;
  }

  set(key, value) {
    this.newAttributes = this.newAttributes || {};
    this.newAttributes[key] = value;
    return this;
  }

  get(key) {
    return this.attributes[key];
  }
}

class Context {}

class Intent {
  constructor({ name, slots }) {
    this.name = name;
    this.slots = {};
    if (slots) {
      Object.keys(slots).forEach((key) => {
        this.slots[key] = slots[key].value;
      });
    }
  }

  get(key) {
    return this.slots[key];
  }
}

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
    return null;
  }
}

class Response {
  construct() {
    this.shouldEndSession = true;
  }

  say(plainText) {
    this.outputSpeech = { type: 'PlainText', text: plainText };
    return this;
  }

  display({ title, text, image }) {
    this.card = { type: 'Standard', title, text, image };
    return this;
  }
}

class Skill {
  constructor() {
    this.intentHandlers = {};
    this.launchHandler = null;
    this.sessionEndedHandler = null;
  }

  onIntent(name, handler) {
    this.intentHandlers[name] = handler;
    return this;
  }

  onIntents(intents) {
    intents.forEach(([name, handler]) => {
      this.onIntent(name, handler);
    });
    return this;
  }

  onLaunch(handler) {
    this.launchHandler = handler;
    return this;
  }

  onSessionEnded(handler) {
    this.sessionEndedHandler = handler;
    return this;
  }

  getExpressHandler() {
    return async (req, res) => {
      const json = req.body;
      const context = new Context(json.context);
      const request = new Request(json.request);
      const session = new Session(json.session);
      const typeHandlers = {
        LaunchRequest: () => this.launchHandler,
        IntentRequest: () => {
          const name = request.intent.name;
          if (!this.intentHandlers[name]) {
            throw new Error(`unknown request intent name "${name}"`);
          }
          return this.intentHandlers[name];
        },
        SessionEndedRequest: () => this.sessionEndedHandler,
      };
      if (!typeHandlers[request.type]) {
        throw new Error(`unknown request type "${request.type}"`);
      }
      const response = new Response();
      try {
        const handler = typeHandlers[request.type]();
        if (handler) {
          await handler({ context, request, response, session });
        }
      } catch (e) {
        console.log(e);
      }
      let sessionAttributes;
      if (session.newAttributes) {
        response.shouldEndSession = false;
        sessionAttributes = session.newAttributes;
      }
      res.send({ response, sessionAttributes, version: '1.0' });
    };
  }
}

module.exports.Skill = Skill;
