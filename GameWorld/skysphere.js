import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class SkySphere {
    constructor(scene, level){
        this.level = level;
        this.scene = scene;

        if (this.level == 2){
            this.setupSkyboxLevel2();
        }
        else{
            this.setupSkyboxLevel3();
        }
    }

    setupSkyboxLevel2() {
        const spaceShipLoader = new GLTFLoader();
        spaceShipLoader.load(
            './assets/objects_level2/space_skydome/scene.gltf',
            (gltf) => {
                const spaceShip = gltf.scene;
                spaceShip.scale.set(600, 600, 600);
                this.scene.add(spaceShip);
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

    setupSkyboxLevel3() {
        const spaceShipLoader = new GLTFLoader();
        spaceShipLoader.load(
            './assets/objects_level3/space_skysphere/scene.gltf',
            (gltf) => {
                const spaceShip = gltf.scene;
                spaceShip.scale.set(600, 600, 600);
                this.scene.add(spaceShip);
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

export default SkySphere;