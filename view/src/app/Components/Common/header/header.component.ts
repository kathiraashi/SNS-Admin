import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  _Colleges: any[] = [ 'SNS College of Technology',
                        'SNS College of Engineering',
                        'SNS College of Ars and Science',
                        'SNS College of Education',
                        'SNS Academy',
                      ];
  constructor() { }

  ngOnInit() {
  }

}
