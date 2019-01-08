/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VacanciesConfigService } from './vacancies-config.service';

describe('Service: VacanciesConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacanciesConfigService]
    });
  });

  it('should ...', inject([VacanciesConfigService], (service: VacanciesConfigService) => {
    expect(service).toBeTruthy();
  }));
});
