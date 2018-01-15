import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { UsersService } from '../../services/users.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registrationError: boolean = false;
  loading: boolean = false;

  //users: any;
  name: string;
  password: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService){
    /*this.usersService.getUsers()
      .subscribe(users => {
        this.users = users;
      });*/
  }

  registerUser(event) {
      event.preventDefault();
      let newUser = {
        name: this.name,
        password: this.password
      }

      this.usersService.addUser(newUser)
          .subscribe(
          user => {
            this.loading = true;
            this.registrationError = false;
            //this.users.push(user);
            this.name = '';
            this.password = '';
            this.router.navigate(['/login']);
          },
          error => {
            this.loading = false;
            this.registrationError = true;
          });
  }

}
