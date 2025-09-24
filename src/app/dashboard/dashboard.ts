import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenStorage } from '../services/token-storage';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

export interface User {
  id: number;
  userCode: string; 
  username: string;
  email: string;
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
  faEye = faEye;
  faTrash = faTrash;
  username: string = '';
  email: string = ''; 
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  hasDataLoaded: boolean = false; 
  selectedUser: User | null = null;   // ✅ add selected user for modal

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


private userCache = new Map<number, User>();
// selectedUser: any = null;
loading: boolean = false;

//view user details in modal
   viewUser(id: number): void {
      this.loading = true;
    this.selectedUser = null;

     if (this.userCache.has(id)) {
    this.selectedUser = this.userCache.get(id)!;
    this.openModal();
    return;
  }
    this.auth.getUser(id).subscribe({
      next: (response: any) => {
      const user = response?.data || response;
      this.selectedUser = user;
      this.loading = false;

      // ✅ Save in cache
      this.userCache.set(id, user);
this.cdr.detectChanges();   // ✅ force Angular to update modal

      this.openModal();
      return;
    },
    error: (error) => {
      console.error('Error fetching user:', error);
      this.loading = false;
      alert('Failed to load user details');
    }
  });
  }


private openModal(): void {
  const modalElement = document.getElementById('userDetailModal');
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show(); 
  }
}
  // ✅ delete user
  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.auth.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        alert('User deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    });
  }

  refreshUser(id: number): void {
  this.auth.getUser(id).subscribe({
    next: (response: any) => {
      const user = response?.data || response;
      this.selectedUser = user;
      this.userCache.set(id, user); // update cache

            this.loading = false;
   this.cdr.detectChanges();  // ✅ important
      this.openModal();
    },
    error: (err) => {
      console.error('Error refreshing user:', err);
     this.loading = false;
      alert('Failed to load user details');
    }
  });
}

}
