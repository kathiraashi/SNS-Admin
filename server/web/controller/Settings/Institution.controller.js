var CryptoJS = require("crypto-js");
var InstitutionModel = require('./../../models/Settings/Institution.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var multer = require('multer');



var Institution_Image_Storage = multer.diskStorage({
   destination: (req, file, cb) => { cb(null, './Uploads/Institutions'); },
   filename: (req, file, cb) => { cb(null, 'Ins_' + Date.now() + '.png'); }
});
var Institution_Image_Upload = multer({
   storage: Institution_Image_Storage,
   fileFilter: function (req, file, callback) {
       let extArray = file.originalname.split(".");
       let extension = (extArray[extArray.length - 1]).toLowerCase();
       if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
           return callback("Only 'png, gif, jpg and jpeg' images are allowed");
       }
       callback(null, true);
   }
}).single('image');




// ************************************************** Institution *****************************************************
   // Institution Async Validate -----------------------------------------------
   exports.Institution_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.findOne({ 'Institution': { $regex : new RegExp("^" + ReceivingData.Institution + "$", "i") }, 'If_Deleted': false }, {}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Institution Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Institution!."});
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
// Institution Create -----------------------------------------------
   exports.Institution_Create = function(req, res) {
      Institution_Image_Upload(req, res, function(upload_err) {
         var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
         var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

         if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
            res.status(400).send({Status: false, Message: "Institution can not be empty" });
         }else if(!ReceivingData.Institution_Code || ReceivingData.Institution_Code === '' ) {
            res.status(400).send({Status: false, Message: "Institution Code can not be empty" });
         } else if (!ReceivingData.Designation || typeof ReceivingData.Designation !== 'object' || ReceivingData.Designation.length === 0 ) {
            res.status(400).send({Status: false, Message: "Designation can not be empty" });
         } else if (!ReceivingData.Departments || typeof ReceivingData.Departments !== 'object' || ReceivingData.Departments.length === 0 ) {
            res.status(400).send({Status: false, Message: "Departments can not be empty" });
         } else if (!ReceivingData.Institution_Category || typeof ReceivingData.Institution_Category !== 'object' || Object.keys(ReceivingData.Institution_Category).length !== 2 ) {
            res.status(400).send({Status: false, Message: "Institution Category can not be empty" });
         } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
            res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
         }else {
            var _Image = {};
            if(req.file !== null && req.file !== undefined && req.file !== ''){
               _Image = { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
            }
            ReceivingData.Departments.map(obj => mongoose.Types.ObjectId(obj));
            ReceivingData.Designation.map(obj => mongoose.Types.ObjectId(obj));
            var Create_Institution = new InstitutionModel.InstitutionSchema({
               Institution: ReceivingData.Institution,
               Institution_Code: ReceivingData.Institution_Code,
               Designation: ReceivingData.Designation,
               Departments: ReceivingData.Departments,
               Image: _Image,
               Institution_Category: ReceivingData.Institution_Category,
               Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
               Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
               Active_Status: true,
               If_Deleted: false
            });
            Create_Institution.save(function(err, result) { // Institution Save Query
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Creation Query Error', 'Institution.controller.js');
                  res.status(417).send({Status: false, Message: "Some error occurred while creating the Institution!."});
               } else {
                  InstitutionModel.InstitutionSchema
                     .findOne({'_id': result._id})
                     .populate({ path: 'Designation', select: ['Designation'] })
                     .populate({ path: 'Departments', select: ['Department'] })
                     .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                     .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                     .exec(function(err_1, result_1) { // Institution FindOne Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Find Query Error', 'Institution.controller.js', err_1);
                        res.status(417).send({status: false, Message: "Some error occurred while Find The Institutions!."});
                     } else {
                        var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                           ReturnData = ReturnData.toString();
                        res.status(200).send({Status: true, Response: ReturnData });
                     }
                  });
               }
            });
         }
      });
   };
