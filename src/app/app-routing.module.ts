import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth-part/login/login.component';
import { SignUpComponent } from './components/auth-part/sign-up/sign-up.component';
import { SideBarComponent } from './components/pages/side-bar/side-bar.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { AuthGuard } from './auth/auth.guard'; // Import the AuthGuard

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: '',
    component: SideBarComponent,
    children: [
      { path: "profile", component: ProfilePageComponent, canActivate: [AuthGuard] }, // Protecting the profile route
      { path: 'dashboard', loadChildren: () => import('../app/components/pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] }, // Protecting the dashboard route
      { path: 'transaction', loadChildren: () => import('./components/pages/transaction/transaction.module').then(m => m.TransactionModule), canActivate: [AuthGuard] }, // Protecting the transaction route
      { path: 'wallet', loadChildren: () => import('./components/pages/wallet/wallet.module').then(m => m.WalletModule), canActivate: [AuthGuard] }, // Protecting the wallet route
      { path: 'setting', loadChildren: () => import('./components/pages/setting/setting.module').then(m => m.SettingModule) ,canActivate: [AuthGuard]  },
      // Add other routes here and protect them as needed
    ]
  },
  
  // Optionally, add a catch-all redirect
  { path: '**', redirectTo: 'login' } // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
