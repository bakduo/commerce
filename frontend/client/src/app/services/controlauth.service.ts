import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ControlauthService {

  role:boolean = false;

  constructor(private router:Router) { }

  switchRole(){
    this.role=!this.role;
    this.router.navigate(["/home"]);
  }



  getRole(){
    return this.role;
  }

}
