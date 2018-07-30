import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-application',
  templateUrl: './main-application.component.html',
  styleUrls: ['./main-application.component.css']
})
export class MainApplicationComponent implements OnInit {
 Active_Tab = 'basic_info';
  constructor() { }

  ngOnInit() {
  }
Active_Tab_Change(name) {
  this.Active_Tab = name;
}
}
