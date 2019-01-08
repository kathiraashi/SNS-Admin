var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Institution Schema
   var InstitutionSchema = mongoose.Schema({
      Institution: { type : String , required : true},
      Institution_Code: { type : String , required : true},
      Designation: [ { type: Schema.Types.ObjectId, ref: 'Designation', required : true } ],
      Departments: [ { type: Schema.Types.ObjectId, ref: 'Department', required : true } ],
      Institution_Category: { type : Object , required : true},
      Image: { type : Object , required : true},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarInstitution = mongoose.model('Institution', InstitutionSchema, 'Institution_List');



   
module.exports = {
   InstitutionSchema : VarInstitution
};