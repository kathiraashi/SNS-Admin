import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CandidatesService } from './../../../Services/Applications/candidates.service';

@Component({
  selector: 'app-main-application',
  templateUrl: './main-application.component.html',
  styleUrls: ['./main-application.component.css']
})
export class MainApplicationComponent implements OnInit {

   Active_Tab = 'Basic&Personal_info';

   Loader: Boolean = true;

   Candidate_Id;

   _Data: Object = {};

   constructor(
               public Service: CandidatesService,
               private active_route: ActivatedRoute
            ) {
               this.active_route.url.subscribe((u) => {
                  this.Candidate_Id = this.active_route.snapshot.params['Candidate_Id'];
                  this.Service.Candidate_View({User_Id: '123', Candidate_Id: this.Candidate_Id}).subscribe(response => {
                     this.Loader = false;
                     if (response['status'] === 200) {
                        this._Data = JSON.parse(JSON.parse(response['_body'])['Response']);
                     }
                  });
               });
    }

   ngOnInit() {

   }

   Active_Tab_Change(name) {
      this.Active_Tab = name;
   }
}
