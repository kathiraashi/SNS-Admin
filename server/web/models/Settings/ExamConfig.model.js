var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ExamConfig Schema
   var ExamConfigSchema = mongoose.Schema({
      Institution: { type : Schema.Types.ObjectId, ref: 'Institution', required : true},
      Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
      Config: [{
            Category: { type: Schema.Types.ObjectId, ref: 'Category', required : true },
            NoOfQuestion: { type: Number, required : true },
            Cutoff: { type: Number, required : true }
         }],
      ExamDuration: { type : Number, required : true },
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarExamConfigSchema = mongoose.model('ExamConfig', ExamConfigSchema, 'ExamConfig_List');



   
module.exports = {
   ExamConfigSchema : VarExamConfigSchema
};