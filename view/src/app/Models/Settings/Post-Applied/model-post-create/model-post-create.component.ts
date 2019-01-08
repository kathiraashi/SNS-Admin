import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-model-post-create',
  templateUrl: './model-post-create.component.html',
  styleUrls: ['./model-post-create.component.css']
})
export class ModelPostCreateComponent implements OnInit {

  Type: String;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
