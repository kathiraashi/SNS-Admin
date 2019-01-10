import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl, FormArray, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { InstitutionService } from './../../../../Services/settings/institution/institution.service';
import { VacanciesConfigService } from './../../../../Services/settings/VacanciesConfig/vacancies-config.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-model-vacancies-config-create',
  templateUrl: './model-vacancies-config-create.component.html',
  styleUrls: ['./model-vacancies-config-create.component.css']
})
export class ModelVacanciesConfigCreateComponent implements OnInit {

   onClose: Subject<any>;

   Type: string;
   Data: any;

   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Designations: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id: any;

   Restricted_Institution: any = null;
   Restricted_Department: any = null;

   public options: Object = {
      charCounterCount: true,
      quickInsertButtons: ['table', 'ul', 'ol', 'hr'],
      toolbarButtons: [ 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                        '|', 'fontFamily', 'fontSize', 'color',
                        '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
                        '|', 'insertLink', 'insertTable', // insertImage
                        '|', 'specialCharacters', 'print', 'fullscreen'],
      // imageUploadParam: 'my_editor',
      // imageUploadURL: 'http://139.59.59.41:4000/API/Settings/VacanciesConfig/Demo_Upload',
      // imageUploadParams: {info: ''},
      // imageUploadMethod: 'POST',
      // imageMaxSize: 5 * 1024 * 1024,
      // imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      // events:  {
      //       'froalaEditor.initialized':  function () {
      //          console.log('initialized');
      //       },
      //       'froalaEditor.image.uploaded':  function  (e,  editor,  response) {
      //          const img_url = 'http://139.59.59.41:4000/API/Uploads/Demos/' ;
      //          console.log(JSON.parse(response));
      //          editor.image.insert(img_url +  JSON.parse(response)['Response'], false, null, editor.image.get());
      //          return false;
      //       }
      //    }
   };

