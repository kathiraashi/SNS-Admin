import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-personal-info',
  templateUrl: './main-personal-info.component.html',
  styleUrls: ['./main-personal-info.component.css']
})
export class MainPersonalInfoComponent implements OnInit {
Active_Tab = 'Nationality';
  constructor() { }

  ngOnInit() {
  }
Active_Tab_Change(name) {
  this.Active_Tab = name;
}
}
