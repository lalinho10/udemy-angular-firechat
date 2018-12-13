import { Component, OnInit } from '@angular/core';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {

  constructor( public chatService: ChatService ) {}

  ngOnInit() {
  }

  login( proveedor: string ): void {
    this.chatService.login( proveedor );
  }

  logout(): void {
    this.chatService.logout();
  }

}
