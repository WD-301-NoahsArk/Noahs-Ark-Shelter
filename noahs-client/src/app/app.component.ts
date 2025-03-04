import { Component, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpclientComponent } from './httpclient/httpclient.component'
import { TestService } from './test.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HttpClientModule,
    HttpclientComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ TestService ]
})
export class AppComponent {
  title = 'noahs-client';
}


