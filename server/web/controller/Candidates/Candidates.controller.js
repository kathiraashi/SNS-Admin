var CandidateModel = require('./../../models/Candidates/Candidates.model.js');
var QA_Model = require('./../../models/Q&A/QuestionAndAnswer.model.js');
var ExamConfigModel = require('./../../models/Settings/ExamConfig.model');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var CryptoJS = require("crypto-js");


var api_key = 'key-1018902c1f72fc21e3dc109706b593e3';
var domain = 'www.inscube.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


function TemplateOne(User, Applied, Department, Ref_Id) {
   var Img = 'http://www.snsct.org/sites/snsct.org/themes/Montreal/img/sns_group_logo.png';
   return '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"> <table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"> <tbody> <tr> <td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:600px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"> <div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:10px;text-align:left" align="left"> <table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"> <tbody> <tr> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"> <table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"> <tbody> <tr style="font-family: sans-serif; line-height:20px"> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"> <img src="'+ Img +'" style="width:40%; margin-left:30%" alt="SNS Logo"> <p style="font-size:18px;font-weight:700;color:#717171;font-family: inherit;"> Dear <b> <i style="color: #f4962f; text-decoration: underline;"> ' + User + ' </i> </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> Greetings from SNS Group of Institutions! </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> This is in response to your application for vacancy position at  <b> SNS Institutions  </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">   Your online application for the post of <b> <i style="color: #f4962f; text-decoration: underline;"> ' +  Applied + ' </i> </b> in the department of <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Department + ' </i> </b> is <b> Verify and Accepted.  </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">   Your Reference Id : <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Ref_Id + ' </i> </b>  </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> You will be informed the status of your application after the scrutiny process. </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> Thanks for your interest in SNS Institutions. </b> </p> <br> <br> <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0;color: #717171;font-family: inherit;text-align: right;">With Regards, <br> <b> HR Team </b> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> </div>';
}

function TemplateTwo(Candidate, Applied, Department, Ref_Id, Link_Id, OTP) {

   var Img = 'http://www.snsct.org/sites/snsct.org/themes/Montreal/img/sns_group_logo.png';
   var Link = 'http://localhost:5000/Online_Exam/' + Link_Id;

   return '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"> <table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"> <tbody> <tr> <td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:600px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"> <div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:10px;text-align:left" align="left"> <table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"> <tbody> <tr> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"> <table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"> <tbody> <tr style="font-family: sans-serif; line-height:20px"> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"> <img src="' + Img + '" style="width:40%; margin-left:30%" alt="SNS Logo"> <p style="font-size:18px;font-weight:700;color:#717171;font-family: inherit;"> Dear <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Candidate + ' </i> </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> Greetings from SNS Group of Institutions! </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> This is in response to your application for vacancy position at  <b> SNS Institutions  </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">   Your online application for the post of <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Applied + ' </i> </b> in the department of <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Department + ' </i> </b> is scrutinized and you are advised to take up the Online test in the link provided below.  </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> Link : <b> <a href=" '+ Link + ' " target="blank" style="color: #f4962f; text-decoration: underline;"> ' + Link + ' </a> </b>  </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> Your Reference Id : <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Ref_Id + ' </i> </b>  </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> One Time Password : <b> <i style="color: #f4962f; text-decoration: underline;"> ' + OTP + ' </i> </b>  </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> You will be notified the status of your application after publication of Online test results. </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;">  <b> Thanks for your interest in SNS Institutions. </b> </p> <br> <br> <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0;color: #717171;font-family: inherit;text-align: right;">With Regards, <br> <b> HR Team </b> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> </div>';
   
}

