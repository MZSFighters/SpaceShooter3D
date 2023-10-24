import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import PlanetLevelOne from './level_one/planet';
import PlanetLevelTwo from './level_two/planet';
import PlanetLevelThree from './level_three/planet';
import EnemySpaceship from './enemy_spaceship';
import powerUp from './powerups';
import enemySpacestation from './enemy_spacestation';
import Particles from './particles';
import ThirdPersonCamera from './custom_cameras.js';
import loadingManager from './loadingManager.js';
import Asteroids from './asteroids';
import CollisionDetection from './collisions';
import Lights from './lighting';
import SkySphere from './skysphere';



class GameWorld {
  constructor(level) {

    // initial setup
    this.canvas = document.querySelector('.webgl'); // Fix: Use '.webgl' to select the canvas element
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.level = level;                             // level number
    this.gameRunning = true;
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

  setupScene() {

    // loading the skybox, earth and moon in the scene

    if (this.level != 1) {
      this.skySphere = new SkySphere(this.scene, this.level);
    }

    if (this.level == 1) {
      this.setupSkybox();
      this.planet = new PlanetLevelOne(this.scene);
      this.enemyStationOne = new enemySpacestation(this.scene, -100, 50, -50, this.level);
      this.enemyStationTwo = new enemySpacestation(this.scene, 0, 100, 400, this.level);
      this.enemyStationThree = new enemySpacestation(this.scene, 300, 0, -150, this.level);
    }
    else if (this.level == 2) {
      this.planet = new PlanetLevelTwo(this.scene);
      this.enemyStationOne = new enemySpacestation(this.scene, 400, 50, 350, this.level);
      this.enemyStationTwo = new enemySpacestation(this.scene, -425, 100, 400, this.level);
      this.enemyStationThree = new enemySpacestation(this.scene, 200, 0, -450, this.level);
    }
    else {
      this.planet = new PlanetLevelThree(this.scene);
      this.enemyStationOne = new enemySpacestation(this.scene, -300, 0, -400, this.level);
      this.enemyStationTwo = new enemySpacestation(this.scene, 0, 100, 400, this.level);
      this.enemyStationThree = new enemySpacestation(this.scene, 300, 0, -150, this.level);
    }

    //const loader = new THREE.TextureLoader();

    // Load the image texture
    // loader.load('./assets/images/shieldy.png', (texture) => {
    //   // Create a material with the loaded texture
    //   const material = new THREE.MeshBasicMaterial({ map: texture });

    //   // Create a sphere geometry
    //   const geometry = new THREE.SphereGeometry(1, 40,40);

    //   // Create the mesh with the material and geometry
    //   const sphere = new THREE.Mesh(geometry, material);
    //   sphere.position.set(0,0,-10);
    //   // Add the sphere to your scene
    //   this.scene.add(sphere);
    // });

    // loading the 3 enemy station bases and adding them to the enemy bases list
    this.enemyBases = [];
    this.enemyBases.push(this.enemyStationOne);
    this.enemyBases.push(this.enemyStationTwo);
    this.enemyBases.push(this.enemyStationThree);

    // loading player spaceship
    this.spaceship = new Spaceship(this.scene, this.camera, this.enemyStationOne.ships, this.enemyBases);

    // creating the particles in background and adding lighting depending on the background
    this.particles = new Particles(this.scene, this.level);
    this.light = new Lights(this.scene, this.level);

    // setting up the third person camera and its target which is the spaceship
    this.thirdPersonCamera = new ThirdPersonCamera({ camera: this.camera, target: this.spaceship.group })

    // adding power ups (for later)
    
    // this.powerupOne = new powerUp(this.scene, 'health',5,0,-5);
    // this.powerupTwo = new powerUp(this.scene, 'shield',-5,0,-5);
    // this.powerupThree = new powerUp(this.scene, 'speed_boost',0,0,-5);

    // rear view camera
    const aspect = window.innerWidth / innerHeight;
    this.rearViewCamera = new THREE.PerspectiveCamera(
      70,
      aspect,
      0.01, 
      500
    )
    // setting up rear view camera  
    this.rearViewCamera.position.set(0, 0, -8);
    this.rearViewCamera.lookAt(0, 0, 0.2);
    this.insetWidth = window.innerWidth / 4;
    this.insetHeight = window.innerHeight / 4;
    this.rearViewCamera.aspect = this.insetWidth / this.insetHeight;
    this.rearViewCamera.add(this.light);
    // adding rear view camera as child to camera
    this.camera.add(this.rearViewCamera);


     //virtual listener for all audio effects in scene
     this.listener = new THREE.AudioListener();
     this.camera.add(this.listener);
 
     //initialize all sounds for the ship here
     this.backgroundSound = new THREE.Audio(this.listener);
     this.impact = new THREE.Audio(this.listener);
     this.hype = new THREE.Audio(this.listener);
     this.fire = new THREE.Audio(this.listener);
     this.power = new THREE.Audio(this.listener);
     this.loadAudio();
  }

  animate() {
    if (this.gameRunning) {
      requestAnimationFrame(this.animate.bind(this));

      // updating planet and moon position
      this.planet.update();

      // animating the particles 
      this.particles.animateStars();

      // rendering according to the camera type
      this.thirdPersonCamera.update();

      // updating the spaceship's position
      this.spaceship.update();

          //updating rearview camera, setting viewport
    // allows main camera and rear view camera toi be viewed at same time 
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.setScissorTest(true);

    this.renderer.setScissor(
      window.innerWidth - this.insetWidth - 17,
      window.innerHeight - this.insetHeight - 17,
      this.insetWidth+2,
      this.insetHeight+2
    );

    this.renderer.setClearColor( 0xffffff, 1 );
    this.renderer.clearColor();

    this.renderer.setViewport(
      window.innerWidth - this.insetWidth - 16,
      window.innerHeight - this.insetHeight - 16,
      this.insetWidth,
      this.insetHeight
    );

    this.renderer.render(this.scene, this.rearViewCamera);
    this.renderer.setScissorTest(false);


      // updating enemy bases and their spaceships
      for (let i = 0; i < this.enemyBases.length; i++) {
        this.enemyBases[i].update(this.spaceship);
      }

      this.collisionDetection();

      // this.renderer.render(this.scene, this.camera);
    } else {
      this.spaceship.GameOver();
    }
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

  //----------------------------------------------------------Collisions-------------------------------------------------------------------//

  // Detects collisions between objects 
  collisionDetection() {

    // Spaceship-Enemy Spaceships Collision
    for (let i = 0; i < this.enemyBases.length; ++i) {
      for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
        if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyBases[i].ships[j])) {
          console.log("Spaceship collided with an enemy spaceship");
          this.enemyBases[i].ships[j].Remove(this.scene);
          const index = this.enemyBases[i].ships.indexOf(this.enemyBases[i].ships[j]);
          const x = this.enemyBases[i].ships.splice(index, 1);
          this.spaceship.health = 0;
          this.spaceship.bindAttriAndUi();
          this.gameRunning = false;
        }
      }
    }

