import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdoptionComponent } from './admin-adoption.component';

describe('AdminAdoptionComponent', () => {
  let component: AdminAdoptionComponent;
  let fixture: ComponentFixture<AdminAdoptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdoptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
