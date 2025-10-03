import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditStatusDialogComponent } from '../edit-status-dialog/edit-status-dialog';
import { UserChartDialogComponent } from '../user-chart-dialog/user-chart-dialog';
import { environment } from '../../environments/environment'; // 👈 חשוב

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  pendingUsers: any[] = [];
  approvedUsers: any[] = [];
  rejectedUsers: any[] = [];
  forms: any[] = [];
  isSyncing = false;

  private readonly adminApi = `${environment.apiUrl}/admin`; // e.g. '/api/admin' בפרוד

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loadPendingUsers();
    this.loadApprovedUsers();
    this.loadRejectedUsers();
    // this.loadForms();
  }

  loadPendingUsers() {
    this.http.get<any[]>(`${this.adminApi}/pending`).subscribe({
      next: data => this.pendingUsers = data,
      error: () => { if (!this.isSyncing) this.snackBar.open('❌ שגיאה בטעינת משתמשים ממתינים', 'סגור', { duration: 3000 }); }
    });
  }

  loadApprovedUsers() {
    this.http.get<any[]>(`${this.adminApi}/approved`).subscribe({
      next: data => this.approvedUsers = data,
      error: () => { if (!this.isSyncing) this.snackBar.open('❌ שגיאה בטעינת משתמשים מאושרים', 'סגור', { duration: 3000 }); }
    });
  }

  loadRejectedUsers() {
    this.http.get<any[]>(`${this.adminApi}/rejected`).subscribe({
      next: data => this.rejectedUsers = data,
      error: () => { if (!this.isSyncing) this.snackBar.open('❌ שגיאה בטעינת משתמשים שנדחו', 'סגור', { duration: 3000 }); }
    });
  }

  updateStatus(id: string, newStatus: string) {
    this.http.post<{ message: string }>(`${this.adminApi}/update-status`, { registrationId: id, newStatus }).subscribe({
      next: (res) => {
        this.snackBar.open(`✅ ${res.message}`, 'סגור', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('❌ שגיאה בעדכון סטטוס', 'סגור', { duration: 3000 })
    });
  }

  // loadForms() {
  //   this.http.get<any[]>(`${this.adminApi}/external-forms`).subscribe({
  //     next: data => this.forms = data,
  //     error: () => { if (!this.isSyncing) this.snackBar.open('❌ שגיאה בטעינת טפסים חיצוניים', 'סגור', { duration: 3000 }); }
  //   });
  // }

  syncUsers() {
    this.isSyncing = true;
    this.http.post<{ message: string }>(`${this.adminApi}/sync-users`, {}).subscribe({
      next: (res) => {
        this.snackBar.open(`✅ ${res.message}`, 'סגור', { duration: 3000 });
        this.isSyncing = false;
        this.loadData();
      },
      error: (err) => {
        this.isSyncing = false;
        this.snackBar.open('❌ שגיאה בסנכרון המשתמשים', 'סגור', { duration: 3000 });
        console.error('שגיאה בסנכרון:', err);
      }
    });
  }

  openEditDialog(user: any) {
    const dialogRef = this.dialog.open(EditStatusDialogComponent, { data: user });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.newStatus && result.newStatus !== user.registrationStatus) {
        this.updateStatus(user.id, result.newStatus);
      }
    });
  }

  openUserChart(user: any) {
    this.dialog.open(UserChartDialogComponent, {
      data: { userId: user.id, fullName: `${user.firstName} ${user.lastName}` },
      width: '450px',
      height: '500px'
    });
  }
}
