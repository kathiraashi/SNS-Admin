import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-personalinfo-religion',
  templateUrl: './model-personalinfo-religion.component.html',
  styleUrls: ['./model-personalinfo-religion.component.css']
})
export class ModelPersonalinfoReligionComponent implements OnInit {

  Type: String;
  constructor(public bsModalRef: BsModalRef) { }
  ngOnInit() {
  }

}
