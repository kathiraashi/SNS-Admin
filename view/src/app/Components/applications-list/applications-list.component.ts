import { Component, OnInit } from '@angular/core';
import { CandidatesService } from './../../Services/Applications/candidates.service';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.css']
})
export class ApplicationsListComponent implements OnInit {

   Loader: Boolean = true;

   _List: any[] = [];

   constructor( public Service: CandidatesService ) { }

   ngOnInit() {
      this.Service.CandidatesList({User_Id: '123'}).subscribe(response => {
         this.Loader = false;
         if (response['status'] === 200) {
            this._List = JSON.parse(JSON.parse(response['_body'])['Response']);
         }
      });
   }

}
