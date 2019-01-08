import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {

  onClose: Subject<any>;
  Text: string;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }
  Cancel() {
     this.onClose.next({Status: false});
     this.bsModalRef.hide();
  }
  Proceed() {
     this.onClose.next({Status: true});
     this.bsModalRef.hide();
  }

}
