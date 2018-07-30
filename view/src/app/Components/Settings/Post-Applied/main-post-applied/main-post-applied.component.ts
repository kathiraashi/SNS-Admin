import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelPostCreateComponent } from '../../../../Components/Models/Settings/Post-Applied/model-post-create/model-post-create.component';
import { DeleteConfirmationComponent } from '../../../../Components/Common/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-main-post-applied',
  templateUrl: './main-post-applied.component.html',
  styleUrls: ['./main-post-applied.component.css']
})
export class MainPostAppliedComponent implements OnInit {
Active_Tab = 'Technical_Institution';
bsModalRef: BsModalRef;
constructor(private modalService: BsModalService) { }


  ngOnInit() {
  }
Active_Tab_Change(name) {
  this.Active_Tab = name;
}
CreatePost() {
  const initialState = {
    Type: 'Create'
  };
  this.bsModalRef = this.modalService.show(ModelPostCreateComponent, Object.assign({initialState}, { class: 'modal-lg' }));
}
DeletePost() {
  const initialState = {
    Text: 'Post'
  };
  this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
}

}
