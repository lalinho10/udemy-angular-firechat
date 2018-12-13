import { Component, OnInit } from '@angular/core';

import { Message } from '../../interfaces/message';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})

export class ChatComponent implements OnInit {
  textMessage: string;
  element: any;

  constructor( public chatService: ChatService ) {
    this.chatService.loadMessages().subscribe( () => {
      setTimeout( () => {
        this.element.scrollTop = this.element.scrollHeight;
      }, 20);
    });
  }

  ngOnInit() {
    this.element = document.getElementById( 'app-mensajes' );
  }

  sendMessage(): void {
    if ( this.textMessage.length === 0 ) {
      return;
    }

    this.chatService
        .addMessage( this.textMessage )
        .then( () => this.textMessage = '' )
        .catch( ( err ) => { console.log( 'Error al enviar mensaje', err ); } );
  }
}
