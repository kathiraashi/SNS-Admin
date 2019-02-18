var CryptoJS = require("crypto-js");
var AdminModel = require('./../../models/Admin/AdminManagement.model.js');
var ErrorManagement = require('./../../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var crypto = require("crypto");



var api_key = 'key-1018902c1f72fc21e3dc109706b593e3';
var domain = 'www.inscube.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});



function TemplateOne(Name, User_Id, EmailToken) {
   var Img = 'http://www.snsct.org/sites/snsct.org/themes/Montreal/img/sns_group_logo.png';
   var link = 'http://careeradmin.snsclt.in/PasswordReset/' + User_Id + '/' + EmailToken;
   return '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"><table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"><tbody><tr><td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:500px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"><div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:500px;padding:10px;text-align:left" align="left"><table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"><tbody><tr><td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"><table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"><tbody><tr style="font-family: sans-serif; line-height:20px"><td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"> <img src="'+ Img +'" style="width:40%; margin-left:30%" alt="SNS Logo"><p style="font-size:18px;font-weight:700;color:#717171;font-family: inherit;"> Hi ' + Name +' </p> <p style="font-size:14px;color:#717171;font-family: inherit;"> To complete the email verification process, <br>Please click the link below then Reset Your Password  </p> <br><table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;margin-bottom:15px;width:auto" width="auto"> <tbody><tr><td style="background-color:#4e6a7a;box-shadow: 0 1px 8px 0 hsla(0,0%,40%,.47);" valign="top" bgcolor="#ffda00" align="center"><a href="'+ link +'" data-saferedirecturl="'+ link +'" style="background-color:#4e6a7a ;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize;cursor:pointer" bgcolor="#ffda00" target="_blank"> Verify Your E-mail</a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td></tr> </tbody></table></div></td></tr> </tbody></table></div>';
}


// -------------------------------------------------- User Name Validate -----------------------------------------------
   exports.User_Name_Validate = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
         res.status(400).send({Status: false, Message: "User Name can not be empty" });
      }else {
         AdminModel.User_Management.findOne({'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") } }, {}, {}, function(err, result) { // User Name Find Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Name Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Users Name!."});
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


// -------------------------------------------------- User Validate ---------------------------------------------------
   exports.User_Login_Validate = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
         res.status(400).send({Status: false, Message: "User_Name can not be empty" });
      } else if (!ReceivingData.User_Password || ReceivingData.User_Password === ''  ) {
         res.status(400).send({Status: false, Message: "User Password can not be empty" });
      } else {
         AdminModel.User_Management.findOne({'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") }, 'User_Password': ReceivingData.User_Password, 'Active_Status': true}, { User_Password: 0 }, {})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Department', select: 'Department' })
         .populate({ path: 'Designation', select: 'Designation' })
         .populate({ path: 'Created_By', select: 'Name' })
         .populate({ path: 'Last_ModifiedBy', select: 'Name' })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Details Validate Query Error', 'RegisterAndLogin.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Validate The User Details!."});
            } else {
               if(result === null){
                  AdminModel.User_Management.findOne({'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") }, 'User_Password': ReceivingData.User_Password}, function(err_1, result_1) {
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Validate Query Error', 'RegisterAndLogin.controller.js', err_1);
                        res.status(417).send({Status: false, Error:err_1, Message: "Some error occurred while Validate the User!"});           
                     } else {
                        if (result_1 === null) {
                           res.status(200).send({ Status: false, Message: "Invalid account details!" });
                        }else{
                           res.status(200).send({ Status: false, Message: "Your Account has been Blocked!" });
                        }
                     }
                  });
               }else{
                  const Key = crypto.randomBytes(16).toString("hex");
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), Key);
                  ReturnData = ReturnData.toString();
                  const NewReturnData = (ReturnData + Key).concat('==');
                  AdminModel.User_Management.update(
                     { _id : result._id },
                     { $set: { LoginToken : Key, LoginTime: new Date().toString(), LastActiveTime: new Date() }}
                  ).exec((err_3, result_3) => {
                     if(err_3) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Validate Update Query Error', 'RegisterAndLogin.controller.js', err_3);
                        res.status(417).send({Status: false, Message: "Some error occurred while Validate Update the User Details!"});           
                     } else {
                        res.status(200).send({ Status: true,  Response: NewReturnData });
                     }
                  });
               }
            }
         });
      }
   };