function TemplateThree(Candidate, _Date, Place) {
   _Date = new Date(_Date);
   _Date = _Date.getDate() +'-'+ _Date.getMonth() +'-'+ _Date.getFullYear();
   var Img = 'http://www.snsct.org/sites/snsct.org/themes/Montreal/img/sns_group_logo.png';
   return '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"> <table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"> <tbody> <tr><td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:600px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"> <div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:10px;text-align:left" align="left"> <table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"> <tbody> <tr> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"> <table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"> <tbody><tr style="font-family: sans-serif; line-height:20px"> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"> <img src="' + Img + '" style="width:40%; margin-left:30%" alt="SNS Logo"> <p style="font-size:18px;font-weight:700;color:#717171;font-family: inherit;"> Dear <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Candidate + ' </i> </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> Greetings from SNS Group of Institutions! </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> We are pleased to inform you that you have been shortlisted for next round. You are requested to appear for an Interview on  <b> Date <i style="color: #f4962f; text-decoration: underline;"> ' + _Date + ' </i> </b> at <b> Place <i style="color: #f4962f; text-decoration: underline;"> ' + Place + ' </i> Coimbatore at 09.00 am. </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> Kindly confirm your presence through a mail on or before date ' + _Date + ' </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> You are also instructed to bring a passport size photo - 1, original credentials and copies of the same. Since the interview process may take a full day, kindly plan accordingly. </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> Interview process may consist of the following rounds. </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> 1. Group Discussion </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> 2. Demo class </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> 3. HR/Personal Interview </p> <p style="font-size:14px;color:#717171;font-family: inherit;" > Wish you all the very best.</p> <br> <br> <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0;color: #717171;font-family: inherit;text-align: right;">With Regards, <br> <b> HR Team </b> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> </div>';
}

function TemplateFour(Candidate, Applied, Department, _Date) {
   _Date = new Date(_Date);
   _Date = _Date.getDate() +'-'+ _Date.getMonth() +'-'+ _Date.getFullYear();
   var Img = 'http://www.snsct.org/sites/snsct.org/themes/Montreal/img/sns_group_logo.png';
   return '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"> <table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"> <tbody> <tr><td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:600px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"> <div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:10px;text-align:left" align="left"> <table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"> <tbody> <tr> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"> <table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"> <tbody><tr style="font-family: sans-serif; line-height:20px"> <td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"> <img src="' + Img + '" style="width:40%; margin-left:30%" alt="SNS Logo"> <p style="font-size:18px;font-weight:700;color:#717171;font-family: inherit;"> Dear <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Candidate + ' </i> </b> </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> Greetings from SNS Group of Institutions! </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> <b> Congratulations!!!! </b></p> <p style="font-size:14px;color:#717171;font-family: inherit;"> This is to inform you that you have been provisionally selected for the post of <b> <i style="color: #f4962f; text-decoration: underline;"> ' + Applied + ' </i> </b> in the department of<b>  <i style="color: #f4962f; text-decoration: underline;"> ' + Department + ' </i>  </b> at our Institution. </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> You are hereby requested to confirm the same through mail to us within three days from the receipt of this mail failing to which your appointment will be considered null and void. Also You are requested to submit your original certificates on or before date <b> <i style="color: #f4962f; text-decoration: underline;"> ' + _Date + ' </i> </b> for processing the order </p>  <br> <br> <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0;color: #717171;font-family: inherit;text-align: right;">With Regards, <br> <b> HR Team </b> </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </td> </tr> </tbody> </table> </div>';
}


