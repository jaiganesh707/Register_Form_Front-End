import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Auth } from './auth';
import { TokenStorage } from './token-storage';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenStorage: TokenStorage,
    private auth: Auth,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenStorage.getAccessToken();
    let authReq = req;

    if (accessToken) {
      authReq = this.addTokenHeader(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token expired → try refresh
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenStorage.getRefreshToken();
      if (refreshToken) {
        return this.auth.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;

            const newAccessToken = response?.accessToken;
            const newRefreshToken = response?.refreshToken || refreshToken;

            if (newAccessToken) {
              this.tokenStorage.setTokens(newAccessToken, newRefreshToken);
              this.refreshTokenSubject.next(newAccessToken);
              return next.handle(this.addTokenHeader(request, newAccessToken));
            } else {
              this.logoutUser();
              return throwError(() => new Error('Failed to refresh token'));
            }
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.logoutUser();
            return throwError(() => err);
          })
        );
      } else {
        this.logoutUser();
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addTokenHeader(request, token!)))
    );
  }

  private logoutUser() {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
