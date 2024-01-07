import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import {
  AmbientLight, AxesHelper, CameraHelper, DirectionalLight,
  Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, SphereGeometry,
  BufferGeometry, WebGLRenderer, MeshStandardMaterial, PlaneGeometry,
  Raycaster, Vector2, AnimationMixer, MeshBasicMaterial, Object3DEventMap
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements AfterViewInit {
  @ViewChild('threeCanvas')
  private canvasRef!: ElementRef;
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;
  private directionallight!: DirectionalLight;
  private sphere!: Mesh<SphereGeometry, MeshStandardMaterial>;
  private map!: Mesh<BufferGeometry, MeshBasicMaterial>;
  private mousePosition!: Vector2;
  private rayCaster!: Raycaster;
  private mixer!: AnimationMixer;
  private mixer2!: AnimationMixer;
  private clock!: THREE.Clock;

  async ngAfterViewInit(): Promise<void> {
    this.initScene();
    this.addLights();

    // Creating a sphere which will be used as a light source
    const lightBallGeometry = new SphereGeometry(1, 33, 33);
    const lightBallMaterial = new MeshStandardMaterial({color: 0xffff00});

    this.sphere = new Mesh(lightBallGeometry, lightBallMaterial);
    this.sphere.position.set(-5, 15, 20);
    this.scene.add(this.sphere);

    // Loading the heightmap texture which will be used as floor.
    const loader = new THREE.TextureLoader();
    loader.load('assets/project/Heightmap.png', (texture) => this.onTextureLoaded(texture));

    // Creating the roof on which the bookshelf will be placed on.
    const roofGeometry = new PlaneGeometry(20, 20);
    const roofMaterial = new MeshPhongMaterial({color: 0xffffff});
    roofMaterial.map = await loader.loadAsync('assets/floor/everytexture.com-stock-wood-texture-00050.jpg');
    roofMaterial.normalMap = await loader.loadAsync('assets/floor/everytexture.com-stock-wood-texture-00050-normal-1024.jpg');
    roofMaterial.normalScale.set(1, 1);
    roofMaterial.side = THREE.DoubleSide;

    const roof = new Mesh(roofGeometry, roofMaterial);
    roof.position.set(8.75, 20.01, 8.75);
    roof.rotation.x = -Math.PI / 2;
    roof.receiveShadow = true;
    this.scene.add(roof);

    // Load OBJ model (Old_Dusty_Bookshelf)
    const objectLoader = new OBJLoader();
    objectLoader.load('/assets/project/Old_Dusty_Bookshelf.obj', (obj) => {
      const model = obj;
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new MeshStandardMaterial({color: 0x8B4513});
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });

      // positioning the bookshelf and scaling it to fit the roof and the human
      model.position.set(10, 20.01, 8);
      model.scale.set(3, 3, 3);
      model.rotation.y = Math.PI;
      this.scene.add(model);
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened while loading the model', error);
    });

    // Load GLTF model (man.gltf)
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/assets/project/man.gltf', (gltf) => {
      const model = gltf.scene;
      model.traverse((man) => {
        if (man instanceof THREE.Mesh) {
          man.material = new MeshPhongMaterial({color: 0x8B0000, specular: 0xffffff, shininess: 100});
          man.receiveShadow = true;
          man.castShadow = true;
        }
      });
      model.position.set(10, 8, 10);
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI / 2;
      this.scene.add(model);

      // animates the model through saving the animation of the model
      this.mixer = new THREE.AnimationMixer(model);

      // Assuming the first animation is the one you want to play and plays it
      const action = this.mixer.clipAction(gltf.animations[0]);
      action.play();
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      console.error('An error happened while loading the model', error);
    });

    // Load another GLTF model (full_man.gltf) because the first one had an accident
    gltfLoader.load('/assets/project/full_man.gltf', (gltf) => {
      const model = gltf.scene;
      model.traverse((fullMan) => {
        if (fullMan instanceof THREE.Mesh) {
          fullMan.material = new MeshPhongMaterial({color: 0x008B00, specular: 0xffffff, shininess: 100});
          fullMan.receiveShadow = true;
          fullMan.castShadow = true;
        }
      });
      model.position.set(10, 20, 10);
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI;
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
    // Add axis, grid helper, and camera helper
    // this.addHelpers();

    this.mousePosition = new Vector2();
    // if the mouse is moved mousePosition is updated
    window.addEventListener('mousemove', (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    // Raycaster is used to detect if the mouse is over the terrain
    this.rayCaster = new Raycaster();
    this.renderer.setAnimationLoop((delay) => this.animate(delay));
  }

  private initScene() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    this.camera.position.set(2, 10, 2);
    // renderer is used to render the scene, canvas is used to display the scene, and the size of the renderer is set to the size of the canvas
    this.renderer = new WebGLRenderer({canvas: this.canvasRef.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    // clock is so that the animation happens, look into the animate function, controls are used to move the camera around the scene
    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.canvasRef.nativeElement);
    this.controls.update();
  }

  private addLights() {
    const pointlight = new THREE.PointLight(0xffffff, 5, 103);
    pointlight.position.set(1, 6, 1);
    pointlight.castShadow = true;
    this.scene.add(pointlight);

    // Add AmbientLight
    const ambientlight = new AmbientLight(0xffffff, 0.27);
    this.scene.add(ambientlight);

    // Add DirectionalLight
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

  private addHelpers() {
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
    // 4 Cylinders and a plane as a roof
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);

    const materialred = new THREE.MeshStandardMaterial({color: 0xff0000});
    const materialblue = new THREE.MeshStandardMaterial({color: 0x0000ff});
    const materialgreen = new THREE.MeshStandardMaterial({color: 0x00ff00});
    const materialorange = new THREE.MeshStandardMaterial({color: 0xffa500});

    const pillar1 = new THREE.Mesh(geometry, materialred);
    pillar1.position.set(2, 10, 2);
    pillar1.castShadow = true;
    pillar1.receiveShadow = true;
    this.scene.add(pillar1);

    const pillar2 = new THREE.Mesh(geometry, materialgreen);
    pillar2.position.set(2, 10, 16);
    pillar2.castShadow = true;
    pillar2.receiveShadow = true;
    this.scene.add(pillar2);

    const pillar3 = new THREE.Mesh(geometry, materialblue);
    pillar3.position.set(16, 10, 2);
    pillar3.castShadow = true;
    pillar3.receiveShadow = true;
    this.scene.add(pillar3);

    const pillar4 = new THREE.Mesh(geometry, materialorange);
    pillar4.position.set(16, 10, 16);
    pillar4.castShadow = true;
    pillar4.receiveShadow = true;
    this.scene.add(pillar4);
  }

  private generateHeightmap(imagedata: ImageData) {
    // Generate 3D terrain based on heightmap image data
    console.log(`imageData -> width: ${imagedata.width}, height: ${imagedata.height}, data.length: ${imagedata.data.length}`);
    console.log(imagedata.data);

    const scale = 1;

    const indices: number[] = [];
    const vertices: number[] = [];
    const colours: number[] = [];

    for (let z = 0; z < imagedata.height; z++) {
      for (let x = 0; x < imagedata.width; x++) {
        const pixelIndex = z * imagedata.width + x;

        // Extract height data from image data and set Y-coordinate of vertices
        const y = imagedata.data[pixelIndex * 4];
        vertices.push(x * scale, y * 0.01 * scale, z * scale);

        // Color representation based on height
        if (y < 128) {
          colours.push(0.41287, 0.32182, 0.25979, 1);
        } else if (y > 128 && y < 204.8) {
          colours.push(0.55153, 0.71476, 0.25920, 1);
        } else if (y > 204.8) {
          colours.push(1, 1, 1, 1);
        }

        // Generate triangle indices for terrain representation
        if (z < imagedata.height - 1 && x < imagedata.width - 1) {
          const topLeft: number = pixelIndex;
          const topRight: number = topLeft + 1;
          const bottomLeft: number = imagedata.width + topLeft;
          const bottomRight: number = bottomLeft + 1;

          indices.push(topLeft, bottomLeft, bottomRight);
          indices.push(topLeft, bottomRight, topRight);
        }
      }
    }

    // Create geometry and material for the terrain
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colours), 4));
    geometry.scale(0.6, 0.6, 0.6);
    const material = new THREE.MeshBasicMaterial();
    material.vertexColors = true;

    // Create mesh for the terrain and add it to the scene
    this.map = new THREE.Mesh(geometry, material);
    this.scene.add(this.map);
  }

  // Called when the texture is loaded. Converts the texture to image data and calls 'generateHeightmap'
  private onTextureLoaded(texture: THREE.Texture) {
    // Called when the texture is loaded. Converts the texture to image data and calls 'generateTerrain'
    console.log('texture loaded');

    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;

    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(texture.image, 0, 0);

    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    console.log(data);

    this.generateHeightmap(data);
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
    /* A raycaster is a fundamental concept in computer graphics and computer games. In the context of 3D graphics and interactive applications, a raycaster is an algorithm or component that simulates the behavior of rays in a 3D environment. It is commonly used for tasks like collision detection, picking (selecting) objects in a scene, and rendering realistic lighting effects. */
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);
    const intersections = this.rayCaster.intersectObjects(this.scene.children);

    if (intersections.find(x => x.object.id == this.map.id)) {
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
