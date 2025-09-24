import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorage } from './token-storage';
import { User } from '../dashboard/dashboard';


interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}
@Injectable({
  providedIn: 'root'
})
export class Auth {
  private live_url = 'https://register-form-is46.onrender.com/';  // Spring Boot backend URL
  private local_url = 'http://localhost:8081/';  // Local backend URL for testing
  private user_url=this.live_url;

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  // Common header builder
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.user_url}api/auth/signin`, { username, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.user_url}api/auth/signup`, user);
  }

   refreshToken(): Observable<any> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return this.http.post(`${this.user_url}api/auth/refresh-token`, { refreshToken });
  }

  getAllUsers() : Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.user_url}user/list`, { headers: this.getAuthHeaders()} );
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.user_url}user/${id}`, {  headers: this.getAuthHeaders() });
  } 

  deleteUser(id: number): Observable<any> {
    return this.http.post(`${this.user_url}user/delete/${id}`,{},
    { headers: this.getAuthHeaders()});
  }
}
