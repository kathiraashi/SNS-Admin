import { Component, OnInit } from '@angular/core';

import { LoginService } from './../../../Services/LoginService/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   User_Type: any;

   constructor(public Login_Service: LoginService) {
      this.User_Type = this.Login_Service.LoginUser_Info()['User_Type'];
   }

   ngOnInit() {
   }

}
