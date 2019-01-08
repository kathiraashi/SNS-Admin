import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-model-personalinfo-nationality',
  templateUrl: './model-personalinfo-nationality.component.html',
  styleUrls: ['./model-personalinfo-nationality.component.css']
})
export class ModelPersonalinfoNationalityComponent implements OnInit {

  Type: String;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
