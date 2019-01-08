import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { LoginService } from './../../../../Services/LoginService/login.service';
import { AdminService  } from './../../../../Services/Admin/admin.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import { DepartmentService } from './../../../../Services/settings/department/department.service';
import { InstitutionService } from './../../../../Services/settings/institution/institution.service';

@Component({
  selector: 'app-model-user-create-user-management',
  templateUrl: './model-user-create-user-management.component.html',
  styleUrls: ['./model-user-create-user-management.component.css']
})
export class ModelUserCreateUserManagementComponent implements OnInit {

   onClose: Subject<any>;

   Type: String;
   Data: any;
   _Institutions: any[] = [];
   _Departments: any[] = [];
   _UserTypes: any[] =  ['Sub-Admin', 'Principle', 'HOD', 'Assistant-Professor', 'User'];


   ShowInstitution: Boolean = false;
   ShowDepartment: Boolean = false;

   User_Id: any;
   User_Type: any;

   Form: FormGroup;

  constructor(
               public bsModalRef: BsModalRef,
               public Login_Service: LoginService,
               public Service: AdminService,
               private Toastr: ToastrService,
               public Department_Service: DepartmentService,
               public Institution_Service: InstitutionService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               console.log(this.Login_Service.LoginUser_Info());

               const Data = {'User_Id' : this.User_Id };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._Institutions = DecryptedData;
                     this.UserBasedDataSet();
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else if (response['status'] === 401 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
                  }
               });
            }

   ngOnInit() {
      this.onClose = new Subject();

      if (this.User_Type === 'Admin') {
         this._UserTypes =  ['Sub-Admin', 'Principle', 'HOD', 'Assistant-Professor', 'User'];
      } else if (this.User_Type === 'Sub-Admin') {
         this._UserTypes =  ['Principle', 'HOD', 'Assistant-Professor', 'User'];
      } else if (this.User_Type === 'Principle') {
         this._UserTypes =  [ 'HOD', 'Assistant-Professor', 'User'];
      } else if (this.User_Type === 'HOD') {
         this._UserTypes =  [ 'Assistant-Professor', 'User'];
      } else {
         this._UserTypes = [];
      }

      this.Form = new FormGroup({
         User_Id: new FormControl(this.User_Id ),
         User_Name: new FormControl('', { validators: Validators.required,
                                          asyncValidators: [this.UserNameAsyncValidate.bind(this)],
                                          updateOn: 'blur' }),
         User_Password: new FormControl('', Validators.required),
         Name: new FormControl('', Validators.required ),
         Email: new FormControl('', [Validators.required, Validators.email]),
         Phone: new FormControl(''),
         User_Type: new FormControl(null, Validators.required),
      });
   }

   UserBasedDataSet() {
      if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub-Admin') {
         const Institution = this.Login_Service.LoginUser_Info()['Institution'];
         this.ShowInstitution = true;
         this.Form.setControl('Institution', new FormControl({value: Institution['_id'], disabled: true}, Validators.required));
         if (this.User_Type !== 'Principle') {
            const _index = this._Institutions.findIndex(obj => obj._id === Institution['_id']);
            this._Departments = this._Institutions[_index].Departments;
            const Department = this.Login_Service.LoginUser_Info()['Department'];
            this.ShowDepartment = true;
            this.Form.setControl('Department', new FormControl({value: Department['_id'], disabled: true}, Validators.required));
         }
      }
   }

   UserNameAsyncValidate( control: AbstractControl ) {
      const Data = { User_Id: this.User_Id, User_Name: control.value };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.User_Name_Validate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { UserName_NotAvailable: true};
         }
      }));
   }

   TypeChange() {
      if (this.User_Type === 'Admin' || this.User_Type === 'Sub-Admin') {
         const Type = this.Form.controls['User_Type'].value;
         this.ShowDepartment = false;
         this.ShowInstitution = false;
         this.Form.removeControl('Department');
         this.Form.removeControl('Institution');
         if (Type === 'HOD' || Type === 'Assistant-Professor' || Type === 'User' || Type === 'Principle' ) {
            this.ShowInstitution = true;
            this.Form.setControl('Institution', new FormControl(null, Validators.required));
         }
      }
   }

   InstitutionChange() {
      if (this.User_Type === 'Admin' || this.User_Type === 'Sub-Admin') {
         const Institution = this.Form.controls['Institution'].value;
         const Type = this.Form.controls['User_Type'].value;
         this.ShowDepartment = false;
         if (Type === 'HOD' || Type === 'Assistant-Professor' || Type === 'User') {
            this.ShowDepartment = true;
            this.Form.setControl('Department', new FormControl(null, Validators.required));
         } else {
            this.ShowDepartment = false;
            this.Form.removeControl('Department');
         }
         const _index = this._Institutions.findIndex(obj => obj._id === Institution);
         this._Departments = this._Institutions[_index].Departments;
      }
   }


   submit() {
      if (this.Form.valid) {
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.User_Create({'Info': Info}).subscribe( response => {
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData['Status']) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 && !ReceivingData['Status']) {
               this.onClose.next({Status: false, Message: 'Bad Request Error!'});
               this.bsModalRef.hide();
            } else if (response['status'] === 417 && !ReceivingData['Status']) {
               this.onClose.next({Status: false, Message: 'Industry Type Query Error!'});
               this.bsModalRef.hide();
            } else {
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
