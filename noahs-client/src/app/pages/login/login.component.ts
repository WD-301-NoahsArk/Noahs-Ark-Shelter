import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../http.service';
import { ButtonComponent } from '../../component/button/button.component';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [HttpService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoggedIn = false
  errorMessage: string = ''

  constructor(private http: HttpService, private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;

      if (status) {
        this.router.navigate(['/admin/adoption']);
        return
      }
    });
  }

  loginFunc() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      this.errorMessage = "Email and password are required.";
      return;
    }

    this.http.loginAdmin(email, password).subscribe({
      next: (res) => {
        this.authService.login(res.token);
        console.log("Login successful!");
      },
      error: (err) => {
        this.errorMessage = "Invalid email or password.";
        console.error("Login failed:", err);
      }
    });

    this.loginForm.reset();
  }

  adoptFunc = () => {
    window.location.href = '/adoption'
  }
}

