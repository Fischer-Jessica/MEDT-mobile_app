import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  Color,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three";
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
  private plane!: PlaneGeometry;
  private lastTime!: number;
  private lightSourceSpeed: number = 2;

  async ngAfterViewInit(): Promise<void> {
    this.scene = new Scene();
    this.scene.background = new Color(Color.NAMES.white);

    this.light = new PointLight(0xffffff, 10000);
    this.light.position.set(0, 0, 20);
    this.scene.add(this.light);

    this.camera = new PerspectiveCamera(
      75,
      this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 8);
    const controls = new OrbitControls(this.camera, this.canvasRef.nativeElement);

    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    //this.renderer.setSize(this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.plane = new PlaneGeometry(10, 10, 1, 1);

    const material = new MeshPhongMaterial();
    const textureLoader = new TextureLoader()
    material.map = await textureLoader.loadAsync('assets/texture/UntouchedNormalMap.jpg');
    material.normalMap = await textureLoader.loadAsync('assets/texture/NormalMap.png');
    material.normalScale.set(1, 1); // Effekt der Normalmap verstärken oder abschwächen

    const planeMesh = new Mesh(this.plane, material);
    this.scene.add(planeMesh);
    requestAnimationFrame((delay) => this.render(delay));
  }

  private render(delay: DOMHighResTimeStamp): void {
    const delayN = (delay - this.lastTime)/1000;
    if(this.light.position.x >5){
      this.lightSourceSpeed *= -1;
    } else if (this.light.position.x < -5){
      this.lightSourceSpeed *= -1;
    }

    this.light.position.x += this.lightSourceSpeed * delayN;
    this.renderer.render(this.scene, this.camera);

    this.lastTime = delay;
    requestAnimationFrame(() => this.render(delay));
  }
}
