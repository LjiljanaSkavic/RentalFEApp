import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SearchResult } from "../model/SearchResult";
import { CarDetails, ElectricBikeDetails, ElectricScooterDetails, Vehicle } from "../model/Vehicle";
import { VehicleRequest } from "../model/VehicleRequest";
import { Manufacturer } from "../model/Manufacturer";
import { VehicleShort } from "../model/VehicleShort";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  baseUrl = "http://localhost:9000/vehicles";

  constructor(private _httpClient: HttpClient) {
  }

  getVehicles(page: number = 0, size: number = 10, category: string = ''): Observable<SearchResult<Vehicle>> {
    const camelCaseCategory = category.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase());

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('category', camelCaseCategory);

    return this._httpClient.get<SearchResult<Vehicle>>(this.baseUrl, {params});
  }

  deleteById(id: number): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  getAllShort(): Observable<VehicleShort[]> {
    return this._httpClient.get<VehicleShort[]>(`${this.baseUrl}/short`);
  }

  update(vehicleRequest: VehicleRequest, vehicleId: number): Observable<any> {
    return this._httpClient.put<Manufacturer>(`${this.baseUrl}/${vehicleId}`, vehicleRequest);
  }

  create(vehicleRequest: VehicleRequest): Observable<any> {
    return this._httpClient.post<VehicleRequest>(`${this.baseUrl}`, vehicleRequest);
  }

  getById(id: number): Observable<CarDetails | ElectricBikeDetails | ElectricScooterDetails> {
    return this._httpClient.get<CarDetails | ElectricBikeDetails | ElectricScooterDetails>(`${this.baseUrl}/${id}`);
  }
}
