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


exports.Questions_Create = function(req, res) {

   var ReceivingData = req.body;

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if(!ReceivingData.College || ReceivingData.College === '' ) {
      res.status(400).send({Status: false, Message: "College Details can not be empty" });
   } else if(!ReceivingData.Department || ReceivingData.Department === '' ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else if(!ReceivingData.Category || ReceivingData.Category === '' ) {
      res.status(400).send({Status: false, Message: "Category Details can not be empty" });
   } else if(!ReceivingData.Question || ReceivingData.Question === '' ) {
      res.status(400).send({Status: false, Message: "Question can not be empty" });
   } else if(!ReceivingData.Option_A || ReceivingData.Option_A === '' ) {
      res.status(400).send({Status: false, Message: "Option A can not be empty" });
   } else if(!ReceivingData.Option_B || ReceivingData.Option_B === '' ) {
      res.status(400).send({Status: false, Message: "Option B not be empty" });
   } else if(!ReceivingData.Option_C || ReceivingData.Option_C === '' ) {
      res.status(400).send({Status: false, Message: "Option C can not be empty" });
   } else if(!ReceivingData.Option_D || ReceivingData.Option_D === '' ) {
      res.status(400).send({Status: false, Message: "Option D can not be empty" });
   } else if(!ReceivingData.Option_E || ReceivingData.Option_E === '' ) {
      res.status(400).send({Status: false, Message: "Option E can not be empty" });
   } else if(!ReceivingData.Option_F || ReceivingData.Option_F === '' ) {
      res.status(400).send({Status: false, Message: "Option F can not be empty" });
   } else if(!ReceivingData.Answer || ReceivingData.Answer === '' ) {
      res.status(400).send({Status: false, Message: "Answer can not be empty" });
   } else {
      var VarQuestionSchema = new CandidateModel.QuestionSchema({
         College: ReceivingData.College,
         Department: ReceivingData.Department,
         Category: ReceivingData.Category,
         Question: ReceivingData.Question,
         Option_A: ReceivingData.Option_A,
         Option_B: ReceivingData.Option_B,
         Option_C: ReceivingData.Option_C,
         Option_D: ReceivingData.Option_D,
         Option_E: ReceivingData.Option_E,
         Option_F: ReceivingData.Option_F,
         Answer:  ReceivingData.Answer,
         User_Id: ReceivingData.User_Id,
         Status:  true ,
      });
      VarQuestionSchema.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer Creation Query Error', 'Candidates.controller.js', err);
            res.status(400).send({Status: false, Message: "Some error occurred while creating the Question Answer!."});
         } else {
            result = JSON.stringify(result);
            res.status(200).send({Status: true, Response: result });
         }
      });
   }
};


exports.Questions_List = function(req, res) {
   if(!req.body.User_Id || req.body.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else {
      CandidateModel.QuestionSchema.find({Status: true }, {}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer List Find Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Question Answer List!."});
         } else {
            result = JSON.stringify(result);
            res.status(200).send({Status: true, Response: result });
         }
      });
   }
};