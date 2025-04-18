import { Malfunction, MalfunctionRequest } from "../model/Malfunction";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SearchResult } from "../model/SearchResult";

@Injectable({
    providedIn: 'root'
})
export class MalfunctionService {
    baseUrl = "http://localhost:9000/malfunction";

    constructor(private _httpClient: HttpClient) {
    }

    create(malfunctionRequest: MalfunctionRequest): Observable<any> {
        return this._httpClient.post<MalfunctionRequest>(this.baseUrl, malfunctionRequest);
    }

    deleteById(id: number): Observable<boolean> {
        return this._httpClient.delete<boolean>(`${this.baseUrl}/${id}`);
    }

    getAll(page: number, size: number): Observable<SearchResult<Malfunction>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())

        return this._httpClient.get<SearchResult<Malfunction>>(this.baseUrl, {params});
    }
}
