import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

@Component({
  selector: 'app-heightmap',
  templateUrl: './heightmap.component.html',
  styleUrls: ['./heightmap.component.scss'],
})
export class HeightmapComponent implements OnInit, AfterViewInit {

  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private map!: Mesh<BufferGeometry, MeshBasicMaterial, Object3DEventMap>;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.createScene();
    requestAnimationFrame((delay) => this.render(delay));
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const loader = new THREE.TextureLoader();
    loader.load('assets/texture/Heightmap.png', (texture) => this.onTextureLoaded(texture))

    this.camera.position.x = 25;
    this.camera.position.y = 20;
    this.camera.position.z = 40;
    this.camera.lookAt(15, -20, 0);
  }

  private render(delay: DOMHighResTimeStamp) {
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame((delay) => this.render(delay))
  }

  private generateTerrain(imagedata: ImageData) {
    // Autocompletion heißt, dass es 4x bis 255 gibt, auf Farben angepasst
    console.log(`imageData -> width: ${imagedata.width}, height: ${imagedata.height}, data.length: ${imagedata.data.length}`)
    console.log(imagedata.data)

    const indices: number[] = [];
    const vertices: number[] = [];
    const colours: number[] = [];

    for (let z = 0; z < imagedata.height; z++) {
      for (let x = 0; x < imagedata.width; x++) {
        const pixelIndex = z * imagedata.width + x;
        const y = imagedata.data[pixelIndex * 4]
        vertices.push(x, y * 0.01, z)

        if (y < 128) {
          colours.push(0.41287, 0.32182, 0.25979, 1)
        } else if (y > 128 && y < 204.8) {
          colours.push(0.55153, 0.71476, 0.25920, 1)
        } else if (y > 204.8) {
          colours.push(1, 1, 1, 1)
        }

        if (z < imagedata.height - 1 && x < imagedata.width - 1) {
          const tl: number = pixelIndex;
          const tr: number = tl + 1;
          const bl: number = (z + 1) * imagedata.width + x;
          const br: number = bl + 1;

          indices.push(tl, bl, tr)
          indices.push(bl, tr, br)
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 4))

    const material = new THREE.MeshBasicMaterial();
    material.vertexColors = true;
    material.wireframe = true;

    this.map = new THREE.Mesh( geometry, material );
    this.scene.add( this.map );
  }

  private onTextureLoaded(texture: THREE.Texture) {
    console.log('texture loaded');

    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;

    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(texture.image, 0, 0);

    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    console.log(data);

    this.generateTerrain(data);
  }
}
