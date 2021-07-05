import { Socket } from 'ngx-socket-io';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MessageclientService {


  //Evento que tengo que escuchar del socket remoto
  currentMessage = this.socket.fromEvent<MessageUser>('reloadmsg');
  listmessages = this.socket.fromEvent<MessageUser[]>('reloadmsgs');

  //Evento que va a escuchar el componente que necesita actualizar los mensajes
  private messages$: Subject<MessageUser[]> = new Subject<MessageUser[]>();

  //se guardan mensajes en estructura auxiliar
  messagesLocal:MessageUser[] = [];

  constructor(private socket: Socket) {
    this.messagesLocal = [];
  }

  //Cuando hay nuevos mensajes se actualizan
  getMessages$():Observable<MessageUser[]>{
    return this.messages$.asObservable();
  }

  updateMessages(items:MessageUser[]){
    this.messagesLocal = items;
  }

  getMessages():MessageUser[]{
    return this.messagesLocal;
  }

  getMessagesRemote(){
    this.socket.emit('getmessages',{});
  }

  //se agrega nuevo mensaje y notifica
  addMsg(msg:MessageUser){
    this.messagesLocal.push(msg);
    this.messages$.next(this.messagesLocal);
  }

  //Se emite un mensaje remoto hacia el server para que lo replique
  newMessage(m:MessageUser) {
    this.socket.emit('appendmsg', m);
  }

}

export interface MessageUser {
  id?:number;
  msg:string;
  user:string;
  tiempo:string;
}
