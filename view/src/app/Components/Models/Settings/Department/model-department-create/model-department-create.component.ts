import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-department-create',
  templateUrl: './model-department-create.component.html',
  styleUrls: ['./model-department-create.component.css']
})
export class ModelDepartmentCreateComponent implements OnInit {

  Type: String;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
