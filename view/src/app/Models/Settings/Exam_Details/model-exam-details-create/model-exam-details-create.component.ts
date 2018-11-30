import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';

import { ExamDetailsService } from './../../../../Services/settings/ExamDetails/exam-details.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-model-exam-details-create',
  templateUrl: './model-exam-details-create.component.html',
  styleUrls: ['./model-exam-details-create.component.css']
})
export class ModelExamDetailsCreateComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data;

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id;

   constructor( public bsModalRef: BsModalRef,
                public Service: ExamDetailsService,
                private Toastr: ToastrService,
                public Login_Service: LoginService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            }

   ngOnInit() {
      this.onClose = new Subject();

      // If Create New ExamDetails
         if (this.Type === 'Create') {
            this.Form = new FormGroup({
               ExamDetails: new FormControl( '', Validators.required ),
               Created_By: new FormControl( this.User_Id, Validators.required ),
            });
         }
      // If Edit New ExamDetails
         if (this.Type === 'Edit') {
            this.Form = new FormGroup({
               ExamDetails: new FormControl(this.Data.ExamDetails, Validators.required),
               ExamDetails_Id: new FormControl(this.Data._id, Validators.required),
               Modified_By: new FormControl(this.User_Id, Validators.required)
            });
         }
   }
   // onSubmit Function
      onSubmit() {
         if (this.Type === 'Create') {
            this.submit();
         }
         if (this.Type === 'Edit') {
            this.update();
         }
      }

   // Submit New ExamDetails
      submit() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.ExamDetails_Create({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Exam Details Successfully Created' } );
                  this.onClose.next({Status: true, Response: DecryptedData});
                  this.bsModalRef.hide();
               } else if (response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else if (response['status'] === 401 || response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Exam Details!' } );
                  this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                  this.bsModalRef.hide();
               }
            });
         }
      }

   // Update New ExamDetails
      update() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.ExamDetails_Update({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Exam Details Successfully Updated' } );
                  this.onClose.next({Status: true, Response: DecryptedData});
                  this.bsModalRef.hide();
               } else if (response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else if (response['status'] === 401 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Exam Details!' } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               }
            });
         }
      }

}
