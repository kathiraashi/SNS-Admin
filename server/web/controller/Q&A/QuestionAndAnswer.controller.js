var QA_Model = require('./../../models/Q&A/QuestionAndAnswer.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var CryptoJS = require("crypto-js");





exports.Questions_Create = function(req, res) {

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
      var VarQuestionSchema = new QA_Model.QuestionSchema({
         Institution: mongoose.Types.ObjectId(ReceivingData.Institution),
         Department: mongoose.Types.ObjectId(ReceivingData.Department),
         Category: mongoose.Types.ObjectId(ReceivingData.Category),
         Question: ReceivingData.Question,
         Option_A: ReceivingData.Option_A,
         Option_B: ReceivingData.Option_B,
         Option_C: ReceivingData.Option_C,
         Option_D: ReceivingData.Option_D,
         Option_E: ReceivingData.Option_E,
         Option_F: ReceivingData.Option_F,
         Answer:  ReceivingData.Answer,
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
            res.status(200).send({Status: true, Message: ReturnData });
         }
      });
   }
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
      QA_Model.QuestionSchema.find({ If_Deleted: false }, {}, {})
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