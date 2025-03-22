import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ManufacturerSearchResult } from "../model/ManufacturerSearchResult";
import { Manufacturer, ManufacturerRequest } from "../model/Manufacturer";

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  baseUrl = "http://localhost:9000/manufacturers";

  constructor(private _httpClient: HttpClient) {
  }

  getManufacturers(page: number = 0, size: number = 10): Observable<ManufacturerSearchResult> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this._httpClient.get<ManufacturerSearchResult>(this.baseUrl, {params});
  }

  createManufacturer(manufacturerRequest: ManufacturerRequest): Observable<Manufacturer> {
    return this._httpClient.post<Manufacturer>(`${this.baseUrl}`, manufacturerRequest);
  }

  updateManufacturer(manufacturerRequest: ManufacturerRequest, manufacturerId: number): Observable<Manufacturer> {
    return this._httpClient.put<Manufacturer>(`${this.baseUrl}/${manufacturerId}`, manufacturerRequest);
  }

  deleteById(id: number): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
