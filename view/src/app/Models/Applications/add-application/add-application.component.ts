import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

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

import { CandidatesService } from './../../../Services/Applications/candidates.service';
import { InstitutionService } from './../../../Services/settings/institution/institution.service';
import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../Services/LoginService/login.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class AddApplicationComponent implements OnInit {


   onClose: Subject<any>;

   @ViewChild('fileInput') fileInput: ElementRef;
   FormData: FormData = new FormData;
   File_Added: Boolean = false;

   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Designations: any[] = [];
   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id: any;

   ShowSubject: Boolean = false;


   Restricted_Institution: any = null;
   Restricted_Department: any = null;

   constructor( public bsModalRef: BsModalRef,
                public Service: CandidatesService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                public Institution_Service: InstitutionService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.Restricted_Institution = this.Login_Service.LoginUser_Info()['Institution'];
               this.Restricted_Department = this.Login_Service.LoginUser_Info()['Department'];
            }

   ngOnInit() {
      this.onClose = new Subject();

      const Data = {'User_Id' : this.User_Id };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
               this._Institutions = DecryptedData.filter(obj => obj._id === this.Restricted_Institution['_id'] );
               this._Designations = this._Institutions[0].Designation;
               this.Form.controls['FormType'].setValue(this._Institutions[0].Institution_Category['Type']);
               if (this._Institutions[0].Institution_Category['Type'] === 'Type_4') {
                  this.ShowSubject = true;
               } else {
                  this.ShowSubject = false;
               }
               this.Form.controls['Institution_Code'].setValue(this._Institutions[0].Institution_Code);
               this.Form.controls['Institution'].setValue(this.Restricted_Institution['_id']);
               this.Form.controls['Institution'].disable();
               if (this.Restricted_Department !== null && this.Restricted_Department !== undefined)  {
                  const Dep = this._Institutions[0].Departments;
                  this._Departments = Dep.filter(obj => obj._id === this.Restricted_Department['_id'] );
                  this.Form.controls['Department_Code'].setValue(this._Departments[0].Department_Code);
                  this.Form.controls['Department'].setValue(this.Restricted_Department['_id']);
                  this.Form.controls['Department'].disable();
               } else {
                  this._Departments = this._Institutions[0].Departments;
               }
            } else {
               this._Institutions = DecryptedData;
            }
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
         }
      });

      this.Form = new FormGroup({
         Name: new FormControl(null, Validators.required ),
         Gender: new FormControl('Male', Validators.required ),
         DOB: new FormControl(null, Validators.required ),
         Age: new FormControl({value: null, disabled: true}, Validators.required ),
         Email: new FormControl(null, {   validators: Validators.required,
                                          asyncValidators: [this.Email_AsyncValidate.bind(this)],
                                          updateOn: 'blur' }),
         Contact: new FormControl(null, { validators: Validators.required,
                                          asyncValidators: [this.Contact_AsyncValidate.bind(this)],
                                          updateOn: 'blur' } ),
         Institution: new FormControl(null, Validators.required ),
         Institution_Code: new FormControl(null, Validators.required ),
         Department: new FormControl(null, Validators.required ),
         Department_Code: new FormControl(null, Validators.required ),
         Designation: new FormControl(null, Validators.required ),
         FormType: new FormControl(null, Validators.required ),
         Subject_1: new FormControl(''),
         Subject_2: new FormControl(''),
         Subject_3: new FormControl(''),
         Created_By: new FormControl( this.User_Id, Validators.required ),
      });
   }

   NotAllow(): Boolean {
      return false;
   }


   Email_AsyncValidate( control: AbstractControl ) {
      const Data = { Email: control.value, User_Id: this.User_Id  };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.Email_AsyncValidate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { Email_NotAvailable: true};
         }
      }));
   }

   Contact_AsyncValidate( control: AbstractControl ) {
      const Data = { Contact: control.value, User_Id: this.User_Id  };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.Contact_AsyncValidate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { Contact_NotAvailable: true};
         }
      }));
   }

   InstitutionChange() {
      const Institution = this.Form.controls['Institution'].value;
      this.Form.controls['Department'].setValue(null);
      this.Form.controls['Designation'].setValue(null);
      this._Departments = [];
      this._Designations = [];
      if (Institution !== '' && Institution !== null && Institution !== undefined) {
         if ((this.Restricted_Institution === null || this.Restricted_Institution === undefined) && (this.Restricted_Department === null || this.Restricted_Department === undefined))  {
            const _index = this._Institutions.findIndex(obj => obj._id === Institution );
            this.Form.controls['Institution_Code'].setValue(this._Institutions[_index].Institution_Code);
            this.Form.controls['FormType'].setValue(this._Institutions[_index].Institution_Category['Type']);
            if (this._Institutions[_index].Institution_Category['Type'] === 'Type_4') {
               this.ShowSubject = true;
            } else {
               this.ShowSubject = false;
            }
            this._Departments = this._Institutions[_index].Departments;
            this._Designations = this._Institutions[_index].Designation;
         }
      }
   }

   DepartmentChange() {
      const Department = this.Form.controls['Department'].value;
      const _index = this._Departments.findIndex(obj => obj._id === Department );
      this.Form.controls['Department_Code'].setValue(this._Departments[_index].Department_Code);
   }

   CalculateAge() {
      const Dob = this.Form.controls['DOB'].value;
      const timeDiff = Math.abs(Date.now() - Dob);
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      this.Form.controls['Age'].setValue(age);
   }


   onFileChange(event) {
      if (event.target.files && event.target.files.length > 0) {
         this.File_Added = true ;
         const file = event.target.files[0];
         this.FormData.set('resume', file, file.name);
      } else {
         this.File_Added = false ;
      }
   }

   // Submit New Institution
      onSubmit() {
         if (this.Form.valid && !this.Uploading) {
            this.Uploading = true;
            const Data = this.Form.getRawValue();
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.FormData.set('Info', Info);
            this.Service.Candidate_Add(this.FormData).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Candidate Successfully Added' } );
                  this.onClose.next({Status: true, Response: DecryptedData});
                  this.bsModalRef.hide();
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Adding Candidate!' } );
                  this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                  this.bsModalRef.hide();
               }
            });
         }
      }

}
