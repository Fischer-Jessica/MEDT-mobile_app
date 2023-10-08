import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {
  BoxGeometry,
  BufferGeometry, Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Object3DEventMap,
  PerspectiveCamera,
  Scene, Texture,
  WebGLRenderer
} from "three";
import {animate} from "@angular/animations";

@Component({
  selector: 'app-heightmap',
  templateUrl: './heightmap.component.html',
  styleUrls: ['./heightmap.component.scss'],
})
export class HeightmapComponent  implements OnInit, AfterViewInit {

  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private map!: Mesh<BufferGeometry, MeshBasicMaterial, Object3DEventMap>;


  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.createScene();
    requestAnimationFrame((delay) => this.render(delay));
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    const loader = new THREE.TextureLoader();
    loader.load('assets/texture/Heightmap.png', (texture) => this.onTextureLoaded(texture));

    this.camera.position.x = 16;
    this.camera.position.y = 32;
    this.camera.position.z = 16;
    this.camera.lookAt(16, 0, 16);
  }

  private render(delay: DOMHighResTimeStamp) {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame((delay) => this.render(delay));
  }

  private generateTerrain(imagedata: ImageData) {
    // Autocompletion heißt, dass es 4x bis 255 gibt, auf Farben angepasst
    console.log(`imageData -> width: ${imagedata.width}, height: ${imagedata.height}, data.length: ${imagedata.data.length}`);

    const indices: number[] = [];
    const vertices: number[] = [];
    const colours: number[] = [];

    for (let z = 0; z < imagedata.height; z++) {
      for (let x = 0; x < imagedata.width; x++) {
        vertices.push(x, 0, z);
        colours.push(1, 1, 1, 1);
      }
    }

    // ccw ... counter clock wise
    indices.push(32); // von der width ablesen
    indices.push(0); // increases by 1
    indices.push(0 + 1);

    // Wie muss ich das angehen jetzt sollte ein dreieck da sein die drei Zeilen müssen Schleife

    const geometry = new THREE.BufferGeometry( );
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 4));

    const material = new THREE.MeshBasicMaterial();
    material.vertexColors = true;
    material.wireframe = true;

    this.map = new THREE.Mesh( geometry, material );
    this.scene.add( this.map );
  }

  private onTextureLoaded(texture: Texture) {
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
