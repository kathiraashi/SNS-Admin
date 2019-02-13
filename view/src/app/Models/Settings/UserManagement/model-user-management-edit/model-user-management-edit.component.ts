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
import { DesignationService } from './../../../../Services/settings/Designation/designation.service';


@Component({
  selector: 'app-model-user-management-edit',
  templateUrl: './model-user-management-edit.component.html',
  styleUrls: ['./model-user-management-edit.component.css']
})
export class ModelUserManagementEditComponent implements OnInit {

  onClose: Subject<any>;

  Type: String;
  Data: any;
  _Institutions: any[] = [];
  _Departments: any[] = [];
  _Designations: any[] = [];
  _UserTypes: any[] =  ['Sub-Admin', 'Principle', 'HOD', 'Assistant-Professor', 'User'];


  User_Id: any;
  Restricted_Institution: any = null;
  Restricted_Department: any = null;
  User_Type: any;

  Form: FormGroup;

  constructor(
      public bsModalRef: BsModalRef,
      public Login_Service: LoginService,
      public Service: AdminService,
      private Toastr: ToastrService,
      public Department_Service: DepartmentService,
      public Institution_Service: InstitutionService,
      public Designation_Service: DesignationService
  ) {
      this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
      this.Restricted_Institution = this.Login_Service.LoginUser_Info()['Institution'];
      this.Restricted_Department = this.Login_Service.LoginUser_Info()['Department'];

      const Data = {'User_Id' : this.User_Id };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
        const ResponseData = JSON.parse(response['_body']);
        if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._Institutions = DecryptedData;
            if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
              this._Institutions = this._Institutions.filter(obj => obj._id === this.Restricted_Institution['_id']);
              if (this._Designations.length > 0) {
                  this._Designations = this._Institutions[0]['Designation'];
              }
              this._Departments = this._Institutions[0]['Departments'];
              this.Form.controls['Institution'].setValue(this.Restricted_Institution['_id']);
              this.Form.controls['Institution'].disable();
              this.Form.controls['Institution_Restricted'].setValue(true);
              this.Form.controls['Institution_Restricted'].disable();
              this.Form.controls['Department'].disable();
              if (this.Restricted_Department !== null && this.Restricted_Department !== undefined) {
                  this._Departments = this._Departments.filter(obj => obj._id === this.Restricted_Department['_id']);
                  this.Form.controls['Department'].setValue(this.Restricted_Department['_id']);
                  this.Form.controls['Department'].disable();
                  this.Form.controls['Department_Restricted'].setValue(true);
                  this.Form.controls['Department_Restricted'].disable();
              } else {
                  this.Form.controls['Department'].enable();
                  this.DepartmentUpdate();
              }
            } else {
              this.InstitutionUpdate();
            }
        } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
        } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
        }
      });
      this.Designation_Service.Designation_SimpleList({'Info': Info}).subscribe( response => {
        const ResponseData = JSON.parse(response['_body']);
        if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._Designations = DecryptedData;
            if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined && this._Institutions.length > 0) {
              this._Institutions = this._Institutions.filter(obj => obj._id === this.Restricted_Institution['_id']);
              this._Designations = this._Institutions[0]['Designation'];
            }
            this.UpdateDesignation();
        } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
        } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
        }
      });
  }

  ngOnInit() {
    this.onClose = new Subject();

    this.Form = new FormGroup({
        Modified_By: new FormControl(this.User_Id, Validators.required ),
       User_Id: new FormControl(this.Data._id, Validators.required ),
       Name: new FormControl(this.Data.Name, Validators.required ),
       Email: new FormControl(this.Data.Email, [Validators.required, Validators.email] ),
       Phone: new FormControl(this.Data.Phone),
       Designation: new FormControl(null, Validators.required),
       ApplicationCreate_Permission: new FormControl(this.Data.ApplicationCreate_Permission),
       ApplicationManagement_Permission: new FormControl(this.Data.ApplicationManagement_Permission),
       Q_A_Permission: new FormControl(this.Data.Q_A_Permission),
       OnlineExamUpdate_Permission: new FormControl(this.Data.OnlineExamUpdate_Permission),
       GD_Permission: new FormControl(this.Data.GD_Permission),
       Technical_Permission: new FormControl(this.Data.Technical_Permission),
       Hr_Permission: new FormControl(this.Data.Hr_Permission),
       BasicConfig_Permission: new FormControl(this.Data.BasicConfig_Permission),
       AdvancedConfig_Permission: new FormControl(this.Data.AdvancedConfig_Permission),
       UserManagement_Permission: new FormControl(this.Data.UserManagement_Permission),
       Institution_Restricted: new FormControl(this.Data.Institution_Restricted),
       Department_Restricted: new FormControl(this.Data.Department_Restricted),
       Institution: new FormControl(null),
       Department: new FormControl(null),
    });
    this.UpdateDesignation();
    this.InstitutionUpdate();
    this.DepartmentUpdate();

  }


  UpdateDesignation() {
    if (this._Designations.length > 0 && this.Data.Designation && typeof this.Data.Designation === 'object' ) {
      this.Form.controls['Designation'].setValue(this.Data.Designation['_id']);
    }
  }

  InstitutionUpdate() {
    if (this._Institutions.length > 0 && (this.Restricted_Institution === null || this.Restricted_Institution === undefined) && this.Data.Institution && typeof this.Data.Institution === 'object' ) {
      this.Form.controls['Institution'].setValue(this.Data.Institution['_id']);

      const Institution = this.Data.Institution['_id'];
      this.Form.controls['Department'].setValue(null);
      if (Institution !== '' && Institution !== null && Institution !== undefined ) {
        const _index = this._Institutions.findIndex(obj => obj._id === Institution);
        this._Departments = this._Institutions[_index].Departments;
        this.Form.controls['Department'].setValue(this.Data.Department['_id']);
      } else {
        this._Departments = [];
      }

    }
  }

  DepartmentUpdate() {
    if (this._Departments.length > 0 && (this.Restricted_Department === null || this.Restricted_Department === undefined) && this.Data.Department && typeof this.Data.Department === 'object' ) {
      this.Form.controls['Department'].setValue(this.Data.Department['_id']);
    }
  }


 Institution_Restricted_Change() {
    const Institution_Restricted = this.Form.controls['Institution_Restricted'].value;
    if (Institution_Restricted) {
       this.Form.controls['Institution'].setValidators(Validators.required);
    } else {
       this.Form.controls['Institution'].clearValidators();
       this.Form.controls['Institution'].setErrors(null);
       this.Form.controls['Institution'].setValue(null);
       this.Form.controls['Department_Restricted'].setValue(false);
       this.Department_Restricted_Change();
    }
 }

 Department_Restricted_Change() {
    const Department_Restricted = this.Form.controls['Department_Restricted'].value;
    if (Department_Restricted) {
       this.Form.controls['Department'].setValidators(Validators.required);
       this.Form.controls['Department'].enable();
    } else {
       this.Form.controls['Department'].clearValidators();
       this.Form.controls['Department'].setErrors(null);
       this.Form.controls['Department'].setValue(null);
       this.Form.controls['Department'].disable();
    }
 }

 InstitutionChange() {
    const Institution = this.Form.controls['Institution'].value;
    this.Form.controls['Department'].setValue(null);
    if (Institution !== '' && Institution !== null && Institution !== undefined ) {
       const _index = this._Institutions.findIndex(obj => obj._id === Institution);
       this._Departments = this._Institutions[_index].Departments;
    } else {
       this._Departments = [];
    }
 }


 submit() {
    if (this.Form.valid) {
       const Data = this.Form.getRawValue();
       let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
       Info = Info.toString();
       this.Service.User_Update({'Info': Info}).subscribe( response => {
          const ReceivingData = JSON.parse(response['_body']);
          if (response['status'] === 200 && ReceivingData['Status']) {
             const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
             const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
             this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'User Details Successfully Updated' } );
             this.onClose.next({Status: true, Response: DecryptedData});
             this.bsModalRef.hide();
          } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData['Status']) {
             this.onClose.next({Status: false, Message: 'Bad Request Error!'});
             this.bsModalRef.hide();
          } else {
             this.onClose.next({Status: false, Message: 'UnExpected Error!'});
             this.bsModalRef.hide();
          }
       });
    }
 }


}
