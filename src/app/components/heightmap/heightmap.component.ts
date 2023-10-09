import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { BufferGeometry, Mesh, MeshBasicMaterial, Object3DEventMap, PerspectiveCamera, Scene, WebGLRenderer } from "three";

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
    // Initialisieren der 3D-Szene und Starten der Render-Schleife
    this.createScene();
    requestAnimationFrame((delay) => this.render(delay));
  }

  private createScene() {
    // Erstellen einer neuen 3D-Szene, Kamera und Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Laden der Höhenkarten-Textur und Aufruf der 'onTextureLoaded'-Methode
    const loader = new THREE.TextureLoader();
    loader.load('assets/texture/Heightmap.png', (texture) => this.onTextureLoaded(texture))

    // Setzen der Anfangsposition und Blickrichtung der Kamera
    this.camera.position.x = 25;
    this.camera.position.y = 20;
    this.camera.position.z = 40;
    this.camera.lookAt(15, -20, 0);
  }

  private render(delay: DOMHighResTimeStamp) {
    // Rendern der Szene
    this.renderer.render(this.scene, this.camera)

    // Erneutes Aufrufen der 'render'-Methode, um die Animation fortzusetzen
    requestAnimationFrame((delay) => this.render(delay))
  }

  private generateTerrain(imagedata: ImageData) {
    // Generieren des 3D-Geländes basierend auf den Bilddaten der Höhenkarte
    console.log(`imageData -> width: ${imagedata.width}, height: ${imagedata.height}, data.length: ${imagedata.data.length}`)
    console.log(imagedata.data)

    const indices: number[] = [];
    const vertices: number[] = [];
    const colours: number[] = [];

    for (let z = 0; z < imagedata.height; z++) {
      for (let x = 0; x < imagedata.width; x++) {
        const pixelIndex = z * imagedata.width + x;

        // Höhendaten aus den Bilddaten extrahieren und die Y-Koordinate der Vertices festlegen
        const y = imagedata.data[pixelIndex * 4]
        vertices.push(x, y * 0.01, z)

        // Farbdarstellung basierend auf der Höhe
        if (y < 128) {
          colours.push(0.41287, 0.32182, 0.25979, 1)
        } else if (y > 128 && y < 204.8) {
          colours.push(0.55153, 0.71476, 0.25920, 1)
        } else if (y > 204.8) {
          colours.push(1, 1, 1, 1)
        }

        // Erzeugung von Dreiecks-Indices für die Darstellung des Terrains
        if (z < imagedata.height - 1 && x < imagedata.width - 1) {
          const topLeft: number = pixelIndex;
          const topRight: number = topLeft + 1;
          const bottomLeft: number = (z + 1) * imagedata.width + x;
          const bottomRight: number = bottomLeft + 1;

          indices.push(topLeft, bottomLeft, topRight)
          indices.push(bottomLeft, topRight, bottomRight)
        }
      }
    }

    // Erstellen der Geometrie und des Materials für das Gelände
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 4))

    const material = new THREE.MeshBasicMaterial();
    material.vertexColors = true;
    material.wireframe = true;

    // Erstellen des Mesh für das Gelände und Hinzufügen zur Szene
    this.map = new THREE.Mesh( geometry, material );
    this.scene.add( this.map );
  }

  private onTextureLoaded(texture: THREE.Texture) {
    // Wird aufgerufen, wenn die Textur geladen ist. Konvertiert die Textur in Bilddaten und ruft 'generateTerrain' auf
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