exports.CandidatesList = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.find({ Status: 'Active' }, {Activity_Info: 0, Education_Info: 0, Files: 0, Reference_Info: 0}, {})
      .populate({path: "Basic_Info.Department", select:["Department", 'Department_Code']})
      .populate({path: "Basic_Info.Institution", select:["Institution", "Institution_Code"]})
      .exec(function(err, result) {
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
      CandidateModel.CandidatesSchema
      .findOne({_id: ReceivingData.Candidate_Id, Status: 'Active' }, {}, {})
      .populate({path: "Basic_Info.Department", select:["Department", 'Department_Code']})
      .populate({path: "Basic_Info.Institution", select:["Institution", "Institution_Code"]})
      .exec(function(err, result) {
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

exports.Accept_Candidate = function(req, res) {

   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.findOne({'_id': ReceivingData.Candidate_Id}, {}, {}, function(err, result) { // Candidate FindOne Query
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate FindOne Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Candidate!."});
         } else {
            if (result !== null) {
               result.Current_Status = 'Accepted';
               result.Current_Stage = 'Stage_2';
               result.Accepted_Date = new Date();
               result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.User_Id);
               result.save(function(err_1, result_1) { // Candidate Update Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Update Query Error', 'Candidate.controller.js');
                     res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Candidate!."});
                  } else {
                     CandidateModel.CandidatesSchema
                     .findOne({_id: ReceivingData.Candidate_Id, Status: 'Active' }, {Basic_Info: 1, }, {})
                     .populate({path: "Basic_Info.Department", select:"Department"})
                     .exec(function(err_2, result_2) {
                        if(err_2) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Data Find Query Error', 'Candidates.controller.js', err_2);
                           res.status(417).send({status: false, Message: "Some error occurred while Find Candidate Data!."});
                        } else {
                           var SendData = {
                              from: 'SNS Institutions <sns.info@gmail.com>',
                              to: result.Personal_Info.Email,
                              subject: 'Your Online Application Accepted Confirmation – reg;',
                              html: TemplateOne(result.Personal_Info.Name, result.Basic_Info.Post_Applied, result_2.Basic_Info.Department.Department, result.Ref_ID )
                           };
                           mailgun.messages().send(SendData, function (error, body) {
                              if (error) {
                                    res.status(417).send({ Status: false, Error:error, Message: "Some error occurred while send The E-mail " });
                              } else {
                                 res.status(200).send({Status: true, Message: 'Candidate Successfully Move To Next Stage' });
                              }
                           });
                        }
                     });
                  }
               });
            } else {
               res.status(400).send({Status: false, Message: "Candidate Details can not be valid!" });
            }
         }
      });
   }
};

exports.QuestionAvailable_Check = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   }else {
      CandidateModel.CandidatesSchema
      .findOne({ _id: ReceivingData.Candidate_Id }, {'Basic_Info.Department': 1, 'Basic_Info.Institution': 1}, {})
      .exec(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Data Find Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Message: "Some error occurred while Find Candidate Data!."});
         } else {
            if (result !== null) {
               ExamConfigModel.ExamConfigSchema.findOne({ 'Institution': mongoose.Types.ObjectId(result.Basic_Info.Institution), 'Department': mongoose.Types.ObjectId(result.Basic_Info.Department), 'If_Deleted': false }, {}, {}, function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'ExamConfig Find One Query Error', ' Candidates.controller.js', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find ExamConfig Details!."});
                  } else {
                     if ( result_1 !== null) {
                        Promise.all(
                           result_1.Config.map(obj => {
                              return QA_Model.QuestionSchema.count({ Institution: mongoose.Types.ObjectId(result_1.Institution),
                                                               Department: mongoose.Types.ObjectId(result_1.Department),
                                                               Category: mongoose.Types.ObjectId(obj.Category),
                                                               If_Deleted: false
                                                            }).then(res_3 => {
                                                               return { Institution: result_1.Institution,
                                                                        Department: result_1.Department,
                                                                        Category: obj.Category,
                                                                        NoOfQuestion: obj.NoOfQuestion,
                                                                        AvailableQuestion: res_3 };
                                                            });
                           })
                        ).then(response => {
                           var Available = true;
                           var TotalQuestion = 0;
                           response.map(obj => {
                              if (obj.NoOfQuestion > obj.AvailableQuestion) {
                                 Available = false;
                              } else{
                                 TotalQuestion = TotalQuestion + obj.NoOfQuestion;
                              }
                           });
                           if (Available) {
                              var RetData = { ExamConfig: result_1._id, ExamDuration:result_1.ExamDuration, TotalQuestion: TotalQuestion, Config_Info: response};
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(RetData), 'SecretKeyOut@123');
                              ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Available: true, Response: ReturnData });
                           } else{
                              res.status(200).send({Status: true, Available: false });
                           }
                        }).catch(catch_err => {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'ExamConfig Category Details Find One Query Error', ' Candidates.controller.js', catch_err);
                           res.status(417).send({status: false, Message: "Some error occurred while Find ExamConfig Category Details!."});
                        });
                     } else {
                        res.status(200).send({Status: false, Message: "Not Assignable" });
                     }
                  }
               });
            } else {
               res.status(400).send({Status: false, Message: "Candidate Details not valid" });
            }
         }
      });
   }
};

