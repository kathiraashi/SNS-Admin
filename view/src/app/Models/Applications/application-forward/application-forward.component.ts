import { Component, OnInit  } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as CryptoJS from 'crypto-js';

import { InstitutionService } from './../../../Services/settings/institution/institution.service';
import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';
import { CandidatesService } from './../../../Services/Applications/candidates.service';
import { LoginService } from './../../../Services/LoginService/login.service';



@Component({
  selector: 'app-application-forward',
  templateUrl: './application-forward.component.html',
  styleUrls: ['./application-forward.component.css']
})
export class ApplicationForwardComponent implements OnInit {

   onClose: Subject<any>;

   Data: any;

   _Institutions: any[] = [];
   _Departments: any[] = [];

   Uploading: Boolean = false;
   Form: FormGroup;
   User_Id: any;
   User_Type: any;

   Config: any;

   constructor( public bsModalRef: BsModalRef,
                  public Institution_Service: InstitutionService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService,
                  public Service: CandidatesService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
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
            this._Institutions = DecryptedData;
            this.ValidateInstitution();
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
         }
      });

      console.log(this.Data);

      this.Form = new FormGroup({
         Candidate_Id: new FormControl(this.Data['_id'], Validators.required ),
         From_Institution_Id: new FormControl(this.Data['Basic_Info']['Institution']['_id'], Validators.required ),
         To_Institution_Id: new FormControl(null, Validators.required ),
         To_Institution_Code: new FormControl(null, Validators.required ),
         To_Department_Id: new FormControl( null, Validators.required ),
         To_Department_Code: new FormControl( null, Validators.required ),
         User_Id: new FormControl( this.User_Id, Validators.required ),
      });
   }

   ValidateInstitution() {
      const Institution_Id = this.Data['Basic_Info']['Institution']['_id'];
      this._Institutions = this._Institutions.filter(obj => obj._id !== Institution_Id);
   }

   InstitutionChange() {
      const Institution_Id = this.Form.controls['To_Institution_Id'].value;
      const _index = this._Institutions.findIndex(obj => obj._id === Institution_Id );
      const Institution_Code = this._Institutions[_index].Institution_Code;
      this.Form.controls['To_Institution_Code'].setValue(Institution_Code);
      this._Departments = this._Institutions[_index].Departments;
      this.Form.controls['To_Department_Id'].setValue(null);
   }

   DepartmentChange() {
      const Department_Id = this.Form.controls['To_Department_Id'].value;
      const _index = this._Departments.findIndex(obj => obj._id === Department_Id );
      const Department_Code = this._Departments[_index].Department_Code;
      this.Form.controls['To_Department_Code'].setValue(Department_Code);
   }



   submit() {
      if (this.Form.valid && !this.Uploading ) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.Refer_Candidate({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Application Successfully Forwarded' } );
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.onClose.next({Status: false});
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!, Application Forwarding!' } );
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }


}
