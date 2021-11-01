import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Orden, OrdenService } from '../services/orden.service';
import { TokenService, TokenUser } from '../services/token.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {

  ordenes: Orden[] = [];

  constructor(private router:Router,private _ordenService:OrdenService,private _tokenService:TokenService) { 

  }

  ngOnInit(): void {

    if (this._tokenService.getToken()){

      let userlogin:TokenUser = this._tokenService.getToken();

      this._ordenService.getOrdenesOfUser(userlogin.email).subscribe((response:any)=>{

        if (!response.fail){
          this.ordenes = response.ordenes;
        };
      });

    }
  }

verOrden(index:any){
  if (index!=null){
    if (this.ordenes[index].id!=null){
      this.router.navigate(["/orden",this.ordenes[index].id]);
    }
  }
}

}
