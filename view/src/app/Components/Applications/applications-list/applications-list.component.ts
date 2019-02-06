import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import {MatMenuTrigger} from '@angular/material';
import { formatDate  } from '@angular/common';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as CryptoJS from 'crypto-js';

import { ConfirmationComponent } from './../../Common/confirmation/confirmation.component';
import { DeleteConfirmationComponent } from '../../../Components/Common/delete-confirmation/delete-confirmation.component';
import { ApplicationForwardComponent } from '../../../Models/Applications/application-forward/application-forward.component';
import { ToastrService } from './../../../Services/common-services/toastr-service/toastr.service';
import { CandidatesService } from './../../../Services/Applications/candidates.service';
import { LoginService } from './../../../Services/LoginService/login.service';
import { AddApplicationComponent } from './../../../Models/Applications/add-application/add-application.component';

import { ExcelService } from './../../../Services/excel-export/excel-export.service';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationsListComponent implements OnInit {

   @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
   @ViewChild('TableSection') TableSection: ElementRef;
   @ViewChild('TableHeaderSection') TableHeaderSection: ElementRef;
   @ViewChild('TableBodySection') TableBodySection: ElementRef;
   @ViewChild('TableFooterSection') TableFooterSection: ElementRef;
   @ViewChild('TableLoaderSection') TableLoaderSection: ElementRef;


      // Pagination Keys
      Current_Index = 1;
      Skip_Count = 0;
      Limit_Count = 10;
      Showing_Text = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
      Pages_Array = [];
      Total_Rows = 0;
      New_Rows = 0;
      Last_Creation: Date = new Date();
      Page_Previous: Object = { Disabled: true, value : 0, Class: 'PagePrev_Disabled'};
      Page_Next: Object = { Disabled: true, value : 0, Class: 'PageNext_Disabled'};
      SubLoader: Boolean = false;

   bsModalRef: BsModalRef;
   bsModalRef_StageOne: BsModalRef;

   Loader: Boolean = true;
   AllExporting: Boolean = false;
   User_Id: any;

   Restricted_Institution: any = null;
   Restricted_Department: any = null;
   Application_Handle: Boolean = false;


   _List: any[] = [];
   _CompleteList: any[] = [];
   _Menus: any[] = [ { name: 'Verify & Accepted', activity: 'Accepted', show: true },
                     { name: 'Assign Online Exam', activity: 'AssignExam', show: true },
                     { name: 'Refer', activity: 'Refer', show: true }];
   Temp_Menu: any[] = [];
   ActionId: any;

   _Institutions: any[] = [];
   _Departments: any[] = [];
   _Categories: any[] = [];

   constructor( public Service: CandidatesService,
               private Toastr: ToastrService,
               private router: Router,
               public Login_Service: LoginService,
               private modalService: BsModalService,
               private excelService: ExcelService,
               private renderer: Renderer,
            ) {
                  this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
                  this.Restricted_Institution = this.Login_Service.LoginUser_Info()['Institution'];
                  this.Restricted_Department = this.Login_Service.LoginUser_Info()['Department'];
                  this.Application_Handle = this.Login_Service.LoginUser_Info()['ApplicationManagement_Permission'];

                  this.Service_Loader();
       }

   ngOnInit() {

   }


   Service_Loader() {
      const Query = { };
      if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
         Query['Institution'] = this.Restricted_Institution['_id'];
         if (this.Restricted_Department !== null && this.Restricted_Department !== undefined) {
            Query['Department'] = this.Restricted_Department['_id'];
         }
      }
      const Data = { 'User_Id' : this.User_Id,
                     'Skip_Count': this.Skip_Count,
                     'Limit_Count': this.Limit_Count,
                     'Last_Creation' : this.Last_Creation,
                     'Query': Query };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Service.CandidatesList({'Info': Info}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         this.Loader = false;
         this.renderer.setElementStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            const SubCryptoBytes  = CryptoJS.AES.decrypt(ResponseData['SubResponse'], 'SecretKeyOut@123');
            const SubDecryptedData = JSON.parse(SubCryptoBytes.toString(CryptoJS.enc.Utf8));
            this._List = DecryptedData;
            this._List = this._List.map(obj => {
               obj.BtnLoading = false;
               return obj;
            });
            this.Total_Rows = SubDecryptedData['Total_Datas'];
            this.New_Rows = SubDecryptedData['New_Datas'];
            this.Pagination_Affect();
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Candidate List Getting Error!, But not Identify!' });
         }
      });
   }

   Pagination_Affect() {
      const NoOfArrays = Math.ceil(this.Total_Rows / this.Limit_Count);
      const Prev_Class = (this.Current_Index > 1 ? 'PagePrev_Enabled' : 'PagePrev_Disabled');
      this.Page_Previous = { Disabled: !(this.Current_Index > 1), Value : (this.Current_Index - 1), Class: Prev_Class};
      const Next_Class = (this.Current_Index < NoOfArrays ? 'PageNext_Enabled' : 'PageNext_Disabled');
      this.Page_Next = { Disabled: !(this.Current_Index < NoOfArrays), Value : (this.Current_Index + 1), Class: Next_Class};
      this.Pages_Array = [];
      for (let index = 1; index <= NoOfArrays ; index++) {
         if (index === 1) {
            this.Pages_Array.push({Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.Current_Index === index ) });
         }
         if (index > 1 && NoOfArrays > 2 && index < NoOfArrays ) {
            if (index === (this.Current_Index - 2)) {
               this.Pages_Array.push({Text: '...', Class: 'Dots', Show: true, Active: false });
            }
            if (index === (this.Current_Index - 1) ) {
               this.Pages_Array.push({Text: (this.Current_Index - 1).toString(), Class: 'Number',  Value: index, Show: true, Active: false });
            }
            if (index === this.Current_Index) {
               this.Pages_Array.push({Text: this.Current_Index.toString(), Class: 'Number', Value: index, Show: true, Active: true });
            }
            if (index === (this.Current_Index + 1) ) {
               this.Pages_Array.push({Text: (this.Current_Index + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
            }
            if (index === (this.Current_Index + 2)) {
               this.Pages_Array.push({Text: '...', Class: 'Dots', Show: true, Active: false });
            }
         }
         if (index === NoOfArrays && NoOfArrays > 1) {
            this.Pages_Array.push({Text: NoOfArrays.toString(), Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.Current_Index === index ) });
         }
      }
      let To_Count = this.Skip_Count + this.Limit_Count;
      if (To_Count > this.Total_Rows) { To_Count = this.Total_Rows; }
      this.Showing_Text = 'Showing <span>' + this.Skip_Count + '</span> to <span>' + To_Count + '</span> out of <span>' + this.Total_Rows + '</span>  entries';
   }

   Short_Change(Num) {
      if (this.Limit_Count !== Num) {
         this.Limit_Count = Num;
         this.Pagination_Action(1);
      }
   }
   Pagination_Action(_index) {
      this.Current_Index = _index;
      this.Skip_Count = this.Limit_Count * (this.Current_Index - 1);
      this.Service_Loader();
      setTimeout(() => {
         const Top = this.TableHeaderSection.nativeElement.offsetHeight + 2;
         const Height = this.TableBodySection.nativeElement.offsetHeight - 1;
         this.renderer.setElementStyle(this.TableLoaderSection.nativeElement, 'display', 'block');
         this.renderer.setElementStyle(this.TableLoaderSection.nativeElement, 'height', Height + 'px');
         this.renderer.setElementStyle(this.TableLoaderSection.nativeElement, 'line-height', Height + 'px');
         this.renderer.setElementStyle(this.TableLoaderSection.nativeElement, 'top', Top + 'px');
      }, 10);
   }

   exportAsXLSX(): void {

      const data = [];
      this._List.map(obj => {
         const return_obj = {};
         return_obj['Name'] = obj['Personal_Info']['Name'];
         return_obj['Date-of-Birth'] = formatDate(obj['Personal_Info']['DOB'], 'dd-MM-yyyy', 'en-US', '+0530');
         return_obj['Age'] = obj['Personal_Info']['Age'];
         return_obj['Gender'] = obj['Personal_Info']['Gender'];
         return_obj['Email'] = obj['Personal_Info']['Email'];
         return_obj['Mobile'] = obj['Personal_Info']['Contact_No'];
         return_obj['Institution'] = obj['Basic_Info']['Institution']['Institution'];
         return_obj['Department'] = obj['Basic_Info']['Department']['Department'];
         return_obj['Designation'] = obj['Basic_Info']['Post_Applied']['Designation'];
         return_obj['Reference-Id'] = obj['Ref_ID'];
         return_obj['Status'] = obj['Current_Status'];
         return_obj['Created-Date'] = formatDate(obj['createdAt'], 'dd-MM-yyyy hh:mm a', 'en-US', '+0530');
         data.push(return_obj);
      });
      this.excelService.exportAsExcelFile(data, 'Candidates');
    }

   Complete_Export() {
      this.AllExporting = true;
      const Query = { };
      if (this.Restricted_Institution !== null && this.Restricted_Institution !== undefined) {
         Query['Institution'] = this.Restricted_Institution['_id'];
         if (this.Restricted_Department !== null && this.Restricted_Department !== undefined) {
            Query['Department'] = this.Restricted_Department['_id'];
         }
      }
      const Data = { 'User_Id' : this.User_Id, 'Query': Query };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      this.Service.Complete_CandidatesList({'Info': Info}).subscribe( response => {
         const ResponseData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ResponseData['Status'] ) {
            const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
            const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
            this._CompleteList = DecryptedData;
            const data = [];
            this._CompleteList.map(obj => {
               const return_obj = {};
               return_obj['Name'] = obj['Personal_Info']['Name'];
               return_obj['Date-of-Birth'] = formatDate(obj['Personal_Info']['DOB'], 'dd-MM-yyyy', 'en-US', '+0530');
               return_obj['Age'] = obj['Personal_Info']['Age'];
               return_obj['Gender'] = obj['Personal_Info']['Gender'];
               return_obj['Email'] = obj['Personal_Info']['Email'];
               return_obj['Mobile'] = obj['Personal_Info']['Contact_No'];
               return_obj['Institution'] = obj['Basic_Info']['Institution']['Institution'];
               return_obj['Department'] = obj['Basic_Info']['Department']['Department'];
               return_obj['Designation'] = obj['Basic_Info']['Post_Applied']['Designation'];
               return_obj['Reference-Id'] = obj['Ref_ID'];
               return_obj['Status'] = obj['Current_Status'];
               return_obj['Created-Date'] = formatDate(obj['createdAt'], 'dd-MM-yyyy hh:mm a', 'en-US', '+0530');
               data.push(return_obj);
            });
            this.AllExporting = false;
            this.excelService.exportAsExcelFile(data, 'Candidates');
         } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Candidate List Getting Error!, But not Identify!' });
         }
      });
   }

   SetActionId(_index) {
      this.ActionId = this._List[_index]._id;
      if (this._List[_index].Current_Stage === 'Stage_1' ) {
         this.Temp_Menu = [   {  name: 'Verify & Accepted', activity: 'Accepted', show: true },
                              { name: 'Refer', activity: 'Refer', show: true },
                              { name: 'Delete', activity: 'Delete', show: true } ];
      }
      if (this._List[_index].Current_Stage === 'Stage_2' ) {
         this.Temp_Menu = [   { name: 'Assign Online Exam', activity: 'AssignExam', show: true },
                              { name: 'Refer', activity: 'Refer', show: true },
                              { name: 'Delete', activity: 'Delete', show: true } ];
      }
      if (this._List[_index].Current_Stage !== 'Stage_1' && this._List[_index].Current_Stage !== 'Stage_2' ) {
         this.Temp_Menu = [   { name: 'Refer', activity: 'Refer', show: true },
                              { name: 'Delete', activity: 'Delete', show: true } ];
      }
      if (this._List[_index].If_Referred_To) {
         this.Temp_Menu = [];
      }
      if (this._List[_index].If_Referred_From && !this._List[_index].If_Referred_Accepted) {
         this.Temp_Menu = [   { name: 'Accept Referral', activity: 'AcceptRefer', show: true },
                              { name: 'Delete', activity: 'Delete', show: true }
                           ];
      }
      if (this._List[_index].ApplicationFromAdmin) {
         this.Temp_Menu = this.Temp_Menu.filter(obj => obj.name !== 'Refer');
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
            } else {
               this._List[_index].BtnLoading = false;
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

      if (Action === 'Refer') {
         this._List[_index].BtnLoading = false;
         const initialState = { Data: this._List[_index] };
         this.bsModalRef = this.modalService.show(ApplicationForwardComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-md' }));
         this.bsModalRef.content.onClose.subscribe(confirmation => {
            if (confirmation.Status) {
               this._List[_index] = confirmation.Response;
            }
         });
      }

      if (Action === 'AcceptRefer') {
         const initialState = { Type: 'Confirmation',
                                 Header: 'Accept Referred Application',
                                 LineOne: 'Are you Sure?',
                                 LineTwo: 'You Want to Accept Referred Candidate Application' };
         this.bsModalRef = this.modalService.show(ConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-md' }));
         this.bsModalRef.content.onClose.subscribe(confirmation => {
            if (confirmation.Status) {
               const Data = {'User_Id' : this.User_Id, 'Candidate_Id': this.ActionId };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Service.Accept_Referred({ 'Info': Info }).subscribe(response => {
                  this._List[_index].BtnLoading = false;
                  const ResponseData = JSON.parse(response['_body']);
                  this._List[_index].BtnLoading = false;
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     this._List[_index].If_Referred_Accepted = true;
                     this._List[_index].Current_Status = 'Referred Accepted';
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status'] || response['status'] === 401) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Candidate Delete Error!, But not Identify!' });
                  }
               });
            } else {
               this._List[_index].BtnLoading = false;
            }
         });
      }


      if (Action === 'Delete') {
         const initialState = { Text: ' This Candidate?' };
         this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-sm min-width-350' }));
         this.bsModalRef.content.onClose.subscribe(confirmation => {
            if (confirmation.Status) {
               const Data = {'Modified_By' : this.User_Id, 'Candidate_Id': this.ActionId };
               let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
               Info = Info.toString();
               this.Service.Delete_Candidate({ 'Info': Info }).subscribe(response => {
                  this._List[_index].BtnLoading = false;
                  const ResponseData = JSON.parse(response['_body']);
                  if (response['status'] === 200 && ResponseData['Status'] ) {
                     this._List.splice(_index, 1);
                     this.Toastr.NewToastrMessage( { Type: 'Warning', Message: 'Candidate Successfully Deleted'} );
                  } else if (response['status'] === 400 || response['status'] === 417 && !ResponseData['Status'] || response['status'] === 401) {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                  } else {
                     this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Referred Candidate Accept Update Error!, But not Identify!' });
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


   CreateApplication() {
      const initialState = {
         Type: 'Create'
      };
      this.bsModalRef = this.modalService.show(AddApplicationComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-70' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            response.Response['BtnLoading'] = false;
            this._List.splice(0, 0, response.Response);
         }
      });
   }


}
