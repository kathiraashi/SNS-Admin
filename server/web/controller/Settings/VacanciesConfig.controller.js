var CryptoJS = require("crypto-js");
var VacanciesConfigModel = require('./../../models/Settings/VacanciesConfig.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');


// var multer = require('multer');



// var Institution_Image_Storage = multer.diskStorage({
//    destination: (req, file, cb) => { cb(null, './Uploads/Demos'); },
//    filename: (req, file, cb) => { cb(null, 'Ins_' + Date.now() + '.png'); }
// });
// var Demo_Image_Upload = multer({
//    storage: Institution_Image_Storage,
//    fileFilter: function (req, file, callback) {
//        let extArray = file.originalname.split(".");
//        let extension = (extArray[extArray.length - 1]).toLowerCase();
//        if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
//            return callback("Only 'png, gif, jpg and jpeg' images are allowed");
//        }
//        callback(null, true);
//    }
// }).single('my_editor');


// exports.Demo_Upload = function(req, res) {
//    Demo_Image_Upload(req, res, function(upload_err) {
//       console.log(upload_err);
//       console.log(req.file);
//       res.status(200).send({Status: true, Response: req.file.filename });
//    })
// };



// ************************************************** Vacancies Config *****************************************************
   // Vacancies Config Validate -----------------------------------------------
   exports.VacanciesConfig_AsyncValidate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.Department || ReceivingData.Department === ''  ) {
         res.status(400).send({Status: false, Message: "Department Details can not be empty" });
      } else if (!ReceivingData.Designation || ReceivingData.Designation === ''  ) {
         res.status(400).send({Status: false, Message: "Department Details can not be empty" });
      } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         VacanciesConfigModel.VacanciesConfigSchema
            .findOne( { 'Institution': mongoose.Types.ObjectId(ReceivingData.Institution),
                        'Department': mongoose.Types.ObjectId(ReceivingData.Department),
                        'Designation': mongoose.Types.ObjectId(ReceivingData.Designation),
                        'If_Deleted': false 
                     }, {}, {})
            .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Vacancies Config Validate Find Query Error', ' VacanciesConfig.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred!."});
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


   // Vacancies Config Create -----------------------------------------------
   exports.VacanciesConfig_Create = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Departments can not be empty" });
      } else if (!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "Designation can not be empty" });
      } else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
         res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
      }else {

         ReceivingData.Institution = mongoose.Types.ObjectId(ReceivingData.Institution);
         ReceivingData.Department = mongoose.Types.ObjectId(ReceivingData.Department);
         ReceivingData.Designation = mongoose.Types.ObjectId(ReceivingData.Designation);

         var Create_VacanciesConfig = new VacanciesConfigModel.VacanciesConfigSchema({
            Institution: ReceivingData.Institution,
            Department: ReceivingData.Department,
            Designation: ReceivingData.Designation,
            JobDescription: ReceivingData.JobDescription,
            JobResponsibility: ReceivingData.JobResponsibility,
            Created_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Created_By),
            Active_Status: true,
            If_Deleted: false
         });
         Create_VacanciesConfig.save(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Creation Query Error', 'VacanciesConfig.controller.js', err);
               res.status(417).send({Status: false, Message: "Some error occurred while creating the Vacancies Config!."});
            } else {
               VacanciesConfigModel.VacanciesConfigSchema
                  .findOne({'_id': result._id})
                  .populate({ path: 'Institution', select: 'Institution' })
                  .populate({ path: 'Department', select: 'Department' })
                  .populate({ path: 'Designation', select: 'Designation' })
                  .populate({ path: 'Created_By', select: 'Name' })
                  .populate({ path: 'Last_Modified_By', select: 'Name' })
                  .exec(function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Find Query Error', 'VacanciesConfig.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find The Vacancies Config!."});
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


   // Vacancies Config List -----------------------------------------------
   exports.VacanciesConfig_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         var FindQuery = {'If_Deleted': false };
         if (ReceivingData.Query['Institution']) {
            FindQuery['Institution'] = mongoose.Types.ObjectId(ReceivingData.Query['Institution']);
         }
         if (ReceivingData.Query['Department']) {
            FindQuery['Department'] = mongoose.Types.ObjectId(ReceivingData.Query['Department']);
         }
         VacanciesConfigModel.VacanciesConfigSchema
            .find(FindQuery, {}, {sort: { updatedAt: -1 }})
            .populate({ path: 'Institution', select: 'Institution' })
            .populate({ path: 'Department', select: 'Department' })
            .populate({ path: 'Designation', select: 'Designation' })
            .populate({ path: 'Created_By', select: 'Name' })
            .populate({ path: 'Last_Modified_By', select: 'Name' })
            .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Find Query Error', 'VacanciesConfig.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Vacancies Config!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };


   // Vacancies Config Update -----------------------------------------------
   exports.VacanciesConfig_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.VacanciesConfig_Id || ReceivingData.VacanciesConfig_Id === '' ) {
         res.status(400).send({Status: false, Message: "Vacancies Config Details can not be empty" });
      } else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution can not be empty" });
      } else if (!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Departments can not be empty" });
      } else if (!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "Designation can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      } else {
         VacanciesConfigModel.VacanciesConfigSchema
         .update( {'_id': mongoose.Types.ObjectId(ReceivingData.VacanciesConfig_Id)},
                  { $set: { If_Deleted: true, Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Modified_By) } })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config FindOne Query Error', 'VacanciesConfig.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Vacancies Config!."});
            } else {
               if (result !== null) {

                  ReceivingData.Institution = mongoose.Types.ObjectId(ReceivingData.Institution);
                  ReceivingData.Department = mongoose.Types.ObjectId(ReceivingData.Department);
                  ReceivingData.Designation = mongoose.Types.ObjectId(ReceivingData.Designation);

                  var Create_VacanciesConfig = new VacanciesConfigModel.VacanciesConfigSchema({
                     Institution: ReceivingData.Institution,
                     Department: ReceivingData.Department,
                     Designation: ReceivingData.Designation,
                     JobDescription: ReceivingData.JobDescription,
                     JobResponsibility: ReceivingData.JobResponsibility,
                     Created_By: mongoose.Types.ObjectId(ReceivingData.Modified_By),
                     Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Modified_By),
                     Active_Status: true,
                     If_Deleted: false
                  });
                  Create_VacanciesConfig.save(function(err_1, result_1) {
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Creation Query Error', 'VacanciesConfig.controller.js', err_1);
                        res.status(417).send({Status: false, Message: "Some error occurred while creating the Vacancies Config!."});
                     } else {
                        VacanciesConfigModel.VacanciesConfigSchema
                           .findOne({'_id': result_1._id})
                           .populate({ path: 'Institution', select: 'Institution' })
                           .populate({ path: 'Department', select: 'Department' })
                           .populate({ path: 'Designation', select: 'Designation' })
                           .populate({ path: 'Created_By', select: 'Name' })
                           .populate({ path: 'Last_Modified_By', select: 'Name' })
                           .exec(function(err_2, result_2) {
                           if(err_2) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Find Query Error', 'VacanciesConfig.controller.js', err_2);
                              res.status(417).send({status: false, Message: "Some error occurred while Find The Vacancies Config!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "Vacancies Config can not be valid!" });
               }
            }
         });
      }
   };


   // Vacancies Config Hide -----------------------------------------------
   exports.VacanciesConfig_Hide = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.VacanciesConfig_Id || ReceivingData.VacanciesConfig_Id === '' ) {
         res.status(400).send({Status: false, Message: "Exam Config Details can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      } else {
         VacanciesConfigModel.VacanciesConfigSchema
         .update( {'_id': mongoose.Types.ObjectId(ReceivingData.VacanciesConfig_Id)},
                  { $set: { Active_Status: false, Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Modified_By) } })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Update Query Error', 'VacanciesConfig.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Update The Vacancies Config!."});
            } else {
               if (result !== null) {
                  res.status(200).send({Status: true, Message: 'Vacancies Config Hide Success!' });
               } else {
                  res.status(400).send({Status: false, Message: "Vacancies Config can not be valid!" });
               }
            }
         });
      }
   };


   // Vacancies Config UnHide -----------------------------------------------
   exports.VacanciesConfig_UnHide = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.VacanciesConfig_Id || ReceivingData.VacanciesConfig_Id === '' ) {
         res.status(400).send({Status: false, Message: "Exam Config Details can not be empty" });
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      } else {
         VacanciesConfigModel.VacanciesConfigSchema
         .update( {'_id': mongoose.Types.ObjectId(ReceivingData.VacanciesConfig_Id)},
                  { $set: { Active_Status: true, Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.Modified_By) } })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Settings Vacancies Config Update Query Error', 'VacanciesConfig.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Update The Vacancies Config!."});
            } else {
               if (result !== null) {
                  res.status(200).send({Status: true, Message: 'Vacancies Config Un Hide Success!' });
               } else {
                  res.status(400).send({Status: false, Message: "Vacancies Config can not be valid!" });
               }
            }
         });
      }
   };