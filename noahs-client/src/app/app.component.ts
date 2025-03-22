import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from "./component/footer/footer.component";
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ HttpService ]
})
export class AppComponent implements OnInit {
  title = 'noahs-client';

  ngOnInit(): void {
    initFlowbite();
  }

  onSubmit() {
    console.log('Confirmation button clicked!');
    alert('Confirmation successful!');
  }
}
