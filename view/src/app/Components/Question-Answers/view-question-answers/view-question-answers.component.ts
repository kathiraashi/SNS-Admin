import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { CandidatesService } from './../../../Services/Applications/candidates.service';

import { ModelEditQuestionAnswersComponent } from '../../../Components/Models/QuestionAnswers/model-edit-question-answers/model-edit-question-answers.component';
import { DeleteConfirmationComponent } from '../../../Components/Common/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-view-question-answers',
  templateUrl: './view-question-answers.component.html',
  styleUrls: ['./view-question-answers.component.css']
})
export class ViewQuestionAnswersComponent implements OnInit {

   Loader: Boolean = true;

   _List: any[] = [];
   bsModalRef: BsModalRef;
   constructor(private modalService: BsModalService, public Service: CandidatesService) { }

   ngOnInit() {
      this.Service.Questions_List({User_Id: '123'}).subscribe( response => {
         this.Loader = false;
         if (response['status'] === 200 ) {
            this._List = JSON.parse(JSON.parse(response['_body'])['Response']);
         }
      });
   }

   CreateQuestionAnswers() {
      const initialState = {
         Type: 'Create'
      };
      this.bsModalRef = this.modalService.show(ModelEditQuestionAnswersComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg max-width-70' }));
      this.bsModalRef.content.onClose.subscribe(response => {
         if (response.Status) {
            this._List.splice(0, 0, response.Response);
         }
      });
   }
   EditQuestionAnswers(_index) {
      const initialState = {
      Type: 'Edit'
      };
      this.bsModalRef = this.modalService.show(ModelEditQuestionAnswersComponent, Object.assign({initialState}, { class: 'modal-lg max-width-70' }));
   }
   DeleteQuestion() {
      const initialState = {
      Text: 'Question'
      };
      this.bsModalRef = this.modalService.show(DeleteConfirmationComponent, Object.assign({initialState}, { class: 'modal-sm' }));
   }
}
