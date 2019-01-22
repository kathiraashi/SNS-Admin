import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-education-info-application',
  templateUrl: './education-info-application.component.html',
  styleUrls: ['./education-info-application.component.css']
})
export class EducationInfoApplicationComponent implements OnInit {

   @Input() CandidateData: Object;

   UG_Course: Boolean = false;
   PG_Course: Boolean = false;
   MPHIL_Course: Boolean = false;
   PHD_Course: Boolean = false;
   BED_Course: Boolean = false;
   MED_Course: Boolean = false;
   OTHER1_Course: Boolean = false;
   OTHER2_Course: Boolean = false;

   constructor() { }

   ngOnInit() {

      if (  this.CandidateData['Education_Info']['UG_Course'] !== '' ||
            this.CandidateData['Education_Info']['UG_Department'] !== '' ||
            this.CandidateData['Education_Info']['UG_Class'] !== '' ||
            this.CandidateData['Education_Info']['UG_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['UG_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['UG_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['UG_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['UG_Medium'] !== ''
         ) { this.UG_Course = true;  }
      if (  this.CandidateData['Education_Info']['PG_Course'] !== '' ||
            this.CandidateData['Education_Info']['PG_Department'] !== '' ||
            this.CandidateData['Education_Info']['PG_Class'] !== '' ||
            this.CandidateData['Education_Info']['PG_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['PG_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['PG_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['PG_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['PG_Medium'] !== ''
         ) { this.PG_Course = true;  }
      if (  this.CandidateData['Education_Info']['Mphil_Course'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_Department'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_Class'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['Mphil_Medium'] !== ''
         ) { this.MPHIL_Course = true;  }
      if (  this.CandidateData['Education_Info']['PHD_Course'] !== '' ||
            this.CandidateData['Education_Info']['PHD_Department'] !== '' ||
            this.CandidateData['Education_Info']['PHD_Class'] !== '' ||
            this.CandidateData['Education_Info']['PHD_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['PHD_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['PHD_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['PHD_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['PHD_Medium'] !== ''
         ) { this.PHD_Course = true;  }
      if (  this.CandidateData['Education_Info']['Bed_Department'] !== '' ||
            this.CandidateData['Education_Info']['Bed_Class'] !== '' ||
            this.CandidateData['Education_Info']['Bed_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['Bed_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['Bed_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['Bed_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['Bed_Medium'] !== ''
         ) { this.BED_Course = true;  }
      if (  this.CandidateData['Education_Info']['Med_Department'] !== '' ||
            this.CandidateData['Education_Info']['Med_Class'] !== '' ||
            this.CandidateData['Education_Info']['Med_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['Med_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['Med_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['Med_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['Med_Medium'] !== ''
         ) { this.MED_Course = true;  }
      if (  this.CandidateData['Education_Info']['Other1_Course'] !== '' ||
            this.CandidateData['Education_Info']['Other1_Department'] !== '' ||
            this.CandidateData['Education_Info']['Other1_Class'] !== '' ||
            this.CandidateData['Education_Info']['Other1_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['Other1_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['Other1_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['Other1_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['Other1_Medium'] !== ''
         ) { this.OTHER1_Course = true;  }
      if (  this.CandidateData['Education_Info']['Other2_Course'] !== '' ||
            this.CandidateData['Education_Info']['Other2_Department'] !== '' ||
            this.CandidateData['Education_Info']['Other2_Class'] !== '' ||
            this.CandidateData['Education_Info']['Other2_Year_Of_Passing'] !== '' ||
            this.CandidateData['Education_Info']['Other2_College_Name'] !== '' ||
            this.CandidateData['Education_Info']['Other2_CGPA'] !== '' ||
            this.CandidateData['Education_Info']['Other2_Percentage'] !== '' ||
            this.CandidateData['Education_Info']['Other2_Medium'] !== ''
         ) { this.OTHER2_Course = true;  }

   }

}
