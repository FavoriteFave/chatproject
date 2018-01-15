import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from './registration.component';

const registrationRoutes: Routes = [
  { path: 'registration-page', component: RegistrationComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(registrationRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RegistrationRoutingModule {}
