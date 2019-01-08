module.exports = function(app) {

   var Controller = require('./../../controller/Candidates/Candidates.controller.js');


   app.post('/API/Candidates/CandidatesList', Controller.CandidatesList);
   app.post('/API/Candidates/Candidate_View', Controller.Candidate_View);
   app.post('/API/Candidates/Accept_Candidate', Controller.Accept_Candidate);
   app.post('/API/Candidates/QuestionAvailable_Check', Controller.QuestionAvailable_Check);
   app.post('/API/Candidates/AssignExam', Controller.AssignExam);
   app.post('/API/Candidates/Candidate_ExamView', Controller.Candidate_ExamView);
   app.post('/API/Candidates/ExamResult_Update', Controller.ExamResult_Update);
   app.post('/API/Candidates/GDResult_Update', Controller.GDResult_Update);
   app.post('/API/Candidates/TechnicalResult_Update', Controller.TechnicalResult_Update);
   app.post('/API/Candidates/InterviewResult_Update', Controller.InterviewResult_Update);

   app.post('/API/Candidates/Refer_Candidate', Controller.Refer_Candidate);
   app.post('/API/Candidates/Accept_Referred', Controller.Accept_Referred);


};
