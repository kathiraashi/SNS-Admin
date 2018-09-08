module.exports = function(app) {

   var Controller = require('./../../controller/Settings/Institution.controller.js');


   app.post('/API/Settings/Institution/Institution_AsyncValidate', Controller.Institution_AsyncValidate);
   app.post('/API/Settings/Institution/Institution_Create', Controller.Institution_Create);
   app.post('/API/Settings/Institution/Institution_List', Controller.Institution_List);
   app.post('/API/Settings/Institution/Institution_SimpleList', Controller.Institution_SimpleList);
   app.post('/API/Settings/Institution/Institution_Update', Controller.Institution_Update);
   app.post('/API/Settings/Institution/Institution_Delete', Controller.Institution_Delete);

};