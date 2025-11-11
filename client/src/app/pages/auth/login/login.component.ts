import { Component } from '@angular/core';
import { AuthService, LoginResponse } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login.component',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: LoginResponse) => {
        if (res.success) {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('role', res.role);
          localStorage.setItem('username', res.username);

          if (res.role === 'barista') {
            this.router.navigate(['/barista']);
          } else if (res.role === 'cashier') {
            this.router.navigate(['/register']);
          } else if (res.role === 'user') {
            this.router.navigate(['/home']);
          } else if (res.role === 'waiter') {
            this.router.navigate(['/waiter']);
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Đăng nhập thất bại';
      }
    });
  }
}
