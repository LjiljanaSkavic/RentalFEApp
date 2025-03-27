import { Injectable } from '@angular/core';
import { SearchResult } from "../model/SearchResult";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Rental } from "../model/Rental";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  baseUrl = "http://localhost:9000/rentals";

  constructor(private _httpClient: HttpClient) {
  }

  getRentals(page: number, size: number): Observable<SearchResult<Rental>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())

    return this._httpClient.get<SearchResult<Rental>>(this.baseUrl, {params});
  }
}
