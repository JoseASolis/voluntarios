'use strict';
var Voluntarios = require('../common/models/voluntarios');
var loopback = require('loopback');
var boot = require('loopback-boot');
var admin = require("firebase-admin");
var app = module.exports = loopback();
var multer = require('multer');
const bodyParser = require("body-parser");
var serviceAccount = require('./voluntarioskey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://voluntarios-52686.firebaseio.com/'
});
app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(multer().any()); // for parsing multipart/form-data
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;
  app.post('/fbpost', function (req, res) {
    var postlink = req.body.link;
    var body = req.body.contenido;
    var token = req.body.token;
    //Voluntarios.find({where: {}}, function(err, accounts) { console.log(accounts)});
    var FB = require('fb'),
      FB = new FB.Facebook();
    FB.extend({ appId: '190967484850064', appSecret: '80c7f70ef7a8e482a75dae4db3a875cf' })
    FB.setAccessToken(token);

    FB.api('me/feed', 'post', { message: body, link: postlink }, function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      res.json("done")
    });

    //res.json({ running: true });
  });
  app.get('/n', function (req, res) {
    var topic = "alldevices";

    var payload = {

      data: {
        title: req.body.titulo,
        userid:"YESSSSSSSSSSSSSs"
        // score: "850",
        // time: "2:45"
      }
    };
    admin.messaging().sendToTopic(topic, payload)
      .then(function (response) {
        // See the MessagingTopicResponse reference documentation for the
        // contents of response.
        console.log("Successfully sent message:", response);
        res.json("done")
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
        res.json("done")
      });
  })
  app.post('/sendnotification', function (req, res) {
    var topic = "alldevices";

    var payload = {
      notification: {
        title: req.body.titulo,
        body: req.body.contenido,

        click_action: req.body.link
      },
      data: {
        userid:"YESSSSSSSSSSSSSs"
        // score: "850",
        // time: "2:45"
      }
    };

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().sendToTopic(topic, payload)
      .then(function (response) {
        // See the MessagingTopicResponse reference documentation for the
        // contents of response.
        console.log("Successfully sent message:", response);
        res.json("done")
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
        res.json("done")
      });
  });


  app.post('/subscribe', function (req, res) {
    var token = req.body.token;
    //token= "fAiV0nVCrug:APA91bGt0VTJt9jDGqtbQ9uYZh61TGyzrzqMXhVxWrnPm89dKG8KhIVdwcGR2ZELHYv0kzyLpFtiorpoMP9auK8Dm14y7wwmagpmlfx6YmM9BkILlPix2THp7ykDS7pbcDJw_lgKj4PC";
    var topic = "alldevices";

    // Subscribe the device corresponding to the registration token to the
    // topic.
    admin.messaging().subscribeToTopic(token, topic)
      .then(function (response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log("Successfully subscribed to topic:", response.errors);
        res.json(response);
      })
      .catch(function (error) {
        console.log("Error subscribing to topic:", JSON.stringify(error));
        res.json(response);
      });
    /*
     var db = admin.firestore();
     var ref = db.collection('devices');
     console.log(ref);

     ref.on("value", function (snapshot) {
       var registrationToken = snapshot.val().userid;
       var registrationTokens = [
         "dj8L1hHPSgg:APA91bFbuCfJv38GjxNYAxLqfoktsUZyBtUmFDQ1KkMOnVH7KSN4sjZdPpD_yMd7ER7qwFJ6SWHbQeJXS-F5OFomXT6ECRUiUmlRXY_bWolZ65K4nR95f-SgTN6aEu1AknJXBxaw8xI6"
       ]; var payload = {
         notification: {
           title: req.body.titulo,
           body: req.body.contenido,
           click_action: req.body.link
         },
         data: {
           userid:"YESSSSSSSSSSSSSs"
           // score: "850",
           // time: "2:45"
         }
       };
       admin.messaging().sendToDevice(registrationToken, payload)
         .then(function (response) {
           console.log("Successfully sent message:", response);

         })
         .catch(function (error) {
           console.log("Error sending message:", error);
         });

     }, function (errorObject) {
       console.log("The read failed: " + errorObject.code);
       res.json(errorObject)
     });
     res.json("done")
     */
  });

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
