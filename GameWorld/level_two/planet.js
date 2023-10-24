import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Planet {
    constructor(scene) {
        this.group = new THREE.Group();
        this.earth = new THREE.Object3D();
        this.loadEarth();
        this.group.position.set(-450, -20, 50);     
        

        /*this.ball = new THREE.Mesh(new THREE.SphereGeometry(30),new THREE.MeshBasicMaterial({color:"red"}));
        this.ball.scale.set(5,5,5);
        this.ball.position.set(-450,-100,50);
        scene.add(this.ball);*/


        scene.add(this.group);
    }

    // loading earth into the world
    loadEarth() {
        const earthLoader = new GLTFLoader();
        earthLoader.load(
            './assets/objects_level2/green_planet/scene.gltf',
            (gltf) => {
                this.earth = gltf.scene;
                this.earth.scale.set(4, 4, 4);
                this.group.add(this.earth);
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

    update() {
        if (this.earth) {
            this.earth.rotation.y += 0.01;
        }

        if(this.ball){
            this.ball.rotation.y += 0.01;
        }
    }
}

export default Planet;

