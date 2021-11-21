import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
export interface Zone {
  label: string;
  color: string;
  points: LatLng[];
}

export interface LatLng {
  lat: string;
  lng: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl = environment.baseUrl;
  private token = 'Bearer ' + localStorage.getItem('token');
  constructor(private http: HttpClient) { }

  getZones() {
    const url = this.baseUrl + '/zones';
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    });
  }

  createZone(body: Zone): Observable<Zone> {
    const url = this.baseUrl + '/zones';

    return this.http.post<Zone>(url, {
      label: body.label,
      color: body.color,
      points: body.points
    }, {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    });
  }

  updateZone(zoneId: string, body: Zone): Observable<Zone> {
    const url = `${this.baseUrl}/zones/${zoneId}`;

    return this.http.put<Zone>(url, {
      label: body.label,
      color: body.color,
      points: body.points
    }, {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    });
  }

  deleteZone(zoneId: string): Observable<Zone> {
    const url = `${this.baseUrl}/zones/${zoneId}`;

    return this.http.delete<Zone>(url, {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    });
  }
}
