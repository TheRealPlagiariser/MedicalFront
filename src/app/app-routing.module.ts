import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { ViewclaimComponent } from './pages/viewclaim/viewclaim.component';
import { MessengerComponent } from './pages/messenger/messenger.component';
import { HrComponent } from './pages/hr/hr.component';
import { AuthGuardGuard } from './services/auth/auth-guard.guard';
import { AuthGuard } from './services/auth/auth.guard';
const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'claimForm',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'viewClaim',
    component: ViewclaimComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'messenger',
    component: MessengerComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'hr', component: HrComponent, canActivate: [AuthGuard] },
  { path: 'hr', component: HrComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
