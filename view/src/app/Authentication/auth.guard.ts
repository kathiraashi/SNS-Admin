import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from './../Services/LoginService/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

   constructor( private _router: Router, private _service: LoginService) {

   }

   canActivate(route: ActivatedRouteSnapshot): boolean {
      // console.log(route.data);
      if (this._service.If_LoggedIn()) {
         return true;
      } else {
         sessionStorage.clear();
         this._router.navigate(['/Login']);
         return false;
      }
   }

}
