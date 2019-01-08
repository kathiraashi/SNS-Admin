import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModelExamConfigCreateComponent } from '../../../../Models/Settings/ExamConfig/model-exam-config-create/model-exam-config-create.component';
import { DeleteConfirmationComponent } from '../../../Common/delete-confirmation/delete-confirmation.component';

import { ExamConfigService } from './../../../../Services/settings/ExamConfig/exam-config.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';
import * as CryptoJS from 'crypto-js';
import { LoginService } from './../../../../Services/LoginService/login.service';

@Component({
  selector: 'app-exam-config-list',
  templateUrl: './exam-config-list.component.html',
  styleUrls: ['./exam-config-list.component.css']
})
export class ExamConfigListComponent implements OnInit {

   bsModalRef: BsModalRef;

   Loader: Boolean = true;
   _List: any[] = [];

   User_Id: any;
   User_Type: any;

   constructor(   private modalService: BsModalService,
                  private Service: ExamConfigService,
                  private Toastr: ToastrService,
                  public Login_Service: LoginService
               ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];

                  const Query = { };
                  if (this.User_Type !== 'Admin' && this.User_Type !== 'Sub-Admin') {
                     Query['Institution'] = this.Login_Service.LoginUser_Info()['Institution']['_id'];
                     if (this.User_Type !== 'Principle') {
                        Query['Department'] = this.Login_Service.LoginUser_Info()['Department']['_id'];
                     }
                  }
                  const Data = { User_Id : this.User_Id, Query: Query };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Service.ExamConfig_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._List = DecryptedData.map(obj => {
                                       let Count = 0;
                                       obj.Config.map(obj_1 => {
                                          Count = Count + obj_1.NoOfQuestion;
                                          return obj_1;
                                       });
                                       obj.TotalNoOfQuestion = Count;
                                       return obj;
                                    });
                     } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else if (response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Exam Config List Getting Error!, But not Identify!' });
                     }
                  });
               }

   ngOnInit() {
   }

   // Create New Institution
   Create() {
      const initialState = { Type: 'Create' };
      this.bsModalRef = this.modalService.show(ModelExamConfigCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-75' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            let Count = 0;
            response['Response']['Config'].map(obj_1 => {
               Count = Count + obj_1.NoOfQuestion;
               return obj_1;
            });
            response['Response'].TotalNoOfQuestion = Count;
            this._List.splice(0, 0, response['Response']);
         }
      });
   }

   // Edit Institution
   Edit(_index) {
      const initialState = { Type: 'Edit', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelExamConfigCreateComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-75' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            let Count = 0;
            response['Response']['Config'].map(obj_1 => {
               Count = Count + obj_1.NoOfQuestion;
               return obj_1;
            });
            response['Response'].TotalNoOfQuestion = Count;
            this._List[_index] = response['Response'];
         }
      });
   }
   // View Institution
   View(_index) {
      const initialState = { Type: 'View', Data: this._List[_index] };
      this.bsModalRef = this.modalService.show(ModelExamConfigCreateComponent, Object.assign({initialState}, { class: 'modal-lg max-width-75' }));
   }
   // Delete Institution
   Delete(_index) {
      // const initialState = { Text: ' Institution ' };
      // this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      // this.bsModalRef.content.onClose.subscribe(response => {
      //    if (response.Status) {
      //       const Data = { 'Institution_Id' :  this._List[_index]._id, 'Modified_By' : this.User_Id };
      //       let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      //       Info = Info.toString();
      //       this.Service.ExamConfig_Delete({'Info': Info}).subscribe( returnResponse => {
      //          const ResponseData = JSON.parse(returnResponse['_body']);
      //          if (returnResponse['status'] === 200 && ResponseData['Status'] ) {
      //             this._List.splice(_index, 1);
      //             this.Toastr.NewToastrMessage( { Type: 'Warning', Message: 'Exam Config Successfully Deleted'} );
      //          } else if (returnResponse['status'] === 400 || returnResponse['status'] === 417 && !ResponseData['Status']) {
      //             this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
      //          } else if (returnResponse['status'] === 401 && !ResponseData['Status']) {
      //             this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
      //          } else {
      //             this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Some Error Occurred!, But not Identify!' } );
      //          }
      //       });
      //    }
      // });
   }


}
