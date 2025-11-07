import { Component } from '@angular/core';
import { Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = '';

  constructor(
    private authService: AuthService,
    private router:Router,
  ){}

  onSubmit(){
    if(!this.username || !this.email || !this.password || !this.confirmPassword || !this.role){
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if(this.password !==this.confirmPassword){
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    const data = {
      username : this.username,
      email : this.email,
      password : this.password,
      role : this.role,
    }

    this.authService.register(data).subscribe({
      next: (res) =>{
        console.log("register success: ", res);
        alert("Account created successfully!");
        this.router.navigate(['/login']);
      },
      error: (err) =>{
        console.log("register error: ", err);
        alert(err.error?.message ||'Đăng ký thất bại');
      }
    })
  }
}
