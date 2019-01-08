import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


import { ModelEducationalCreateComponent } from '../../../../Models/Settings/educational-info/model-educational-create/model-educational-create.component';
import { DeleteConfirmationComponent } from '../../../../Components/Common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-main-educational-info',
  templateUrl: './main-educational-info.component.html',
  styleUrls: ['./main-educational-info.component.css']
})
export class MainEducationalInfoComponent implements OnInit {
Active_Tab = 'Technical_Institution';
bsModalRef: BsModalRef;
constructor(private modalService: BsModalService) { }


  ngOnInit() {
  }
Active_Tab_Change(name) {
  this.Active_Tab = name;
}
CreateCourseName() {
  const initialState = {
    Type: 'Create'
  };
  this.bsModalRef = this.modalService.show(ModelEducationalCreateComponent, Object.assign({initialState}, { class: 'modal-lg' }));
}
DeleteCourseName() {
  const initialState = {
    Text: 'CourseName'
  };
  this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}

}