// -------------------------------------------------- User Create -----------------------------------------------
   exports.User_Create = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else if(!ReceivingData.Name || ReceivingData.Name === '' ) {
         res.status(400).send({Status: false, Message: "Name can not be empty" });
      } else if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
         res.status(400).send({Status: false, Message: "User Name can not be empty" });
      } else if(!ReceivingData.Email || ReceivingData.Email === '' ) {
         res.status(400).send({Status: false, Message: "Email can not be empty" });
      } else if(!ReceivingData.User_Password || ReceivingData.User_Password === '' ) {
         res.status(400).send({Status: false, Message: "User Password can not be empty" });
      } else if(!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "User Type can not be empty " });
      } else {
         if (ReceivingData.Institution && ReceivingData.Institution !== null && ReceivingData.Institution !== '') {
            ReceivingData.Institution = mongoose.Types.ObjectId(ReceivingData.Institution)
         } else {  
            ReceivingData.Institution = null;
         }
         if (ReceivingData.Department && ReceivingData.Department !== null && ReceivingData.Department !== '') {
            ReceivingData.Department = mongoose.Types.ObjectId(ReceivingData.Department)
         } else {
            ReceivingData.Department = null;
         }
         if (ReceivingData.Designation && ReceivingData.Designation !== null && ReceivingData.Designation !== '') {
            ReceivingData.Designation = mongoose.Types.ObjectId(ReceivingData.Designation)
         } else {
            ReceivingData.Designation = null;
         }
         var CreateUser_Management = new AdminModel.User_Management({
            User_Name : ReceivingData.User_Name,
            User_Password : ReceivingData.User_Password,
            Name : ReceivingData.Name,
            Phone : ReceivingData.Phone,
            Email : ReceivingData.Email,
            Designation: ReceivingData.Designation,
            ApplicationCreate_Permission: ReceivingData.ApplicationCreate_Permission,
            ApplicationManagement_Permission: ReceivingData.ApplicationManagement_Permission,
            Q_A_Permission: ReceivingData.Q_A_Permission,
            OnlineExamUpdate_Permission: ReceivingData.OnlineExamUpdate_Permission,
            GD_Permission: ReceivingData.GD_Permission,
            Technical_Permission: ReceivingData.Technical_Permission,
            Hr_Permission: ReceivingData.Hr_Permission,
            BasicConfig_Permission: ReceivingData.BasicConfig_Permission,
            AdvancedConfig_Permission: ReceivingData.AdvancedConfig_Permission,
            UserManagement_Permission: ReceivingData.UserManagement_Permission,
            Institution_Restricted: ReceivingData.Institution_Restricted,
            Department_Restricted: ReceivingData.Department_Restricted,
            Institution: ReceivingData.Institution,
            Department: ReceivingData.Department,
            Created_By : mongoose.Types.ObjectId(ReceivingData.User_Id),
            Last_ModifiedBy : mongoose.Types.ObjectId(ReceivingData.User_Id),
            Active_Status : ReceivingData.Active_Status || true,
         });
         
         CreateUser_Management.save(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Creation Query Error', 'AdminManagement.controller.js', err);
               res.status(400).send({Status: false, Message: "Some error occurred while creating the User!."});
            } else {
               AdminModel.User_Management.findOne({'_id': result._id}, {}, {})
               .populate({ path: 'Designation', select: 'Designation' })
               .populate({ path: 'Institution', select: 'Institution' })
               .populate({ path: 'Department', select: 'Department' })
               .populate({ path: 'Created_By', select: 'Name' })
               .populate({ path: 'Last_ModifiedBy', select: 'Name' })
               .exec(function(err, result) {
                  if(err) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User List Find Query Error', 'AdminManagement.controller.js', err);
                     res.status(417).send({status: false, Message: "Some error occurred while Find Users List!."});
                  } else {
                     var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                        ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: ReturnData });
                  }
               });
            }
         });
      }
   };


   // -------------------------------------------------- User Update -----------------------------------------------
   exports.User_Update = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else if(!ReceivingData.Name || ReceivingData.Name === '' ) {
         res.status(400).send({Status: false, Message: "Name can not be empty" });
      } else if(!ReceivingData.Email || ReceivingData.Email === '' ) {
         res.status(400).send({Status: false, Message: "Email can not be empty" });
      } else if(!ReceivingData.Designation || ReceivingData.Designation === '' ) {
         res.status(400).send({Status: false, Message: "User Type can not be empty " });
      } else if(!ReceivingData.Modified_By || ReceivingData.Modified_By === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         AdminModel.User_Management.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.User_Id)}, {}, {}, function(err, result) { // User FindOne Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The User!."});
            } else {
               if (result !== null) {

                  if (ReceivingData.Institution && ReceivingData.Institution !== null && ReceivingData.Institution !== '') {
                     ReceivingData.Institution = mongoose.Types.ObjectId(ReceivingData.Institution)
                  } else {  
                     ReceivingData.Institution = null;
                  }
                  if (ReceivingData.Department && ReceivingData.Department !== null && ReceivingData.Department !== '') {
                     ReceivingData.Department = mongoose.Types.ObjectId(ReceivingData.Department)
                  } else {
                     ReceivingData.Department = null;
                  }
                  if (ReceivingData.Designation && ReceivingData.Designation !== null && ReceivingData.Designation !== '') {
                     ReceivingData.Designation = mongoose.Types.ObjectId(ReceivingData.Designation)
                  } else {
                     ReceivingData.Designation = null;
                  }

                  result.Name = ReceivingData.Name,
                  result.Phone  = ReceivingData.Phone,
                  result.Email  = ReceivingData.Email,
                  result.Designation = ReceivingData.Designation,
                  result.ApplicationCreate_Permission = ReceivingData.ApplicationCreate_Permission,
                  result.ApplicationManagement_Permission = ReceivingData.ApplicationManagement_Permission,
                  result.Q_A_Permission = ReceivingData.Q_A_Permission,
                  result.OnlineExamUpdate_Permission = ReceivingData.OnlineExamUpdate_Permission,
                  result.GD_Permission = ReceivingData.GD_Permission,
                  result.Technical_Permission = ReceivingData.Technical_Permission,
                  result.Hr_Permission = ReceivingData.Hr_Permission,
                  result.BasicConfig_Permission = ReceivingData.BasicConfig_Permission,
                  result.AdvancedConfig_Permission = ReceivingData.AdvancedConfig_Permission,
                  result.UserManagement_Permission = ReceivingData.UserManagement_Permission,
                  result.Institution_Restricted = ReceivingData.Institution_Restricted,
                  result.Department_Restricted = ReceivingData.Department_Restricted,
                  result.Institution = ReceivingData.Institution,
                  result.Department = ReceivingData.Department,
                  result.Last_ModifiedBy = mongoose.Types.ObjectId(ReceivingData.Modified_By);
                  result.save(function(err_1, result_1) { // User Update Query
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Updating Query Error', 'AdminManagement.controller.js', err);
                        res.status(400).send({Status: false, Message: "Some error occurred while Updating the User!."});
                     } else {
                        AdminModel.User_Management.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.User_Id) }, {}, {})
                        .populate({ path: 'Designation', select: 'Designation' })
                        .populate({ path: 'Institution', select: 'Institution' })
                        .populate({ path: 'Department', select: 'Department' })
                        .populate({ path: 'Created_By', select: 'Name' })
                        .populate({ path: 'Last_ModifiedBy', select: 'Name' })
                        .exec(function(err, result) {
                           if(err) {
                              ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Find Query Error', 'AdminManagement.controller.js', err);
                              res.status(417).send({status: false, Message: "Some error occurred while Find Users Details!."});
                           } else {
                              var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                              ReturnData = ReturnData.toString();
                              res.status(200).send({Status: true, Response: ReturnData });
                           }
                        });
                     }
                  });
               } else {
                  res.status(400).send({Status: false, Message: "User Details can not be valid!" });
               }
            }
         });
      }
   };


   // -------------------------------------------------- User Deactivate -----------------------------------------------
   exports.User_Deactivate = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else if(!ReceivingData.Modified_By || ReceivingData.Modified_By === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         AdminModel.User_Management.update( {'_id': mongoose.Types.ObjectId(ReceivingData.User_Id)}, { $set: { Active_Status: false, Last_ModifiedBy: mongoose.Types.ObjectId(ReceivingData.Modified_By) } }, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Deactivate Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Deactivate User!."});
            } else {
               if ( result !== null) {
                  res.status(200).send({Status: true, Message: "User Successfully Blocked!" });
               } else {
                  res.status(400).send({Status: false, Message: "User Details can not be valid!" });
               }
            }
         });
      }
   };


   // -------------------------------------------------- User Activate -----------------------------------------------
   exports.User_Activate = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else if(!ReceivingData.Modified_By || ReceivingData.Modified_By === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      }else {
         AdminModel.User_Management.update( {'_id': mongoose.Types.ObjectId(ReceivingData.User_Id)}, { $set: { Active_Status: true, Last_ModifiedBy: mongoose.Types.ObjectId(ReceivingData.Modified_By) } }, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Activate Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Activate User!."});
            } else {
               if ( result !== null) {
                  res.status(200).send({Status: true, Message: "User Successfully Activate!" });
               } else {
                  res.status(400).send({Status: false, Message: "User Details can not be valid!" });
               }
            }
         });
      }
   };


   // -------------------------------------------------- Forgot Password Request -----------------------------------------------
   exports.Forgot_Password_Request = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.Email || ReceivingData.Email === '' ) {
         res.status(400).send({Status: false, Message: "Email can not be empty" });
      }else {
         AdminModel.User_Management.findOne( {'Email': ReceivingData.Email}, {},  function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Activate Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Activate User!."});
            } else {
               if ( result === null) {
                  res.status(200).send({Status: true, Message: "Account Not Findable!, Enter Valid Email!" });
               } else {
                  const EmailToken = crypto.randomBytes(16).toString("hex");
                  AdminModel.User_Management.update({ _id : result._id }, { $set: { EmailToken : EmailToken }})
                  .exec((err_2, result_2) => {
                     if(err_2) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Forgot Password Query Error', 'RegisterAndLogin.controller.js', err_2);
                        res.status(417).send({Status: false, Message: "Some error occurred!"});           
                     } else {
                        var SendData = {
                           from: 'SNS Institutions <sns.info@gmail.com>',
                           to: result.Email,
                           subject: 'Your Email Verification for Password Reset Process – reg;',
                           html: TemplateOne(result.Name, result._id, EmailToken)
                        };
                        mailgun.messages().send(SendData, function (error, body) {
                           if (error) {
                              res.status(417).send({ Status: false, Error:error, Message: "Some error occurred while send The E-mail " });
                           } else {
                              res.status(200).send({ Status: true,  Message: 'Check Your Email After Reset Your Password' });
                           }
                        });
                     }
                  });
               }
            }
         });
      }
   };


   // -------------------------------------------------- Forgot Password Request -----------------------------------------------
   exports.Reset_Password = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be valid" });
      }else if(!ReceivingData.EmailToken || ReceivingData.EmailToken === '' ) {
         res.status(400).send({Status: false, Message: "Password Reset Details can not be valid" });
      }else if(!ReceivingData.User_Password || ReceivingData.User_Password === '' ) {
         res.status(400).send({Status: false, Message: "Password can not be empty" });
      }else {
         AdminModel.User_Management.findOne( {'_id': mongoose.Types.ObjectId(ReceivingData.User_Id)}, {},  function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred!."});
            } else {
               if ( result === null) {
                  res.status(200).send({Status: false, Message: "Account Not Valid!, Contact our Admin!" });
               } else {
                  AdminModel.User_Management.findOne({'_id': mongoose.Types.ObjectId(ReceivingData.User_Id), 'EmailToken' : ReceivingData.EmailToken }, {},  function(err_1, result_1) {
                     if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Find Query Error', 'AdminManagement.controller.js', err_1);
                        res.status(417).send({status: false, Message: "Some error occurred!."});
                     } else {
                        if ( result_1 === null) {
                           res.status(200).send({Status: false, Message: "This Link is Expired!" });
                        } else {
                           AdminModel.User_Management.update({ _id : result_1._id }, { $set: { EmailToken : '', User_Password: ReceivingData.User_Password }})
                           .exec((err_2, result_2) => {
                              if (err_2) {
                                 ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Password update Query Error', 'AdminManagement.controller.js', err_2);
                                 res.status(417).send({status: false, Message: "Some error occurred!."});
                              } else {
                                 res.status(200).send({Status: true, Message: "Password Successfully Changed" });
                              }
                           })
                        }
                     }
                  });
               }
            }
         });
      }
   };

   
