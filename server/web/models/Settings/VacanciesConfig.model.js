var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// VacanciesConfig Schema
   var VacanciesConfigSchema = mongoose.Schema({
      Institution: { type : Schema.Types.ObjectId, ref: 'Institution', required : true},
      Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
      Designation: { type: Schema.Types.ObjectId, ref: 'Designation', required : true },
      JobDescription: { type : String},
      JobResponsibility: { type : String},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarVacanciesConfigSchema = mongoose.model('VacanciesConfig', VacanciesConfigSchema, 'VacanciesConfig_List');



   
module.exports = {
   VacanciesConfigSchema : VarVacanciesConfigSchema
};