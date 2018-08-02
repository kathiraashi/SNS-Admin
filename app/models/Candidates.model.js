var mongoose = require('mongoose');

var CandidatesSchema = mongoose.Schema({
    Basic_Info : {
        Post_Applied: { type : String , required : true },
        Department: { type : String , required : true },
        Preferred_Subject_1: { type : String },
        Preferred_Subject_2: { type : String },
        Preferred_Subject_3: { type : String },
    },
    Personal_Info : {
        Name: { type : String , required : true },
        DOB: { type : Date, required : true },
        Age: { type : String, required : true },
        Gender: { type : String, required : true },
        Place_of_Birth: { type : String, required : true },
        Nationality: { type : String, required : true },
        Religion: { type : String, required : true },
        Community: { type : String, required : true },
        Caste: { type : String, required : true },
        Aadhar_No: { type : String, required : true },
        PAN_No: { type : String },
        Contact_No: { type : String, required : true},
        Email: { type : String, required : true },

        Permanent_Door_No: { type : String, required : true },
        Permanent_Street: { type : String, required : true },
        Permanent_City: { type : String, required : true },
        Permanent_Sate: { type : String, required : true },
        Permanent_Pin_Code: { type : String, required : true },

        Address_Same: { type : String },

        Present_Door_No: { type : String, required : true },
        Present_Street: { type : String, required : true },
        Present_City: { type : String, required : true },
        Present_Sate: { type : String, required : true },
        Present_Pin_Code: { type : String, required : true },

        Marital_Status: { type : String, required : true },

        Father_Name: { type : String, required : true },
        Father_Designation: { type : String },
        Father_Organization: { type : String },
        Father_Locality: { type : String },

        Mother_Name: { type : String, required : true },
        Mother_Designation: { type : String },
        Mother_Organization: { type : String },
        Mother_Locality: { type : String },

        Spouse_Name: { type : String },
        Spouse_Designation: { type : String },
        Spouse_Organization: { type : String },
        Spouse_Locality: { type : String },

        No_Of_Siblings: { type : String },
        No_Of_Kids: { type : String },
        kids_List: { type : Array },
    },
    Education_Info: {
        Sslc_School: { type : String },
        Sslc_Medium: { type : String },
        Sslc_Year_Of_Passing: { type : String },
        Sslc_Percentage: { type : String },
        
        Hsc_School: { type : String },
        Hsc_Medium: { type : String },
        Hsc_Year_Of_Passing: { type : String },
        Hsc_Percentage: { type : String },
        
        UG_Course: { type : Object },
        UG_Department: { type : String },
        UG_Class: { type : String },
        UG_Year_Of_Passing: { type : String },
        UG_College_Name: { type : String },
        UG_CGPA: { type : String },
        UG_Percentage: { type : String },
        UG_Medium: { type : String },
        
        PG_Course: { type : Object },
        PG_Department: { type : String },
        PG_Class: { type : String },
        PG_Year_Of_Passing: { type : String },
        PG_College_Name: { type : String },
        PG_CGPA: { type : String },
        PG_Percentage: { type : String },
        PG_Medium: { type : String },

        Mphil_Course: { type : String },
        Mphil_Department: { type : String },
        Mphil_Class: { type : String },
        Mphil_Year_Of_Passing: { type : String },
        Mphil_College_Name: { type : String },
        Mphil_CGPA: { type : String },
        Mphil_Percentage: { type : String },
        Mphil_Medium: { type : String },
            
        PHD_Course: { type : String },
        PHD_Department: { type : String },
        PHD_Class: { type : String },
        PHD_Year_Of_Passing: { type : String },
        PHD_College_Name: { type : String },
        PHD_CGPA: { type : String },
        PHD_Percentage: { type : String },
        PHD_Medium: { type : String },

        Bed_Course: { type : String },
        Bed_Department: { type : String },
        Bed_Class: { type : String },
        Bed_Year_Of_Passing: { type : String },
        Bed_College_Name: { type : String },
        Bed_CGPA: { type : String },
        Bed_Percentage: { type : String },
        Bed_Medium: { type : String },

        Med_Course: { type : String },
        Med_Department: { type : String },
        Med_Class: { type : String },
        Med_Year_Of_Passing: { type : String },
        Med_College_Name: { type : String },
        Med_CGPA: { type : String },
        Med_Percentage: { type : String },
        Med_Medium: { type : String },

        Other1_Course: { type : String },
        Other1_Department: { type : String },
        Other1_Class: { type : String },
        Other1_Year_Of_Passing: { type : String },
        Other1_College_Name: { type : String },
        Other1_CGPA: { type : String },
        Other1_Percentage: { type : String },
        Other1_Medium: { type : String },

        Other2_Course: { type : String },
        Other2_Department: { type : String },
        Other2_Class: { type : String },
        Other2_Year_Of_Passing: { type : String },
        Other2_College_Name: { type : String },
        Other2_CGPA: { type : String },
        Other2_Percentage: { type : String },
        Other2_Medium: { type : String },

        Guide_ship: { type : String },
        Guide_ship_No: { type : String },
  
        SET_Qualified: { type : String },
        SET_QualifiedYear: { type : String },
    },
    Activity_Info: {
        Experience: { type : String },
        Teaching_Experience: { type : Array },
        Industry_Experience: { type : Array },
  
        No_Of_FDP_Attended: { type : String },
        No_Of_Workshop_Attended: { type : String },
        No_Of_Conference_Attended: { type : String },
        No_Of_Symposium_Attended: { type : String },
  
        No_Of_FDP_Organized: { type : String },
        No_Of_Workshop_Organized: { type : String },
        No_Of_Conference_Organized: { type : String },
        No_Of_Symposium_Organized: { type : String },
  
        No_Of_Monograph_Published: { type : String },
        No_Of_Books_Published: { type : String },
        No_Of_Chapter_in_Inherited_Books: { type : String },
        No_Of_Paper_Published_InJournals: { type : String },
        No_Of_Papers_InConference: { type : String },
        No_Of_Citations: { type : String },
        No_Of_H_Index: { type : String },
        No_Of_I10_Index: { type : String },
  
        No_Of_Project_Guided_UG: { type : String },
        No_Of_Project_Guided_PG: { type : String },
        No_Of_Project_Guided_PHD: { type : String },
  
        Patent: { type : Array },
        Achievements_Awards: { type : Array },
  
        Research_Found: { type : String },
        Research_Found_Amount: { type : String },
        Contact_Industries: { type : String },
        Contact_Industries_Count: { type : String },
  
        Interested_Game: { type : String },
        Activities: { type : String },
        Special_Achievements: { type : String },
        Joining_Time: { type : String },
        Expected_Salary: { type : String },
    },
    Reference_Info: {
        Family_in_SNS: { type : String },
        Family_in_SNS_Details: { type : Array },

        Reference1_Name: { type : String },
        Reference2_Name: { type : String },
        Reference1_Designation: { type : String },
        Reference2_Designation: { type : String },
        Reference1_Organization: { type : String },
        Reference2_Organization: { type : String },
        Reference1_Contact_Number: { type : String },
        Reference2_Contact_Number: { type : String },
        Reference1_Email_Id: { type : String },
        Reference2_Email_Id: { type : String },

        Place: { type : String },
        Date: { type : String },
    },
    Files: {
        Cover_Later: { type: Object},
        Photo: { type: Object},
        Signature: { type: Object}
    },
    FormType:  { type: String, required: true },
    Status: { type: String},
    Stage: { type: Number}
}, { timestamps: true });


var varCandidates_Data = mongoose.model('Candidates_Data', CandidatesSchema, 'Candidates_Data');

module.exports = {
    CandidatesSchema : varCandidates_Data
};