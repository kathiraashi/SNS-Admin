import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelPersonalinfoReligionComponent } from '../../../../../Components/Models/Settings/personal-info/model-personalinfo-religion/model-personalinfo-religion.component';
import { DeleteConfirmationComponent } from '../../../../Common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-personal-info-religion',
  templateUrl: './personal-info-religion.component.html',
  styleUrls: ['./personal-info-religion.component.css']
})
export class PersonalInfoReligionComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }


  ngOnInit() {
  }
  CreatePersonalInfoReligion() {
    const initialState = {
      Type: 'Create'
    };
    this.bsModalRef = this.modalService.show(ModelPersonalinfoReligionComponent, Object.assign({initialState}, { class: 'modal-lg' }));
  }
    DeletePersonalInfoReligion() {
    const initialState = {
      Text: 'Religion'
    };
    this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
  }
}
