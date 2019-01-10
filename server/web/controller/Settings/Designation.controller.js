var CryptoJS = require("crypto-js");
var DesignationModel = require('./../../models/Settings/Designation.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** Designation *****************************************************
   // Designation Async Validate -----------------------------------------------
   exports.Designation_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "Designation can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         DesignationModel.DesignationSchema.findOne({ 'Designation': { $regex : new RegExp("^" + ReceivingData.Designation + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Designation Find Query Error', 'Designation.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Designation!."});
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
// Designation Create -----------------------------------------------
   exports.Designation_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "Designation can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         var Create_Designation = new DesignationModel.DesignationSchema({
            Designation: ReceivingData.Designation,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_Designation.save(function(err, result) { // Designation Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Creation Query Error', 'Designation.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Designation!."});
            } else {
               DesignationModel.DesignationSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Created_By', select: 'Name' })
                  .populate({ path: 'Last_Modified_By', select: 'Name' })
                  .exec(function(err_1, result_1) { // Designation FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Find Query Error', 'Designation.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Designations!."});
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
// Designation List -----------------------------------------------
   exports.Designation_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         DesignationModel.DesignationSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Created_By', select: 'Name' })
            .populate({ path: 'Last_Modified_By', select: 'Name' })
            .exec(function(err, result) { // Designation FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Find Query Error', 'Designation.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Designations!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Designation Simple List -----------------------------------------------
   exports.Designation_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         DesignationModel.DesignationSchema.find({ 'If_Deleted': false }, { Designation : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Designation FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Find Query Error', 'Designation.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Designations!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Designation Update -----------------------------------------------
   exports.Designation_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Designation_Id || ReceivingData.Designation_Id === '' ) {
         res.status(400).send({Status: false, Message: "Designation Id can not be empty" });
      }else if(!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "Designation can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         DesignationModel.DesignationSchema.findOne({'_id': ReceivingData.Designation_Id}, {}, {}, function(err, result) { // Designation FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation FindOne Query Error', 'Designation.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Designation!."});
            } else {
               if (result !== null) {
                  result.Designation = ReceivingData.Designation;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Designation Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Update Query Error', 'Designation.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Designation!."});
                     } else {
                        DesignationModel.DesignationSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Created_By', select: 'Name' })
                           .populate({ path: 'Last_Modified_By', select: 'Name' })
                           .exec(function(err_2, result_2) { // Designation FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Find Query Error', 'Designation.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Designations!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Designation Id can not be valid!" });
               }
            }
         });
      }
   };
// Designation Delete -----------------------------------------------
   exports.Designation_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Designation_Id || ReceivingData.Designation_Id === '' ) {
         res.status(400).send({Status: false, Message: "Designation Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         DesignationModel.DesignationSchema.findOne({'_id': ReceivingData.Designation_Id}, {}, {}, function(err, result) { // Designation FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation FindOne Query Error', 'Designation.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Designation!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Designation Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Designation Delete Query Error', 'Designation.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Designation!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Designation Id can not be valid!" });
               }
            }
         });
      }
   };