import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperTableViewComponent } from './developer-table-view.component';

describe('DeveloperTableViewComponent', () => {
  let component: DeveloperTableViewComponent;
  let fixture: ComponentFixture<DeveloperTableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperTableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
