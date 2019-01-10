import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModelVacanciesConfigCreateComponent } from '../../../../Models/Settings/VacanciesConfig/model-vacancies-config-create/model-vacancies-config-create.component';
import { DeleteConfirmationComponent } from '../../../Common/delete-confirmation/delete-confirmation.component';

import { ConfirmationComponent } from './../../../Common/confirmation/confirmation.component';
import { VacanciesConfigService } from './../../../../Services/settings/VacanciesConfig/vacancies-config.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-vacancies-config-list',
  templateUrl: './vacancies-config-list.component.html',
  styleUrls: ['./vacancies-config-list.component.css']
})
export class VacanciesConfigListComponent implements OnInit {

   bsModalRef: BsModalRef;

   Loader: Boolean = true;
   _List: any[] = [];

   User_Id: any;

   Restricted_Institution: any = null;
   Restricted_Department: any = null;

   constructor(   private modalService: BsModalService,
                  private Service: VacanciesConfigService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService
               ) {
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
                  this.Loader = true;
                  this.Service.VacanciesConfig_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._List = DecryptedData;
                     } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Vacancies Config List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
   }

   // Create New Vacancies Config
   Create() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(ModelVacanciesConfigCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-75' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this._List.splice(0, 0, response['Response']);
         }
      });
   }

   // Edit Vacancies Config
   Edit(_index) {
      const initialState = { Type: 'Edit', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelVacanciesConfigCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-75' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            this._List[_index] = response['Response'];
         }
      });
   }

   // View Vacancies Config
   View(_index) {
      const initialState = { Type: 'View', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelVacanciesConfigCreateComponent, Object.assign({initialState}, { class: 'modal-lg max-width-75' }));
   }

   // Hide Vacancies Config
   Hide(_index) {
      const initialState = {  Type: 'Confirmation',
                              Header: 'Confirmation For Hide',
                              LineOne: 'Are you Sure?',
                              LineTwo: 'You Want to Hide the Vacancies Configuration?' };
      this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm min-width-350' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            const Data = { 'VacanciesConfig_Id' :  this._List[_index]._id, 'Modified_By' : this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.VacanciesConfig_Hide({'Info': Info}).subscribe( returnResponse => {
               const ResponseData = JSON.parse(returnResponse['_body']);
               if (returnResponse['status'] === 200 && ResponseData['Status'] ) {
                  this._List[_index].Active_Status = false;
                  this.Toastr.NewToastrMessage( { Type: 'Warning', Message: 'Vacancies Config Successfully Hided'} );
               } else if (returnResponse['status'] === 400 || returnResponse['status'] === 417 || returnResponse['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Some Error Occurred!, But not Identify!' } );
               }
            });
         }
      });
   }

   // UnHide Vacancies Config
   UnHide(_index) {
      const initialState = {  Type: 'Confirmation',
                              Header: 'Confirmation For Un-Hide',
                              LineOne: 'Are you Sure?',
                              LineTwo: 'You Want to Un-Hide the Vacancies Configuration?' };
      this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm min-width-350' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            const Data = { 'VacanciesConfig_Id' :  this._List[_index]._id, 'Modified_By' : this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.VacanciesConfig_UnHide({'Info': Info}).subscribe( returnResponse => {
               const ResponseData = JSON.parse(returnResponse['_body']);
               if (returnResponse['status'] === 200 && ResponseData['Status'] ) {
                  this._List[_index].Active_Status = true;
                  this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Vacancies Config Successfully UnHided'} );
               } else if (returnResponse['status'] === 400 || returnResponse['status'] === 417 || returnResponse['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Some Error Occurred!, But not Identify!' } );
               }
            });
         }
      });
   }


}
