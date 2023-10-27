import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager';

class SkySphere {
    constructor(scene, level){
        this.level = level;
        this.scene = scene;
        this.skysphere = new THREE.Object3D();

        if (this.level == 2){
            this.setupSkyboxLevel2();
        }
        else{
            this.setupSkyboxLevel3();
        }
    }

    setupSkyboxLevel2() {
        const spaceShipLoader = new GLTFLoader(loadingManager);
        spaceShipLoader.load(
            './assets/objects_level2/space_skydome/scene.gltf',
            (gltf) => {
                this.skysphere = gltf.scene;
                this.skysphere.scale.set(600, 600, 600);
                this.scene.add(this.skysphere);
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
        const spaceShipLoader = new GLTFLoader(loadingManager);
        spaceShipLoader.load(
            './assets/objects_level3/space_skysphere/scene.gltf',
            (gltf) => {
                this.skysphere = gltf.scene;
                this.skysphere.scale.set(600, 600, 600);
                this.scene.add(this.skysphere);
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

    update(){
        if (this.skysphere){
            this.skysphere.rotation.y += 0.001;
        }
    }
}

export default SkySphere;