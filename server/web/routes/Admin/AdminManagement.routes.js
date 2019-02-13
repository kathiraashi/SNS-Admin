module.exports = function(app) {

   var Controller = require('./../../controller/Admin/AdminManagement.controller.js');

   
   app.post('/API/AdminManagement/User_Name_Validate', Controller.User_Name_Validate);
   app.post('/API/AdminManagement/User_Create', Controller.User_Create);
   app.post('/API/AdminManagement/User_Update', Controller.User_Update);
   app.post('/API/AdminManagement/User_Deactivate', Controller.User_Deactivate);
   app.post('/API/AdminManagement/User_Activate', Controller.User_Activate);
   app.post('/API/AdminManagement/Users_List', Controller.Users_List);

   app.post('/API/AdminManagement/Country_List', Controller.Country_List);
   app.post('/API/AdminManagement/State_List', Controller.State_List);
   app.post('/API/AdminManagement/City_List', Controller.City_List);

};