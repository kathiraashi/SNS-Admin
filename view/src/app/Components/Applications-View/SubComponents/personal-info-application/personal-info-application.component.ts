import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-personal-info-application',
  templateUrl: './personal-info-application.component.html',
  styleUrls: ['./personal-info-application.component.css']
})
export class PersonalInfoApplicationComponent implements OnInit {

  @Input() CandidateData: Object;

  constructor() { }

  ngOnInit() {
  }

}
