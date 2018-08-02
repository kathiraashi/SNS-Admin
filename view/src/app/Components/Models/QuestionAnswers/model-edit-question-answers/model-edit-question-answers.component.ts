import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { CandidatesService } from './../../../../Services/Applications/candidates.service';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-edit-question-answers',
  templateUrl: './model-edit-question-answers.component.html',
  styleUrls: ['./model-edit-question-answers.component.css']
})
export class ModelEditQuestionAnswersComponent implements OnInit {

   _Colleges: any[] = [ 'SNS College of Technology',
                        'SNS College of Engineering',
                        'SNS College of Ars and Science',
                        'SNS College of Education',
                        'SNS Academy',
                     ];
   _Departments: any[] = [
                           'Aeronautical Engineering',
                           'Agriculture Engineering',
                           'Automobile Engineering',
                           'Biomedical Engineering',
                           'Civil Engineering',
                           'Civil Engineering and Planning',
                           'Computer Science Engineering',
                           'Electrical and Electronics Engineering',
                           'Electronics and Communication Engineering',
                           'Electronics and Instrumentation Engineering',
                           'Information Technology',
                           'Mechanical Engineering',
                           'Mechanical and Automation Engineering',
                           'Mechatronics Engineering',
                           'Master of Business Administration',
                           'Master of Computer Application',
                           'Science & Humanities',
                           'Department of Physical Education',
                        ];
   _Categories: any[] = ['One', 'Two', 'Three'];

   Type: String;

   onClose: Subject<any>;

   Form: FormGroup;

   Uploading: Boolean = false;

   constructor(public bsModalRef: BsModalRef, public Service: CandidatesService) { }

   ngOnInit() {
      this.onClose = new Subject();
      this.Form = new FormGroup({
         College: new FormControl(null, Validators.required),
         Department: new FormControl(null, Validators.required),
         Category: new FormControl(null, Validators.required),
         Question: new FormControl('', Validators.required),
         Option_A: new FormControl('', Validators.required),
         Option_B: new FormControl('', Validators.required),
         Option_C: new FormControl('', Validators.required),
         Option_D: new FormControl('', Validators.required),
         Option_E: new FormControl('', Validators.required),
         Option_F: new FormControl('', Validators.required),
         Answer: new FormControl('', Validators.required),
        User_Id: new FormControl('123'),
    });
   }

   Submit() {
    if (this.Form.valid && !this.Uploading) {
       this.Uploading = true;
       this.Service.Questions_Create(this.Form.value).subscribe( response => {
          this.Uploading = false;
          if (response['status'] === 200 ) {
            this.onClose.next({Status: true, Response: JSON.parse(JSON.parse(response['_body'])['Response'])});
            this.bsModalRef.hide();
          }
       });
   }
  }

}
