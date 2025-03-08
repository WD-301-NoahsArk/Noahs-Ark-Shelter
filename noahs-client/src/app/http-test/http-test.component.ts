import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-http-test',
  imports: [
    CommonModule,
  ],
  templateUrl: './http-test.component.html',
  styleUrl: './http-test.component.css',
  providers: [ HttpService ]
})
export class HttpTestComponent {
  testData$: Observable<any>

  constructor(private http: HttpService) {
    this.testData$ = this.http.getTest()
  }
}
