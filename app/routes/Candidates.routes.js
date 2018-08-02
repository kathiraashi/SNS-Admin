module.exports = function(app) {

    var Controller = require('../controller/Candidates.controller.js');

    app.post('/API/Candidates/CandidatesList', Controller.CandidatesList);
    app.post('/API/Candidates/Candidate_View', Controller.Candidate_View);

    app.post('/API/Candidates/Questions_Create', Controller.Questions_Create);
    app.post('/API/Candidates/Questions_List', Controller.Questions_List);

};
