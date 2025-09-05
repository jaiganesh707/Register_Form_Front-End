import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenStorage } from '../services/token-storage';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  userCode: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

interface JwtPayload {
  sub?: string; 
  email?: string;    
  roles?: string[]; 
  exp?: number;    
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
  username: string = '';
  email: string = '';
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  hasDataLoaded: boolean = false;

slides = [
  { image: 'https://picsum.photos/seed/1/700/300' },
  { image: 'https://picsum.photos/seed/2/700/300' },
  { image: 'https://picsum.photos/seed/3/700/300' },
  { image: 'https://picsum.photos/seed/4/700/300' }
];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
private tokenStorage: TokenStorage,private auth:Auth,private router :Router,
    private cdr: ChangeDetectorRef
) {}

   ngOnInit(): void {
    console.log('Dashboard initialized');
    this.validateTokenAndLoadData();
      // this.loadUsers();
  }

  private validateTokenAndLoadData(): void {
    const token = this.tokenStorage.getAccessToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.username = decoded.sub || 'Guest';
      this.email = decoded.email || '';
      } catch (e) {
      console.error('Invalid token:', e);
      this.tokenStorage.clearTokens();
      this.router.navigate(['/login']);
    }
  }

loadUsers(): void {
  this.isLoading = true;
  this.errorMessage = '';
  this.auth.getAllUsers().subscribe({
   next: (response: any) => {
      if (Array.isArray(response)) {
        this.users = response;
      } else if (response?.data && Array.isArray(response.data)) {
        this.users = response.data;
      } else {
        this.users = [];
      }
      this.isLoading = false;
      this.hasDataLoaded = true;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading users:', error);
      this.errorMessage = 'Failed to load user data. Please try again.';
      this.isLoading = false;
      this.hasDataLoaded = true;
      this.cdr.detectChanges();
    },
  });
  } 
}
