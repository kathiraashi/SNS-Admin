import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from './../../LoginService/login.service';

const API_URL = 'http://localhost:4000/API/Settings/Category/';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

   headers;
   constructor(private http: Http, private Service: LoginService) {
      this.headers = new Headers();
   }

   ValidateEveryRequest() {
      let Message = JSON.stringify({Status: false, Message: 'Your Login Expired! Please Login Again'});
      if (sessionStorage.getItem('Token') && sessionStorage.getItem('SessionKey') && sessionStorage.getItem('SessionToken') ) {
         const LastSession = new Date(atob(sessionStorage.getItem('SessionKey'))).getTime();
         const NowSession = new Date().getTime();
         const SessionDiff: number = NowSession - LastSession;
         const SessionDiffMinutes: number = SessionDiff / 1000 / 60 ;
         if (SessionDiffMinutes >= 20 ) {
            Message = JSON.stringify({Status: false, Message: 'Your Session Expired! Please Login Again'});
            sessionStorage.clear();
         }
      }
      return Observable.create(observer => {
         const Response = {status: 401, _body: Message };
         observer.next(Response);
         observer.complete();
      });
   }


   // Category
      public Category_AsyncValidate(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_AsyncValidate', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_Create(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_Create', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_List(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_List', Info, {headers: this.headers }).pipe( map(response => response), catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_SimpleList(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_SimpleList', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_Update(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_Update', Info, {headers: this.headers }).pipe( map(response => response), catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }
      public Category_Delete(Info: any): Observable<any[]> {
         if (this.Service.If_LoggedIn()) {
            this.headers.set('Authorization', atob(sessionStorage.getItem('SessionToken')));
            sessionStorage.setItem('SessionKey', btoa(Date()));
            return this.http.post(API_URL + 'Category_Delete', Info, {headers: this.headers }).pipe( map(response => response),  catchError(error => of(error)));
         } else {
            return this.ValidateEveryRequest();
         }
      }

}
