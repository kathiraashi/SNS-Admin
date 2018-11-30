var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ExamDetails Schema
   var ExamDetailsSchema = mongoose.Schema({
      ExamDetails: { type : String , required : true},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarExamDetails = mongoose.model('ExamDetails', ExamDetailsSchema, 'ExamDetails_List');



   
module.exports = {
   ExamDetailsSchema : VarExamDetails
};