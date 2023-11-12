import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper, BoxGeometry, Color, DirectionalLight,
  GridHelper,
  Mesh,
  MeshPhongMaterial, MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-lighting',
  templateUrl: './lightning.component.html',
  styleUrls: ['./lightning.component.scss'],
})
export class LightningComponent  implements AfterViewInit {
  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;
  private directionalLight!: DirectionalLight;

  async ngAfterViewInit():Promise<void> {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(2, 10, 2);
    this.controls = new OrbitControls( this.camera, this.canvasRef.nativeElement);
    this.controls.update();
    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    const axisHelper = new AxesHelper(5);
    this.scene.add(axisHelper);
    const gridHelper = new GridHelper(20);
    this.scene.add(gridHelper);


    //add box
    const geometry = new BoxGeometry();
    const material = new MeshPhongMaterial({color: Color.NAMES.violet});
    const box = new Mesh(geometry, material);
    box.position.set(0, 1, 0);
    this.scene.add(box);

    //add sphere
    const geometry2 = new SphereGeometry();
    const material2 = new MeshPhongMaterial({color: 0xff0000, specular: Color.NAMES.white});
    const sphere = new Mesh(geometry2, material2);
    sphere.position.x = -3;
    sphere.position.y = 2;
    sphere.castShadow = true;
    this.scene.add(sphere);


    // add plane
    const planeGeometry = new BoxGeometry(20, 20);
    const planeMaterial = new MeshStandardMaterial({color: Color.NAMES.white});
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -90 * Math.PI / 180;
    plane.receiveShadow = true;
    this.scene.add(plane);


    const ambientlight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientlight);

    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(-10, 15, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    requestAnimationFrame(() => this.animate());

  }

  private animate():void {
    requestAnimationFrame(() => this.animate());
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
  }
}
