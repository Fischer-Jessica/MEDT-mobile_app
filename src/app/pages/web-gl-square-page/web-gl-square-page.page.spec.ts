import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WebGLSquarePage} from './web-gl-square-page.page';

describe('WebGLSquarePagePage', (): void => {

    let fixture: ComponentFixture<WebGLSquarePage>;
    let component: WebGLSquarePage;

    beforeEach(async (): Promise<void> => {
        fixture = TestBed.createComponent(WebGLSquarePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component).toBeTruthy();
    });
});
