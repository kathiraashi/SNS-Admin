module.exports = function(app) {

   var Controller = require('./../../controller/Settings/ExamDetails.controller.js');


   app.post('/API/Settings/ExamDetails/ExamDetails_Create', Controller.ExamDetails_Create);
   app.post('/API/Settings/ExamDetails/ExamDetails_List', Controller.ExamDetails_List);
   app.post('/API/Settings/ExamDetails/ExamDetails_Update', Controller.ExamDetails_Update);
   app.post('/API/Settings/ExamDetails/ExamDetails_Delete', Controller.ExamDetails_Delete);

};