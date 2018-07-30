import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-educational-create',
  templateUrl: './model-educational-create.component.html',
  styleUrls: ['./model-educational-create.component.css']
})
export class ModelEducationalCreateComponent implements OnInit {

  Type: String;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
