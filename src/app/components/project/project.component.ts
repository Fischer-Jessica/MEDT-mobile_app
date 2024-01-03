import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import {
  AmbientLight, AxesHelper, CameraHelper, DirectionalLight,
  Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, SphereGeometry,
  BufferGeometry, WebGLRenderer, MeshStandardMaterial, PlaneGeometry,
  Raycaster, Vector2, AnimationMixer, MeshBasicMaterial, Object3DEventMap
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent  implements AfterViewInit {
  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;
  private directionallight!: DirectionalLight;
  private sphere!: Mesh<SphereGeometry, MeshStandardMaterial, Object3DEventMap>;
  private map!: Mesh<BufferGeometry, MeshBasicMaterial>;
  private mousePosition!: Vector2;
  private rayCaster!: Raycaster;
  private mixer!: AnimationMixer;
  private mixer2!: AnimationMixer;
  private clock!: THREE.Clock;

  async ngAfterViewInit(): Promise<void> {
    this.initScene();
    this.addLights();

    //add sphere
    const geometry2 = new SphereGeometry(1, 32, 32)
    const material2 = new MeshStandardMaterial({color: 0xffff00});

    this.sphere = new Mesh(geometry2, material2);
    this.sphere.position.set(-5, 15, 20);
    this.scene.add(this.sphere);


    const loader = new THREE.TextureLoader();
    loader.load('assets/project/Heightmap.png', (texture) => this.onTextureLoaded(texture))


    const roofGeometry = new PlaneGeometry(20, 20);
    const roofMaterial = new MeshPhongMaterial({color: 0xffffff});
    roofMaterial.map = await loader.loadAsync('assets/floor/everytexture.com-stock-wood-texture-00050.jpg');
    roofMaterial.normalMap = await loader.loadAsync('assets/floor/everytexture.com-stock-wood-texture-00050-normal-1024.jpg');
    roofMaterial.normalScale.set(1, 1); // Effekt der Normalmap verstärken oder abschwächen
    roofMaterial.side = THREE.DoubleSide;

    const roof = new Mesh(roofGeometry, roofMaterial);
    roof.position.set(8.75, 20.01, 8.75);
    roof.rotation.x = -Math.PI / 2;
    roof.receiveShadow = true;
    this.scene.add(roof);

    const objectLoader = new OBJLoader();
    objectLoader.load('/assets/project/Old_Dusty_Bookshelf.obj', (obj) => {
      const model = obj;
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new MeshStandardMaterial({ color: 0x8B4513})
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });

      // Move the positioning outside the traverse callback
      model.position.set(10, 20.01, 8);
      model.scale.set(3, 3, 3);
      model.rotation.y = Math.PI;
      this.scene.add(model);

    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened while loading the model', error);
    });



    const loaderg = new GLTFLoader();
    loaderg.load('/assets/project/man.gltf', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new MeshPhongMaterial({ color: 0x8B0000, specular: 0xffffff, shininess: 100 })
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      model.position.set(10, 8, 10);
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI / 2;
      this.scene.add(model);
      // FBX files may contain a mixer with pre-defined animations

      this.mixer = new THREE.AnimationMixer(model);

      // Assuming the first animation is the one you want to play
      const action = this.mixer.clipAction(gltf.animations[0]);
      action.play();

    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened while loading the model', error);
    });

    loaderg.load('/assets/project/full_man.gltf', (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new MeshPhongMaterial({ color: 0x008B00, specular: 0xffffff, shininess: 100 })
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      model.position.set(10, 20, 10);
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI ;
      this.scene.add(model);
      // FBX files may contain a mixer with pre-defined animations

      this.mixer2 = new THREE.AnimationMixer(model);

      // Assuming the first animation is the one you want to play
      const action2 = this.mixer2.clipAction(gltf.animations[0]);
      action2.play();

    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened while loading the model', error);
    });

    this.addSkybox();
    this.addShelter();

    // add axis, grid helper and camera helper
    //this.addHelpers();

    this.mousePosition = new Vector2();

    window.addEventListener('mousemove', (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    this.rayCaster = new Raycaster();

    this.renderer.setAnimationLoop((delay) => this.animate(delay));
  }

  private initScene() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    this.camera.position.set(2, 10, 2);
    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.canvasRef.nativeElement);
    this.controls.update();
  }

  private addLights() {
    const pointlight = new THREE.PointLight(0xffffff, 5, 103);
    pointlight.position.set(1, 6, 1);
    pointlight.castShadow = true;
    this.scene.add(pointlight);
    //add AmbientLight
    const ambientlight = new AmbientLight(0xffffff, 0.27);
    this.scene.add(ambientlight);
    //add DirectionalLight
    this.directionallight = new DirectionalLight(0xffffff, 3);
    this.directionallight.position.set(-3, 13, 17);
    this.directionallight.castShadow = true;
    const size = 33; // Adjust this value to increase/decrease the shadow area
    this.directionallight.shadow.camera.left = -size;
    this.directionallight.shadow.camera.right = size;
    this.directionallight.shadow.camera.top = size;
    this.directionallight.shadow.camera.bottom = -size;
    this.directionallight.shadow.camera.updateProjectionMatrix();
    this.directionallight.target.position.set(0, 0, 0);
    this.scene.add(this.directionallight);
  }

  private addHelpers(){
    const axisHelper = new AxesHelper(6);
    this.scene.add(axisHelper);
    const cameraHelper = new CameraHelper(this.directionallight.shadow.camera);
    this.scene.add(cameraHelper);
  }

  private addSkybox() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/project/skybox.jpeg'); // Replace with the path to your sky texture
    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    });

    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(skybox);
  }
  private addShelter() {
    //4 Zylinder and a plane as a roof
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);

    const materialred = new THREE.MeshStandardMaterial({color: 0xff0000});
    const materialblue = new THREE.MeshStandardMaterial({color: 0x0000ff});
    const materialgreen = new THREE.MeshStandardMaterial({color: 0x00ff00});
    const materialorange = new THREE.MeshStandardMaterial({color: 0xffa500});

    const cylinder1 = new THREE.Mesh(geometry, materialred);
    cylinder1.position.set(2, 10, 2);
    cylinder1.castShadow = true;
    cylinder1.receiveShadow = true;
    this.scene.add(cylinder1);
    const cylinder2 = new THREE.Mesh(geometry, materialgreen);
    cylinder2.position.set(2, 10, 16);
    cylinder2.castShadow = true;
    cylinder2.receiveShadow = true;
    this.scene.add(cylinder2);
    const cylinder3 = new THREE.Mesh(geometry, materialblue);
    cylinder3.position.set(16, 10, 2);
    cylinder3.castShadow = true;
    cylinder3.receiveShadow = true;
    this.scene.add(cylinder3);
    const cylinder4 = new THREE.Mesh(geometry, materialorange);
    cylinder4.position.set(16, 10, 16);
    cylinder4.castShadow = true;
    cylinder4.receiveShadow = true;
    this.scene.add(cylinder4);
  }
  private generateTerrain(imagedata: ImageData) {
    // Generieren des 3D-Geländes basierend auf den Bilddaten der Höhenkarte
    console.log(`imageData -> width: ${imagedata.width}, height: ${imagedata.height}, data.length: ${imagedata.data.length}`)
    console.log(imagedata.data)

    const scale = 1;

    const indices: number[] = [];
    const vertices: number[] = [];
    const colours: number[] = [];

    for (let z = 0; z < imagedata.height; z++) {
      for (let x = 0; x < imagedata.width; x++) {
        const pixelIndex = z * imagedata.width + x;

        // Höhendaten aus den Bilddaten extrahieren und die Y-Koordinate der Vertices festlegen
        const y = imagedata.data[pixelIndex * 4]
        vertices.push(x*scale, y * 0.01 * scale, z * scale)

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
          const bottomLeft: number = imagedata.width + topLeft;
          const bottomRight: number = bottomLeft + 1;

          indices.push(topLeft, bottomLeft, bottomRight)
          indices.push(topLeft, bottomRight, topRight)
        }
      }
    }

    // Erstellen der Geometrie und des Materials für das Gelände
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 4))
    geometry.scale(0.6, 0.6, 0.6)
    const material = new THREE.MeshBasicMaterial();
    material.vertexColors = true;

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

  private animate(delay: DOMHighResTimeStamp): void {
    // Light movement
    this.directionallight.position.x += 0.1 * Math.sin(delay / 1000 * 0.5);
    this.sphere.position.x += 0.1 * Math.sin(delay / 1000 * 0.5);

    // Animation
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
    if (this.mixer2) {
      this.mixer2.update(this.clock.getDelta());

    }
    // Raycaster and intersection logic
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);
    const intersections = this.rayCaster.intersectObjects(this.scene.children);

    if(intersections.find(x => x.object.id == this.map.id)){
      this.sphere.material.color.set(0xFF0000);
      this.directionallight.color.set(0xFF0000);
    } else {
      this.sphere.material.color.set(0x00FFFF);
      this.directionallight.color.set(0x00FFFF);
    }

    // Update controls and render the scene
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
