import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ModelEditQuestionAnswersComponent } from '../../../Components/Models/QuestionAnswers/model-edit-question-answers/model-edit-question-answers.component';
import { DeleteConfirmationComponent } from '../../../Components/Common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-view-question-answers',
  templateUrl: './view-question-answers.component.html',
  styleUrls: ['./view-question-answers.component.css']
})
export class ViewQuestionAnswersComponent implements OnInit {
   bsModalRef: BsModalRef;
   constructor(private modalService: BsModalService) { }

   ngOnInit() {
   }
   EditQuestionAnswers() {
      const initialState = {
        Type: 'Edit'
      };
      this.bsModalRef = this.modalService.show(ModelEditQuestionAnswersComponent, Object.assign({initialState}, { class: 'modal-lg' }));
    }
    DeleteQuestion() {
      const initialState = {
        Text: 'Question'
      };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
    }
}
