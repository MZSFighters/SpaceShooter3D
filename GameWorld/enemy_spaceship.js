import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class enemySpaceship {
    constructor(scene,x,y,z) {
        this.group = new THREE.Group();
        this.x = x;
        this.y = y;
        this.z = z;
        this.health = 100;
        this.loadSpaceship();
        this.group.position.set(this.x,this.y,this.z);
        scene.add(this.group);                      // loading, setting initial position of the spaceship and adding it to the scene
    }


    loadSpaceship() {
        const spaceShipLoader = new GLTFLoader();
        spaceShipLoader.load(
            './assets/objects/enemy_spaceship/scene.gltf',
            (gltf) => {
                this.spaceShip = gltf.scene;
                this.spaceShip.scale.set(0.5, 0.5, 0.5);
                this.group.add(this.spaceShip);
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
}

export default enemySpaceship;