import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Manufacturer } from "../model/Manufacturer";
import { Pricing } from "../model/Pricing";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PricingService {

    baseUrl = "http://localhost:9000/pricing";

    constructor(private _httpClient: HttpClient) {
    }

    getAll(): Observable<Pricing[]> {
        return this._httpClient.get<Pricing[]>(this.baseUrl);
    }

    update(pricingId: number, pricingRequest: Pricing): Observable<any> {
        return this._httpClient.put<Manufacturer>(`${this.baseUrl}/${pricingId}`, pricingRequest);
    }
}
