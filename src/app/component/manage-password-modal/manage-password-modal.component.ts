import { Component, OnDestroy, OnInit } from '@angular/core';
import * as sha512 from "js-sha512";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { snackBarConfig } from "../../shared/constants";
import { MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../services/user.service";
import { UserStoreService } from "../../services/user-store.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-manage-password-modal',
  templateUrl: './manage-password-modal.component.html',
  styleUrls: ['./manage-password-modal.component.scss']
})
export class ManagePasswordModalComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup = {} as FormGroup;
  userId = 0;
  disableSave = false;
  hasPasswordsMatchError = false;
  subscriptions = new Subscription();

  constructor(private _userService: UserService,
              private _userStoreService: UserStoreService,
              private _snackBar: MatSnackBar,
              private _dialogRef: MatDialogRef<ManagePasswordModalComponent>,) {
  }

  ngOnInit(): void {
    this.userId = this._userStoreService.getLoggedInUser()?.id ?? 0;
    this.buildEmptyForm();
    this.passwordForm.valueChanges.subscribe(
      () => {
        this.updateDisableSave();
      })
  }

  buildEmptyForm() {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required]),
      repeatNewPassword: new FormControl(null, [Validators.required])
    });
    this.updateDisableSave();
  }

  onDiscardPasswordClick(): void {
    this._dialogRef.close();
  }

  onSubmitPasswordClick(): void {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const currentPasswordHash = this.getPasswordHash(currentPassword);

    const newPassword = this.passwordForm.get('newPassword')?.value;
    const newPasswordHash = this.getPasswordHash(newPassword);

    this._userService.changePassword(this.userId, currentPasswordHash, newPasswordHash).subscribe(
      () => {
        this._dialogRef.close();
        this._snackBar.open("Password successfully changed.", "OK", snackBarConfig);
      },
      () => {
        this._snackBar.open('Error while changing password.', "OK", snackBarConfig);
      }
    );
  }

  getPasswordHash(password: string): string {
    return sha512.sha512(password);
  }

  updateDisableSave(): void {
    this.disableSave = !this.passwordForm.valid || this.checkPasswordsMatchError();
  }

  checkPasswordsMatchError(): boolean {
    this.hasPasswordsMatchError = this.passwordForm.get('newPassword')?.value !== this.passwordForm.get('repeatNewPassword')?.value
    return this.hasPasswordsMatchError;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
