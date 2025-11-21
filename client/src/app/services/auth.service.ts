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

  // ------------------ AUTH ------------------
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  }

  register(data: any): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrlCashier}/cashierRegister`, data, {
      headers,
      withCredentials: true
    });
  }

  // ------------------ PRODUCT ------------------
  getAllProducts(): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrlCashier.replace('/cashier','')}/getProduct`, { headers });
  }



  uploadProduct(formData: FormData): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrlCashier}/uploadProduct`, formData, { headers });
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = { Authorization: `Bearer ${token}` }; // object bình thường, đừng dùng HttpHeaders nếu override

    return this.http.put(`${this.apiUrlCashier}/updateProduct/${id}`, formData, { headers });
  }

  deleteProduct(id: string): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrlCashier}/deleteProduct/${id}`, { headers });
  }


}
