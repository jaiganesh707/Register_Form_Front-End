import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
username = '';
  email = '';
  password = '';
  message: string | null = null;
  isError: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  onRegister() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password
    };

  this.auth.register(user).subscribe({
      next: (res) => {
        this.isError = false;
        this.message = '✅ Registration successful! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 2000); // redirect after 2s
      },
      error: (err) => {
        this.isError = true;
        if (err.error?.message) {
          this.message = `❌ ${err.error.message}`;
        } else {
          this.message = '❌ Registration failed!';
        }
          alert(this.message);   // ✅ Show error in popup
      }
    });
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }
}
