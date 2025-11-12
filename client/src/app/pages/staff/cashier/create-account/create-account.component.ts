import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-account',
    imports: [
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent  implements OnInit {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = '';
  currentRole = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentRole = localStorage.getItem('role') || '';

    if (this.currentRole !== 'cashier') {
      this.role = 'user';
    }
  }

  onSubmit() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword || !this.role) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: 'user',
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        console.log('register success:', res);
        alert('Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('register error:', err);
        alert(err.error?.message || 'Đăng ký thất bại');
      }
    });
  }
}
