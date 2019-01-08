import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModelPersonalinfoNationalityComponent } from '../../../../../Models/Settings/personal-info/model-personalinfo-nationality/model-personalinfo-nationality.component';
import { DeleteConfirmationComponent } from '../../../../Common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-personal-info-nationality',
  templateUrl: './personal-info-nationality.component.html',
  styleUrls: ['./personal-info-nationality.component.css']
})
export class PersonalInfoNationalityComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  CreatePersonalInfoNationality() {
    const initialState = {
      Type: 'Create'
    };
    this.bsModalRef = this.modalService.show(ModelPersonalinfoNationalityComponent, Object.assign({initialState}, { class: 'modal-lg' }));
  }
    DeletePersonalInfoNationality() {
    const initialState = {
      Text: 'Nationality'
    };
    this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
  }
}
