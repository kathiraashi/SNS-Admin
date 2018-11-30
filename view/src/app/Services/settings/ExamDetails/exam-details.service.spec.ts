/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExamDetailsService } from './exam-details.service';

describe('Service: ExamDetails', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExamDetailsService]
    });
  });

  it('should ...', inject([ExamDetailsService], (service: ExamDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
