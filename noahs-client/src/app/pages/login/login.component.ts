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
  token = ""
  getLoginCredentials() {
    let htmlEmail = document.querySelector("#email") as HTMLInputElement;
    let htmlPass = document.querySelector("#user_pass") as HTMLInputElement;
    let email = htmlEmail.value;
    let pass = htmlPass.value;

    htmlEmail.value = "";
    htmlPass.value = "";
    return { userEmail: email, userPass: pass };
  }

  constructor(private http: HttpService) { }

  // janedoe@example.com
  // secpass
  loginFunc() {
  let { userEmail, userPass } = this.getLoginCredentials();
    this.http.loginAdmin(userEmail, userPass).subscribe(res => {
      this.token = res.token;
      this.http.goAdmin(this.token).subscribe(res => {
        console.log(res.message)
      });
    })
  }

}
