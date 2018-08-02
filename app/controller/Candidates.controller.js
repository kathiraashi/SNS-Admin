var CandidateModel = require('../models/Candidates.model.js');
var ErrorManagement = require('./../../app/config/ErrorHandling.js');


exports.CandidatesList = function(req, res) {
   if(!req.body.User_Id || req.body.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.find({Status:'Active' }, {Activity_Info: 0, Education_Info: 0, Files: 0, Reference_Info: 0}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidates List Find Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Candidates List!."});
         } else {
            result = JSON.stringify(result);
            // var Response = Buffer.from(result).toString('base64');
            res.status(200).send({Status: true, Response: result });
         }
      });
   }
};

exports.Candidate_View = function(req, res) {
   if(!req.body.User_Id || req.body.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!req.body.Candidate_Id || req.body.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.findOne({_id: req.body.Candidate_Id }, {}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Data Find Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Candidate Data!."});
         } else {
            result = JSON.stringify(result);
            // var Response = Buffer.from(result).toString('base64');
            res.status(200).send({Status: true, Response: result });
         }
      });
   }
};