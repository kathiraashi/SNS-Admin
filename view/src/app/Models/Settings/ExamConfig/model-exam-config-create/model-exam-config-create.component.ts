import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { CategoriesService } from './../../../../Services/settings/categories/categories.service';
import { InstitutionService } from './../../../../Services/settings/institution/institution.service';
import { ExamConfigService } from './../../../../Services/settings/ExamConfig/exam-config.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-model-exam-config-create',
  templateUrl: './model-exam-config-create.component.html',
  styleUrls: ['./model-exam-config-create.component.css']
})
export class ModelExamConfigCreateComponent implements OnInit {


   onClose: Subject<any>;

   Type: string;
   Data;
   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Categories: any[] = [];
   Temp_Categories: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id;

   Config;

   constructor( public bsModalRef: BsModalRef,
                public Institution_Service: InstitutionService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                public Service: ExamConfigService,
                public Category_Service: CategoriesService,
                public form_builder: FormBuilder
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            }

   ngOnInit() {
      this.onClose = new Subject();

      if (this.Type === 'Create' || this.Type === 'Edit') {
         const Data = {'User_Id' : this.User_Id };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._Institutions = DecryptedData;
               if (this.Type === 'Edit') {
                  this.Form.controls['Institution'].setValue(this.Data.Institution._id);
                  this._Departments.push(this.Data.Department);
                  this.Form.controls['Department'].setValue(this.Data.Department._id);
               }
            } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else if (response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
            }
         });
         this.Category_Service.Category_SimpleList({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this._Categories = DecryptedData;
               this.Temp_Categories = DecryptedData;
               if (this.Type === 'Edit') {
                  this.Data.Config.map(obj => {
                     this.SetConfig_FormArray(obj.Category._id, obj.NoOfQuestion);
                  });
                  setTimeout(() => {
                     const SelectedCategories = [];
                     this.Form.value.Config.map(obj => {
                        SelectedCategories.push(obj.Category);
                     });
                     this.Temp_Categories = this._Categories.filter(obj => !SelectedCategories.includes(obj._id));
                  }, 1000);
               }
            } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else if (response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Categories List Getting Error!, But not Identify!' });
            }
         });
      }

      // If Create New ExamConfig
         if (this.Type === 'Create') {
            this.Form = new FormGroup({
               Institution: new FormControl(null, Validators.required ),
               Department: new FormControl( null, {  validators: Validators.required,
                                                      asyncValidators: [this.ExamConfig_AsyncValidate.bind(this)],
                                                      updateOn: 'blur' } ),
               ExamDuration: new FormControl(null, Validators.required ),
               Config: this.form_builder.array([]),
               Created_By: new FormControl( this.User_Id, Validators.required ),
            });
            this.AddConfig();
         }

      // If Edit New Institution
         if (this.Type === 'Edit') {
            this.Form = new FormGroup({
               ExamConfig_Id: new FormControl(this.Data._id, Validators.required ),
               Institution: new FormControl(null, Validators.required ),
               Department: new FormControl(null, {  validators: Validators.required,
                                                      asyncValidators: [this.ExamConfig_AsyncValidate.bind(this)],
                                                      updateOn: 'blur' } ),
               ExamDuration: new FormControl(this.Data.ExamDuration, Validators.required ),
               Config: this.form_builder.array([]),
               Modified_By: new FormControl(this.User_Id, Validators.required ),
            });
         }
   }

   InstitutionChange() {
      const Institution_Id = this.Form.controls['Institution'].value;
      const _index = this._Institutions.findIndex(obj => obj._id === Institution_Id );
      this._Departments = this._Institutions[_index].Departments;
      this.Form.controls['Department'].setValue(null);
   }

   Category_Change() {
      const SelectedCategories = [];
      this.Form.value.Config.map(obj => {
         SelectedCategories.push(obj.Category);
      });
      this.Temp_Categories = this._Categories.filter(obj => !SelectedCategories.includes(obj._id));
   }

   Config_FormArray(): FormGroup {
      return new FormGroup({
         Category: new FormControl(null, Validators.required),
         NoOfQuestion: new FormControl( '', [Validators.required, Validators.min(3)])
      });
   }

   SetConfig_FormArray(Category, NoOfQuestion) {
      const Group = this.Form.get('Config') as FormArray;
      Group.push(new FormGroup({
         Category: new FormControl(Category, Validators.required),
         NoOfQuestion: new FormControl(NoOfQuestion, [Validators.required, Validators.min(3)])
      }));
   }

   AddConfig() {
      const Group = this.Form.get('Config') as FormArray;
      Group.push(this.Config_FormArray());
   }

   Remove_Config(index: number) {
      const control = <FormArray>this.Form.controls['Config'];
      control.removeAt(index);
      this.Category_Change();
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

      ExamConfig_AsyncValidate( control: AbstractControl ) {
         const Institution_Id = this.Form.controls['Institution'].value;
         const Data = { Institution_Id: Institution_Id, Department_Id: control.value, User_Id: this.User_Id  };
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         return this.Service.ExamConfig_AsyncValidate({'Info': Info}).pipe(map( response => {
            if (this.Type === 'Edit' && this.Data.Department._id === control.value) {
               return null;
            } else {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
                  return null;
               } else {
                  return { ExamConfig_NotAvailable: true};
               }
            }
         }));
      }


   // Submit New ExamConfig
      submit() {
         if (this.Form.valid && !this.Uploading && this.Form.value.Config.length > 0) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.ExamConfig_Create({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New ExamConfig Successfully Created' } );
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
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating ExamConfig!' } );
                  this.onClose.next({Status: false, Message: 'UnExpected Error!'});
                  this.bsModalRef.hide();
               }
            });
         }
      }

   // Update New ExamConfig
      update() {
         if (this.Form.valid && !this.Uploading && this.Form.value.Config.length > 0) {
            this.Uploading = true;
            const Data = this.Form.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.ExamConfig_Update({'Info': Info}).subscribe( response => {
               this.Uploading = false;
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'ExamConfig Successfully Updated' } );
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
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating ExamConfig!' } );
                  this.onClose.next({Status: false});
                  this.bsModalRef.hide();
               }
            });
         }
      }
}
