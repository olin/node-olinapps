# Olinapps

`npm install olinapps`

In the top of your file:

```
var olinapps = require('olinapps');
```

In your express app, right after your `app.configure`:

```
/**
 * Authentication
 */

app.post('/login', olinapps.login);
app.all('/logout', olinapps.logout);
app.all('/*', olinapps.middleware);
app.all('/*', olinapps.loginRequired);
```

Remove the `loginRequired` line if logging in is optional. Then in any route:

```
app.get('/', function (req, res) {
  var user = olinapps.user(req);
  console.log(user);
  // ...
})
```

Yields:

```
{ id: 'timothy.ryan',
  created: 1354933883,
  domain: 'students.olin.edu',
  username: 'timothy.ryan',
  email: 'timothy.ryan@students.olin.edu' }
```

## Example

See the source for [quotes.olinapps.com](http://github.com/ohack/olinapps-quotes) for an example.