import { Component, Inject, OnInit ,PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorage } from '../services/token-storage';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit{
username: string = '';
  email: string = '';

 constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private router: Router,private tokenStorage: TokenStorage) {}
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        this.username = parsed.username || 'Guest';
        this.email = parsed.email || '';
      }
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      
      this.tokenStorage.clearTokens();
    }

    // Navigate to login
    this.router.navigate(['/login']).then(() => {
      // Prevent going back to dashboard
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    });
  }
}
