import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpTestComponent } from './http-test/http-test.component';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    HttpTestComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    HttpService,
  ]
})
export class AppComponent {
  title = 'noahs-client';
}
