import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: boolean = false;

  constructor() {
    // Kiểm tra token trong localStorage khi service được khởi tạo
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.isLoggedIn = true;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
