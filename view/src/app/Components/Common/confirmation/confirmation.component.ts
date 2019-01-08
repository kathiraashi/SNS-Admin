import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {


   onClose: Subject<any>;
   Type: string;
   Header: string;
   LineOne: string;
   LineTwo: string;
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
   Close() {
      this.bsModalRef.hide();
   }

}
