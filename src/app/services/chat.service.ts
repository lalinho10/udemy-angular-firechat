import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private chatCollection: AngularFirestoreCollection<Message>;

  public chats: Message[] = [];
  public usuario: any = {};

  constructor(
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe( user => {
      console.log( 'Estado inicial del usuario: ', user );
      if ( !user ) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login( proveedor: string ) {
    if ( proveedor === 'google' ) {
      this.afAuth.auth.signInWithPopup( new auth.GoogleAuthProvider() );
    } else {
      this.afAuth.auth.signInWithPopup( new auth.TwitterAuthProvider() );
    }
  }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  loadMessages(): Observable<void> {
    this.chatCollection = this.afs.collection<Message>( 'chats', ref => ref.orderBy( 'sendTime', 'desc' ).limit( 5 ) );

    return this.chatCollection
                .valueChanges()
                .pipe( map( ( messages: Message[] ) => {
                  this.chats = [];

                  for ( let message of messages ) {
                    this.chats.unshift( message );
                  }
                }));
  }

  addMessage( textMessage: string ): Promise<any> {
    let message: Message = {
      sender: this.usuario.nombre,
      text: textMessage,
      sendTime: new Date().getTime(),
      senderUid: this.usuario.uid
    };

    return this.chatCollection.add( message );
  }
}
