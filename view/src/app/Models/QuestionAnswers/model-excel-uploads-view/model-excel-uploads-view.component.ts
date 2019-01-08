import { Component, OnInit } from '@angular/core';
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
  selector: 'app-model-excel-uploads-view',
  templateUrl: './model-excel-uploads-view.component.html',
  styleUrls: ['./model-excel-uploads-view.component.css']
})
export class ModelExcelUploadsViewComponent implements OnInit {


   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Categories: any[] = [];

   BtnReplace: Boolean = true;
   BtnAppend: Boolean = true;
   Uploading: Boolean = false;

   onClose: Subject<any>;
   User_Id;
   User_Type;
   _Data;

   Form: FormGroup;

   constructor(public bsModalRef: BsModalRef,
      public Service: QuestionAndAnswerService,
      private Toastr: ToastrService,
      public Login_Service: LoginService,
      public Categories_Service: CategoriesService,
      public Department_Service: DepartmentService,
      public Institution_Service: InstitutionService) {
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
         Questions: new FormControl([]),
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

   DeleteQuestion(_index) {
      this._Data.splice(_index, 1);
   }

   Replace() {
      if (this.Form.valid && this._Data.length > 0) {
         this.BtnAppend = false;
         this.Uploading = true;
         this.Form.controls['Questions'].setValue(JSON.stringify(this._Data));
         let Info = CryptoJS.AES.encrypt(JSON.stringify(this.Form.getRawValue()), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Questions_Import_Replace({ 'Info': Info }).subscribe(response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Uploading = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               this.onClose.next({Status: true, Type: 'Replace'});
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

   Append() {
      if (this.Form.valid && this._Data.length > 0) {
         this.BtnReplace = false;
         this.Uploading = true;
         this.Form.controls['Questions'].setValue(JSON.stringify(this._Data));
         let Info = CryptoJS.AES.encrypt(JSON.stringify(this.Form.getRawValue()), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Questions_Import_Append({ 'Info': Info }).subscribe(response => {
            const ResponseData = JSON.parse(response['_body']);
            this.Uploading = false;
            if (response['status'] === 200 && ResponseData['Status'] ) {
               this.onClose.next({Status: true, Type: 'Append' });
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
