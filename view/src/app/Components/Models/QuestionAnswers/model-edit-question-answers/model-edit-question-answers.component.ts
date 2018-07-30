import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-model-edit-question-answers',
  templateUrl: './model-edit-question-answers.component.html',
  styleUrls: ['./model-edit-question-answers.component.css']
})
export class ModelEditQuestionAnswersComponent implements OnInit {
   Type: String;
   constructor(public bsModalRef: BsModalRef) { }

   ngOnInit() {
   }

}
