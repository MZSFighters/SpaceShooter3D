import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import Planet from './planet';
import EnemySpaceship from './enemy_spaceship';
import powerUp from './powerups';
import enemySpacestation from './enemy_spacestation';
import Particles from './particles';
import ThirdPersonCamera from './custom_cameras.js';
import loadingManager from './loadingManager.js';
import Asteroids from './asteroids';
import CollisionDetection from './collisions';

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
    this.setupScene();
    this.CollisionDetection = new CollisionDetection(this.scene);
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

    // loading the skybox, earth, moon, and the spaceship in the scene
    this.setupSkybox();
    this.planet = new Planet(this.scene);
    this.spaceship = new Spaceship(this.scene);
  
    // loading the 3 enemy station bases
    this.enemyStationOne = new enemySpacestation(this.scene, -100, 50, -50);
    this.enemyStationTwo = new enemySpacestation(this.scene, 0, 100, 400);
    this.enemyStationThree = new enemySpacestation(this.scene, 300, 0, -150);

    // loading the enemy spaceship(s)
    this.enemySpaceshipOne = new EnemySpaceship(this.scene, -10, 0, -10);
    this.enemySpaceshipTwo = new EnemySpaceship(this.scene, 0, 95, 375);
    this.enemySpaceshipThree = new EnemySpaceship(this.scene, 295, -5, -140);

    // creating the white particles in background
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
    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

    this.thirdPersonCamera = new ThirdPersonCamera({ camera: this.camera, target: this.spaceship.group })

    // adding power ups (for later)
    
    this.powerupOne = new powerUp(this.scene, 'health',5,0,-5);
    this.powerupTwo = new powerUp(this.scene, 'shield',-5,0,-5);
    this.powerupThree = new powerUp(this.scene, 'speed_boost',0,0,-5);

    // orthographic camera (mini-map)
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
    this.insetWidth = window.innerHeight / 4;
    this.insetHeight = window.innerHeight / 4;
    this.miniMapCamera.aspect = this.insetWidth / this.insetHeight;
    this.miniMapCamera.add(this.light);
    this.camera.add(this.miniMapCamera);

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // updating planet and moon position
    this.planet.update();

    // animating the white particles 
    this.particles.animateStars();

    // rendering according to the camera type
    this.thirdPersonCamera.update();

    // updating the spaceship's position
    this.spaceship.update();


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

    this.collisionDetection();
  }

  // adds the skybox to the scene 
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

  // detects collisions between objects 
  collisionDetection() {

    // Spaceship-Enemy Spaceships Collision
    if (this.CollisionDetection.checkCollision(this.spaceship, this.enemySpaceshipOne)) {
      console.log("Spaceship collided with the first enemy spaceship");
      // ...
    }
    if (this.CollisionDetection.checkCollision(this.spaceship, this.enemySpaceshipTwo)) {
      console.log("Spaceship collided with the second enemy spaceship");
      // ...
    }
    if (this.CollisionDetection.checkCollision(this.spaceship, this.enemySpaceshipThree)) {
      console.log("Spaceship collided with the third enemy spaceship");
      // ...
    }

    // Spaceship-Earth Collision
    if (this.CollisionDetection.checkSphereCollision(this.spaceship, this.planet.earthBoundingSphere)) {
      console.log("Spaceship collided with the earth");
      // ...
    }

    // Spaceship-Enemy Base Collisions
    if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyStationOne)) {
      console.log("Spaceship collided with the first enemy base");
      // ...
    }
    if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyStationTwo)) {
      console.log("Spaceship collided with the second enemy base");
      // ...
    }
    if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyStationThree)) {
      console.log("Spaceship collided with the third enemy base");
      // ...
    }

    // Spaceship-Powerup Collisions
    if(this.CollisionDetection.checkCollision(this.spaceship,this.powerupOne)){
      console.log("Spaceship collided with the power up one");
    }
    if(this.CollisionDetection.checkCollision(this.spaceship,this.powerupTwo)){
      console.log("Spaceship collided with the power up two");
    }
    if(this.CollisionDetection.checkCollision(this.spaceship,this.powerupThree)){
      console.log("Spaceship collided with the power up three");
    }

    // Spaceship-Asteroids Collision
    this.CollisionDetection.checkAsteroidCollision(this.spaceship);
  }
}

export default GameWorld;