    // Spaceship-Enemy Base Collisions
    for (let i = 0; i < this.enemyBases.length; i++) {
      if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyBases[i]) && this.spaceship._position.x != 0) {
        console.log("Spaceship collided with an enemy base");
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }
    }

    // Spaceship-Earth Collision
    // if (this.CollisionDetection.checkSphereCollision(this.spaceship, this.planet.earthBoundingSphere)) {
    //   console.log("Spaceship collided with the earth");
    //   this.spaceship.health = 0;
    //   this.spaceship.bindAttriAndUi();
    //   this.gameRunning = false;
    // }

    // Spaceship-Asteroids Collision
    if (this.CollisionDetection.checkAsteroidCollision(this.spaceship)) {
      console.log("Spaceship collided with an asteroid")
      this.spaceship.health = 0;
      this.spaceship.bindAttriAndUi();
      this.gameRunning = false;
    }

    // // Enemy Spaceship-Earth Collision
    // for (let i = 0; i < this.enemyBases.length; ++i) {
    //   for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
    //     if (this.CollisionDetection.checkSphereCollision(this.enemyBases[i].ships[j], this.planet.earthBoundingSphere)) {
    //       console.log("An enemy spaceship collided with the earth");
    //       this.enemyBases[i].ships[j].Remove(this.scene);
    //       const index = this.enemyBases[i].ships.indexOf(this.enemyBases[i].ships[j]);
    //       const x = this.enemyBases[i].ships.splice(index, 1);
    //     }
    //   }
    // }

    // Enemy Spaceship-Asteroid
    for (let i = 0; i < this.enemyBases.length; ++i) {
      for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
        if (this.CollisionDetection.checkAsteroidCollision(this.enemyBases[i].ships[j])) {
          console.log("An enemy spaceship collided with an asteroid");
          this.enemyBases[i].ships[j].Remove(this.scene);
          const index = this.enemyBases[i].ships.indexOf(this.enemyBases[i].ships[j]);
          const x = this.enemyBases[i].ships.splice(index, 1);
        }
      }
    }

  }
}

export default GameWorld;
