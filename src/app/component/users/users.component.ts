import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from "../../services/user.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { AppUser } from "../../model/AppUser";
import { MatTableDataSource } from "@angular/material/table";
import { EMPTY, Subscription, switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { UserModalComponent } from "./user-modal/user-modal.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: AppUser[] = [];
  isLoading = true;
  pageIndex = 0;
  pageSize = 10;
  totalUsers = 0;
  types = ['CLIENT', 'EMPLOYEE'];
  selectedType = '';
  subscriptions = new Subscription();

  displayedColumns: string[] = ['id', 'username', 'firstName', 'lastName', 'email', 'phone', 'role', 'edit', 'delete'];
  dataSource = new MatTableDataSource<AppUser>(this.users);

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(private userService: UserService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.selectedType = this.types[0];
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.subscriptions.add(this.userService.getUsers(this.pageIndex, this.pageSize, this.selectedType).subscribe(res => {
      this.users = res.data;
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
    this.loadUsers();
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
          return result ? this.userService.deleteById(user.id) : EMPTY;
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
