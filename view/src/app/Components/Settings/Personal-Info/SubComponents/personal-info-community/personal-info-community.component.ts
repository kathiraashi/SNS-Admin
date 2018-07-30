import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';



import { ModelPersonalinfoCommunityComponent } from '../../../../../Components/Models/Settings/personal-info/model-personalinfo-community/model-personalinfo-community.component';
import { DeleteConfirmationComponent } from '../../../../../Components/Common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-personal-info-community',
  templateUrl: './personal-info-community.component.html',
  styleUrls: ['./personal-info-community.component.css']
})
export class PersonalInfoCommunityComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  CreatePersonalInfoCommunity() {
    const initialState = {
      Type: 'Create'
    };
    this.bsModalRef = this.modalService.show(ModelPersonalinfoCommunityComponent, Object.assign({initialState}, { class: 'modal-lg' }));
  }
    DeletePersonalInfoCommunity() {
    const initialState = {
      Text: 'Community'
    };
    this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
  }
}
