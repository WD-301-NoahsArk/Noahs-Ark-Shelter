import { Component } from '@angular/core';
import { TestService } from '../test.service'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-httpclient',
  imports: [ CommonModule ],
  templateUrl: './httpclient.component.html',
  styleUrl: './httpclient.component.css',
  providers: [ TestService ],
})
export class HttpclientComponent {
  testData$: Observable<any>;

  constructor(private testService: TestService) {
      this.testData$ = this.testService.getTest();
  }
}
