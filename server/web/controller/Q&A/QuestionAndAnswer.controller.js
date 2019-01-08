var QA_Model = require('./../../models/Q&A/QuestionAndAnswer.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var CryptoJS = require("crypto-js");
var multer = require('multer');


var Questions_Image_Storage = multer.diskStorage({
   destination: (req, file, cb) => { cb(null, './Uploads/Questions'); },
   filename: (req, file, cb) => { cb(null, 'Qus_' + Date.now() + '.png'); }
});
var Questions_Create_Image_Upload = multer({
   storage: Questions_Image_Storage,
   fileFilter: function (req, file, callback) {
       let extArray = file.originalname.split(".");
       let extension = (extArray[extArray.length - 1]).toLowerCase();
       if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
           return callback("Only 'png, gif, jpg and jpeg' images are allowed");
       }
       callback(null, true);
   }
}).single('image');


exports.Questions_Create = function(req, res) {
   Questions_Create_Image_Upload(req, res, function(upload_err) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      var _Image = {};
      if(req.file !== null && req.file !== undefined && req.file !== ''){
         _Image = { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
      }

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
         res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
      } else if(!ReceivingData.Department || ReceivingData.Department === '' ) {
         res.status(400).send({Status: false, Message: "Department Details can not be empty" });
      } else if(!ReceivingData.Category || ReceivingData.Category === '' ) {
         res.status(400).send({Status: false, Message: "Category Details can not be empty" });
      } else if(!ReceivingData.Type || ReceivingData.Type === '' ) {
         res.status(400).send({Status: false, Message: "Question Details can not be Valid" });
      } else if( ( !ReceivingData.Question || ReceivingData.Question === '' ) && ReceivingData.Type === 'Question' ) {
         res.status(400).send({Status: false, Message: "Question can not be empty" });
      } else if( ( !ReceivingData.Option_A || ReceivingData.Option_A === '' ) && ReceivingData.Type === 'Question' ) {
         res.status(400).send({Status: false, Message: "Option A can not be empty" });
      } else if( ( !ReceivingData.Option_B || ReceivingData.Option_B === '' ) && ReceivingData.Type === 'Question' ) {
         res.status(400).send({Status: false, Message: "Option B not be empty" });
      } else if( ( !ReceivingData.Option_C || ReceivingData.Option_C === '' ) && ReceivingData.Type === 'Question') {
         res.status(400).send({Status: false, Message: "Option C can not be empty" });
      } else if( ( !ReceivingData.Option_D || ReceivingData.Option_D === '' ) && ReceivingData.Type === 'Question' ) {
         res.status(400).send({Status: false, Message: "Option D can not be empty" });
      } else if( ( !ReceivingData.Option_E || ReceivingData.Option_E === '' ) && ReceivingData.Type === 'Question' ) {
         res.status(400).send({Status: false, Message: "Option E can not be empty" });
      } else if( ( !ReceivingData.Option_F || ReceivingData.Option_F === '' ) && ReceivingData.Type === 'Question' ) {
         res.status(400).send({Status: false, Message: "Option F can not be empty" });
      } else if(!ReceivingData.Answer || ReceivingData.Answer === '' ) {
         res.status(400).send({Status: false, Message: "Answer can not be empty" });
      } else if(ReceivingData.Type === 'Image' && (req.file === null || req.file === undefined || req.file === '' || Object.keys(_Image).length < 3) ) {
         res.status(400).send({Status: false, Message: "Question Image can not be empty" });
      } else {

         var VarQuestionSchema = new QA_Model.QuestionSchema({
            Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
            Department: mongoose.Types.ObjectId(ReceivingData.Department),
            Category: mongoose.Types.ObjectId(ReceivingData.Category),
            Question: ReceivingData.Question || '',
            Option_A: ReceivingData.Option_A || '',
            Option_B: ReceivingData.Option_B || '',
            Option_C: ReceivingData.Option_C || '',
            Option_D: ReceivingData.Option_D || '',
            Option_E: ReceivingData.Option_E || '',
            Option_F: ReceivingData.Option_F || '',
            Answer:  ReceivingData.Answer,
            Type: ReceivingData.Type,
            Image: _Image,
            User_Id: mongoose.Types.ObjectId(ReceivingData.User_Id),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.User_Id),
            Status:  'Active',
            If_Deleted: false
         });
         VarQuestionSchema.save(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer Creation Query Error', 'QuestionAndAnswer.controller.js', err);
               res.status(400).send({Status: false, Message: "Some error occurred while creating the Question Answer!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   });
};



exports.Questions_Import_Append = function(req, res) {

   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else if(!ReceivingData.Department || ReceivingData.Department === '' ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else if(!ReceivingData.Category || ReceivingData.Category === '' ) {
      res.status(400).send({Status: false, Message: "Category Details can not be empty" });
   } else if(!ReceivingData.Questions || typeof JSON.parse(ReceivingData.Questions) !== 'object' || JSON.parse(ReceivingData.Questions).length <= 0 ) {
      res.status(400).send({Status: false, Message: "Questions can not be empty" });
   } else {
      ReceivingData.Questions = JSON.parse(ReceivingData.Questions);
      ReceivingData.Questions = ReceivingData.Questions.map(Obj => {
         const NewObj = {
            Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
            Department: mongoose.Types.ObjectId(ReceivingData.Department),
            Category: mongoose.Types.ObjectId(ReceivingData.Category),
            Question: Obj.Question,
            Option_A: Obj.Option_A,
            Option_B: Obj.Option_B,
            Option_C: Obj.Option_C,
            Option_D: Obj.Option_D,
            Option_E: Obj.Option_E,
            Option_F: Obj.Option_F,
            Answer:  Obj.Ans,
            Type: 'Question',
            Image: {},
            User_Id: mongoose.Types.ObjectId(ReceivingData.User_Id),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.User_Id),
            Status:  'Active',
            If_Deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
         };
         return NewObj;
      });
      QA_Model.QuestionSchema.collection.insertMany(ReceivingData.Questions, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer Creation Query Error', 'QuestionAndAnswer.controller.js', err);
            res.status(400).send({Status: false, Message: "Some error occurred while creating the Question Answer!."});
         } else {
            res.status(200).send({Status: true, Message: 'Successfully Added' });
         }
      });
   }
};



exports.Questions_Import_Replace = function(req, res) {

   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if(!ReceivingData.Institution || ReceivingData.Institution === '' ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   } else if(!ReceivingData.Department || ReceivingData.Department === '' ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   } else if(!ReceivingData.Category || ReceivingData.Category === '' ) {
      res.status(400).send({Status: false, Message: "Category Details can not be empty" });
   } else if(!ReceivingData.Questions || typeof JSON.parse(ReceivingData.Questions) !== 'object' || JSON.parse(ReceivingData.Questions).length <= 0 ) {
      res.status(400).send({Status: false, Message: "Questions can not be empty" });
   } else {
      QA_Model.QuestionSchema.updateMany( 
         { Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
            Department: mongoose.Types.ObjectId(ReceivingData.Department),
            Category: mongoose.Types.ObjectId(ReceivingData.Category) },
         { $set: { If_Deleted: true } }
      ).exec( function(error, result) {
         ReceivingData.Questions = JSON.parse(ReceivingData.Questions);
         ReceivingData.Questions = ReceivingData.Questions.map(Obj => {
            const NewObj = {
               Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
               Department: mongoose.Types.ObjectId(ReceivingData.Department),
               Category: mongoose.Types.ObjectId(ReceivingData.Category),
               Question: Obj.Question,
               Option_A: Obj.Option_A,
               Option_B: Obj.Option_B,
               Option_C: Obj.Option_C,
               Option_D: Obj.Option_D,
               Option_E: Obj.Option_E,
               Option_F: Obj.Option_F,
               Answer:  Obj.Ans,
               Type: 'Question',
               Image: {},
               User_Id: mongoose.Types.ObjectId(ReceivingData.User_Id),
               Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.User_Id),
               Status:  'Active',
               If_Deleted: false,
               createdAt: new Date(),
               updatedAt: new Date()
            };
            return NewObj;
         });
         QA_Model.QuestionSchema.collection.insertMany(ReceivingData.Questions, function(error_1, result_1) {
            if(error_1) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer Creation Query Error', 'QuestionAndAnswer.controller.js', error_1);
               res.status(400).send({Status: false, Message: "Some error occurred while creating the Question Answer!."});
            } else {
               res.status(200).send({Status: true, Message: 'Successfully Replaced' });
            }
         });
      });
   }
};