exports.AssignExam = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
   

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   }else if(!ReceivingData.Ref_ID || ReceivingData.Ref_ID === '' ) {
      res.status(400).send({Status: false, Message: "Reference Details can not be empty" });
   }else if(!ReceivingData.ExamConfig_Id || ReceivingData.ExamConfig_Id === '' ) {
      res.status(400).send({Status: false, Message: "ExamConfig Details can not be empty" });
   }else if(!ReceivingData.Institution_Id || ReceivingData.Institution_Id === '' ) {
      res.status(400).send({Status: false, Message: "Institution Details can not be empty" });
   }else if(!ReceivingData.Department_Id || ReceivingData.Department_Id === '' ) {
      res.status(400).send({Status: false, Message: "Department Details can not be empty" });
   }else if(!ReceivingData.Config || typeof ReceivingData.Config !== 'object' || ReceivingData.Config.length < 1 ) {
      res.status(400).send({Status: false, Message: "Config Details can not be empty" });
   }else {
      
     Promise.all(
         ReceivingData.Config.map(Obj => {
            return QA_Model.QuestionSchema.find({ Institution: mongoose.Types.ObjectId(Obj.Institution),
               Department: mongoose.Types.ObjectId(Obj.Department),
               Category: mongoose.Types.ObjectId(Obj.Category),
               If_Deleted: false}, {User_Id: 0, Last_Modified_By: 0, createdAt: 0, updatedAt:0, Institution: 0, Department: 0, If_Deleted: 0, Status: 0}
               ).then(output => { return {Questions: output ,NoOfQuestion: Obj.NoOfQuestion}; });
         })
     ).then(response => {
        var Questions = [];
        response.map(Obj => {
            Obj.Questions = Obj.Questions.map((a) => ({sort: Math.random() + Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value);
            const Qus = Obj.Questions.splice(0, parseInt(Obj.NoOfQuestion));
            Qus.map(obj => {
               var newObj = { Question_Id: mongoose.Types.ObjectId(obj._id),
                              Category: mongoose.Types.ObjectId(obj.Category),
                              Question: obj.Question,
                              Option_A: obj.Option_A,
                              Option_B: obj.Option_B,
                              Option_C: obj.Option_C,
                              Option_D: obj.Option_D,
                              Option_E: obj.Option_E,
                              Option_F: obj.Option_F,
                              Type: obj.Type,
                              Image: obj.Image,
                              Answer: obj.Answer,
                              CandidateAnswer: '',
                              Status: 'UnTouched',
                              DateTime: null };
               Questions.push(newObj);
            });
        });
        var VarOnline_Exam = new CandidateModel.OnlineExamSchema({
            Candidate: mongoose.Types.ObjectId(ReceivingData.Candidate_Id),
            Ref_ID: ReceivingData.Ref_ID,
            Institution: mongoose.Types.ObjectId(ReceivingData.Institution_Id),
            Department: mongoose.Types.ObjectId(ReceivingData.Department_Id),
            ExamConfig: mongoose.Types.ObjectId(ReceivingData.ExamConfig_Id),
            ExamDuration: ReceivingData.ExamDuration,
            TotalQuestions: Questions.length,
            AnsweredQuestions: 0,
            CorrectAnsweredQuestions: 0,
            Questions: Questions,
            OTP: Math.floor(10000000 + Math.random() * 90000000),
            UpToValid: new Date(new Date().setDate(new Date().getDate() + 4 )),
            SubmittedDate: null,
            Status: 'Active',
            ExamStatus: '',
            If_Attended: false,
            If_Completed: false,
            If_Deleted: false,
            User_Id: mongoose.Types.ObjectId(ReceivingData.User_Id),
            Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.User_Id),
        });
         VarOnline_Exam.save(function(err_1, result_1) { // Candidate Update Query
            if(err_1) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Update Query Error', 'Candidate.controller.js');
               res.status(417).send({Status: false, Message: "Some error occurred while Update the Candidate!."});
            } else {
               CandidateModel.CandidatesSchema.update({'_id': result_1.Candidate}, { $set: { Current_Status: 'Exam Assigned', Current_Stage: 'Stage_3',  Last_Modified_By: mongoose.Types.ObjectId(ReceivingData.User_Id) } },  function(err_2, result_2) {
                  if(err_2) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Stage Update Query Error', 'Candidate.controller.js', err_2);
                     res.status(200).send({Status: true, Message: "Online Exam Successfully Assigned! But Not Updated" });
                  } else {

                     CandidateModel.CandidatesSchema
                     .findOne({_id: result_1.Candidate }, {}, {})
                     .populate({path: "Basic_Info.Department", select:"Department"})
                     .exec(function(err_3, result_3) {
                        if(err_3) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Details Find Query Error', 'Candidate.controller.js', err_3);
                           res.status(200).send({Status: true, Message: "Online Exam Successfully Assigned! But Not Mail Sent" });
                        } else {
                           var SendData = {
                              from: 'SNS Institutions <sns.info@gmail.com>',
                              to: result_3.Personal_Info.Email,
                              subject: 'Call for Online Test – reg;',
                              html: TemplateTwo(result_3.Personal_Info.Name, result_3.Basic_Info.Post_Applied, result_3.Basic_Info.Department.Department, result_3.Ref_ID, result_1._id, result_1.OTP)
                           };
                           mailgun.messages().send(SendData, function (error, body) {
                              if (error) {
                                 res.status(417).send({ Status: false, Error:error, Message: "Online Exam Successfully Assigned But Not E-mail Sent " });
                              } else {
                                 res.status(200).send({Status: true, Message: "Online Exam Successfully Assigned!" });
                              }
                           });
                        }
                     });
                  }

               });
            }
         });
     }).catch(catch_err => {
         ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Online Exam Assign Query Error', 'Candidate.controller.js', catch_err);
         res.status(417).send({Status: false, Message: "Some error occurred while Assign Online Exam!."});
     });
   }
};

