import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import Planet from './planet';
import EnemySpaceship from './enemy_spaceship';
import Bullet from './bullet';
import powerUp from './powerups';
import shootBullets from './shoot_bullets';
import enemySpacestation from './enemy_spacestation';
import Particles from './particles';


//----------------------------------------Functions------------------------------------------------------//

// Function that adds the skybox into the scene 
function skybox() {
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  scene.background = cubeTextureLoader.setPath("./assets/images/space_skybox/").load(["right.png",
    "left.png",
    "top.png",
    "bottom.png",
    "front.png",
    "back.png"
  ]);
}

//--------------------------------------------------------------------------------------------------------//


// initial setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const scene = new THREE.Scene();
const thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let isthirdPersonCamera = true;                             // Boolean flag to track the active camera



// Just to test and to move around using the camera at (0,0)
const orbit = new OrbitControls(thirdPersonCamera, renderer.domElement);
orbit.update();



// loading the skybox, earth, moon and the spaceship in the scene
skybox();
const planet = new Planet(scene);
const spaceship = new Spaceship(scene);


// loading the 3 enemy station bases
const enemyStationOne = new enemySpacestation(scene, -100,50,-50);
const enemyStationTwo = new enemySpacestation(scene, 0,100,400);
const enemyStationThree = new enemySpacestation(scene, 300,0,-150);

// loading the enemy spaceship(s)
const enemySpaceshipOne = new EnemySpaceship(scene,-10,0,-10);
const enemySpaceshipTwo = new EnemySpaceship(scene,0,95,375);
const enemySpaceshipThree = new EnemySpaceship(scene,295,-5,-140);


// creating the red particles in background
const particles = new Particles(scene);
particles.createStars(); 


// adding directional light from the sun which is on far right - work in progress
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1000, 0, 0);
scene.add(directionalLight);


// adding some ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambientLight);


// default camera positioning for both cameras
thirdPersonCamera.position.z = 5;
thirdPersonCamera.position.y = 1;
firstPersonCamera.position.y = 0.9;
firstPersonCamera.position.z = 1;

// adding power ups (for later)
/*
new powerUp(scene, 'health',5,0,-5);
new powerUp(scene, 'shield',-5,0,-5);
new powerUp(scene, 'speed_boost',0,0,-5);
*/

/*document.addEventListener('keydown', (event) => {
  if (event.key === 'm') {
    shoot = new shootBullets(scene, spaceship.position.x, spaceship.position.y, spaceship.z);
  }
});*/



// Animating 
function animate() {
  requestAnimationFrame(animate);

  // updating planet and moon position
  planet.update();

  // animating the red particles 
  particles.animateStars();


  /*
  if (shoot) {
    shoot.shootupdate();
  }*/


  // rendering according to the camera type
  if (isthirdPersonCamera) {
    renderer.render(scene, thirdPersonCamera);
  } else {
    renderer.render(scene, firstPersonCamera);
  }

}

animate();


//---------------------------------Event listeners for keyboard and mouse input------------------------------------------------------------//



// takes care of resizing when we open or close the console
window.addEventListener('resize', function () {
  thirdPersonCamera.aspect = window.innerWidth / window.innerHeight;
  thirdPersonCamera.updateProjectionMatrix();
});


//---------------------------------------------------------------------------------------------------------------------------------//



