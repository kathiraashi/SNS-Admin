import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-model-user-management-view',
  templateUrl: './model-user-management-view.component.html',
  styleUrls: ['./model-user-management-view.component.css']
})
export class ModelUserManagementViewComponent implements OnInit {

   Data: any;

   constructor(public bsModalRef: BsModalRef) { }

   ngOnInit() {
   }

}
