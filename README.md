# node-olinapps

`npm install olinapps`

In the top of your file:

```js
var olinapps = require('olinapps');
```

In your express app, right after your `app.configure`:

```js
/**
 * Authentication
 */

app.post('/login', olinapps.login);
app.all('/logout', olinapps.logout);
app.all('/*', olinapps.middleware);
app.all('/api/*', olinapps.loginRequiredJSON); // (optional) login required, no redirect, returns 401
app.all('/*', olinapps.loginRequired);
```

Remove the `loginRequired` line if logging in is optional. Then in any route:

```js
app.get('/', function (req, res) {
  var user = olinapps.user(req);
  console.log(user);
  // ...
})
```

Yields:

```js
{ id: 'timothy.ryan',
  created: 1354933883,
  domain: 'students.olin.edu',
  username: 'timothy.ryan',
  email: 'timothy.ryan@students.olin.edu' }
```

## Directory & Mailing Lists

You can request information from the Olin Directory or Mailing List APIs.

```
app.get('/me', function (req, res) {
  olinapps.directory.me(req, function (err, json) {
    res.json(json);
  });
});

app.get('/people', function (req, res) {
  olinapps.directory.people(req, function (err, json) {
    res.json(json);
  });
});

app.get('/list', function (req, res) {
  olinapps.lists.list(req, 'helpme', 'ride to eliot', function (err, json) {
    olinapps.lists.messages(req, json.groups[0].ids, function (err, json) {
      res.json(json);
    })
  });
});
```

## API

Session:

```
olinapps.user(req);
olinapps.sessionid(req);
```

Middleware:

```
olinapps.login
olinapps.logout
olinapps.middleware
olinapps.loginRequired
olinapps.loginRequiredJSON
```

APIs:

```
olinapps.directory.me(req, callback)
olinapps.directory.people(req, callback)

olinapps.lists.list(req, name, keywords, callback)
olinapps.lists.messages(req, ids, callback)
```

## Example

See the source for [quotes.olinapps.com](http://github.com/ohack/olinapps-quotes) for an example.