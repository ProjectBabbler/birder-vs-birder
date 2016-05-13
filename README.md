# Birder Vs Birder ![Logo](https://github.com/ProjectBabbler/birder-vs-birder/blob/master/public/static/images/logo.png "Birder vs Birder")
It's not just for the birds.  Track and compete with your friends on who can see the most birds.

## Set up

### Installs
[Install heroku toolbar](https://toolbelt.heroku.com/)

Set up environment variables. Run `heroku config` and add the key values pairs to `.env`

[Install node](https://nodejs.org/en/download/)

Install dependencies

```
npm install
```

### Running App

You'll want to run `gulp watch` to pick up changes to node modules that will be compiled with babel.

```
gulp watch
```

After that you can run the dev server
```
npm run dev
```

### Running things in the command line or console
Use heroku to run node on the command line.  This way all the config variables will be loaded into the context correctly.
```
heroku local:run node ./optional/file/to/run.js
```
