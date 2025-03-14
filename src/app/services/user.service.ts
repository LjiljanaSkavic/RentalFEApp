import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppUser } from "../model/AppUser";
import { Observable } from "rxjs";
import { AppUserRequest } from "../model/AppUserRequest";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedUser: AppUser | null = null;
  baseUrl = "http://localhost:9000/user";

  constructor(private _httpClient: HttpClient) {
  }

  isLoggedIn(): boolean {
    return this.loggedUser !== null;
  }

  findUserByUsernameAndPassword(username: string, password: string): Observable<AppUser> {
    const loginUserInfo = {
      username: username,
      password: password
    }

    const loginUrl = `${this.baseUrl}/login`;
    return this._httpClient.post<AppUser>(loginUrl, loginUserInfo, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  editUser(user: AppUserRequest): Observable<AppUser> {
    const editUserUrl = `${this.baseUrl}/${user.id}`;
    return this._httpClient.put<AppUser>(editUserUrl, user);
  }

}
