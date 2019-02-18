module.exports = function(app) {

   var Controller = require('./../../controller/Admin/AdminManagement.controller.js');

   app.post('/API/RegisterAndLogin/User_Login_Validate', Controller.User_Login_Validate);
   app.post('/API/RegisterAndLogin/Forgot_Password_Request', Controller.Forgot_Password_Request);
   app.post('/API/RegisterAndLogin/Reset_Password', Controller.Reset_Password);


};
