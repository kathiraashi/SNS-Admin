import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


import { ModelUserCreateUserManagementComponent } from './../../../../Models/Settings/UserManagement/model-user-create-user-management/model-user-create-user-management.component';
import { ModelUserManagementEditComponent } from './../../../../Models/Settings/UserManagement/model-user-management-edit/model-user-management-edit.component';
import { ModelUserManagementViewComponent } from './../../../../Models/Settings/UserManagement/model-user-management-view/model-user-management-view.component';

import { ConfirmationComponent } from './../../../Common/confirmation/confirmation.component';

import { AdminService } from './../../../../Services/Admin/admin.service';
import { LoginService } from './../../../../Services/LoginService/login.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-user-management-list',
  templateUrl: './user-management-list.component.html',
  styleUrls: ['./user-management-list.component.css']
})
export class UserManagementListComponent implements OnInit {


   bsModalRef: BsModalRef;

   _List: any[] = [];
   User_Id: any;

   Restricted_Institution: any = null;
   Restricted_Department: any = null;

   constructor(
               private modalService: BsModalService,
               private Service: AdminService,
               private Login_Service: LoginService,
               private Toastr: ToastrService
            ) {
               //  Get Users List
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
               this.Restricted_Institution = this.Login_Service.LoginUser_Info()['Institution'];
               this.Restricted_Department = this.Login_Service.LoginUser_Info()['Department'];

               const Query = { };
               if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
                  Query['Institution'] = this.Restricted_Institution['_id'];
                  if (this.Restricted_Department !== null && this.Restricted_Department !== undefined) {
                     Query['Department'] = this.Restricted_Department['_id'];
                  }
               }
               const Data = { User_Id : this.User_Id, Query: Query };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Service.Users_List({'Info': Info}).subscribe( response => {
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                     const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                     this._List = DecryptedData;
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                     this.Toastr.NewToastrMessage( { Type: 'Error', Message: response['Message'] } );
                  } else if (response['status'] === 401 && !ResponseData['Status']) {
                    this.Toastr.NewToastrMessage( { Type: 'Error', Message: response['Message'] } );
                  } else {
                     this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Users List Getting Error!, Error not Identify!' } );
                  }
               });
            }

   ngOnInit() {
   }

   CreateUser() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(ModelUserCreateUserManagementComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this._List.splice(0, 0, response['Response']);
         }
      });
   }

   EditUser(_index: any) {
      const initialState = { Type: 'Edit', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelUserManagementEditComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this._List[_index] = response['Response'];
         }
      });
   }

   ViewUser(_index: any) {
      const initialState = { Type: 'View', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelUserManagementViewComponent, Object.assign({initialState}, {class: 'modal-lg max-width-85' }));
   }

   DeactivateUser(_index: any) {
      const initialState = { Type: 'Confirmation',
                              Header: 'User Blocking',
                              LineOne: 'Are you Sure?',
                              LineTwo: 'You Want to Block this User?' };
      this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      this.bsModalRef.content.onClose.subscribe(confirmation => {
         if (confirmation.Status) {
            const Data = {'User_Id' : this._List[_index]._id, 'Modified_By': this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.User_Deactivate({ 'Info': Info }).subscribe(response => {
               const ResponseData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ResponseData['Status'] ) {
                  this._List[_index].Active_Status = false;
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: ResponseData['Message'] });
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'User Blocking Error!, But not Identify!' });
               }
            });
         }
      });
   }

   ActivateUser(_index: any) {
      const initialState = { Type: 'Confirmation',
                              Header: 'User UnBlocking',
                              LineOne: 'Are you Sure?',
                              LineTwo: 'You Want to UnBlock this User?' };
      this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      this.bsModalRef.content.onClose.subscribe(confirmation => {
         if (confirmation.Status) {
            const Data = {'User_Id' : this._List[_index]._id, 'Modified_By': this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.User_Activate({ 'Info': Info }).subscribe(response => {
               const ResponseData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ResponseData['Status'] ) {
                  this._List[_index].Active_Status = true;
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: ResponseData['Message'] });
               } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'User UnBlocking Error!, But not Identify!' });
               }
            });
         }
      });
   }

}
