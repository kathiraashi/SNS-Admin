import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:4000/API/Candidates/';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor( private http: Http) {  }


   public CandidatesList(Info: any): Observable<any[]> {
      return this.http.post(API_URL + 'CandidatesList', Info)
      .pipe( map(response => response),  catchError(error => of(error)));
   }

   public Candidate_View(Info: any): Observable<any[]> {
      return this.http.post(API_URL + 'Candidate_View', Info)
      .pipe( map(response => response),  catchError(error => of(error)));
   }

   public Questions_Create(Info: any): Observable<any[]> {
      return this.http.post(API_URL + 'Questions_Create', Info)
      .pipe( map(response => response),  catchError(error => of(error)));
   }

   public Questions_List(Info: any): Observable<any[]> {
      return this.http.post(API_URL + 'Questions_List', Info)
      .pipe( map(response => response),  catchError(error => of(error)));
   }


}
