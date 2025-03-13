import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import * as sha512 from 'js-sha512';
import { MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hidePassword = true;
  loginForm: FormGroup = {} as FormGroup;
  invalidCredentials = false;
  subscriptions = new Subscription();
  constructor(private readonly _formBuilder: UntypedFormBuilder,
              private _dialogRef: MatDialogRef<LoginComponent>,
              private _userService: UserService){
}
  ngOnInit(): void {
    this.buildForm();

    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });

    this.subscriptions.add(
      this.loginForm.get('username')?.valueChanges.subscribe(value => this.invalidCredentials = false)
    );
    this.subscriptions.add(
      this.loginForm.get('password')?.valueChanges.subscribe(value => this.invalidCredentials = false)
    );
  }
  buildForm(): void {
    this.loginForm = this._formBuilder.group({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }
  getPasswordHash(password: string): string {
    return sha512.sha512(password);
  }
  onLoginClick(event: MouseEvent): void {
      const username = this.loginForm.get('username')!.value;
      const password = this.getPasswordHash(this.loginForm.get('password')!.value);
      this.subscriptions.add(
        this._userService.findUserByUsernameAndPassword(username, password).subscribe(
          (user) => {
            //TODO: Add some actions later
            console.log(user)
            this._dialogRef.close();
          },
          (error) => {
            this.invalidCredentials = true;
          }));
  }

  // onSignUpClick($event: MouseEvent): void {
  // }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
