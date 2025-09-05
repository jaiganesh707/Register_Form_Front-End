import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenStorage } from './token-storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorage, private router: Router) {}

  canActivate(): boolean {
    const token = this.tokenStorage.getAccessToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        this.tokenStorage.clearTokens();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
