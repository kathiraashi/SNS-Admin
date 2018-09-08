module.exports = function(app) {

   var Controller = require('./../../controller/Candidates/Candidates.controller.js');


   app.post('/API/Candidates/CandidatesList', Controller.CandidatesList);
   app.post('/API/Candidates/Candidate_View', Controller.Candidate_View);


};
