import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from '../loadingManager.js';

class Planet {
    constructor(scene) {
        this.group = new THREE.Group();
        this.moon = new THREE.Object3D();
        this.earth = new THREE.Object3D();
        this.loadEarth();
        this.loadMoon();
        this.group.position.set(150, 0, 50);
        scene.add(this.group);
    
        // bounding sphere of the earth for collision detection
        this.earthBoundingSphere = new THREE.Sphere(new THREE.Vector3(150, 0, 50), 70);
    }

    // loading moon in the world
    loadMoon() {
        const moonLoader = new GLTFLoader(loadingManager);
        moonLoader.load(
            './assets/objects/moon/scene.gltf',
            (gltf) => {
                this.moon = gltf.scene;
                this.moon.scale.set(30, 30, 30);

                //the moon's position relative to the Earth
                this.moon.position.set(300, 350, -150); // (initially z was 0)
                this.ball = new THREE.Mesh(new THREE.SphereGeometry(30), new THREE.MeshStandardMaterial({ color: "red" }));
                this.ball.scale.set(1, 1, 1);
                this.ball.position.set(300, 350, -150);
                //this.earth.add(this.ball);
                this.earth.add(this.moon);
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
        //this.moonBoundingSphere = new THREE.Sphere();
    }

    // loading earth into the world
    loadEarth() {
        const earthLoader = new GLTFLoader(loadingManager);
        earthLoader.load(
            './assets/objects/earth/scene.gltf',
            (gltf) => {
                this.earth = gltf.scene;
                this.earth.scale.set(0.2, 0.2, 0.2);
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
            this.earth.rotation.y += 0.001;
        }

        if (this.moon) {
            // rotating the moon around the earth which is the parent object
            this.moon.rotation.y -= 0.01;
            
        }
    }
}

export default Planet;

