import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-personalinfo-community',
  templateUrl: './model-personalinfo-community.component.html',
  styleUrls: ['./model-personalinfo-community.component.css']
})
export class ModelPersonalinfoCommunityComponent implements OnInit {

  Type: String;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
