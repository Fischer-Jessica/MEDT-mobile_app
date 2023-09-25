import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebGLSquarePage} from './web-gl-square-page.page';

const routes: Routes = [
    {
        path: '',
        component: WebGLSquarePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebGLSquarePagePageRoutingModule {
}