   constructor( public bsModalRef: BsModalRef,
                public Institution_Service: InstitutionService,
                private Toastr: ToastrService,
                public Login_Service: LoginService,
                public Service: VacanciesConfigService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.Restricted_Institution = this.Login_Service.LoginUser_Info()['Institution'];
               this.Restricted_Department = this.Login_Service.LoginUser_Info()['Department'];
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
               if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
                  this._Institutions = DecryptedData.filter(obj => obj._id === this.Restricted_Institution['_id'] );
                  this.Form.controls['Institution'].setValue(this.Restricted_Institution['_id']);
                  this.Form.controls['Institution'].disable();
                  this._Designations = this._Institutions[0].Designation;
                  if (this.Restricted_Department !== null && this.Restricted_Department !== undefined) {
                     this._Departments = [this.Restricted_Department];
                     this.Form.controls['Department'].setValue(this.Restricted_Department['_id']);
                     this.Form.controls['Designation'].enable();
                     if (this.Type === 'Edit') {
                        this.Form.controls['Designation'].setValue(this.Data.Designation._id);
                        this.Form.controls['Designation'].disable();
                     }
                  } else {
                     this._Departments = this._Institutions[0].Departments;
                     this.Form.controls['Department'].enable();
                     if (this.Type === 'Edit') {
                        this.Form.controls['Department'].setValue(this.Data.Department._id);
                        this.Form.controls['Department'].disable();
                        this.Form.controls['Designation'].setValue(this.Data.Designation._id);
                     }
                  }
               } else {
                  this._Institutions = DecryptedData;
                  this.Form.controls['Institution'].enable();
                  if (this.Type === 'Edit') {
                     this.Form.controls['Institution'].setValue(this.Data.Institution._id);
                     this.Form.controls['Institution'].disable();
                     const _index = this._Institutions.findIndex(obj => obj._id === this.Data.Institution._id );
                     this._Departments = DecryptedData[_index].Departments;
                     this._Designations = DecryptedData[_index].Designation;
                     this.Form.controls['Department'].setValue(this.Data.Department._id);
                     this.Form.controls['Designation'].setValue(this.Data.Designation._id);
                  }
               }
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
            }
         });
      }

      // If Create New ExamConfig
         if (this.Type === 'Create') {
            this.Form = new FormGroup({
               Institution: new FormControl({value: null, disabled: true}, Validators.required ),
               Department: new FormControl({value: null, disabled: true}, Validators.required ),
               Designation: new FormControl({value: null, disabled: true}, {  validators: Validators.required,
                                                                              asyncValidators: [this.VacanciesConfig_AsyncValidate.bind(this)] } ),
               JobDescription: new FormControl( null, Validators.required ),
               JobResponsibility: new FormControl(null, Validators.required ),
               Created_By: new FormControl( this.User_Id, Validators.required ),
            });
         }

      // If Edit New Institution
         if (this.Type === 'Edit') {
            this.Form = new FormGroup({
               VacanciesConfig_Id: new FormControl(this.Data._id, Validators.required ),
               Institution: new FormControl({value: null, disabled: true}, Validators.required ),
               Department: new FormControl({value: null, disabled: true}, Validators.required),
               Designation: new FormControl({value: null, disabled: true}, {  validators: Validators.required,
                                                                              asyncValidators: [this.VacanciesConfig_AsyncValidate.bind(this)] } ),
               JobDescription: new FormControl( this.Data.JobDescription, Validators.required ),
               JobResponsibility: new FormControl( this.Data.JobResponsibility, Validators.required ),
               Modified_By: new FormControl(this.User_Id, Validators.required ),
            });
         }
   }


   InstitutionChange() {
      const Institution = this.Form.controls['Institution'].value;
      if (this.Type !== 'Edit' && (this.Restricted_Institution === null || this.Restricted_Institution === undefined) && Institution !== null && Institution !== '' && Institution !== undefined ) {
         const _index = this._Institutions.findIndex(obj => obj._id === Institution );
         this._Departments = this._Institutions[_index].Departments;
         this._Designations = this._Institutions[_index].Designation;
         this.Form.controls['Department'].setValue(null);
         this.Form.controls['Department'].enable();
         this.Form.controls['Designation'].setValue(null);
         this.Form.controls['Designation'].disable();
      }
      if ( Institution === null || Institution === '' || Institution === undefined ) {
         this.Form.controls['Department'].setValue(null);
         this.Form.controls['Department'].disable();
         this.Form.controls['Designation'].setValue(null);
         this.Form.controls['Designation'].disable();
      }
   }

   DepartmentChange() {
      const Department = this.Form.controls['Department'].value;
      if (this.Type !== 'Edit' && Department !== null && Department !== '' && Department !== undefined ) {
         this.Form.controls['Designation'].setValue(null);
         this.Form.controls['Designation'].enable();
      }
      if ( Department === null || Department === '' || Department === undefined ) {
         this.Form.controls['Designation'].setValue(null);
         this.Form.controls['Designation'].disable();
      }
   }


   VacanciesConfig_AsyncValidate( control: AbstractControl ) {
      const Institution = this.Form.controls['Institution'].value;
      const Department = this.Form.controls['Department'].value;
      const Data = { Institution: Institution, Department: Department, Designation: control.value, User_Id: this.User_Id  };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.VacanciesConfig_AsyncValidate({'Info': Info}).pipe(map( response => {
         if (this.Type === 'Edit') {
            return null;
         } else {
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
               return null;
            } else {
               return { Designation_NotAvailable: true};
            }
         }
      }));
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


   // Submit New Vacancies Config
   submit() {
      if (this.Form.valid && !this.Uploading ) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.VacanciesConfig_Create({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Vacancies Config Successfully Created' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Creating Vacancies Config!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

// Update New Vacancies Config
   update() {
      if (this.Form.valid && !this.Uploading ) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.VacanciesConfig_Update({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Vacancies Config Successfully Updated' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Updating Vacancies Config!' } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            }
         });
      }
   }

}






import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'innerHtml'
})
export class InnerHtmlPipe implements PipeTransform {

   constructor(private _sanitizer: DomSanitizer) {}

   transform(html: string): SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(html);
   }

}
