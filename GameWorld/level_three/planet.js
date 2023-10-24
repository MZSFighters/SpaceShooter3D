import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Planet {
    constructor(scene) {
        this.group = new THREE.Group();
        this.moon = new THREE.Object3D();
        this.moon2 = new THREE.Object3D();
        this.earth = new THREE.Object3D();
        this.loadEarth();
        this.loadMoon();
        this.group.position.set(150, 0, 50);
        scene.add(this.group);
    }

    // loading moon in the world
    loadMoon() {
        const moonLoader = new GLTFLoader();
        moonLoader.load(
            './assets/objects_level3/brethren_moons/scene.gltf',
            (gltf) => {
                this.moon = gltf.scene;


                /*const axesHelper = new THREE.AxesHelper(10);
                this.moon.add(axesHelper);

                // Add bounding box helper to the model
                const bbox = new THREE.Box3().setFromObject(this.moon);
                const bboxHelper = new THREE.Box3Helper(bbox, 0xffff00);
                this.moon.add(bboxHelper);*/

                this.moon.scale.set(30, 30, 30);
                this.moon2 = gltf.scene;
                this.moon2.position.set(-10,0,0);
                //the moon's position relative to the Earth
                this.moon.position.set(30, 50, -50); // (initially z was 0)
                this.moon2.position.set(30, 50, 50);
                // Apply inverse transformations of the parent to the child (moon).
                this.moon.position.applyMatrix4(this.earth.matrixWorld.clone().invert());
                this.moon.scale.applyMatrix4(this.earth.matrixWorld.clone().invert());
                //this.earth.add(this.moon2)
                this.group.add(this.moon);
                this.group.add(this.moon2);
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

    // loading earth into the world
    loadEarth() {
        const earthLoader = new GLTFLoader();
        earthLoader.load(
            './assets/objects_level3/red_planet/scene.gltf',
            (gltf) => {

                this.earth = gltf.scene;

                /*const axesHelper = new THREE.AxesHelper(10);
                this.earth.add(axesHelper);

                // Add bounding box helper to the model
                const bbox = new THREE.Box3().setFromObject(this.earth);
                const bboxHelper = new THREE.Box3Helper(bbox, 0xffff00);
                this.earth.add(bboxHelper);*/
                this.earth.scale.set(5, 5, 5);
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

        if (this.moon) {
            // rotating the moon around the earth which is the parent object
            this.moon.rotation.y -= 0.01;
        }
    }
}

export default Planet;

