import {Component, OnInit} from '@angular/core';
import {WebGLSquareService} from '../../services/web-gl/web-gl-square-service.service';

@Component({
    selector: 'app-web-gl-square-component',
    templateUrl: './web-gl-square-component.component.html',
    styleUrls: ['./web-gl-square-component.component.scss']
})
export class WebGLSquareComponent implements OnInit {

    constructor(private webGLSquareService: WebGLSquareService) {
    }

    ngOnInit(): void {
        this.webGLSquareService.init();
    }
}