// Institution List -----------------------------------------------
   exports.Institution_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema
            .find({ 'If_Deleted': false }, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Designation', select: ['Designation'] })
            .populate({ path: 'Departments', select: ['Department', 'Department_Code'] })
            .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
            .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
            .exec(function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institutions!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Institution Simple List -----------------------------------------------
   exports.Institution_SimpleList = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.find({ 'If_Deleted': false }, { Institution : 1, Institution_Code : 1, }, {sort: { updatedAt: -1 }}, function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Find Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institutions!."});
            } else {
               result = result.map(obj => {
                  const newObj = {
                     _id : obj._id,
                     Institution : obj.Institution +' (' + obj.Institution_Code  + ') '
                  }
                  return newObj;
               })
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
// Institution Update -----------------------------------------------
   exports.Institution_Update = function(req, res) {
      Institution_Image_Upload(req, res, function(upload_err) {
         var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
         var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

         if(!ReceivingData.Institution_Id || ReceivingData.Institution_Id === '' ) {
            res.status(400).send({Status: false, Message: "Institution Id can not be empty" });
         }else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
            res.status(400).send({Status: false, Message: "Institution can not be empty" });
         }else if(!ReceivingData.Institution_Code || ReceivingData.Institution_Code === '' ) {
            res.status(400).send({Status: false, Message: "Institution Code can not be empty" });
         } else if (!ReceivingData.Designation || typeof ReceivingData.Designation !== 'object' || ReceivingData.Designation.length === 0 ) {
            res.status(400).send({Status: false, Message: "Departments can not be empty" });
         } else if (!ReceivingData.Departments || typeof ReceivingData.Departments !== 'object' || ReceivingData.Departments.length === 0 ) {
            res.status(400).send({Status: false, Message: "Departments can not be empty" });
         } else if (!ReceivingData.Institution_Category || typeof ReceivingData.Institution_Category !== 'object' || Object.keys(ReceivingData.Institution_Category).length !== 2 ) {
            res.status(400).send({Status: false, Message: "Institution Category can not be empty" });
         } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
            res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
         }else {
            InstitutionModel.InstitutionSchema.findOne({'_id': ReceivingData.Institution_Id}, {}, {}, function(err, result) { // Institution FindOne Query
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution FindOne Query Error', 'Institution.controller.js', err);
                  res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institution!."});
               } else {
                  if (result !== null) {
                     ReceivingData.Departments.map(obj => mongoose.Types.ObjectId(obj));
                     ReceivingData.Designation.map(obj => mongoose.Types.ObjectId(obj));

                     if(req.file !== null && req.file !== undefined && req.file !== ''){
                        result.Image = { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
                     }
                     result.Designation = ReceivingData.Designation;
                     result.Departments = ReceivingData.Departments;
                     result.Institution_Category = ReceivingData.Institution_Category;
                     result.Institution = ReceivingData.Institution;
                     result.Institution_Code = ReceivingData.Institution_Code;
                     result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);

                     result.save(function(err_1, result_1) { // Institution Update Query
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Update Query Error', 'Institution.controller.js');
                           res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Institution!."});
                        } else {
                           InstitutionModel.InstitutionSchema
                              .findOne({'_id': result_1._id})
                              .populate({ path: 'Designation', select: ['Designation'] })
                              .populate({ path: 'Departments', select: ['Department'] })
                              .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                              .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                              .exec(function(err_2, result_2) { // Institution FindOne Query
                              if(err_2) {
                                 ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Find Query Error', 'Institution.controller.js', err_2);
                                 res.status(417).send({status: false, Message: "Some error occurred while Find The Institutions!."});
                              } else {
                                 var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                    ReturnData = ReturnData.toString();
                                 res.status(200).send({Status: true, Response: ReturnData });
                              }
                           });
                        }
                     });
                  } else {
                     res.status(400).send({Status: false, Message: "Institution Id can not be valid!" });
                  }
               }
            });
         }
      });
   };
// Institution Delete -----------------------------------------------
   exports.Institution_Delete = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution_Id || ReceivingData.Institution_Id === '' ) {
         res.status(400).send({Status: false, Message: "Institution Id can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {
         InstitutionModel.InstitutionSchema.findOne({'_id': ReceivingData.Institution_Id}, {}, {}, function(err, result) { // Institution FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution FindOne Query Error', 'Institution.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Institution!."});
            } else {
               if (result !== null) {
                  result.If_Deleted = true;
                  result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // Institution Delete Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Institution Delete Query Error', 'Institution.controller.js');
                        res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Institution!."});
                     } else {
                        res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Institution Id can not be valid!" });
               }
            }
         });
      }
   };