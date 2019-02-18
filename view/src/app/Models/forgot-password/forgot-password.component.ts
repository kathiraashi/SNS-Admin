import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../Services/LoginService/login.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

   Uploading: Boolean = false;
   Form: FormGroup;

   constructor( public bsModalRef: BsModalRef,
                private Toastr: ToastrService,
                public Login_Service: LoginService
            ) { }

   ngOnInit() {
      this.Form = new FormGroup({
          Email: new FormControl( '',  [Validators.required, Validators.email]),
      });
   }

   submit() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.value;
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Login_Service.Forgot_Password_Request({'Info': Info}).subscribe( response => {
            this.Uploading = false;
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Success', Message: ReceivingData['Message'] } );
               this.bsModalRef.hide();
            } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ReceivingData.Status) {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData['Message'] } );
               this.bsModalRef.hide();
            } else {
               this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Error Not Identify!' } );
               this.bsModalRef.hide();
            }
         });
      }
   }

}
