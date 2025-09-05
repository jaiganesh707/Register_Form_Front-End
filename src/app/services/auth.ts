import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorage } from './token-storage';
import { User } from '../dashboard/dashboard';


interface ApiResponse {
  timestamp: string;
  status: number;
  message: string;
  data: User[];
}
@Injectable({
  providedIn: 'root'
})
export class Auth {
  private live_url = 'https://register-form-is46.onrender.com/';  // Spring Boot backend URL
  private local_url = 'http://localhost:8081/';  // Local backend URL for testing
  private user_url=this.live_url;

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.user_url}api/auth/signin`, { username, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.user_url}api/auth/signup`, user);
  }

   refreshToken(): Observable<any> {
    const token = this.tokenStorage.getRefreshToken();
    return this.http.post(`${this.user_url}api/auth/refresh-token`, { token });
  }

  getAllUsers(){
    const token = this.tokenStorage.getAccessToken();
    let headers = new HttpHeaders();
    return this.http.get<ApiResponse>(`${this.user_url}user/`, { headers: {
      Authorization: `Bearer ${token}`
    } });
  }
}
