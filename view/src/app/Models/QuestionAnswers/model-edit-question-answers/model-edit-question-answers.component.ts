import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { QuestionAndAnswerService } from './../../../Services/QuestionAndAnswer/question-and-answer.service';
import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../Services/LoginService/login.service';
import { CategoriesService } from './../../../Services/settings/categories/categories.service';
import { DepartmentService } from './../../../Services/settings/department/department.service';
import { InstitutionService } from './../../../Services/settings/institution/institution.service';

import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-model-edit-question-answers',
  templateUrl: './model-edit-question-answers.component.html',
  styleUrls: ['./model-edit-question-answers.component.css']
})
export class ModelEditQuestionAnswersComponent implements OnInit {

   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Categories: any[] = [];

   @ViewChild('fileInput') fileInput: ElementRef;
   FormData: FormData = new FormData;
   Show_Img_Preview: Boolean = false;
   Preview_Img: any ;
   ActiveTab: any = null;

   Type: String;
   User_Id;
   User_Type;

   onClose: Subject<any>;

   Form: FormGroup;

   Uploading: Boolean = false;

   constructor(public bsModalRef: BsModalRef,
      public Service: QuestionAndAnswerService,
      private Toastr: ToastrService,
      public Login_Service: LoginService,
      public Categories_Service: CategoriesService,
      public Department_Service: DepartmentService,
      public Institution_Service: InstitutionService,
      ) {
         this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
         this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
      }

   ngOnInit() {
      this.onClose = new Subject();

      const Data = {'User_Id' : this.User_Id };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Categories_Service.Category_SimpleList({ 'Info': Info }).subscribe(response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._Categories = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Categories List Getting Error!, But not Identify!' });
         }
      });

      if (this.User_Type === 'Admin' || this.User_Type === 'Sub-Admin' || this.User_Type === 'Principle') {
         this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               if (this.User_Type === 'Principle') {
                  this._Institutions = [this.Login_Service.LoginUser_Info()['Institution']];
                  const _index = DecryptedData.findIndex(obj => obj._id === this._Institutions[0]['_id'] );
                  this._Departments = DecryptedData[_index].Departments;
                  this.Form.controls['Institution'].setValue(this._Institutions[0]['_id']);
                  this.Form.controls['Institution'].disable();
               } else {
                  this._Institutions = DecryptedData;
               }
            } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else if (response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this.UserPermissionBased();
      }

      this.Form = new FormGroup({
         Institution: new FormControl(null, Validators.required),
         Department: new FormControl(null, Validators.required),
         Category: new FormControl(null, Validators.required),
         Type: new FormControl('', Validators.required),
         Answer: new FormControl('', Validators.required),
         User_Id: new FormControl(this.User_Id),
      });
   }


   UserPermissionBased() {
      setTimeout(() => {
         this._Institutions = [this.Login_Service.LoginUser_Info()['Institution']];
         const Institution = this.Login_Service.LoginUser_Info()['Institution']['_id'];
         setTimeout(() => {
            this.Form.controls['Institution'].setValue(Institution);
            this.Form.controls['Institution'].disable();
         }, 100);
         this._Departments = [this.Login_Service.LoginUser_Info()['Department']];
         const Department = this.Login_Service.LoginUser_Info()['Department']['_id'];
         setTimeout(() => {
            this.Form.controls['Department'].setValue(Department);
            this.Form.controls['Department'].disable();
         }, 100);
      }, 200);
   }

   InstitutionChange() {
      const Institution_Id = this.Form.controls['Institution'].value;
      const _index = this._Institutions.findIndex(obj => obj._id === Institution_Id );
      this._Departments = this._Institutions[_index].Departments;
      this.Form.controls['Department'].setValue(null);
   }

   ActiveTabChange(Tab) {
      if (this.ActiveTab === Tab) {
         this.RemoveQuestionFormControls();
         this.ActiveTab = null;
      } else {
         this.FormData.delete('image');
         this.Preview_Img = '';
         this.Show_Img_Preview = false;
         if (Tab === 'Image') {
            this.RemoveQuestionFormControls();
            this.Form.controls['Type'].setValue('Image');
         } else {
            this.AddQuestionFormControls();
            this.Form.controls['Type'].setValue('Question');
         }
         this.ActiveTab = Tab;
      }
   }

   AddQuestionFormControls() {
      this.Form.setControl('Question', new FormControl('', Validators.required));
      this.Form.setControl('Option_A', new FormControl('', Validators.required));
      this.Form.setControl('Option_B', new FormControl('', Validators.required));
      this.Form.setControl('Option_C', new FormControl('', Validators.required));
      this.Form.setControl('Option_D', new FormControl('', Validators.required));
      this.Form.setControl('Option_E', new FormControl('', Validators.required));
      this.Form.setControl('Option_F', new FormControl('', Validators.required));
      this.Form.updateValueAndValidity();
   }

   RemoveQuestionFormControls() {
      this.Form.removeControl('Question');
      this.Form.removeControl('Option_A');
      this.Form.removeControl('Option_B');
      this.Form.removeControl('Option_C');
      this.Form.removeControl('Option_D');
      this.Form.removeControl('Option_E');
      this.Form.removeControl('Option_F');
      this.Form.updateValueAndValidity();
   }

   onFileChange(event) {
      if (event.target.files && event.target.files.length > 0) {
        this.Show_Img_Preview = true ;
        const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (events) => {
            this.Preview_Img = events.target['result'];
          };
        const file = event.target.files[0];
        this.FormData.set('image', file, file.name);
      } else {
        this.Show_Img_Preview = false ;
      }
   }

   Submit() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         let Info = CryptoJS.AES.encrypt(JSON.stringify(this.Form.value), 'SecretKeyIn@123');
         Info = Info.toString();
         this.FormData.set('Info', Info);
         this.Service.Questions_Create(this.FormData).subscribe(response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Uploading = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.onClose.next({Status: true, Response: DecryptedData });
               this.bsModalRef.hide();
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
