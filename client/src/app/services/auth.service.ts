import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/users';
  private apiUrlCashier = 'http://localhost:8000/api/cashier';

  constructor(private http: HttpClient) {}

  // 🔐 Hàm đăng nhập có gửi kèm credentials và log phản hồi
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Observable((observer) => {
      this.http.post(
        `${this.apiUrl}/login`,
        { email, password },
        {
          headers: headers,
          withCredentials: true,
        }
      ).subscribe({
        next: (res) => {
          console.log('Phản hồi đăng nhập:', res);
          observer.next(res);
          observer.complete();
        },
        error: (err) => {
          console.error('Lỗi đăng nhập:', err);
          observer.error(err);
        }
      });
    });
  }


  // 🔐 Hàm đăng ký có token
  register(data: any): Observable<any> {
    const token = localStorage.getItem('token') || '';

    return this.http.post(`${this.apiUrlCashier}/cashierRegister`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true // gửi cookie/session kèm nếu cần
    });
  }
}
