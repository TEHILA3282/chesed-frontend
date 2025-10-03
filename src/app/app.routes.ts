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
import { ProgramsPageComponent } from './programs/programs.page'; 
import { WaitingGuard } from './guards/waiting.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: Register, canActivate: [NoAuthGuard] },

  { path: 'awaiting-approval', component: AwaitingApprovalComponent },
  { path: 'rejected', component: RejectedDialogComponent },

  { path: 'home', component: HomeComponent, canActivate: [WaitingGuard] },
  { path: 'messages', component: MessagesBoxComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'performing-actions', component: PerformingActionsComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'account', component: AccountActionsComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'deposit/:id', component: DepositComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'deposits', component: DepositListComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'loan/:id', component: LoanComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'loans-list', component: LoansListComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'payments-freeze', component: FreezeRequestComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'deposit-withdraw', component: DepositWithdrawComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'update-details', component: UpdateDetailsComponent, canActivate: [AuthGuard, WaitingGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard, WaitingGuard] },

  {
    path: ':slug',
    canActivate: [SlugGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
      { path: 'register', component: Register, canActivate: [NoAuthGuard] },

      { path: 'awaiting-approval', component: AwaitingApprovalComponent },
      { path: 'rejected', component: RejectedDialogComponent },

      { path: 'home', component: HomeComponent, canActivate: [WaitingGuard] },
      { path: 'messages', component: MessagesBoxComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'performing-actions', component: PerformingActionsComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'account', component: AccountActionsComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'deposit', component: DepositComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'deposit/:id', component: DepositComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'deposits', component: DepositListComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'loan/:id', component: LoanComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'loans-list', component: LoansListComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'payments-freeze', component: FreezeRequestComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'deposit-withdraw', component: DepositWithdrawComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'update-details', component: UpdateDetailsComponent, canActivate: [AuthGuard, WaitingGuard] },
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard, WaitingGuard] },

      { path: 'programs', component: ProgramsPageComponent, canActivate: [WaitingGuard] },

      { path: '**', redirectTo: 'home' }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
