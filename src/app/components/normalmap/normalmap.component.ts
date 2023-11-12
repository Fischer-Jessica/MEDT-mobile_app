import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  Color, GridHelper,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three";
import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import PlaneGeometry = ParametricGeometries.PlaneGeometry;
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-normalmap',
  templateUrl: './normalmap.component.html',
  styleUrls: ['./normalmap.component.scss'],
})
export class NormalmapComponent  implements AfterViewInit {

  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private scene!: Scene;
  private light!: PointLight;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private plane!: ParametricGeometries.PlaneGeometry;
  private lastTime!: number;
  private lightSourceSpeed: number = 10;

  async ngAfterViewInit(): Promise<void> {
    this.scene = new Scene();
    this.scene.background = new Color(Color.NAMES.white);

    this.light = new PointLight(0xffffff, 1);
    this.light.position.set(0, 10, 10);
    this.scene.add(this.light);

    this.camera = new PerspectiveCamera(75, this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height,
      0.1, 1000);

    this.camera.position.set(0, 30, 0);

    const controls = new OrbitControls(this.camera, this.canvasRef.nativeElement)

    const axisHelper = new AxesHelper(5);
    this.scene.add(axisHelper);
    const gridHelper = new GridHelper(20);
    this.scene.add(gridHelper);

    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});

    this.plane = new PlaneGeometry(10, 10, 1, 1);

    const material = new MeshPhongMaterial();
    const textureLoader = new TextureLoader();
    material.map = await textureLoader.loadAsync('assets/texture/UntouchedNormalMap.jpg');
    material.normalMap = await textureLoader.loadAsync('assets/texture/NormalMap.png');
    material.normalScale. set(2, 2);

    const planeMesh = new Mesh(this.plane, material);
    planeMesh.rotation.x = 180 * Math.PI / 180
    this.scene.add(planeMesh);

    requestAnimationFrame((total) => this.animate(total));
  }

  private animate(total: number) {
    const delay = (total - this.lastTime) / 1000;

    this.light.position.x += this.lightSourceSpeed * delay;
    if (this.light.position.x > 5) {
      this.lightSourceSpeed *= -1;
    } else if (this.light.position.x < -5) {
      this.lightSourceSpeed *= -1;
    }

    this.renderer.render(this.scene, this.camera);

    this.lastTime = total;
    requestAnimationFrame(() => this.animate(total));
  }
}
