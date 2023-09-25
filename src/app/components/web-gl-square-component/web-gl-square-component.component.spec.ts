import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {WebGLSquareComponent} from './web-gl-square-component.component';

describe('WebGLSquareComponentComponent', (): void => {

    let fixture: ComponentFixture<WebGLSquareComponent>;
    let component: WebGLSquareComponent;

    beforeEach(waitForAsync((): void => {
        TestBed.configureTestingModule({
            declarations: [WebGLSquareComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(WebGLSquareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', (): void => {
        expect(component).toBeTruthy();
    });
});
