var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = mongoose.Schema({
   Institution: { type: Schema.Types.ObjectId, ref: 'Institution', required : true },
   Department: { type: Schema.Types.ObjectId, ref: 'Department', required : true },
   Category: { type: Schema.Types.ObjectId, ref: 'Category', required : true },
   Question: { type : String},
   Option_A: { type : String},
   Option_B: { type : String},
   Option_C: { type : String},
   Option_D: { type : String},
   Option_E: { type : String},
   Option_F: { type : String},
   Option_F: { type : String},
   Type: { type : String, required: true},
   Image: { type : Object },
   Answer: { type : String, required : true },
   Status: { type : String , required : true },
   If_Deleted: { type : Boolean , required : true },
   User_Id: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
   Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
}, { timestamps: true });

var varQuestion_Answer = mongoose.model('Question_Answer', QuestionSchema, 'Question_Answer');



module.exports = {
   QuestionSchema: varQuestion_Answer
};