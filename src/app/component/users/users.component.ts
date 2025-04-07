import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from "../../services/user.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { AppUser, Client } from "../../model/AppUser";
import { MatTableDataSource } from "@angular/material/table";
import { EMPTY, Subscription, switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { UserModalComponent } from "./user-modal/user-modal.component";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: AppUser[] | Client[] = [];
  isLoading = true;
  pageIndex = 0;
  pageSize = 10;
  totalUsers = 0;
  types = ['CLIENT', 'EMPLOYEE'];
  selectedType = '';
  subscriptions = new Subscription();

  displayedColumnsClient: string[] = ['id', 'username', 'firstName', 'lastName', 'email', 'phone', 'block'];
  displayedColumnsEmployee: string[] = ['id', 'username', 'firstName', 'lastName', 'email', 'phone', 'role', 'edit', 'delete'];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<AppUser>(this.users);

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(private _userService: UserService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.selectedType = this.types[0];
    this.updateDisplayedColumns();
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.subscriptions.add(this._userService.getUsers(this.pageIndex, this.pageSize, this.selectedType).subscribe(res => {
      if (this.selectedType === 'EMPLOYEE') {
        this.users = res.data.filter(user => !user.deleted);
      } else {
        this.users = res.data;
      }
      this.totalUsers = res.totalElements;
      this.dataSource.data = this.users;
      this.isLoading = false;
    }));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onTypeChange(type: any): void {
    this.selectedType = type;
    this.updateDisplayedColumns();
    this.loadUsers();
  }

  updateDisplayedColumns(): void {
    if (this.selectedType === 'EMPLOYEE') {
      this.displayedColumns = this.displayedColumnsEmployee;
    } else {
      this.displayedColumns = this.displayedColumnsClient;
    }
  }

  onEditClick(user: AppUser): void {
    this.dialog.open(UserModalComponent, {
      data: {
        user: user
      },
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const userIndex = this.users.findIndex(u => u.id === result.id);

        if (userIndex !== -1) {
          this.users[userIndex] = result;
          this.dataSource.data = this.users;
        }
      }
    });
  }

  onDeleteClick(user: AppUser): void {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: "Delete user",
        text: "Are you sure that you want to delete this user?"
      },
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed()
      .pipe(
        switchMap(result => {
          return result ? this._userService.deleteById(user.id) : EMPTY;
        })
      )
      .subscribe(res => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.loadUsers();
        }
      });
  }

  onBlockClick(user: AppUser, event: MatSlideToggleChange): void {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: "Block user",
        text: `Are you sure that you want to ${event.checked ? 'block' : 'unblock'} this user?`
      },
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed()
      .pipe(
        switchMap(result => {
          return result ? this._userService.manageBlock(user.id) : EMPTY;
        })
      )
      .subscribe(res => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.loadUsers();
        }
      });
  }

  onAddNewUserClick(): void {
    this.dialog.open(UserModalComponent, {
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const calculatedPageIndex = Math.ceil((this.totalUsers + 1) / this.pageSize);
        this.pageIndex = calculatedPageIndex - 1;
        this.loadUsers();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
