import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdReferencesComponent } from './md-references.component';

describe('MdReferencesComponent', () => {
  let component: MdReferencesComponent;
  let fixture: ComponentFixture<MdReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdReferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MdReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
