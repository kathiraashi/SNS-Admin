import { Component, OnInit } from '@angular/core';

import { LoginService } from './../../../Services/LoginService/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   User_Type: any;
   Q_A_Permission: any;
   BasicConfig_Permission: any;
   AdvancedConfig_Permission: any;
   UserManagement_Permission: any;

   constructor(public Login_Service: LoginService) {
      this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
      this.Q_A_Permission = this.Login_Service.LoginUser_Info()['Q_A_Permission'];
      this.BasicConfig_Permission = this.Login_Service.LoginUser_Info()['BasicConfig_Permission'];
      this.AdvancedConfig_Permission = this.Login_Service.LoginUser_Info()['AdvancedConfig_Permission'];
      this.UserManagement_Permission = this.Login_Service.LoginUser_Info()['UserManagement_Permission'];

   }

   ngOnInit() {
   }

}
