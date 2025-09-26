import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { AuthGuard } from './guards/auth-guard';
import { AccountActionsComponent } from './components/account-actions/account-actions';
import { DepositComponent } from './components/deposit/deposit';
import { MessagesBoxComponent } from './components/messages-box/messages-box';
import { AdminComponent } from './components/admin-dashboard/admin-dashboard';
import { AdminGuard } from './guards/admin.guard';
import { Register } from './components/register/register';
import { PerformingActionsComponent } from './components/performing-actions/performing-actions';
import { DepositListComponent } from './components/deposit-list/deposit-list';
import { AwaitingApprovalComponent } from './components/awaiting-approval/awaiting-approval';
import { UpdateDetailsComponent } from './components/update-details/update-details';
import { LoanComponent } from './components/loan/loan';
import { LoansListComponent } from './components/loans-list/loans-list';
import { FreezeRequestComponent } from './components/payments-freeze/payments-freeze';
import { DepositWithdrawComponent } from './components/deposit-withdraw/deposit-withdraw';
import { NoAuthGuard } from './guards/no-auth.guard';
import { RejectedDialogComponent } from './components/rejected-dialog/rejected-dialog';
import { SlugGuard } from './guards/slug.guard';  
import { ProgramsHostComponent } from './programs/programs-host';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: Register, canActivate: [NoAuthGuard] },
  { path: 'awaiting-approval', component: AwaitingApprovalComponent },
  { path: 'rejected', component: RejectedDialogComponent },
  { path: 'home', component: HomeComponent },
  { path: 'messages', component: MessagesBoxComponent, canActivate: [AuthGuard] },
  { path: 'performing-actions', component: PerformingActionsComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountActionsComponent, canActivate: [AuthGuard] },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'deposit/:id', component: DepositComponent, canActivate: [AuthGuard] },
  { path: 'deposits', component: DepositListComponent, canActivate: [AuthGuard] },
  { path: 'loan/:id', component: LoanComponent, canActivate: [AuthGuard] },
  { path: 'loans-list', component: LoansListComponent, canActivate: [AuthGuard] },
  { path: 'payments-freeze', component: FreezeRequestComponent, canActivate: [AuthGuard] },
  { path: 'deposit-withdraw', component: DepositWithdrawComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'update-details', component: UpdateDetailsComponent, canActivate: [AuthGuard] },



  {
    path: ':slug',
    canActivate: [SlugGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
      { path: 'register', component: Register, canActivate: [NoAuthGuard] },
      { path: 'awaiting-approval', component: AwaitingApprovalComponent },
      { path: 'rejected', component: RejectedDialogComponent },
      { path: 'home', component: HomeComponent },
      { path: 'messages', component: MessagesBoxComponent, canActivate: [AuthGuard] },
      { path: 'performing-actions', component: PerformingActionsComponent, canActivate: [AuthGuard] },
      { path: 'account', component: AccountActionsComponent, canActivate: [AuthGuard] },
      { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard] },
      { path: 'deposit/:id', component: DepositComponent, canActivate: [AuthGuard] },
      { path: 'deposits', component: DepositListComponent, canActivate: [AuthGuard] },
      { path: 'loan/:id', component: LoanComponent, canActivate: [AuthGuard] },
      { path: 'loans-list', component: LoansListComponent, canActivate: [AuthGuard] },
      { path: 'payments-freeze', component: FreezeRequestComponent, canActivate: [AuthGuard] },
      { path: 'deposit-withdraw', component: DepositWithdrawComponent, canActivate: [AuthGuard] },
      { path: 'update-details', component: UpdateDetailsComponent, canActivate: [AuthGuard] },
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },

      { path: 'programs', component: ProgramsHostComponent },

      { path: '**', redirectTo: 'home' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];

