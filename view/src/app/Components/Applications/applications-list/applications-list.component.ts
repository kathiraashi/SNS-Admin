import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatMenuTrigger} from '@angular/material';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as CryptoJS from 'crypto-js';

import { ConfirmationComponent } from './../../Common/confirmation/confirmation.component';
import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';
import { CandidatesService } from './../../../Services/Applications/candidates.service';
import { LoginService } from './../../../Services/LoginService/login.service';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.css']
})
export class ApplicationsListComponent implements OnInit {

   @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

   bsModalRef: BsModalRef;
   bsModalRef_StageOne: BsModalRef;

   Loader: Boolean = true;
   User_Id;
   User_Type;
   _List: any[] = [];
   _Menus: any[] = [ { name: 'Verify & Accepted', activity: 'Accepted', show: true },
                     { name: 'Assign Online Exam', activity: 'AssignExam', show: true }];
   Temp_Menu: any[] = [];
   ActionId;

   constructor( public Service: CandidatesService,
               private Toastr: ToastrService,
               private router: Router,
               public Login_Service: LoginService,
               private modalService: BsModalService
            ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
                  const Data = {'User_Id' : this.User_Id };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Service.CandidatesList({ 'Info': Info }).subscribe(response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._List = DecryptedData;
                        this._List = this._List.map(obj => {
                           obj.BtnLoading = false;
                           return obj;
                        });
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Candidate List Getting Error!, But not Identify!' });
                     }
                  });
       }

   ngOnInit() {

   }

   SetActionId(_index) {
      this.ActionId = this._List[_index]._id;
      if (this._List[_index].Current_Stage === 'Stage_1') {
         this.Temp_Menu = this._Menus.slice(0);
      }
      if (this._List[_index].Current_Stage === 'Stage_2') {
         this.Temp_Menu = this._Menus.slice(1);
      }
      if (this._List[_index].Current_Stage === 'Stage_3') {
         this.Temp_Menu = this._Menus.slice(2);
      }
      if (this._List[_index].Current_Stage === 'Stage_4') {
         this.Temp_Menu = this._Menus.slice(3);
      }
   }

   View() {
      this.router.navigate(['Applications', this.ActionId]);
   }

   Action(Action) {
      this.trigger.closeMenu();
      const _index = this._List.findIndex(obj => obj._id === this.ActionId);
      this._List[_index].BtnLoading = true;

      if (Action === 'Accepted') {
         const initialState = { Type: 'Confirmation',
                                 Header: 'Accept Application',
                                 LineOne: 'Are you Sure?',
                                 LineTwo: 'You Want to Verified? Accept the Candidate Application' };
         this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
         this.bsModalRef.content.onClose.subscribe(confirmation => {
            if (confirmation.Status) {
               const Data = {'User_Id' : this.User_Id, 'Candidate_Id': this.ActionId };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Service.Accept_Candidate({ 'Info': Info }).subscribe(response => {
                  const ResponseData = JSON.parse(response['_body']);
                  this._List[_index].BtnLoading = false;
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     this._List[_index].Current_Status = 'Accepted';
                     this._List[_index].Current_Stage = 'Stage_2';
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else if (response['status'] === 401 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Candidate Accept Update Error!, But not Identify!' });
                  }
               });
            }
         });
      }

      if (Action === 'AssignExam') {
         const initialState = { Type: 'Confirmation',
                                 Header: 'Assign Online Exam',
                                 LineOne: 'Are you Sure?',
                                 LineTwo: 'You Want to Assign the Online Exam to this Candidate' };
         this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
         this.bsModalRef.content.onClose.subscribe(confirmation => {
            if (confirmation.Status) {
               const Data = {'User_Id' : this.User_Id, 'Candidate_Id': this.ActionId };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Service.QuestionAvailable_Check({ 'Info': Info }).subscribe(response => {
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status']) {
                     if (ResponseData['Available']) {
                        this._List[_index].BtnLoading = false;
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this.Assign_Confirmed(_index, this.ActionId, DecryptedData['ExamDuration'], DecryptedData['TotalQuestion'], DecryptedData['Config_Info'], DecryptedData['ExamConfig'] );
                     } else {
                        const initialState_1 = { Type: 'Alert',
                                       Header: 'Questions Not Available',
                                       LineOne: 'Add More Questions to this Candidate Applied Institution and Department after Assign the Exam!.' };
                        this.Alert_Function(initialState_1);
                     }
                  } else if (response['status'] === 200 && !ResponseData['Status']) {
                     const initialState_1 = { Type: 'Alert',
                                                Header: 'Exam Config Not Create',
                                                LineOne: 'Exam Configuration Not Create For This Candidate Applied Institution and Department!.' };
                     this.Alert_Function(initialState_1);
                  } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     this._List[_index].BtnLoading = false;
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Questions Available Check Error!, But not Identify!' });
                     this._List[_index].BtnLoading = false;
                  }
               });
            } else {
               this._List[_index].BtnLoading = false;
            }
         });
      }
   }

   Alert_Function(initialState) {
      const _index = this._List.findIndex(obj => obj._id === this.ActionId);
      this.bsModalRef_StageOne = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: false, class: 'modal-sm min-width-350' }));
      this._List[_index].BtnLoading = false;
   }

   Assign_Confirmed(_index, Candidate_Id, ExamDuration, TotalQuestion, Config_Info, ExamConfig) {
      const initialState = { Type: 'Confirmation',
                              Header: 'Assigned Exam Config',
                              LineOne: 'No of Questions: ' + TotalQuestion + ', \n Exam Duration: ' + ExamDuration + 'Mins. \n ',
                              LineTwo: 'Final Confirm to Assign Online Exam' };
      this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm min-width-350' }));
      this.bsModalRef.content.onClose.subscribe(confirmation => {
         if (confirmation.Status) {

            const Data = { 'User_Id' : this.User_Id,
                           'Candidate_Id': Candidate_Id,
                           Ref_ID: this._List[_index]['Ref_ID'],
                           Config: Config_Info,
                           ExamConfig_Id: ExamConfig,
                           ExamDuration: ExamDuration,
                           Institution_Id: this._List[_index]['Basic_Info']['Institution']['_id'],
                           Department_Id: this._List[_index]['Basic_Info']['Department']['_id'],
                        };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.AssignExam({ 'Info': Info }).subscribe(response => {
               const ResponseData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ResponseData['Status'] ) {
                  this._List[_index].Current_Status = 'Assigned';
                  this._List[_index].Current_Stage = 'Stage_3';
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'online Exam Successfully Assigned' });
               } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else if (response['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Candidate Exam Assign Error!, But not Identify!' });
               }
            });
         }
      });
   }


}
