import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AppUser, Client, EmployeeRequest } from "../model/AppUser";
import { Observable } from "rxjs";
import { AppUserRequest } from "../model/AppUserRequest";
import { SearchResult } from "../model/SearchResult";

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

    getUsers(page: number = 0, size: number = 10, type: string): Observable<SearchResult<AppUser | Client>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('type', type.toString());

        return this._httpClient.get<SearchResult<AppUser | Client>>(this.baseUrl, {params});
    }


    changePassword(userId: number, currentPassword: string, newPassword: string) {
        const changePasswordUrl = `${this.baseUrl}/change-password/${userId}`;
        const changePasswordData = {
            currentPassword: currentPassword,
            newPassword: newPassword
        }
        return this._httpClient.post(changePasswordUrl, changePasswordData)
    }

    editUser(user: AppUserRequest): Observable<AppUser> {
        const editUserUrl = `${this.baseUrl}/${user.id}`;
        return this._httpClient.put<AppUser>(editUserUrl, user);
    }

    createUser(employeeRequest: EmployeeRequest): Observable<AppUser> {
        return this._httpClient.post<AppUser>(this.baseUrl, employeeRequest);
    }

    deleteById(id: number): Observable<boolean> {
        return this._httpClient.delete<boolean>(`${this.baseUrl}/${id}`);
    }

    manageBlock(id: number): Observable<boolean> {
        return this._httpClient.post<boolean>(`${this.baseUrl}/manage-block/${id}`, {});
    }
}
