import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import Planet from './planet';
import EnemySpaceship from './enemy_spaceship';


//----------------------------------------Functions------------------------------------------------------//


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



// Loading a space station in the world
function loadSpaceStation() {
    const spaceStationLoader = new GLTFLoader();
    spaceStationLoader.load(
        './assets/objects/space_station/scene.gltf',
        (gltf) => {
            const spaceStation = gltf.scene;

            spaceStation.scale.set(2, 2, 2);
            spaceStation.position.set(-100, 50, -50);

            scene.add(spaceStation);
        },
        (xhr) => {
            // Loading progress callback
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
            // Error callback
            console.error('Error loading GLTF model', error);
        }
    );
}




//--------------------------------------------------------------------------------------------------------//


// initial setup
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
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
loadSpaceStation();
const planet = new Planet(scene);
const spaceship = new Spaceship(scene);
const enemy_spaceship = new EnemySpaceship(scene);

// adding directional light from the sun which is on far right - work in progress
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(1000,0,0);
scene.add( directionalLight );
/*
const lightTarget = new THREE.Object3D();
scene.add( lightTarget);
directionalLight.target = lightTarget;
lightTarget.position.set(150,0,50);*/



// adding some ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambientLight);


// default camera positioning for both cameras
thirdPersonCamera.position.z = 5;
thirdPersonCamera.position.y = 1;
firstPersonCamera.position.y = 0.9;
firstPersonCamera.position.z = 1;


// Animating 
function animate() {
    requestAnimationFrame(animate);
   
    // updating planet and moon position
    planet.update();     

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



