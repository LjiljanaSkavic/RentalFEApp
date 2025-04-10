import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserStoreService } from "../../services/user-store.service";
import { UserService } from "../../services/user.service";
import { FileService } from "../../services/files.service";
import { AppUser } from "../../model/AppUser";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { snackBarConfig } from "../../shared/constants";
import { AppUserRequest } from "../../model/AppUserRequest";

export interface UserModalData {
    origin: 'Profile details' | 'Users';
    user: AppUser | null
}

@Component({
    selector: 'app-profile-details-modal',
    templateUrl: './profile-details-modal.component.html',
    styleUrls: ['./profile-details-modal.component.scss']
})
export class ProfileDetailsModalComponent implements OnInit, OnDestroy {
    profileForm: FormGroup = {} as FormGroup;
    user: AppUser | null = null;
    selectedFile: File | null = null;
    selectedFileName = '';
    fileUrl: string | ArrayBuffer | null = null;
    fileUrlOriginal: string | null = null;
    isEditMode = false;
    subscriptions = new Subscription();

    constructor(private _userStoreService: UserStoreService,
                private _fileService: FileService,
                private _userService: UserService,
                private _snackBar: MatSnackBar,
                private _dialogRef: MatDialogRef<ProfileDetailsModalComponent>,
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
                role: new FormControl(user.role, Validators.required),
                email: new FormControl(user.email, Validators.required),
                phone: new FormControl(user.phone, Validators.required),
                profilePicture: new FormControl(user.profilePicture?.name || null)
            });
        } else {
            this.profileForm = new FormGroup({
                firstName: new FormControl(null, Validators.required),
                lastName: new FormControl(null, Validators.required),
                username: new FormControl(null, Validators.required),
                role: new FormControl(null, Validators.required),
                email: new FormControl(null, Validators.required),
                phone: new FormControl(null, Validators.required),
                profilePicture: new FormControl(null)
            });
        }
    }

    onDiscardProfileChanges(): void {
        this.buildProfileForm(this.user ?? {} as AppUser);
        this.fileUrl = this.fileUrlOriginal;
        this._dialogRef.close();
    }

    onSaveProfileChanges(): void {
        const editedUser: AppUser = {
            id: this.user!.id,
            phone: this.profileForm.get('phone')?.value,
            email: this.profileForm.get('email')?.value,
            firstName: this.profileForm.get('firstName')?.value,
            profilePicture: this.user!.profilePicture,
            lastName: this.profileForm.get('lastName')?.value,
            username: this.user!.username,
            role: this.profileForm.get('role')?.value,
            deleted: false
        }
        if (this.user?.profilePicture?.name !== this.selectedFileName) {
            this.uploadNewPictureAndSaveUser(editedUser);
        } else {
            this.saveUser({...editedUser, imageId: this.user?.id});
        }
        this._dialogRef.close();
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

    saveUser(user: AppUserRequest): void {
        this._userService.editUser(user).subscribe(res => {
            this._userStoreService.setUserAsLoggedIn(res);
            this.user = this._userStoreService.getLoggedInUser();
            this._snackBar.open("User details successfully updated.", "OK", snackBarConfig);
        });
    }

    uploadNewPictureAndSaveUser(user: AppUser): void {
        this._fileService.uploadFile(this.selectedFile).pipe(
            switchMap((response: any) => {
                return this._userService.editUser({...user, imageId: response.id});
            })
        ).subscribe(
            res => {
                this._userStoreService.setUserAsLoggedIn(res);
                this.user = this._userStoreService.getLoggedInUser();
            },
            error => {
                console.error('Error uploading file or saving user data:', error);
            }
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