exports.Candidate_ExamView = function(req, res) {
   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   }else {
      CandidateModel.OnlineExamSchema
      .findOne({Candidate: ReceivingData.Candidate_Id, If_Deleted: false }, {}, {})
      .populate({path: "User_Id", select:["Name", "User_Type"]})
      .populate({path: "ExamResult_UpdateUser", select:["Name", "User_Type"]})
      .populate({path: "InterviewResult_UpdateUser", select:["Name", "User_Type"]})
      .exec(function(err, result) {
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


exports.ExamResult_Update = function(req, res) {

   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Exam_Id || ReceivingData.Exam_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Exam Details can not be empty" });
   } else if (!ReceivingData.ExamResult || ReceivingData.ExamResult === ''  ) {
      res.status(400).send({Status: false, Message: "Exam Result can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Candidate_Id)}, {}, {}, function(err, result) { // Candidate FindOne Query
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate FindOne Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Candidate!."});
         } else {
            if (result !== null) {
               if (ReceivingData.ExamResult === 'Pass') {
                  result.Current_Status = 'Interview Assigned';  
               } else {
                  result.Current_Status = 'Exam Failed';
               }
               result.Current_Stage = 'Stage_5';
               result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.User_Id);
               result.save(function(err_1, result_1) { // Candidate Update Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Update Query Error', 'Candidate.controller.js');
                     res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Candidate!."});
                  } else {
                     CandidateModel.OnlineExamSchema.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Exam_Id)}, {}, {}, function(err_3, result_3) { // Candidate FindOne Query
                        if(err_3) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Online Exam FindOne Query Error', 'Candidates.controller.js', err_3);
                           res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Online Exam!."});
                        } else {
                           if (result_3 !== null) {
                              if (ReceivingData.ExamResult === 'Pass') {
                                 result_3.InterviewDate = ReceivingData.InterviewDate;
                                 result_3.InterviewPlace = ReceivingData.Place;
                              }
                              result_3.ExamResult_UpdateUser = mongoose.Types.ObjectId(ReceivingData.User_Id); 
                              result_3.ExamResult = ReceivingData.ExamResult;
                              result_3.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.User_Id);
                              result_3.save(function(err_4, result_4) { 
                                 if(err_4) {
                                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Online Exam Update Query Error', 'Candidate.controller.js', err_4);
                                    res.status(417).send({Status: false, Message: "Some error occurred while Update the Online Exam!."});
                                 } else {
                                    CandidateModel.OnlineExamSchema
                                    .findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Exam_Id)}, {}, {})
                                    .populate({path: "User_Id", select:["Name", "User_Type"]})
                                    .populate({path: "ExamResult_UpdateUser", select:["Name", "User_Type"]})
                                    .exec(function(err_5, result_5) {
                                       if(err_5) {
                                          ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Data Find Query Error', 'Candidates.controller.js', err_5);
                                          res.status(417).send({status: false, Message: "Some error occurred while Find Candidate Data!."});
                                       } else {
                                          if (ReceivingData.ExamResult === 'Pass') {
                                             var SendData = {
                                                from: 'SNS Institutions <sns.info@gmail.com>',
                                                to: result.Personal_Info.Email,
                                                subject: 'Call for Group Discussion, Demo Class & Technical/HR Interview – reg;',
                                                html: TemplateThree(result.Personal_Info.Name, ReceivingData.InterviewDate, ReceivingData.Place )
                                             };
                                             mailgun.messages().send(SendData, function (error, body) {
                                                if (error) {
                                                   res.status(417).send({ Status: false, Error:error, Message: "Some error occurred while send The E-mail " });
                                                } else {
                                                   var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_5), 'SecretKeyOut@123');
                                                   ReturnData = ReturnData.toString();
                                                   res.status(200).send({Status: true, Response: ReturnData });
                                                }
                                             });
                                          } else {
                                             var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_5), 'SecretKeyOut@123');
                                             ReturnData = ReturnData.toString();
                                             res.status(200).send({Status: true, Response: ReturnData });
                                          }
                                       }
                                    });
                                 }
                              });
                           }
                        }
                     });
                  }
               });
            } else {
               res.status(400).send({Status: false, Message: "Candidate Details can not be valid!" });
            }
         }
      });
   }
};




