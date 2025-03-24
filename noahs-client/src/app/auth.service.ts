import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logOutTimer: any
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated())
  authStatus$ = this.authStatus.asObservable()

  constructor() { }

  login(token: string) {
    const expirationTime = new Date().getTime() + 4 * 60 * 60 * 1000; // 4 hours

    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", expirationTime.toString());

    this.setAutoLogout(4 * 60 * 60 * 1000);
    this.authStatus.next(true)
    window.location.href = "/"
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    this.authStatus.next(false)
    console.log("User logged out due to token expiration.");
    window.location.href = "/"
  }

  setAutoLogout(expirationTime: number) {
    if (this.logOutTimer) clearTimeout(this.logOutTimer);
    this.logOutTimer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (!token || !expiry) return false;

    if (new Date().getTime() > parseInt(expiry, 10)) {
      this.logout();
      return false;
    }

    return true;
  }
}
