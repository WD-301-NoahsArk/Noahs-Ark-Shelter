import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../http.service';
import { ButtonComponent } from '../../component/button/button.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [HttpService]
})
export class LoginComponent {
  loginFunc() {
    console.log("login clicked");
  }
}
