import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';
import { LoginService } from './../../../Services/LoginService/login.service';
import { QuestionAndAnswerService } from './../../../Services/QuestionAndAnswer/question-and-answer.service';

import { ModelExcelUploadsViewComponent } from '../../../Models/QuestionAnswers/model-excel-uploads-view/model-excel-uploads-view.component';
import { ModelEditQuestionAnswersComponent } from '../../../Models/QuestionAnswers/model-edit-question-answers/model-edit-question-answers.component';
import { DeleteConfirmationComponent } from '../../../Components/Common/delete-confirmation/delete-confirmation.component';

import { CategoriesService } from './../../../Services/settings/categories/categories.service';
import { DepartmentService } from './../../../Services/settings/department/department.service';
import { InstitutionService } from './../../../Services/settings/institution/institution.service';

import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;

@Component({
  selector: 'app-view-question-answers',
  templateUrl: './view-question-answers.component.html',
  styleUrls: ['./view-question-answers.component.css']
})
export class ViewQuestionAnswersComponent implements OnInit {

   @ViewChild('fileInputFile') fileInputFile: ElementRef;

   Loader: Boolean = true;
   FilterLoading: Boolean = false;
   User_Id;

   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Categories: any[] = [];

   Institution = null;
   Department = null;
   Category = null;

   Restricted_Institution: any = null;
   Restricted_Department: any = null;

   _List: any[] = [];
   _FilteredList: any[] = [];

   ZoomImage: Boolean = false;
   ZoomedImage = '';

   bsModalRef: BsModalRef;
   constructor(private modalService: BsModalService,
      public Service: QuestionAndAnswerService,
      private Toastr: ToastrService,
      public Categories_Service: CategoriesService,
      public Department_Service: DepartmentService,
      public Institution_Service: InstitutionService,
      public Login_Service: LoginService) {
         this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
         this.Restricted_Institution = this.Login_Service.LoginUser_Info()['Institution'];
         this.Restricted_Department = this.Login_Service.LoginUser_Info()['Department'];
      }

   ngOnInit() {
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
      this.Service.Questions_List({ 'Info': Info }).subscribe(response => {
         const ResponseData = JSON.parse(response['_body']);
         this.Loader = false;
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._List = DecryptedData;
            this._FilteredList = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Creating Customer Getting Error!, But not Identify!' });
         }
      });
      this.Categories_Service.Category_SimpleList({ 'Info': Info }).subscribe(response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._Categories = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Categories List Getting Error!, But not Identify!' });
         }
      });
      if (this.Restricted_Department === null || this.Restricted_Department === undefined) {
         this.Institution_Service.Institution_List({'Info': Info}).subscribe( response => {
            const ResponseData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ResponseData['Status'] ) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
                  this._Institutions = DecryptedData.filter(obj => obj._id === this.Restricted_Institution['_id'] );
                  this._Departments = this._Institutions[0].Departments;
                  this.Institution = this.Restricted_Institution['_id'];
               } else {
                  this._Institutions = DecryptedData;
               }
            } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
            } else if (response['status'] === 401 && !ResponseData['Status']) {
               this.Toastr.NewToastrMessage({ Type: 'Error',  Message: ResponseData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Institutions List Getting Error!, But not Identify!' });
            }
         });
      } else {
         this._Institutions = [this.Restricted_Institution];
         setTimeout(() => {
            this.Institution = this.Restricted_Institution['_id'];
         }, 100);
         this._Departments = [this.Restricted_Department];
         setTimeout(() => {
            this.Department = this.Restricted_Department['_id'];
         }, 100);
      }
   }


   InstitutionChange() {
      this.Department = null;
      this._Departments = [];
      if (this.Institution !== '' && this.Institution !== null && this.Institution !== undefined) {
         if ((this.Restricted_Institution === null || this.Restricted_Institution === undefined) && (this.Restricted_Institution === null || this.Restricted_Institution === undefined))  {
            const _index = this._Institutions.findIndex(obj => obj._id === this.Institution );
            this._Departments = this._Institutions[_index].Departments;
         }
      }
   }

   FilterChange() {
      this.FilterLoading = true;
      let Temp_FilteredList = this._List;
      if (this.Institution !== null) {
         Temp_FilteredList = Temp_FilteredList.filter(obj => obj.Institution['_id'] === this.Institution);
      }
      if (this.Department !== null) {
         Temp_FilteredList = Temp_FilteredList.filter(obj => obj.Department['_id'] === this.Department);
      }
      if (this.Category !== null) {
         Temp_FilteredList = Temp_FilteredList.filter(obj => obj.Category['_id'] === this.Category);
      }
      setTimeout(() => {
         this._FilteredList = Temp_FilteredList;
         this.FilterLoading = false;
      }, 500);
   }

   onUploadFileChange(event) {
      const reader = new FileReader();
      const target = event.target;
      let Result = [];
      reader.onload = function() {
         const fileData = reader.result;
         const WorkBook = XLSX.read(fileData, {type : 'binary'});
         const FirstSheet = WorkBook.SheetNames[0];
         Result = XLSX.utils.sheet_to_json(WorkBook.Sheets[FirstSheet]);
      };
      setTimeout(() => {
         if (Result.length > 0) {
            this.UploadedFileView(Result);
         }
      }, 500);
      reader.readAsBinaryString(target.files[0]);
   }

   UploadedFileView(_Data) {
      this.fileInputFile.nativeElement.value = '';
      const initialState = {
         _Data: _Data
      };
      this.bsModalRef = this.modalService.show(ModelExcelUploadsViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-85' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response['Status']) {
            const Data = {'User_Id' : this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Questions_List({ 'Info': Info }).subscribe(response_1 => {
               const ResponseData = JSON.parse(response_1['_body']);
               if (response_1['status'] === 200 && ResponseData['Status'] ) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this._List = DecryptedData;
                  this._FilteredList = DecryptedData;
                  this.FilterChange();
               } else if (response_1['status'] === 400 || response_1['status'] === 417 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else if (response_1['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Creating Customer Getting Error!, But not Identify!' });
               }
            });
         }
      });
   }

   CreateQuestionAnswers() {
      const initialState = {
         Type: 'Create'
      };
      this.bsModalRef = this.modalService.show(ModelEditQuestionAnswersComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-70' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            this._FilteredList.splice(0, 0, response.Response);
            this.FilterChange();
         }
      });
   }

   DeleteQuestion(_index) {
      const initialState = { Text: ' Question ' };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            const Data = { 'Question_Id' :  this._FilteredList[_index]._id, 'Modified_By' : this.User_Id };
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.Service.Question_Delete({'Info': Info}).subscribe( returnResponse => {
               const ResponseData = JSON.parse(returnResponse['_body']);
               if (returnResponse['status'] === 200 && ResponseData['Status'] ) {
                  this._FilteredList.splice(_index, 1);
                  this.Toastr.NewToastrMessage( { Type: 'Warning', Message: 'Question Successfully Deleted'} );
               } else if (returnResponse['status'] === 400 || returnResponse['status'] === 417 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
               } else if (returnResponse['status'] === 401 && !ResponseData['Status']) {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: ResponseData['Message'] } );
               } else {
                  this.Toastr.NewToastrMessage( { Type: 'Error', Message: 'Some Error Occurred!, But not Identify!' } );
               }
            });
         }
      });
   }


   ImgZoom(_ImgName) {
      this.ZoomedImage = _ImgName;
      this.ZoomImage = true;
   }

   ImgZoomHide() {
      this.ZoomedImage = '';
      this.ZoomImage = false;
   }
}
