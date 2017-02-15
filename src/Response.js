class Response {
  say(plainText) {
    this.outputSpeech = { type: 'PlainText', text: plainText };
    return this;
  }

  display({ title, text, image }) {
    this.card = { type: 'Standard', title, text, image };
    return this;
  }

  linkAccount() {
    this.card = { type: 'LinkAccount' };
    return this;
  }
}

module.exports = Response;
