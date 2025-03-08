import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpTestComponent } from './http-test.component';

describe('HttpTestComponent', () => {
  let component: HttpTestComponent;
  let fixture: ComponentFixture<HttpTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HttpTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
