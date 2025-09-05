import { Component } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

import { TokenStorage } from '../services/token-storage';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
 username: string = '';
  password: string = '';

   constructor(
    private authService: Auth,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.tokenStorage.setTokens(res.accessToken, res.refreshToken);
        if (res.user) {
          sessionStorage.setItem('auth-user', JSON.stringify(res.user));
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Invalid username or password!');
        console.error('Login failed:', err);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
