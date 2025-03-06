import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnfantEncadrantsComponent } from './enfant-encadrants.component';

describe('EnfantEncadrantsComponent', () => {
  let component: EnfantEncadrantsComponent;
  let fixture: ComponentFixture<EnfantEncadrantsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnfantEncadrantsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnfantEncadrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
