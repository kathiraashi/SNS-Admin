var CryptoJS = require("crypto-js");
var CategoryModel = require('./../../models/Settings/Category.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');




// ************************************************** Category *****************************************************
   // Category Async Validate -----------------------------------------------
   exports.Category_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Category || ReceivingData.Category === '' ) {
         res.status(400).send({Status: false, Message: "Category can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         CategoryModel.CategorySchema.findOne({ 'Category': { $regex : new RegExp("^" + ReceivingData.Category + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category Find Query Error', 'Category.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Category!."});
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
// Category Create -----------------------------------------------
   exports.Category_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Category || ReceivingData.Category === '' ) {
         res.status(400).send({Status: false, Message: "Category can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {
         var Create_Category = new CategoryModel.CategorySchema({
            Category: ReceivingData.Category,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_Category.save(function(err, result) { // Category Save Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Creation Query Error', 'Category.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Category!."});
            } else {
               CategoryModel.CategorySchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                  .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                  .exec(function(err_1, result_1) { // Category FindOne Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Find Query Error', 'Category.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Categorys!."});
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
// Category List -----------------------------------------------
   exports.Category_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         CategoryModel.CategorySchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Category FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Find Query Error', 'Category.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Categorys!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Category Simple List -----------------------------------------------
   exports.Category_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         CategoryModel.CategorySchema.find({ 'If_Deleted': false }, { Category : 1 }, {sort: { updatedAt: -1 }}, function(err, result) { // Category FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Find Query Error', 'Category.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Categorys!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Category Update -----------------------------------------------
   exports.Category_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Category_Id || ReceivingData.Category_Id === '' ) {
         res.status(400).send({Status: false, Message: "Category Id can not be empty" });
      }else if(!ReceivingData.Category || ReceivingData.Category === '' ) {
         res.status(400).send({Status: false, Message: "Category can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         CategoryModel.CategorySchema.findOne({'_id': ReceivingData.Category_Id}, {}, {}, function(err, result) { // Category FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category FindOne Query Error', 'Category.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Category!."});
            } else {
               if (result !== null) {
                  result.Category = ReceivingData.Category;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Category Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Update Query Error', 'Category.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Category!."});
                     } else {
                        CategoryModel.CategorySchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                           .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                           .exec(function(err_2, result_2) { // Category FindOne Query
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Find Query Error', 'Category.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Categorys!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Category Id can not be valid!" });
               }
            }
         });
      }
   };
// Category Delete -----------------------------------------------
   exports.Category_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Category_Id || ReceivingData.Category_Id === '' ) {
         res.status(400).send({Status: false, Message: "Category Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         CategoryModel.CategorySchema.findOne({'_id': ReceivingData.Category_Id}, {}, {}, function(err, result) { // Category FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category FindOne Query Error', 'Category.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Category!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Category Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Category Delete Query Error', 'Category.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Category!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Category Id can not be valid!" });
               }
            }
         });
      }
   };