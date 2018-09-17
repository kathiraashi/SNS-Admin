module.exports = function(app) {

   var Controller = require('./../../controller/Settings/ExamConfig.controller.js');


   app.post('/API/Settings/ExamConfig/ExamConfig_AsyncValidate', Controller.ExamConfig_AsyncValidate);
   app.post('/API/Settings/ExamConfig/ExamConfig_Create', Controller.ExamConfig_Create);
   app.post('/API/Settings/ExamConfig/ExamConfig_List', Controller.ExamConfig_List);
   app.post('/API/Settings/ExamConfig/ExamConfig_Update', Controller.ExamConfig_Update);

};