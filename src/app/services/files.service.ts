import { Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RentalAppFile } from "../model/RentalAppFile";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  baseUrl = "http://localhost:9000/files";
  private cache = new Map<number, Observable<Blob>>();

  constructor(private _httpClient: HttpClient) {
  }

  getFileById(id: number): Observable<Blob> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const request = this._httpClient.get(`${this.baseUrl}/${id}`, {responseType: 'blob'}).pipe(
      shareReplay(1),
      catchError(err => {
        this.cache.delete(id);
        return throwError(() => err);
      })
    );

    this.cache.set(id, request);
    return request;
  }


  uploadFile(file: any): Observable<RentalAppFile> {
    const formData = new FormData();
    formData.append('file', file);

    return this._httpClient.post<RentalAppFile>(`${this.baseUrl}/upload`, formData);
  }
}
