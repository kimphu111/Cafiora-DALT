import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  accessToken: string;
  role: string;
  username: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/users';
  private apiUrlCashier = 'http://localhost:8000/api/cashier';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password },
      {
        headers: headers,
        withCredentials: true
      }
    );
  }

  register(data: any): Observable<any> {
    const token = localStorage.getItem('accessToken') || ''; // lấy accessToken

    return this.http.post(`${this.apiUrlCashier}/cashierRegister`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true // gửi cookie/session kèm
    });
  }
}
