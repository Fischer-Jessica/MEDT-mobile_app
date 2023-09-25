import {Injectable} from '@angular/core';
import {main} from './webgl-demo';

@Injectable({
    providedIn: 'root'
})
export class WebGLSquareService {

    constructor() {
    }

    public init(): void {
        main();
    }
}