exports.InterviewResult_Update = function(req, res) {

   var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   if(!ReceivingData.Candidate_Id || ReceivingData.Candidate_Id === '' ) {
      res.status(400).send({Status: false, Message: "Candidate Details can not be empty" });
   } else if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   } else if (!ReceivingData.Exam_Id || ReceivingData.Exam_Id === ''  ) {
      res.status(400).send({Status: false, Message: "Exam Details can not be empty" });
   } else if (!ReceivingData.InterviewResult || ReceivingData.InterviewResult === ''  ) {
      res.status(400).send({Status: false, Message: "Interview Result can not be empty" });
   }else {
      CandidateModel.CandidatesSchema.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Candidate_Id)}, {}, {})
      .populate({path: "Basic_Info.Department", select:"Department"}).exec( function(err, result) { // Candidate FindOne Query
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate FindOne Query Error', 'Candidates.controller.js', err);
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Candidate!."});
         } else {
            if (result !== null) {
               if (ReceivingData.InterviewResult === 'Pass') {
                  result.Current_Status = 'Selected ';  
               } else {
                  result.Current_Status = 'Interview Failed';
               }
               result.Current_Stage = 'Stage_6';
               result.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.User_Id);
               result.save(function(err_1, result_1) { // Candidate Update Query
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Update Query Error', 'Candidate.controller.js');
                     res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Candidate!."});
                  } else {
                     CandidateModel.OnlineExamSchema.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Exam_Id)}, {}, {}, function(err_3, result_3) { // Candidate FindOne Query
                        if(err_3) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Online Exam FindOne Query Error', 'Candidates.controller.js', err_3);
                           res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Online Exam!."});
                        } else {
                           if (result_3 !== null) {
                              if (ReceivingData.InterviewResult === 'Pass') {
                                 result_3.Joining_Date = ReceivingData.JoinDate;
                              }
                              result_3.InterviewResult_UpdateUser = mongoose.Types.ObjectId(ReceivingData.User_Id); 
                              result_3.InterviewResult = ReceivingData.InterviewResult;
                              result_3.Last_Modified_By = mongoose.Types.ObjectId(ReceivingData.User_Id);
                              result_3.save(function(err_4, result_4) { 
                                 if(err_4) {
                                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Online Exam Update Query Error', 'Candidate.controller.js', err_4);
                                    res.status(417).send({Status: false, Message: "Some error occurred while Update the Online Exam!."});
                                 } else {
                                    CandidateModel.OnlineExamSchema
                                    .findOne({'_id': mongoose.Types.ObjectId(ReceivingData.Exam_Id)}, {}, {})
                                    .populate({path: "User_Id", select:["Name", "User_Type"]})
                                    .populate({path: "ExamResult_UpdateUser", select:["Name", "User_Type"]})
                                    .populate({path: "InterviewResult_UpdateUser", select:["Name", "User_Type"]})
                                    .exec(function(err_5, result_5) {
                                       if(err_5) {
                                          ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Candidate Data Find Query Error', 'Candidates.controller.js', err_5);
                                          res.status(417).send({status: false, Message: "Some error occurred while Find Candidate Data!."});
                                       } else {
                                          if (ReceivingData.InterviewResult === 'Pass') {
                                             var SendData = {
                                                from: 'SNS Institutions <sns.info@gmail.com>',
                                                to: result.Personal_Info.Email,
                                                subject: 'Intimation of Interview results  – reg;',
                                                html: TemplateFour(result.Personal_Info.Name, result.Basic_Info.Post_Applied, result.Basic_Info.Department.Department, ReceivingData.JoinDate )
                                             };
                                             mailgun.messages().send(SendData, function (error, body) {
                                                if (error) {
                                                   res.status(417).send({ Status: false, Error:error, Message: "Some error occurred while send The E-mail " });
                                                } else {
                                                   var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_5), 'SecretKeyOut@123');
                                                   ReturnData = ReturnData.toString();
                                                   res.status(200).send({Status: true, Response: ReturnData });
                                                }
                                             });
                                          } else {
                                             var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_5), 'SecretKeyOut@123');
                                             ReturnData = ReturnData.toString();
                                             res.status(200).send({Status: true, Response: ReturnData });
                                          }
                                       }
                                    });
                                 }
                              });
                           }
                        }
                     });
                  }
               });
            } else {
               res.status(400).send({Status: false, Message: "Candidate Details can not be valid!" });
            }
         }
      });
   }
};