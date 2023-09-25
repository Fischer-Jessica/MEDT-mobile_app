import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';

describe('AppComponent', (): void => {

    beforeEach(async (): Promise<void> => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    it('should create the app', (): void => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
