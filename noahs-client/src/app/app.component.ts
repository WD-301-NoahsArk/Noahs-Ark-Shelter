import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpclientComponent } from './httpclient/httpclient.component';
import { TestService } from './test.service';
import { NavbarComponent } from './component/navbar/navbar.component';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from "./component/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HttpClientModule,
    HttpclientComponent,
    NavbarComponent,
    FooterComponent,
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Corrected property name
  providers: [ TestService ]
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
