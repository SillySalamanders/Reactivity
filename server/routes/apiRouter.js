var apiRouter = require('express').Router();
var dbMethods = require('../../db/dbMethods');
var moment = require('moment');

apiRouter.get('/activities/:id', function(req, res) {
  dbMethods.getActivityById(req.params.id, req.user.id)
    .then(function(activity) {
      if (!activity) {
        res.status(404).send('Activity not found');
      } else {
        res.json(activity);
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Server error');
    });
});

apiRouter.post('/activities', dbMethods.postActivity);

apiRouter.get('/activities/mine/:n', function(req, res) {
  var sportIdsArr = req.query.sportIds ? JSON.parse(req.query.sportIds) : null;
  var startTime = req.query.start || moment().subtract(1, 'hour').utc();
  var endTime = req.query.end || null;
  var n = req.params.n;
  dbMethods.getUserActivities(req.user.id, n, sportIdsArr, startTime, endTime)
    .then(function(activities) {
      res.json(activities);
    })
    .catch(function(err) {
      console.error('Get my activities error:', err);
      res.status(500).send(err);
    });
});

apiRouter.get('/activities/myfriends/:n', function(req, res) {
  var n = req.params.n;
  var sportIdsArr = req.query.sportIds ? JSON.parse(req.query.sportIds) : null;
  var startTime = req.query.start || moment().subtract(1, 'hour').utc();
  var endTime = req.query.end || null;
  dbMethods.getUsersFriendsActivities(req.user.id, n, sportIdsArr, startTime, endTime)
    .then(function(activities) {
      res.json(activities);
    })
    .catch(function(err) {
      console.error('Get my activities error:', err);
      res.status(500).send(err);
    });
});

apiRouter.get('/activities/nearby/:lat/:long/:n?', function(req, res) {
  var lat = req.params.lat;
  var long = req.params.long;
  var n = req.params.n || 25;
  var sportIdsArr = req.query.sportIds ? JSON.parse(req.query.sportIds) : null;
  var startTime = req.query.start || moment().subtract(1, 'hour').utc();
  var endTime = req.query.end || null;

  dbMethods.activitiesNearby(lat, long, n, sportIdsArr, startTime, endTime)
    .then(function(results) {
      res.json(results);
    })
    .catch(function(err) {
      console.error('find nearby activities error:', err);
      res.status(500).send(err);
    });
});

apiRouter.get('/profile/:idOrUsername', function(req, res) {
  dbMethods.getProfileByIdOrUsername(req.params.idOrUsername, req.user.id)
    .then(function(user) {
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.json(user);
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Server error');
    });
});

//UPDATE PROFILE
apiRouter.patch('/profile/:id', dbMethods.editProfile);
apiRouter.patch('/interests', dbMethods.editInterests);

//************************************************
//                   FRIENDS
//************************************************

apiRouter.get('/friends/myrequests', dbMethods.getFriendRequests);
apiRouter.put('/friends/accept/:id', dbMethods.acceptFriendRequest);
apiRouter.delete('/friends/myrequests/:id', dbMethods.deleteFriendRequest);
apiRouter.put('/friends/makerequest/:id', dbMethods.makeFriendRequest);
apiRouter.delete('/friends/:id', dbMethods.deleteFriend);
apiRouter.get('/friends/:idOrUsername', function(req, res) {
  dbMethods.getUserFriendsByIdOrUsername(req.params.idOrUsername)
    .then(function(friends) {
      res.json(friends);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Server error');
    });
});







apiRouter.get('/sports', dbMethods.getSports);

















apiRouter.route('/test')
  .get(function(req, res) {
    res.send('Hey there HR 50');
  });

apiRouter.get('/nateTest', function(req, res) {
  res.end();
});

// apiRouter.route('/authTest', passport.authenticate('jwt', { session: false}))
//   .get(function(req, res) {
//     res.send('Hey there authenticated user');
//   });

module.exports = apiRouter;
