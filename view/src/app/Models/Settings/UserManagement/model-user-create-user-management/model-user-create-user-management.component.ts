import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

import { LoginService } from './../../../../Services/LoginService/login.service';
import { AdminService  } from './../../../../Services/Admin/admin.service';
import { ToastrService } from './../../../../Services/common-services/toastr-service/toastr.service';

@Component({
  selector: 'app-model-user-create-user-management',
  templateUrl: './model-user-create-user-management.component.html',
  styleUrls: ['./model-user-create-user-management.component.css']
})
export class ModelUserCreateUserManagementComponent implements OnInit {

   onClose: Subject<any>;

   Type: String;
   Data;
   _Colleges: any[] = [ 'SNS College of Technology',
                        'SNS College of Engineering',
                        'SNS College of Ars and Science',
                        'SNS College of Education',
                        'SNS Academy',
                     ];
   _Departments: any[] = [
                           'Aeronautical Engineering',
                           'Agriculture Engineering',
                           'Automobile Engineering',
                           'Biomedical Engineering',
                           'Civil Engineering',
                           'Civil Engineering and Planning',
                           'Computer Science Engineering',
                           'Electrical and Electronics Engineering',
                           'Electronics and Communication Engineering',
                           'Electronics and Instrumentation Engineering',
                           'Information Technology',
                           'Mechanical Engineering',
                           'Mechanical and Automation Engineering',
                           'Mechatronics Engineering',
                           'Master of Business Administration',
                           'Master of Computer Application',
                           'Science & Humanities',
                           'Department of Physical Education',
                        ];
   _UserTypes: any[] =  ['Admin', 'Sub-Admin', 'Principle', 'HOD', 'Assistant-Professor', 'User'];


   ShowCollege: Boolean = false;
   ShowDepartment: Boolean = false;

   User_Id;

   Form: FormGroup;

  constructor(
               public bsModalRef: BsModalRef,
               public Login_Service: LoginService,
               public Service: AdminService,
               private Toastr: ToastrService
            ) {
               this.User_Id = this.Login_Service.LoginUser_Info()['_id'];
            }

   ngOnInit() {
      this.onClose = new Subject();

      this.Form = new FormGroup({
         User_Id: new FormControl(this.User_Id ),
         User_Name: new FormControl('', { validators: Validators.required,
                                          asyncValidators: [this.UserNameAsyncValidate.bind(this)],
                                          updateOn: 'blur' }),
         User_Password: new FormControl('', Validators.required),
         Name: new FormControl('', Validators.required ),
         Email: new FormControl('', [Validators.required, Validators.email]),
         Phone: new FormControl(''),
         User_Type: new FormControl(null, Validators.required),
      });
   }

   UserNameAsyncValidate( control: AbstractControl ) {
      const Data = { User_Id: this.User_Id, User_Name: control.value };
      let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
      Info = Info.toString();
      return this.Service.User_Name_Validate({'Info': Info}).pipe(map( response => {
         const ReceivingData = JSON.parse(response['_body']);
         if (response['status'] === 200 && ReceivingData['Status'] && ReceivingData['Available']) {
            return null;
         } else {
            return { UserName_NotAvailable: true};
         }
      }));
   }

   TypeChange() {
      const Type = this.Form.controls['User_Type'].value;
      if (Type === 'HOD' || Type === 'Assistant-Professor' || Type === 'User') {
         this.ShowCollege = true;
         this.ShowDepartment = true;
         this.Form.setControl('College', new FormControl(null, Validators.required));
         this.Form.setControl('Department', new FormControl(null, Validators.required));
      } else if (Type === 'Principle' ) {
         this.ShowCollege = true;
         this.ShowDepartment = false;
         this.Form.setControl('College', new FormControl(null, Validators.required));
         this.Form.removeControl('Department');
      } else {
         this.ShowCollege = false;
         this.ShowDepartment = false;
         this.Form.removeControl('College');
         this.Form.removeControl('Department');
      }
   }


   submit() {
      if (this.Form.valid) {
         const Data = this.Form.value;
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.Service.User_Create({'Info': Info}).subscribe( response => {
            const ReceivingData = JSON.parse(response['_body']);
            if (response['status'] === 200 && ReceivingData['Status']) {
               const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
               const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
               this.onClose.next({Status: true, Response: DecryptedData});
               this.bsModalRef.hide();
            } else if (response['status'] === 400 && !ReceivingData['Status']) {
               this.onClose.next({Status: false, Message: 'Bad Request Error!'});
               this.bsModalRef.hide();
            } else if (response['status'] === 417 && !ReceivingData['Status']) {
               this.onClose.next({Status: false, Message: 'Industry Type Query Error!'});
               this.bsModalRef.hide();
            } else {
               this.onClose.next({Status: false, Message: 'UnExpected Error!'});
               this.bsModalRef.hide();
            }
         });
      }
   }

}
