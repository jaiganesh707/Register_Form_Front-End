import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  private accessKey = 'accessToken';
  private refreshKey = 'refreshToken';
  private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  // 🔹 Save tokens
  setTokens(accessToken: string, refreshToken: string): void {
    if (this.isBrowser) {
    sessionStorage.setItem(this.accessKey, accessToken);
    sessionStorage.setItem(this.refreshKey, refreshToken);
    }
  }

  // 🔹 Get tokens
  getAccessToken(): string | null {
    return this.isBrowser ? sessionStorage.getItem(this.accessKey) : null;
  }

  getRefreshToken(): string | null {
    return this.isBrowser ? sessionStorage.getItem(this.refreshKey) : null;
  }

  // 🔹 Clear tokens (logout)
  clearTokens(): void {
    if(this.isBrowser){
      sessionStorage.removeItem(this.accessKey);
      sessionStorage.removeItem(this.refreshKey);
    }
  }
}