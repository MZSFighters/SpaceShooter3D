import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import Planet from './planet';
import EnemySpaceship from './enemy_spaceship';
import powerUp from './powerups';
import enemySpacestation from './enemy_spacestation';
import Particles from './particles';
import  ThirdPersonCamera from './custom_cameras.js';
import loadingManager from './loadingManager.js';


class GameWorld {
  constructor() {
    // initial setup
    this.canvas = document.querySelector('.webgl'); // Fix: Use '.webgl' to select the canvas element
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    this.setupCameras();
    //this.setupControls();
    this.setupScene();

  }

  setupCameras() {
    // default camera positioning for both cameras
    this.camera.position.z = 5;
    this.camera.position.y = 1;
  }

  setupControls() {
    // Just to test and to move around using the camera at (0,0)
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
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

    // This hemisphere light is purely for the minimap camera.
    // has very minimal (basically nothing) impact on rest of scene
    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );



    this.thirdPersonCamera = new ThirdPersonCamera({camera: this.camera, target: this.spaceship.group})

    // adding power ups (for later)
    /*
    new powerUp(scene, 'health',5,0,-5);
    new powerUp(scene, 'shield',-5,0,-5);
    new powerUp(scene, 'speed_boost',0,0,-5);
    */

    //orthographic camera (mini-map)
    const aspect = window.innerWidth / innerHeight;
    const viewSize = 40;
    
    this.miniMapCamera = new THREE.OrthographicCamera(
        -aspect * viewSize / 2,
        aspect * viewSize / 2,
        viewSize / 2,
        -viewSize / 2,
        -1000, 1000
    );
    this.miniMapCamera.position.set(0, 25, 0);
    this.miniMapCamera.lookAt(0, 0, -5);
    // this.thirdPersonCamera.add(this.miniMapCamera);
    this.insetWidth = window.innerHeight / 4;
    this.insetHeight = window.innerHeight / 4;
    this.miniMapCamera.aspect = this.insetWidth/this.insetHeight;
    this.miniMapCamera.add(this.light);
    this.camera.add(this.miniMapCamera);  


  //   function resize() {
  //     this.thirdPersonCamera.aspect = window.innerWidth / window.innerHeight;
  //     this.thirdPersonCamera.updateProjectionMatrix();
  
  //     this.renderer.setSize(window.innerWidth, window.innerHeight);
  
  //     insetWidth = window.innerHeight / 4;
  //     insetHeight = window.innerHeight / 4;
  
  //     this.miniMapCamera.aspect = insetWidth/insetHeight;
  //     this.miniMapCamera.updateProjectionMatrix();
  // }
  // window.addEventListener("resize", resize);

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // updating planet and moon position
    this.planet.update();

    // animating the red particles 
    this.particles.animateStars();

    // rendering according to the camera type
    this.thirdPersonCamera.update()
    this.spaceship.update()
    // this.renderer.render(this.scene, this.camera);

//updating minimpap camera
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setScissorTest(true);

    this.renderer.setScissor(
        window.innerWidth - this.insetWidth - 16,
        window.innerHeight - this.insetHeight - 16,
        this.insetWidth,
        this.insetHeight
    );

    this.renderer.setViewport(
        window.innerWidth - this.insetWidth - 16,
        window.innerHeight - this.insetHeight - 16,
        this.insetWidth,
        this.insetHeight
    );

    this.renderer.render(this.scene, this.miniMapCamera);
    this.renderer.setScissorTest(false);
  }

  setupSkybox() {
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
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