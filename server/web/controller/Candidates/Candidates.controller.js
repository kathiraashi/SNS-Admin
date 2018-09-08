var CandidateModel = require('./../../models/Candidates/Candidates.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var CryptoJS = require("crypto-js");


exports.CandidatesList = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.find({Status:'Active' }, {Activity_Info: 0, Education_Info: 0, Files: 0, Reference_Info: 0}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidates List Find Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Candidates List!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};

exports.Candidate_View = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.findOne({_id: ReceivingData.Candidate_Id }, {}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Data Find Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Candidate Data!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};
