import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ThreeJsCubeComponent} from "./components/three-js-cube/three-js-cube.component";
import {HeightmapComponent} from "./components/heightmap/heightmap.component";
import {NormalmapComponent} from "./components/normalmap/normalmap.component";
import {LightningComponent} from "./components/lightning/lightning.component";
import {ProjectComponent} from "./components/project/project.component";

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'web-gl-square-page',
        loadChildren: () => import('./pages/web-gl-square-page/web-gl-square-page.module').then(m => m.WebGLSquarePagePageModule)
    },
    {
      path: 'three-js-cube',
      component: ThreeJsCubeComponent
    },
    {
      path: 'heightmap',
      component: HeightmapComponent
    },
    {
      path: 'normal-map',
      component: NormalmapComponent
    },
    {
      path: 'lightning',
      component: LightningComponent
    },
    {
      path: 'project',
      component: ProjectComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
