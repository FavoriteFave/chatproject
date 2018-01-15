import { Injectable } from '@angular/core';
import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(private http: Http) {
    console.log('Registration Service works..');
  }

  getUsers() {
    return this.http.get('http://localhost:3000/api/users')
        .map((res: Response) => res.json());
  }

  getById(_id: string) {
    return this.http.get('http://localhost:3000/api/users/' + _id)
      .map((res: Response) => res.json());
  }

  addUser(newUser) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/user', JSON.stringify(newUser), {headers: headers});
  }

  /*updateUser(_id: string) {
    var set = {
      loggedIn: "true"
    };
    return this.http.put('http://localhost:3000/api/update/' + _id, JSON.stringify(set), this.addJwt())
      .map((res: Response) => res.json());
  }

  addJwt(options?: RequestOptionsArgs): RequestOptionsArgs {
    options = options || new RequestOptions();
    options.headers = options.headers || new Headers();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.token) {
      options.headers.append('Authorization', 'Bearer ' + currentUser.token);
    }

    return options;
  }*/
}
