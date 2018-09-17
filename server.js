var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var path = require('path');

var ErrorManagement = require('./server/handling/ErrorHandling.js');
var LogManagement = require('./server/handling/LogHandling.js');
var AdminModel = require('./server/web/models/Admin/AdminManagement.model.js');

var port = process.env.PORT || 4000;
var app = express();


// Process On Every Error
   process.setMaxListeners(0);
   process.on('unhandledRejection', (reason, promise) => {
      console.log(reason);
      ErrorManagement.ErrorHandling.ErrorLogCreation('', '', '', reason);
      console.error("'Un Handled Rejection' Error Log File - " + new Date().toLocaleDateString());
   });
   process.on('uncaughtException', function (err) {
      console.log(err);
      ErrorManagement.ErrorHandling.ErrorLogCreation('', '', '', err.toString());
      console.error(" 'Un Caught Exception' Error Log File - " + new Date().toLocaleDateString());
   });


// DB Connection
   // mongoose.connect('mongodb://kathiraashi:kathir143@ds263161.mlab.com:63161/sns');
   mongoose.connect('mongodb://kathiraashi:kathir143@ds245532.mlab.com:45532/sns-local');
   mongoose.connection.on('error', function(err) {
      ErrorManagement.ErrorHandling.ErrorLogCreation('', 'Mongodb Connection Error', 'Server.js', err);
   });
   mongoose.connection.once('open', function() {
      console.log('DB Connectivity, Success!');
   });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/API/Uploads', express.static('Uploads'));

// Every request Log Creation
// app.use('/API/', function (req, res, next) {
//    if (req.body.Info !== '' && req.body.Info){
//       LogManagement.LogHandling.LogCreation(req);
//       return next();
//    }else {
//       ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Security Error For Every Request Log Creation', 'Server.js');
//       return res.status(406).send({Status: false, Message: 'Invalid Arguments'});
//    }
// });

 require('./server/web/routes/Admin/RegisterAndLogin.routes.js')(app); // Without Company Id, User Id and Authorization

   function AuthorizationValidate(AuthorizationKey, callback) {
      var date = new Date(new Date() - 20 * 60 * 1000); // 20 minutes differ
      AdminModel.User_Management.findOne({ 
         '_id': mongoose.Types.ObjectId(AuthorizationKey.slice(0, -32)), 
         'LoginToken': AuthorizationKey.slice(-32),
         LastActiveTime: { $gte: date } }, {}, {}, function(err, response) {
            if (!err && response !== null) {
               AdminModel.User_Management.update({ _id: response._id }, { $set: { LastActiveTime: new Date() }}).exec();
               return callback(true);
            }else {
               return callback(false);
            }
         });
   }
//  // Every request Log Creation
   // app.use('/API/', function (req, res, next) {
   //    if (req.headers.authorization) {
   //       AuthorizationValidate(req.headers.authorization, function(callback){
   //          if (callback) {
   //             return next();
   //          }else{
   //             ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Security Error For Request authorization Empty', 'Server.js');
   //             return res.status(401).send({Status: false, Message: 'Invalid Authorization'});
   //          }
   //        });
   //    }else {
   //       ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Security Error For Request authorization Empty', 'Server.js');
   //       return res.status(401).send({Status: false, Message: 'Invalid Authorization'});
   //    }
   // });

// Admin
   require('./server/web/routes/Admin/AdminManagement.routes.js')(app);

// Candidates
   require('./server/web/routes/Candidates/Candidates.routes.js')(app);
// Q&A
   require('./server/web/routes/Q&A/QuestionAndAnswer.routes.js')(app);

// Settings
   require('./server/web/routes/Settings/Department.routes.js')(app);
   require('./server/web/routes/Settings/Category.routes.js')(app);
   require('./server/web/routes/Settings/Institution.routes.js')(app);
   require('./server/web/routes/Settings/ExamConfig.routes.js')(app);


   // app.use(express.static(__dirname + '/view/dist/view/'));

   // app.use(function(req, res) {
   //    res.sendFile(path.join(__dirname, '/view/dist/view', 'index.html'));
   // });


app.get('*', function(req, res){
    res.send('This is Server Side Page');
});


app.listen(port, function(){
  console.log('Listening on port ' + port);
});