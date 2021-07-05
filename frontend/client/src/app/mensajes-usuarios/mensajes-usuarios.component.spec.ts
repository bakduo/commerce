import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesUsuariosComponent } from './mensajes-usuarios.component';

describe('MensajesUsuariosComponent', () => {
  let component: MensajesUsuariosComponent;
  let fixture: ComponentFixture<MensajesUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajesUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
