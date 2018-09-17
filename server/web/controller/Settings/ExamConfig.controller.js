var CryptoJS = require("crypto-js");
var ExamConfigModel = require('./../../models/Settings/ExamConfig.model');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');



// ************************************************** Exam Config *****************************************************
   // Exam Config Validate -----------------------------------------------
   exports.ExamConfig_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution_Id || ReceivingData.Institution_Id === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.Department_Id || ReceivingData.Department_Id === ''  ) {
         res.status(400).send({Status: false, Message: "Department Details can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ExamConfigModel.ExamConfigSchema.findOne({ 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution_Id), 'Department': mongoose.Types.ObjectId(ReceivingData.Department_Id), 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Department Available Find Query Error', ' ExamConfig.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Department Available!."});
            } else {
               if ( result !== null) {
                  res.status(200).send({Status: true, Available: false });
               } else {
                  res.status(200).send({Status: true, Available: true });
               }
            }
         });
      }
   };


   // Exam Config Create -----------------------------------------------
   exports.ExamConfig_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Departments can not be empty" });
      } else if (!ReceivingData.ExamDuration || ReceivingData.ExamDuration === ''  ) {
         res.status(400).send({Status: false, Message: "Exam Duration can not be empty" });
      } else if (!ReceivingData.Config || typeof ReceivingData.Config !== 'object' || ReceivingData.Config.length < 1 ) {
         res.status(400).send({Status: false, Message: "Category Details can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {

         ReceivingData.Config = ReceivingData.Config.map(obj => {
            obj.Category = mongoose.Types.ObjectId(obj.Category);
            return obj;
         });

         var Create_ExamConfig = new ExamConfigModel.ExamConfigSchema({
            Institution: ReceivingData.Institution,
            Department: ReceivingData.Department,
            Config: ReceivingData.Config,
            ExamDuration: parseInt(ReceivingData.ExamDuration),
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_ExamConfig.save(function(err, result) { // Exam Config Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Exam Config Creation Query Error', 'ExamConfig.controller.js', err);
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Exam Config!."});
            } else {
               ExamConfigModel.ExamConfigSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Config.Category', select: ['Category'] })
                  .populate({ path: 'Institution', select: ['Institution'] })
                  .populate({ path: 'Department', select: ['Department'] })
                  .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                  .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                  .exec(function(err_1, result_1) { // Exam Config FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Exam Config Find Query Error', 'ExamConfig.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Exam Config!."});
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


   // Exam Config List -----------------------------------------------
   exports.ExamConfig_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         ExamConfigModel.ExamConfigSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Config.Category', select: ['Category'] })
            .populate({ path: 'Institution', select: ['Institution'] })
            .populate({ path: 'Department', select: ['Department'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Exam Config FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Exam Config Find Query Error', 'ExamConfig.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Exam Config!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };


      // Exam Config Update -----------------------------------------------
      exports.ExamConfig_Update = function(req, res) {
         var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
         var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

         if(!ReceivingData.ExamConfig_Id || ReceivingData.ExamConfig_Id === '' ) {
            res.status(400).send({Status: false, Message: "Exam Config Details can not be empty" });
         } else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
            res.status(400).send({Status: false, Message: "Institution can not be empty" });
         } else if (!ReceivingData.Department || ReceivingData.Department === '' ) {
            res.status(400).send({Status: false, Message: "Departments can not be empty" });
         } else if (!ReceivingData.ExamDuration || ReceivingData.ExamDuration === ''  ) {
            res.status(400).send({Status: false, Message: "Exam Duration can not be empty" });
         } else if (!ReceivingData.Config || typeof ReceivingData.Config !== 'object' || ReceivingData.Config.length < 1 ) {
            res.status(400).send({Status: false, Message: "Category Details can not be empty" });
         } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
            res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
         } else {
            ExamConfigModel.ExamConfigSchema.update({'_id': ReceivingData.ExamConfig_Id}, { $set: { If_Deleted: true, Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Modified_By) } },  function(err, result) { // Exam Config FindOne Query
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Exam Config FindOne Query Error', 'ExamConfig.controller.js', err);
                  res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Exam Config!."});
               } else {
                  if (result !== null) {
                     ReceivingData.Config = ReceivingData.Config.map(obj => {
                        obj.Category = mongoose.Types.ObjectId(obj.Category);
                        return obj;
                     });

                     var Create_ExamConfig = new ExamConfigModel.ExamConfigSchema({
                        Institution: ReceivingData.Institution,
                        Department: ReceivingData.Department,
                        Config: ReceivingData.Config,
                        ExamDuration: ReceivingData.ExamDuration,
                        Created_By: mongoose.Types.ObjectId(ReceivingData.Modified_By),
                        Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Modified_By),
                        Active_Status: true,
                        If_Deleted: false
                     });
                     Create_ExamConfig.save(function(err_1, result_1) { // Exam Config Save Query
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Exam Config Creation Query Error', 'ExamConfig.controller.js', err_1);
                           res.status(417).send({Status: false, Message: "Some error occurred while creating the Exam Config!."});
                        } else {
                           ExamConfigModel.ExamConfigSchema
                              .findOne({'_id': result_1._id})
                              .populate({ path: 'Config.Category', select: ['Category'] })
                              .populate({ path: 'Institution', select: ['Institution'] })
                              .populate({ path: 'Department', select: ['Department'] })
                              .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                              .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                              .exec(function(err_2, result_2) { // Exam Config FindOne Query
                              if(err_2) {
                                 ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Exam Config Find Query Error', 'ExamConfig.controller.js', err_2);
                                 res.status(417).send({status: false, Message: "Some error occurred while Find The Exam Config!."});
                              } else {
                                 var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                    ReturnData = ReturnData.toString();
                                 res.status(200).send({Status: true, Response: ReturnData });
                              }
                           });
                        }
                     });
                  }
               }
            });

         }
      };