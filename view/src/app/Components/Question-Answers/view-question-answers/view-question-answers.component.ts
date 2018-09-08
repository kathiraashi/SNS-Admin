import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
   User_Type;

   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Categories: any[] = [];

   Institution = null;
   Department = null;
   Category = null;

   _List: any[] = [];
   _FilteredList: any[] = [];

   bsModalRef: BsModalRef;
   constructor(private modalService: BsModalService,
      public Service: QuestionAndAnswerService,
      private Toastr: ToastrService,
      public Categories_Service: CategoriesService,
      public Department_Service: DepartmentService,
      public Institution_Service: InstitutionService,
      public Login_Service: LoginService) {
         this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
      }

   ngOnInit() {
      const Data = {'User_Id' : this.User_Id };
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
      this.Department_Service.Department_SimpleList({ 'Info': Info }).subscribe(response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._Departments = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Departments List Getting Error!, But not Identify!' });
         }
      });
      this.Institution_Service.Institution_SimpleList({ 'Info': Info }).subscribe(response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._Institutions = DecryptedData;
         } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else if (response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Departments List Getting Error!, But not Identify!' });
         }
      });
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
            this._List.splice(0, 0, response.Response);
            this.FilterChange();
         }
      });
   }

   EditQuestionAnswers(_index) {
      const initialState = {
      Type: 'Edit'
      };
      this.bsModalRef = this.modalService.show(ModelEditQuestionAnswersComponent, Object.assign({initialState}, { class: 'modal-lg max-width-70' }));
   }

   DeleteQuestion() {
      const initialState = {
      Text: 'Question'
      };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
   }
}
