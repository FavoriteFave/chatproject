import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ChatService } from '../../services/chat.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'chat-start',
  templateUrl: './chat-start.component.html',
  styleUrls: ['./chat-start.component.css']
})

export class ChatStartComponent implements OnInit {

  @ViewChild('d1') d1:ElementRef;
  @ViewChild('d2') d2:ElementRef;

  connection: any;
  currentUser: any;
  message: string;
  messages: string[] = [];
  currentUserName: string;

  onlineUsers: string[] = [];

  chatrooms = ['Allgemein', 'Wirtschaftswissenschaften', 'Jura', 'Lehramt', 'Wirtschaftsinformatik', 'Informatik', 'Mathematik'];
  chosenRoom: string = 'Allgemein';

  socket = io.connect('http://localhost:3000/');

  constructor(private usersService: UsersService,
              private chatService: ChatService,
              private route: ActivatedRoute,
              private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserName = this.currentUser.name;
  }

  ngOnInit() {
    //get the last 5 messages of the current chatroom
    this.getLastMessages();

    //check for socket io connection
    if(this.socket !== undefined){
      console.log('connected to socket...');
      //handle room
      this.socket.emit('room', 'Allgemein');
      //emit online user
      this.socket.emit('onlineUser', this.currentUserName);
      //get all online users from server and display them in the Template
      this.socket.on('onlineUsers', (data) => {
        this.checkData(data);
      });
      //get all new messages from the server
      this.socket.on('newMessage', (data) => {
          this.d1.nativeElement.insertAdjacentHTML('beforeend', `<div class="two" style="display:flex"><div style="color:black; font-weight:bold">${data[0].user}: &nbsp</div>   ${data[0].message}</div>`);
      });
    }
  }


  messageInput(event) {
    var msg = {
      message: this.message,
      user: this.currentUserName,
      room: this.chosenRoom
    };
    this.socket.emit('input', msg);
    event.preventDefault();
    this.message = '';
    this.d1.nativeElement.scrollTop = this.d1.nativeElement.scrollHeight;
  }

  //check a str for special charackters
  isValid(str){
   return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
  }

  checkData(data) {
    let newArray = [];
    if(data.length) {
      for(let i in data) {
        //if username is a normal string and does not have any special characters, proceed to push it in Array
        if(this.isValid(data[i])) {
          newArray.push(data[i]);
        } else {
          //else decode the spcieal charackters and then create it
          let decodedName = decodeURIComponent(data[i]);
          newArray.push(decodedName);
        }
      }
    }
    this.onlineUsers = newArray;
    return newArray;
  }

  clickaRoom(event) {
    console.log(event.target.innerHTML);
    if(this.chosenRoom === event.target.innerHTML) {
      return;
    } else {
      this.chosenRoom = event.target.innerHTML;
      this.socket.emit('room', this.chosenRoom);
      while (this.d1.nativeElement.firstChild) {
        this.d1.nativeElement.removeChild(this.d1.nativeElement.firstChild);
      }
      this.getLastMessages();
    }
  }

  getLastMessages() {
    this.chatService.getAllChat(this.chosenRoom)
      .subscribe(chats => {
        for(let chat of chats) {
          console.log(chat);
          this.d1.nativeElement.insertAdjacentHTML('beforeend', `<div class="two" style="display:flex"><div style="color:black; font-weight:bold">${chat.username}: &nbsp</div>   ${chat.message}</div>`);
        }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.socket.emit('disconnect', "logged out");
  }

}
