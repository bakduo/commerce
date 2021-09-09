import { TokenService } from './services/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ControlauthService } from './services/controlauth.service';

@Injectable({
  providedIn: 'root'
})
export class ControlRoutesGuard implements CanActivate, CanActivateChild {

  constructor(private _controlService:ControlauthService,private _tokenService:TokenService){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      if (this._tokenService.getToken()){
        return true
      }

      return false;
      //return this._controlService.getRole();

  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      //return this._controlService.getRole();
      if (this._tokenService.getToken()){
        return true
      }

      return false;
  }

}
