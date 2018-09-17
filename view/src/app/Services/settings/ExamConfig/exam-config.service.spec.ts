import { TestBed, inject } from '@angular/core/testing';

import { ExamConfigService } from './exam-config.service';

describe('ExamConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExamConfigService]
    });
  });

  it('should be created', inject([ExamConfigService], (service: ExamConfigService) => {
    expect(service).toBeTruthy();
  }));
});
