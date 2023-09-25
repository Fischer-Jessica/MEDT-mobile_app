import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {WebGLSquarePage} from './web-gl-square-page.page';
import {WebGLSquarePagePageRoutingModule} from './web-gl-square-page-routing.module';
import {
    WebGLSquareComponent
} from '../../components/web-gl-square-component/web-gl-square-component.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WebGLSquarePagePageRoutingModule
    ],
    declarations: [WebGLSquarePage, WebGLSquareComponent]
})
export class WebGLSquarePagePageModule {
}
