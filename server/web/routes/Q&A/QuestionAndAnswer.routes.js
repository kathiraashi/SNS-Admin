module.exports = function(app) {

   var Controller = require('./../../controller/Q&A/QuestionAndAnswer.controller.js');

   app.post('/API/QuestionAndAnswer/Questions_Create', Controller.Questions_Create);
   app.post('/API/QuestionAndAnswer/Questions_Import_Append', Controller.Questions_Import_Append);
   app.post('/API/QuestionAndAnswer/Questions_Import_Replace', Controller.Questions_Import_Replace);
   app.post('/API/QuestionAndAnswer/Questions_List', Controller.Questions_List);


};
