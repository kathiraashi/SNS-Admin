import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-experience-activities-application',
  templateUrl: './experience-activities-application.component.html',
  styleUrls: ['./experience-activities-application.component.css']
})
export class ExperienceActivitiesApplicationComponent implements OnInit {

   @Input() CandidateData: Object;

   constructor() { }

   ngOnInit() {
   }

}
