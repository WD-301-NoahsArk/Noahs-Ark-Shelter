import { Component, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpclientComponent } from './httpclient/httpclient.component'
import { TestService } from './test.service';
import { NavbarComponent } from './component/navbar/navbar.component';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HttpClientModule,
    HttpclientComponent,
    NavbarComponent,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ TestService ]
})
export class AppComponent {
  title = 'noahs-client';
  ngOnInit(): void {
    initFlowbite();
  }

}


