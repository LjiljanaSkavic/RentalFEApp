import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { AppUser } from "../model/AppUser";
import { LocalStorageService } from "./local-storage.service";
@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  isLoggedIn$ = new Subject<boolean>();
  private _isLoggedIn = false;

  constructor(private _localStorageService: LocalStorageService) {
  }

  getIsLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  setUserAsLoggedIn(user: AppUser): void {
    this._localStorageService.saveData('loggedUser', JSON.stringify(user));
    this._isLoggedIn = true;
  }

  setUserAsLoggedOut(): void {
    this._localStorageService.removeData('loggedUser');
    this._isLoggedIn = false;
  }

  getLoggedInUser(): AppUser | null {
    const userString = this._localStorageService.getData('loggedUser');
    if (userString !== null) {
      const user: AppUser = JSON.parse(userString);
      return user;
    } else {
      return null;
    }
  }
}
