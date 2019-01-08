module.exports = function(app) {

   var Controller = require('./../../controller/Settings/Designation.controller.js');


   app.post('/API/Settings/Designation/Designation_AsyncValidate', Controller.Designation_AsyncValidate);
   app.post('/API/Settings/Designation/Designation_Create', Controller.Designation_Create);
   app.post('/API/Settings/Designation/Designation_List', Controller.Designation_List);
   app.post('/API/Settings/Designation/Designation_SimpleList', Controller.Designation_SimpleList);
   app.post('/API/Settings/Designation/Designation_Update', Controller.Designation_Update);
   app.post('/API/Settings/Designation/Designation_Delete', Controller.Designation_Delete);

};