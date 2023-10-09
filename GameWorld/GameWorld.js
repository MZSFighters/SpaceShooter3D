import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import Planet from './planet';
import EnemySpaceship from './enemy_spaceship';
import powerUp from './powerups';
import enemySpacestation from './enemy_spacestation';
import Particles from './particles';


class GameWorld {
  constructor() {
    // initial setup
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.isthirdPersonCamera = true;                             // Boolean flag to track the active camera

    this.setupCameras();
    this.setupControls();
    this.setupScene();

  }

  setupCameras() {
    // default camera positioning for both cameras
    this.thirdPersonCamera.position.z = 5;
    this.thirdPersonCamera.position.y = 1;
    this.firstPersonCamera.position.y = 0.9;
    this.firstPersonCamera.position.z = 1;
  }

  setupControls() {
    // Just to test and to move around using the camera at (0,0)
    const orbit = new OrbitControls(this.thirdPersonCamera, this.renderer.domElement);
    orbit.update();
  }

  setupScene() {

    // loading the skybox, earth, moon and the spaceship in the scene
    this.setupSkybox();
    this.planet = new Planet(this.scene);
    this.spaceship = new Spaceship(this.scene);

    // loading the 3 enemy station bases
    const enemyStationOne = new enemySpacestation(this.scene, -100, 50, -50);
    const enemyStationTwo = new enemySpacestation(this.scene, 0, 100, 400);
    const enemyStationThree = new enemySpacestation(this.scene, 300, 0, -150);

    // loading the enemy spaceship(s)
    const enemySpaceshipOne = new EnemySpaceship(this.scene, -10, 0, -10);
    const enemySpaceshipTwo = new EnemySpaceship(this.scene, 0, 95, 375);
    const enemySpaceshipThree = new EnemySpaceship(this.scene, 295, -5, -140);

    // creating the red particles in background
    this.particles = new Particles(this.scene);
    this.particles.createStars();

    // adding directional light from the sun which is on far right - work in progress
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1000, 0, 0);
    this.scene.add(directionalLight);

    // adding some ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
    this.scene.add(ambientLight);

    // adding power ups (for later)
    /*
    new powerUp(scene, 'health',5,0,-5);
    new powerUp(scene, 'shield',-5,0,-5);
    new powerUp(scene, 'speed_boost',0,0,-5);
    */
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // updating planet and moon position
    this.planet.update();

    // animating the red particles 
    this.particles.animateStars();

    // rendering according to the camera type
    if (this.isthirdPersonCamera) {
      this.renderer.render(this.scene, this.thirdPersonCamera);
    } else {
      this.renderer.render(this.scene, this.firstPersonCamera);
    }

  }

  setupSkybox() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    this.scene.background = cubeTextureLoader.setPath("./assets/images/space_skybox/").load(["right.png",
      "left.png",
      "top.png",
      "bottom.png",
      "front.png",
      "back.png"
    ]);
  }

}

export default GameWorld;

// Window resizing not important for now

/*
// takes care of resizing when we open or close the console
window.addEventListener('resize', function () {
  thirdPersonCamera.aspect = window.innerWidth / window.innerHeight;
  thirdPersonCamera.updateProjectionMatrix();
});*/






