import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import * as CryptoJS from 'crypto-js';
import {NativeDateAdapter} from '@angular/material';
import {DateAdapter} from '@angular/material/core';
export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
   }
}


import { ToastrService } from './../../../../../Services/common-services/toastr-service/toastr.service';
import { CandidatesService } from './../../../../../Services/Applications/candidates.service';
import { LoginService } from './../../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class ExamDetailsComponent implements OnInit {

   @Input() CandidateData: Object;

   UpdateOptions: any[] = ['Pass', 'Fail'];

   User_Id;
   User_Type;
   Candidate_Id;
   If_Pass: Boolean = false;
   If_PassOne: Boolean = false;
   MinDate: Date = new Date();

   Exam_Data = {};

   Uploading: Boolean = false;
   Form: FormGroup;
   FormOne: FormGroup;

   modalRef: BsModalRef;

  constructor( public Service: CandidatesService,
               private active_route: ActivatedRoute,
               private Toastr: ToastrService,
               public Login_Service: LoginService,
               private modalService: BsModalService
            ) {   this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
                  this.active_route.url.subscribe((u) => {
                     this.Candidate_Id = this.active_route.snapshot.params['Candidate_Id'];
                     const Data = {'User_Id' : this.User_Id, Candidate_Id: this.Candidate_Id };
                     let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                     Info = Info.toString();
                     this.Service.Candidate_ExamView({ 'Info': Info }).subscribe(response => {
                        const ResponseData = JSON.parse(response['_body']);
                        if (response['status'] === 200 && ResponseData['Status'] ) {
                           const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                           const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                           this.Exam_Data = DecryptedData;
                           console.log(DecryptedData);
                           this.Form.controls['Exam_Id'].setValue(this.Exam_Data['_id']);
                           this.FormOne.controls['Exam_Id'].setValue(this.Exam_Data['_id']);
                        } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else if (response['status'] === 401 && !ResponseData['Status']) {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                        } else {
                           this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Creating Customer Getting Error!, But not Identify!' });
                        }
                     });
                  });
               }

   ngOnInit() {
      this.Form = new FormGroup({
         Candidate_Id: new FormControl(this.Candidate_Id, Validators.required ),
         User_Id: new FormControl(this.User_Id, Validators.required ),
         Exam_Id: new FormControl('', Validators.required ),
         ExamResult: new FormControl(null, Validators.required ),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
      this.FormOne = new FormGroup({
         Candidate_Id: new FormControl(this.Candidate_Id, Validators.required ),
         User_Id: new FormControl(this.User_Id, Validators.required ),
         Exam_Id: new FormControl('', Validators.required ),
         InterviewResult: new FormControl(null, Validators.required ),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
   }

   NotAllow(): Boolean {
      return false;
   }

   openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template);
   }

   ResultChange() {
      const Result = this.Form.value.ExamResult;
      if (Result === 'Pass') {
         this.If_Pass = true;
         this.Form.addControl('InterviewDate', new FormControl(null, Validators.required));
         this.Form.addControl('Place', new FormControl('', Validators.required));
      } else {
         this.If_Pass = false;
         this.Form.removeControl('InterviewDate');
         this.Form.removeControl('Place');
      }
   }

   InterviewResultChange() {
      const Result = this.FormOne.value.InterviewResult;
      if (Result === 'Pass') {
         this.If_PassOne = true;
         this.FormOne.addControl('JoinDate', new FormControl(null, Validators.required));
      } else {
         this.If_PassOne = false;
         this.FormOne.removeControl('JoinDate');
      }
   }

   onSubmit() {
      if (this.Form.valid) {
         this.Uploading = true;
         let Info = CryptoJS.AES.encrypt(JSON.stringify(this.Form.value), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.ExamResult_Update({ 'Info': Info }).subscribe(response => {
            this.Uploading = false;
            this.modalRef.hide();
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Exam_Data = DecryptedData;
               this.CandidateData['Current_Stage'] = 'Stage_5';
            } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else if (response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Creating Customer Getting Error!, But not Identify!' });
            }
         });
      }
   }

   InterviewSubmit() {
      if (this.FormOne.valid) {
         this.Uploading = true;
         let Info = CryptoJS.AES.encrypt(JSON.stringify(this.FormOne.value), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.InterviewResult_Update({ 'Info': Info }).subscribe(response => {
            this.Uploading = false;
            this.modalRef.hide();
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Exam_Data = DecryptedData;
               this.CandidateData['Current_Stage'] = 'Stage_6';
            } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else if (response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Creating Customer Getting Error!, But not Identify!' });
            }
         });
      }
   }

}