exports.Questions_List = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else {
      var FindQuery = {'If_Deleted': false };
      if (ReceivingData.Query['Institution']) {
         FindQuery['Institution'] = mongoose.Types.ObjectId(ReceivingData.Query['Institution']);
      }
      if (ReceivingData.Query['Department']) {
         FindQuery['Department'] = mongoose.Types.ObjectId(ReceivingData.Query['Department']);
      }
      QA_Model.QuestionSchema.find(FindQuery, {}, {})
      .populate({path: 'Department', select: ['Department'] })
      .populate({path: 'Category', select: ['Category'] })
      .populate({path: 'Institution', select: ['Institution'] })
      .exec( function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer List Find Query Error', 'QuestionAndAnswer.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Question Answer List!."});
         } else {
            var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
            ReturnData = ReturnData.toString();
            res.status(200).send({Status: true, Response: ReturnData });
         }
      });
   }
};


exports.Question_Delete = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Question_Id || ReceivingData.Question_Id === '' ) {
      res.status(400).send({Status: false, Message: "Question Id can not be empty" });
   } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
      res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
   }else {
      QA_Model.QuestionSchema.findOne({'_id': ReceivingData.Question_Id}, {}, {}, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer FindOne Query Error', 'QuestionAndAnswer.controller.js', err);
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Question Answer!."});
         } else {
            if (result !== null) {
               result.If_Deleted = true;
               result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
               result.save(function(err_1, result_1) { // Department Delete Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Question Answer Delete Query Error', 'QuestionAndAnswer.controller.js');
                     res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Delete the Question Answer!."});
                  } else {
                     res.status(200).send({Status: true, Message: 'Successfully Deleted' });
                  }
               });
            } else {
               res.status(400).send({Status: false, Message: "Question Id can not be valid!" });
            }
         }
      });
   }
};