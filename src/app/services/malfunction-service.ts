import { MalfunctionRequest } from "../model/malfunction";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

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
}
