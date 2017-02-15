const Context = require('./Context');
const Intent = require('./Intent');
const Request = require('./Request');
const Response = require('./Response');
const Session = require('./Session');

class Skill {
  constructor() {
    this.actionHandlers = {};
    this.intentHandlers = {};
    this.launchHandler = null;
    this.middlewares = [];
    this.sessionEndedHandler = null;
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  onAction(name, handler) {
    this.actionHandlers[name] = handler;
    return this;
  }

  onActions(actions) {
    for (const [name, handler] of actions) {
      this.onAction(name, handler);
    }
    return this;
  }

  onIntent(name, handler) {
    this.intentHandlers[name] = handler;
    return this;
  }

  onIntents(intents) {
    for (const [name, handler] of intents) {
      this.onIntent(name, handler);
    }
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
        IntentRequest: (clear) => {
          const name = request.intent.name;
          const lastIntent = session.getJSON('lastIntent');
          if (lastIntent && this.actionHandlers[name]) {
            return this.actionHandlers[name](lastIntent);
          }
          if (!this.intentHandlers[name]) {
            throw new Error(`unknown request intent name "${name}"`);
          }
          if (clear) {
            session.clear();
          }
          session.setJSON('lastIntent', request.intent);
          return this.intentHandlers[name];
        },
        SessionEndedRequest: () => this.sessionEndedHandler,
      };
      if (!typeHandlers[request.type]) {
        throw new Error(`unknown request type "${request.type}"`);
      }
      const response = new Response();
      try {
        const args = { context, request, response, session };
        for (const middleware of this.middlewares) {
          await middleware(args);
        }
        let next;
        do {
          const handler = typeHandlers[request.type](!next);
          next = await handler(args);
          if (next) {
            request.intent = new Intent(next);
          }
        } while (next);
      } catch (e) {
        console.log(e);
      }
      response.shouldEndSession = session.shouldEndSession;
      let sessionAttributes;
      if (!session.shouldEndSession) {
        sessionAttributes = session.attributes;
      }
      res.send({ response, sessionAttributes, version: '1.0' });
    };
  }
}

module.exports = Skill;
