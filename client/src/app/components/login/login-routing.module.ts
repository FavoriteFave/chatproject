import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

import { LoginComponent } from '../login/login.component';
import { ChatStartComponent } from '../chat-start/chat-start.component';

const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'chat-start', component: ChatStartComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class LoginRoutingModule {}
