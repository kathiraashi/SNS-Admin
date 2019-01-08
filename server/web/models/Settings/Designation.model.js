var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Designation Schema
   var DesignationSchema = mongoose.Schema({
      Designation: { type : String , required : true},
      Created_By : { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Last_Modified_By: { type: Schema.Types.ObjectId, ref: 'User_Management', required : true },
      Active_Status: { type : Boolean , required : true},
      If_Deleted: { type : Boolean , required : true }
      },
      { timestamps: true }
   );
   var VarDesignation = mongoose.model('Designation', DesignationSchema, 'Designation_List');



   
module.exports = {
   DesignationSchema : VarDesignation
};