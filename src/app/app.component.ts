import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginComponent } from "./component/login/login.component";
import { UserService } from "./services/user.service";
import { MatDialog } from "@angular/material/dialog";
import { animate, AUTO_STYLE, state, style, transition, trigger } from "@angular/animations";
export const DEFAULT_ANIMATION_DURATION = 100;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({height: AUTO_STYLE, visibility: AUTO_STYLE})),
      state('true', style({height: '0', visibility: 'hidden'})),
      transition('false => true', animate(DEFAULT_ANIMATION_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_ANIMATION_DURATION + 'ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy{

  isLoggedIn = false;
  constructor(private _loginService: UserService,
              public dialog: MatDialog) {
  }
  ngOnInit(): void {
    if (!this._loginService.isLoggedIn()) {
      const dialogRef = this.dialog.open(LoginComponent,
        { disableClose: true,
          height: '300px',
          hasBackdrop: true,
          backdropClass: 'rental-app-backdrop'});
      dialogRef.afterClosed().subscribe(() => {
        // this.isLoggedIn = this._loginService.isLoggedIn();
      });
    }
  }

  ngOnDestroy(): void {
  }
}
