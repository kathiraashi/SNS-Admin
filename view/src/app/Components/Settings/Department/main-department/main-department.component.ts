import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelDepartmentCreateComponent } from '../../../Models/Settings/Department/model-department-create/model-department-create.component';
import { DeleteConfirmationComponent } from '../../../Common/delete-confirmation/delete-confirmation.component';



@Component({
  selector: 'app-main-department',
  templateUrl: './main-department.component.html',
  styleUrls: ['./main-department.component.css']
})
export class MainDepartmentComponent implements OnInit {
Active_Tab = 'Technical_Institution';
bsModalRef: BsModalRef;
constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
Active_Tab_Change(name) {
  this.Active_Tab = name;
}

CreateDepartment() {
  const initialState = {
    Type: 'Create'
  };
  this.bsModalRef = this.modalService.show(ModelDepartmentCreateComponent, Object.assign({initialState}, { class: 'modal-lg' }));
}
DeleteDepartment() {
  const initialState = {
    Text: 'Department'
  };
  this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}
}
