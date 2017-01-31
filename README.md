[![Dependency Status](https://david-dm.org/dnode/dalexa/status.svg)](https://david-dm.org/dnode/dalexa)
[![devDependency Status](https://david-dm.org/dnode/dalexa/dev-status.svg)](https://david-dm.org/dnode/dalexa?type=dev)

# Installation

`npm i --save mxd-heimdall`


# Initialisation

```
const app = require('dexpress');
app.use(require('body-parser').json());

const skill = new (require('./lib').Skill)();

app.post('/', skill.getExpressHandler());
```


# Examples

## Simple Intent

```
skill.onIntent('example', async ({ request, response }) => {
  response.say('Hello Alexa');
});
```
