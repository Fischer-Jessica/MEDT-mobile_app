import {TestBed} from '@angular/core/testing';
import {WebGLSquareService} from './web-gl-square-service.service';

describe('WebGLSquareServiceService', (): void => {

    let service: WebGLSquareService;

    beforeEach((): void => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WebGLSquareService);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });
});
