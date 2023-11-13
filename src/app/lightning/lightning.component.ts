import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper, BoxGeometry, Color, DirectionalLight,
  GridHelper,
  Mesh, MeshBasicMaterial,
  MeshPhongMaterial, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, PointLight,
  Scene,
  SphereGeometry, SpotLight,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'lightning',
  templateUrl: './lightning.component.html',
  styleUrls: ['./lightning.component.scss'],
})
export class LightningComponent implements AfterViewInit {
  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;
  private directionallight!: DirectionalLight;

  async ngAfterViewInit(): Promise<void> {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(2, 10, 2);
    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    const axisHelper = new AxesHelper(5);
    this.scene.add(axisHelper);
    const gridHelper = new GridHelper(20);
    this.scene.add(gridHelper);


    this.controls = new OrbitControls(this.camera, this.canvasRef.nativeElement);
    this.controls.update();


    //add box
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshStandardMaterial({color: 0x0000ff});
    const box = new Mesh(geometry, material);
    box.position.set(2, 0.5, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    this.scene.add(box);

    //add sphere
    const geometry2 = new SphereGeometry(1, 32, 32)
    const material2 = new MeshPhongMaterial({color: 0xff0000, specular: Color.NAMES.white, shininess: 100 });

    const sphere = new Mesh(geometry2, material2);
    sphere.position.set(0, 1, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.scene.add(sphere);

    const sphere2 = new Mesh(geometry2, material2);
    sphere2.position.set(0, 2.5, 0);
    sphere2.castShadow = true;
    sphere2.receiveShadow = true;
    this.scene.add(sphere2);

    //add AmbientLight
    const ambientlight = new AmbientLight(0xffffff, 0.05);
    this.scene.add(ambientlight);
    //add DirectionalLight
    this.directionallight = new DirectionalLight(0xffffff, 1);
    this.directionallight.position.set(-10, 15, 0);
    this.directionallight.castShadow = true;
    this.scene.add(this.directionallight);


    //add ground plane
    const groundGeometry = new PlaneGeometry(20, 20);
    const groundMaterial = new MeshStandardMaterial({color: 0xffffff});
    const ground = new Mesh(groundGeometry, groundMaterial);
    ground.position.set(0, 0, 0);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    requestAnimationFrame(() => this.animate());
  }

  private animate():void {
    requestAnimationFrame(() => this.animate());
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
  }
}
