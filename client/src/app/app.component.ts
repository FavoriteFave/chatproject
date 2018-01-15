import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  person: any = [];
  name:string = "hi";

  addPerson($event) {
      this.person.push($event.value);
  }
}
