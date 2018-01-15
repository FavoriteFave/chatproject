import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{

  loginError: boolean = false;
  loading: boolean = false;
  username:string;
  password:string;

  errorMessage:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    //reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.username, this.password)
      .subscribe(
      data => {
        this.router.navigate(['/chat-start']);
      },
      error => {
        this.loading = false,
        this.loginError = true;
        this.errorMessage = error;
        console.log("there is an error in the log in data");
      });
  }


}
