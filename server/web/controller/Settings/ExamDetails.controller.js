var CryptoJS = require("crypto-js");
var ExamDetailsModel = require('./../../models/Settings/ExamDetails.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** ExamDetails *****************************************************  
// ExamDetails Create -----------------------------------------------
   exports.ExamDetails_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ExamDetails || ReceivingData.ExamDetails === '' ) {
         res.status(400).send({Status: false, Message: "ExamDetails can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         var Create_ExamDetails = new ExamDetailsModel.ExamDetailsSchema({
            ExamDetails: ReceivingData.ExamDetails,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_ExamDetails.save(function(err, result) { // ExamDetails Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails Creation Query Error', 'ExamDetails.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while creating the ExamDetails!."});
            } else {
               ExamDetailsModel.ExamDetailsSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Created_By', select: 'Name' })
                  .populate({ path: 'Last_Modified_By', select: 'Name' })
                  .exec(function(err_1, result_1) { // ExamDetails FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails Find Query Error', 'ExamDetails.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Exam Details!."});
                  } else {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                        ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }
               });
            }
         });
      }
   };
// ExamDetails List -----------------------------------------------
   exports.ExamDetails_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ExamDetailsModel.ExamDetailsSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Created_By', select: 'Name' })
            .populate({ path: 'Last_Modified_By', select: 'Name' })
            .exec(function(err, result) { // ExamDetails FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails Find Query Error', 'ExamDetails.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Exam Details!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// ExamDetails Update -----------------------------------------------
   exports.ExamDetails_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ExamDetails_Id || ReceivingData.ExamDetails_Id === '' ) {
         res.status(400).send({Status: false, Message: "ExamDetails Id can not be empty" });
      }else if(!ReceivingData.ExamDetails || ReceivingData.ExamDetails === '' ) {
         res.status(400).send({Status: false, Message: "ExamDetails can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         ExamDetailsModel.ExamDetailsSchema.findOne({'_id': ReceivingData.ExamDetails_Id}, {}, {}, function(err, result) { // ExamDetails FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails FindOne Query Error', 'ExamDetails.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Exam Details!."});
            } else {
               if (result !== null) {
                  result.ExamDetails = ReceivingData.ExamDetails;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // ExamDetails Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails Update Query Error', 'ExamDetails.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the ExamDetails!."});
                     } else {
                        ExamDetailsModel.ExamDetailsSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Created_By', select: 'Name' })
                           .populate({ path: 'Last_Modified_By', select: 'Name' })
                           .exec(function(err_2, result_2) { // ExamDetails FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails Find Query Error', 'ExamDetails.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Exam Details!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "ExamDetails Id can not be valid!" });
               }
            }
         });
      }
   };
// ExamDetails Delete -----------------------------------------------
   exports.ExamDetails_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.ExamDetails_Id || ReceivingData.ExamDetails_Id === '' ) {
         res.status(400).send({Status: false, Message: "ExamDetails Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         ExamDetailsModel.ExamDetailsSchema.findOne({'_id': ReceivingData.ExamDetails_Id}, {}, {}, function(err, result) { // ExamDetails FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails FindOne Query Error', 'ExamDetails.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The ExamDetails!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // ExamDetails Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings ExamDetails Delete Query Error', 'ExamDetails.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the ExamDetails!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "ExamDetails Id can not be valid!" });
               }
            }
         });
      }
   };