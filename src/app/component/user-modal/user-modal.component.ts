import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserStoreService } from "../../services/user-store.service";
import { UserService } from "../../services/user.service";
import { FileService } from "../../services/files.service";
import { AppUser, EmployeeRequest } from "../../model/AppUser";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { snackBarConfig } from "../../shared/constants";
import { AppUserRequest } from "../../model/AppUserRequest";
import * as sha512 from "js-sha512";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { RentalAppFile } from "../../model/RentalAppFile";

export interface UserModalData {
    origin: 'Profile details' | 'Users';
    user: AppUser | null
}

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit, OnDestroy {
    profileForm: FormGroup = {} as FormGroup;
    user: AppUser | null = null;
    selectedFile: File | null = null;
    selectedFileName = '';
    fileUrl: string | ArrayBuffer | null = null;
    fileUrlOriginal: string | null = null;
    isEditMode = false;
    subscriptions = new Subscription();
    resetPassword = false;
    roles = ['Admin', 'Operator', 'Manager'];

    constructor(private _userStoreService: UserStoreService,
                private _fileService: FileService,
                private _userService: UserService,
                private _snackBar: MatSnackBar,
                private _dialogRef: MatDialogRef<UserModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: UserModalData) {
    }


    ngOnInit(): void {
        if (this.data.origin === 'Profile details') {
            this.user = this._userStoreService.getLoggedInUser();
            if (this.user === null) {
                //TODO: Handle error
            } else {
                this.buildProfileForm(this.user);
                if (this.user.profilePicture) {
                    this.getFile();
                    this.selectedFileName = this.user.profilePicture.name;
                } else {
                    //TODO: Put here file urls to null or empty string
                }
            }
        } else if (this.data.origin === 'Users' && this.data.user !== null) {
            this.user = this.data.user;
            this.isEditMode = true;
            this.buildProfileForm(this.user);
            if (this.user.profilePicture) {
                this.getFile();
                this.selectedFileName = this.user.profilePicture.name;
            } else {
                //TODO: Put here file urls to null or empty string
            }
        } else if (this.data.origin === 'Users' && this.data.user === null) {
            this.user = {} as AppUser;
            this.isEditMode = false;
            this.buildProfileForm(this.user);
        } else {
            //TODO: Handle error
        }
    }

    getFile(): void {
        this.subscriptions.add(
            this._fileService.getFileById(this.user?.profilePicture.id ?? 0).subscribe(
                (data: Blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(data);
                    reader.onloadend = () => {
                        this.fileUrl = reader.result;
                        this.fileUrlOriginal = reader.result as string;
                    };
                },
                error => {
                    //TODO: Handle error
                    console.error('Error retrieving file:', error);
                }
            ));
    }

    buildProfileForm(user: AppUser): void {
        if (this.data.origin === 'Profile details' ||
            (this.data.origin === 'Users' && this.isEditMode)) {
            this.profileForm = new FormGroup({
                firstName: new FormControl(user.firstName, Validators.required),
                lastName: new FormControl(user.lastName, Validators.required),
                username: new FormControl(user.username, Validators.required),
                password: new FormControl(user.password, Validators.required),
                role: new FormControl(user.role, Validators.required),
                email: new FormControl(user.email, Validators.required),
                phone: new FormControl(user.phone, Validators.required),
                profilePicture: new FormControl(user.profilePicture?.name || null)
            });
        } else {
            this.profileForm = new FormGroup({
                firstName: new FormControl(null, Validators.required),
                lastName: new FormControl(null, Validators.required),
                username: new FormControl('', Validators.required),
                role: new FormControl('', Validators.required),
                email: new FormControl(null, Validators.required),
                phone: new FormControl(null, Validators.required),
                profilePicture: new FormControl(null)
            });
        }
    }

    onDiscardChanges(): void {
        this.buildProfileForm(this.user ?? {} as AppUser);
        this.fileUrl = this.fileUrlOriginal;
        this._dialogRef.close();
    }

    onSaveChanges(): void {
        let password = '';
        let doResetPassword = this.data.origin === 'Users' && this.resetPassword;
        if (doResetPassword) {
            password = this.getPasswordHash(`${this.user!.username}_${this.profileForm.get('role')?.value}`);
        }

        if (this.data.origin === 'Profile details') {
            const profileDetails: AppUser = {
                id: this.user!.id,
                phone: this.profileForm.get('phone')?.value,
                email: this.profileForm.get('email')?.value,
                firstName: this.profileForm.get('firstName')?.value,
                profilePicture: this.user!.profilePicture,
                lastName: this.profileForm.get('lastName')?.value,
                username: this.user!.username,
                password: this.user!.password,
                role: this.profileForm.get('role')?.value,
                deleted: false
            }
            if (this.user?.profilePicture?.name !== this.selectedFileName) {
                this.uploadNewPictureAndEditProfileDetails(profileDetails);
            } else {
                this.editProfileDetails({...profileDetails, profilePictureId: this.user?.id});
            }
        }
        if (this.data.origin === 'Users' && this.isEditMode) {
            const editedUser: AppUser = {
                id: this.user!.id,
                phone: this.profileForm.get('phone')?.value,
                email: this.profileForm.get('email')?.value,
                firstName: this.profileForm.get('firstName')?.value,
                profilePicture: this.user!.profilePicture,
                lastName: this.profileForm.get('lastName')?.value,
                username: this.user!.username,
                password: doResetPassword ? password : this.user!.password,
                role: this.profileForm.get('role')?.value,
                deleted: false
            }
            if (this.user?.profilePicture?.name !== this.selectedFileName) {
                this.uploadNewPictureAndEditUser(editedUser);
            } else {
                this.editUser({...editedUser, profilePictureId: this.user?.id});
            }
        } else if (this.data.origin === 'Users' && !this.isEditMode) {
            const newUser: EmployeeRequest = {
                phone: this.profileForm.get('phone')?.value,
                email: this.profileForm.get('email')?.value,
                firstName: this.profileForm.get('firstName')?.value,
                profilePicture: {} as RentalAppFile,
                lastName: this.profileForm.get('lastName')?.value,
                username: this.profileForm.get('username')?.value,
                password: this.getPasswordHash(`${this.user!.username}_${this.profileForm.get('role')?.value}`),
                role: this.profileForm.get('role')?.value,
                deleted: false
            }
            //TODO: Check what if picture is not selected
            this.uploadNewPictureAndCreateUser(newUser);
        }
        this._dialogRef.close();
    }

    getPasswordHash(password: string): string {
        return sha512.sha512(password);
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.displaySelectedFile(file);
        }
        this.selectedFile = event.target.files[0];
    }

    displaySelectedFile(file: File) {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.fileUrl = event.target?.result?.toString() ?? null;
            this.selectedFileName = file.name;
            this.profileForm.get('profilePicture')?.setValue(file.name);
        };
        reader.readAsDataURL(file);
    }

    editProfileDetails(user: AppUserRequest): void {
        this._userService.editUser(user.id, user).subscribe(res => {
            this.updateUserStore(res);
            this._snackBar.open("Profile details successfully updated.", "OK", snackBarConfig);
            this._dialogRef.close(true);
        });
    }

    updateUserStore(user: AppUser): void {
        this._userStoreService.setUserAsLoggedIn(user);
        this.user = this._userStoreService.getLoggedInUser();
    }

    editUser(user: AppUserRequest): void {
        this._userService.editUser(user.id, user).subscribe((user: AppUser) => {
            this._snackBar.open("User successfully updated.", "OK", snackBarConfig);
            this._dialogRef.close(user);
        });
    }

    uploadNewPictureAndEditUser(user: AppUser): void {
        this._fileService.uploadFile(this.selectedFile).pipe(
            switchMap((response: any) => {
                return this._userService.editUser(user.id, {...user, profilePictureId: response.id});
            })
        ).subscribe(
            (user: AppUser) => {
                this._snackBar.open("User successfully updated.", "OK", snackBarConfig);
                this._dialogRef.close(user);
            },
            error => {
                console.error('Error uploading file or saving user data:', error);
            }
        );
    }

    uploadNewPictureAndEditProfileDetails(user: AppUser): void {
        this._fileService.uploadFile(this.selectedFile).pipe(
            switchMap((response: any) => {
                return this._userService.editUser(user.id, {...user, profilePictureId: response.id});
            })
        ).subscribe(
            (user: AppUser) => {
                this._dialogRef.close(user);
                this._snackBar.open("Profile details successfully updated.", "OK", snackBarConfig);
            },
            error => {
                console.error('Error uploading file or saving user data:', error);
            }
        );
    }

    uploadNewPictureAndCreateUser(employeeRequest: EmployeeRequest): void {
        this._fileService.uploadFile(this.selectedFile).pipe(
            switchMap((response: any) => {
                return this._userService.createUser({...employeeRequest, profilePicture: response});
            })
        ).subscribe(
            (user: AppUser) => {
                this._dialogRef.close(user);
            },
            error => {
                console.error('Error uploading file or saving user data:', error);
            }
        );
    }

    onDoPasswordChange(event: MatSlideToggleChange): void {
        this.resetPassword = event.checked;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
