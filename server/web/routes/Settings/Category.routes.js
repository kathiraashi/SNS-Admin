module.exports = function(app) {

   var Controller = require('./../../controller/Settings/Category.controller.js');


   app.post('/API/Settings/Category/Category_AsyncValidate', Controller.Category_AsyncValidate);
   app.post('/API/Settings/Category/Category_Create', Controller.Category_Create);
   app.post('/API/Settings/Category/Category_List', Controller.Category_List);
   app.post('/API/Settings/Category/Category_SimpleList', Controller.Category_SimpleList);
   app.post('/API/Settings/Category/Category_Update', Controller.Category_Update);
   app.post('/API/Settings/Category/Category_Delete', Controller.Category_Delete);

};