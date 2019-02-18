import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { LoginService } from './../../../Services/LoginService/login.service';

import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

 LoginForm: FormGroup;

 User_Id: any;
 EmailToken: any;

   UserRequired: Boolean = false;
   UserMinLengthErr: Boolean = false;

   constructor(
      private router: Router,
      private active_route: ActivatedRoute,
      private service: LoginService,
      private Toastr: ToastrService,

   ) {
      this.active_route.url.subscribe((u) => {
         this.User_Id = this.active_route.snapshot.params['User_Id'];
         this.EmailToken = this.active_route.snapshot.params['EmailToken'];
      });
   }

   ngOnInit() {
      this.LoginForm = new FormGroup({
         User_Id: new FormControl(this.User_Id, Validators.required),
         EmailToken: new FormControl(this.EmailToken, Validators.required),
         User_Password: new FormControl('', Validators.required),
      });
   }

   submit() {
      if (this.LoginForm.valid) {
            const Data = this.LoginForm.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.service.Reset_Password({'Info': Info}).subscribe( response => {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: ReceivingData.Message } );
                  this.router.navigate(['/']);
               } else if (response['status'] === 200 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData.Message } );
               } else if (response['status'] === 400 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData.Message } );
               } else if (response['status'] === 417 && !ReceivingData.Status) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ReceivingData.Message } );
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Some Error Occurred!, Error Not Defined!' } );
               }
            });
      }
   }


}
