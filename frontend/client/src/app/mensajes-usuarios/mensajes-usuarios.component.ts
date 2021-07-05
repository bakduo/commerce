import { element } from 'protractor';
import { MessageclientService, MessageUser } from './../services/messageclient.service';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mensajes-usuarios',
  templateUrl: './mensajes-usuarios.component.html',
  styleUrls: ['./mensajes-usuarios.component.css']
})
export class MensajesUsuariosComponent implements OnInit, OnDestroy {

  //Necesito observar los cambios respecto de los mensajes
  messages$: Observable<MessageUser[]>;

  // necesito estar pendiente de un mensaje nuevo que llegue de forma remota
  private _messageSub: Subscription;
  // toda la lista de mensajes remotas
  private _messagesSub: Subscription;

  // necesito estar subcripto para imprimir los mensajes
  private _messages: Subscription;

  formMessage: FormGroup;

  //estructura local para levantar los mensajes que llegan

  messagesLocal:MessageUser[] = [];

  constructor(private _messageService:MessageclientService,private fb: FormBuilder) {
    this.formMessage = this.fb.group({
      email  : ['', [ Validators.required, Validators.minLength(5) ]  ],
      msgtext  : ['', [ Validators.required, Validators.minLength(5) ]  ]
    });


  }

  ngOnInit() {


    this.messages$ = this._messageService.getMessages$();
    this._messages = this.messages$.subscribe((items)=>this.messagesLocal=items);
    //esto es solo para esperar los mensajes remotos, cuando llegan se notifica al servicio y se almancenan en la estructura
    this._messageSub = this._messageService.currentMessage.subscribe(msg => this._messageService.addMsg(msg));
    this._messagesSub  = this._messageService.listmessages.subscribe(items=>{this._messageService.updateMessages(items);this.messagesLocal=items;});
    this._messageService.getMessagesRemote();
  }

  //si salgo del componente dejo de escuchar eventos del socket y de actualización
  ngOnDestroy() {
    this._messageSub.unsubscribe();
    this._messagesSub.unsubscribe();
    this._messages.unsubscribe();
  }


  newMessage() {

    if ( this.formMessage.valid ) {

        const tiempo = new Date();

        const parser =  tiempo.getDate() +  "/" + (tiempo.getMonth()+1) + "/" + tiempo.getFullYear() + " " + tiempo.getHours() + ":" + tiempo.getMinutes() + ":" + tiempo.getSeconds();

        const msg:MessageUser ={
          user: this.formMessage.value.email,
          msg:this.formMessage.value.msgtext,
          tiempo: parser
        }
        this._messageService.newMessage(msg);
    }
  }

}
