module.exports = function(app) {

   var Controller = require('./../../controller/Settings/Department.controller.js');


   app.post('/API/Settings/Department/Department_AsyncValidate', Controller.Department_AsyncValidate);
   app.post('/API/Settings/Department/Department_Create', Controller.Department_Create);
   app.post('/API/Settings/Department/Department_List', Controller.Department_List);
   app.post('/API/Settings/Department/Department_SimpleList', Controller.Department_SimpleList);
   app.post('/API/Settings/Department/Department_Update', Controller.Department_Update);
   app.post('/API/Settings/Department/Department_Delete', Controller.Department_Delete);

};