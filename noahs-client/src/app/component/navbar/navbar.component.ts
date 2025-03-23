import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpService } from '../../http.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [HttpService, AuthService]
})
export class NavbarComponent {
  isLoggedIn: boolean = false

  constructor(private http: HttpService, private authService: AuthService) { }

}
