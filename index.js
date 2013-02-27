var request = require('request');

/**
 * Authentication
 */

function loadSession (req, sessionid, next) {
  request('http://olinapps.com/api/me', {
    qs: {"sessionid": sessionid}
  }, function (err, res, body) {
    try {
      var json = JSON.parse(body);
      if (res.statusCode == 200 && json && 'user' in json) {
        req.session['sessionid'] = sessionid;
        req.session['user'] = json.user;
        return next(true);
      }
    } catch (e) { }
    next(false);
  });
}

function getUsername (user) {
  return user && user.id;
}

function getEmail (user) {
  return user && (String(user.id) + '@' + String(user.domain));
}

function getSessionId (req) {
  return req.session.sessionid;
}

function getSessionUser (req) {
  if (req.session.user) {
    var user = JSON.parse(JSON.stringify(req.session.user));
    user.username = getUsername(user);
    user.email = getEmail(user);
    return user;
  }
  return null;
}

function login (req, res) {
  // External login.
  loadSession(req, req.body.sessionid, function (success) {
    if (success) {
      res.redirect('/');
    } else {
      delete req.session['sessionid'];
      res.send('Invalid session token: ' + JSON.stringify(req.body.sessionid));
    }
  });
}

function logout (req, res) {
  delete req.session['sessionid'];
  delete req.session['user'];
  res.redirect('/');
}

function redirectLogin (req, res, next) {
  res.redirect('http://olinapps.com/external?callback=http://' + req.headers.host + '/login');
}

function middleware (req, res, next) {
  if (!getSessionUser(req) && 'sessionid' in req.query) {
    loadSession(req, req.query.sessionid, function (success) {
      if (success) {
        next();
      } else {
        res.send('Invalid session token: ' + JSON.stringify(req.query.sessionid));
      }
    });
  } else {
    next();
  }
}

function loginRequiredJSON (req, res, next) {
  if (!getSessionUser(req)) {
    res.json({error: true, message: 'Login required.'}, 401);
  } else {
    next();
  }
}

function loginRequired (req, res, next) {
  if (!getSessionUser(req)) {
    redirectLogin(req, res, next);
  } else {
    next();
  }
}

/**
 * Directory
 */

var directory = {
  me: function (req, next) {
    request('http://directory.olinapps.com/api/me', {
      qs: {"sessionid": getSessionId(req)},
      json: true
    }, function (err, res, body) {
      next(err, body);
    });
  },

  people: function (req, next) {
    request('http://directory.olinapps.com/api/people', {
      qs: {"sessionid": getSessionId(req)},
      json: true
    }, function (err, res, body) {
      next(err, body);
    });
  }
};

/**
 * Lists
 */

var lists = {
  list: function (req, list, text, next) {
    request('http://lists.olinapps.com/api/lists/' + list, {
      qs: {
        "sessionid": getSessionId(req),
        "text": text
      },
      json: true
    }, function (err, res, body) {
      next(err, body);
    });
  },

  messages: function (req, ids, next) {
    request('http://lists.olinapps.com/api/messages', {
      qs: {
        "sessionid": getSessionId(req),
        ids: ids
      },
      json: true
    }, function (err, res, body) {
      next(err, body);
    });
  }
};

/**
 * Exports
 */

module.exports = {
  loadSession: loadSession,
  user: getSessionUser,
  sessionid: getSessionId,
  login: login,
  logout: logout,
  middleware: middleware,
  loginRequiredJSON: loginRequiredJSON,
  loginRequired: loginRequired,
  directory: directory,
  lists: lists
};