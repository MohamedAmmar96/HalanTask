import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface AuthResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<AuthResponse> {
    const url = this.baseUrl + '/login';
    return this.http.post<AuthResponse>(url, {
      username: username,
      password: password
    });
  }
}
