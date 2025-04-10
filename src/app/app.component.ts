import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginComponent } from "./component/login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { animate, AUTO_STYLE, state, style, transition, trigger } from "@angular/animations";
import { UserStoreService } from "./services/user-store.service";
import { AppUser } from "./model/AppUser";
import { Subscription } from "rxjs";
import { UserModalComponent } from "./component/user-modal/user-modal.component";
import { ManagePasswordModalComponent } from "./component/manage-password-modal/manage-password-modal.component";

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
export class AppComponent implements OnInit, OnDestroy {
    user: AppUser | null = null;
    subscription = new Subscription();
    collapsed = true;

    constructor(private _userStoreService: UserStoreService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _elRef: ElementRef,
                public dialog: MatDialog) {
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const clickedToggleProfile = this._elRef.nativeElement.querySelector('.user-modal').contains(event.target);
        const clickedInsideProfileCard = this._elRef.nativeElement.querySelector('.quick-profile-view-card').contains(event.target);

        if (!clickedToggleProfile && !clickedInsideProfileCard && !this.collapsed) {
            this.collapsed = true;
        }
    }

    ngOnInit(): void {
        this.user = this._userStoreService.getLoggedInUser();
        if (this.user !== null) {
            this._userStoreService.setUserAsLoggedIn(this.user);
        } else {
            this.openLogin();
        }

        this.subscribeToUserChanges();
    }

    openLogin(): void {
        const dialogRef = this.dialog.open(LoginComponent,
            {
                disableClose: true,
                hasBackdrop: true,
                backdropClass: 'rentals-app-backdrop'
            });
        dialogRef.afterClosed().subscribe((user) => {
            this._userStoreService.setUserAsLoggedIn(user);
            this._userStoreService.isLoggedIn$.next(true);
        });
    }

    subscribeToUserChanges(): void {
        this.subscription.add(this._userStoreService.isLoggedIn$.subscribe(res => {
            if (res) {
                this.user = this._userStoreService.getLoggedInUser();
                this._changeDetectorRef.detectChanges();
            } else {
                this.user = null;
                this._changeDetectorRef.detectChanges();
            }
        }));
    }

    onProfileDetailsClick(): void {
        this.collapsed = true;
        this.dialog.open(UserModalComponent, {
                data: {
                    origin: "Profile details"
                },
                hasBackdrop: true,
                backdropClass: 'rentals-app-backdrop'
            }
        ).afterClosed().subscribe(() => {
        });
    }

    onChangePasswordClick(): void {
        this.collapsed = true;
        this.dialog.open(ManagePasswordModalComponent, {
                hasBackdrop: true,
                backdropClass: 'rentals-app-backdrop'
            }
        ).afterClosed().subscribe(
            () => {
            });
    }

    onLogOutClick(): void {
        if (this.user !== null) {
            this.collapsed = true;
            this._userStoreService.setUserAsLoggedOut();
            this._userStoreService.isLoggedIn$.next(false);
            window.location.reload();
        }
    }

    onRentalAppClick(): void {

    }

    onToggleAccountMenuClick(): void {
        this.collapsed = !this.collapsed;
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
