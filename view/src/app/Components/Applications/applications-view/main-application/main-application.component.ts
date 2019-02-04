import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import { CandidatesService } from './../../../../Services/Applications/candidates.service';
import { LoginService } from './../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-main-application',
  templateUrl: './main-application.component.html',
  styleUrls: ['./main-application.component.css']
})
export class MainApplicationComponent implements OnInit {

   Active_Tab = 'Basic&Personal_info';

   Loader: Boolean = true;
   Candidate_Id;
   User_Id;
   User_Type;

   _Data: Object = {};

   constructor(
               public Service: CandidatesService,
               private active_route: ActivatedRoute,
               private Toastr: ToastrService,
               public Login_Service: LoginService
            ) {
            this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
               this.active_route.url.subscribe((u) => {
                  this.Candidate_Id = this.active_route.snapshot.params['Candidate_Id'];
                  const Data = {'User_Id' : this.User_Id, Candidate_Id: this.Candidate_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Service.Candidate_View({ 'Info': Info }).subscribe(response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._Data = DecryptedData;
                        console.log(DecryptedData);
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Creating Customer Getting Error!, But not Identify!' });
                     }
                  });
               });
   }

   ngOnInit() {

   }

   Active_Tab_Change(name) {
      this.Active_Tab = name;
   }
}
