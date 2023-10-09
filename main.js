import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Spaceship from './spaceship';
import Planet from './planet';
import EnemySpaceship from './enemy_spaceship';
import {GUI} from 'dat.gui';

//Classes

class ThirdPersonCamera //must pass through camera in params
{
    constructor(params)
    {
        this._params= params
        this._camera = params.camera

        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }

    Update(velocity=10)
    {
        const idealOffSet = this._CalculateIdealOffset(velocity);
        const idealLookAt = this._CalculateIdealLookat();

        this._currentPosition.copy(idealOffSet);
        this._currentLookAt.lerp(idealLookAt, 0.5);
        
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt);

    }

    _CalculateIdealOffset(offset) {
        const idealOffset = new THREE.Vector3(0, 2, (offset)*2+5 );
        idealOffset.applyQuaternion(this._params.target.quaternion);
        idealOffset.add(this._params.target.position);
        return idealOffset;
      }
    

    _CalculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 0, -40);
        idealLookat.applyQuaternion(this._params.target.quaternion);
        idealLookat.add(this._params.target.position);
        return idealLookat;
      }


}

class FirstPersonCamera
{
    constructor(params)
    {
        this._params = params
        this._camera = this._params.camera
    }
}


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
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const scene = new THREE.Scene();

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



// adding some ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambientLight);

//Camera
var camera = new  THREE.PerspectiveCamera(60, 1920/1080, 1.0, 1000.0)

var thirdPersonCamera =new ThirdPersonCamera({
    camera: camera,
    target: spaceship.group
})

var firstPersonCamera = new FirstPersonCamera({
    camera: camera,
})



//enemy AI




// Animating 
function animate() {
    requestAnimationFrame(animate);

    enemy_spaceship.update(spaceship);
    spaceship.update()
    planet.update();     
    thirdPersonCamera.Update(spaceship._velocity)


    renderer.render(scene, camera);
}


animate();



//---------------------------------Event listeners for keyboard and mouse input------------------------------------------------------------//



// takes care of resizing when we open or close the console

//---------------------------------------------------------------------------------------------------------------------------------//



