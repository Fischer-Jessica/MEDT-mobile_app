import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {HomePage} from './home.page';

describe('HomePage', (): void => {

    let fixture: ComponentFixture<HomePage>;
    let component: HomePage;

    beforeEach(async (): Promise<void> => {
        await TestBed.configureTestingModule({
            declarations: [HomePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component).toBeTruthy();
    });
});