// -------------------------------------------------- Users List -----------------------------------------------
   exports.Users_List = function(req, res) {

      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty" });
      } else {
         var FindQuery = {};
         if (ReceivingData.Query['Institution']) {
            FindQuery['Institution'] = mongoose.Types.ObjectId(ReceivingData.Query['Institution']);
         }
         if (ReceivingData.Query['Department']) {
            FindQuery['Department'] = mongoose.Types.ObjectId(ReceivingData.Query['Department']);
         }
         AdminModel.User_Management.find(FindQuery, {User_Password: 0}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Institution', select: 'Institution' })
         .populate({ path: 'Department', select: 'Department' })
         .populate({ path: 'Designation', select: 'Designation' })
         .populate({ path: 'Created_By', select: 'Name' })
         .populate({ path: 'Last_ModifiedBy', select: 'Name' })
         .exec(function(err, result) { // Users Find Query
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User List Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find Users List!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };




// -------------------------------------------------- Countries List----------------------------------------------------------
   exports.Country_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty!" });
      } else {
         AdminModel.Global_Country.find({}, {Country_Name: 1}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Countries Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find the Countries List!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
  
// -------------------------------------------------- States List ----------------------------------------------------------
   exports.State_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty!" });
      }else if(!ReceivingData.Country_Id || ReceivingData.Country_Id === '') {
         res.status(200).send({Status:"True", Output:"False", Message: "Country Id can not be empty" });
      }else{
         AdminModel.Global_State.find({ Country_DatabaseId: ReceivingData.Country_Id }, { State_Name: 1}, {}, function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'States List Find Query Error', 'AdminManagement.controller.js', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find the States List!."});
            } else {
               var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                  ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: ReturnData });
            }
         });
      }
   };
  
// -------------------------------------------------- Cities List ----------------------------------------------------------
   exports.City_List = function(req, res) {
      var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
      var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
         res.status(400).send({Status: false, Message: "User Details can not be empty!" });
      }else if(!ReceivingData.State_Id || ReceivingData.State_Id === '') {
               res.status(200).send({Status:"True", Output:"False", Message: "State Id can not be empty" });
         }else{
            AdminModel.Global_City.find({ State_DatabaseId: ReceivingData.State_Id }, { City_Name: 1}, {}, function(err, result) {
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cities List Find Query Error', 'AdminManagement.controller.js', err);
                  res.status(417).send({status: false, Message: "Some error occurred while Find the Cities List!."});
               } else {
                  var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
                     ReturnData = ReturnData.toString();
                  res.status(200).send({Status: true, Response: ReturnData });
               }
            });
         }
   };