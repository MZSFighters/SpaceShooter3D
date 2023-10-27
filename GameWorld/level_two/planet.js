import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from '../loadingManager';

class Planet {
    constructor(scene) {
        this.group = new THREE.Group();
        this.earth = new THREE.Object3D();
        this.loadEarth();
        this.group.position.set(-450, -20, 50);     

        this.moonBoundingSphere = new THREE.Sphere(new THREE.Vector3(-450, -20, 50), 70);

        this.shield = new THREE.Mesh(new THREE.SphereGeometry(125),new THREE.MeshStandardMaterial({color:"purple", transparent: true, opacity: 0.3}));
        this.shield.scale.set(1.45,1.45,1.45);
        this.shield.position.set(10,-220,0);
        this.group.add(this.shield);

        this.planetBoundingSphere = new THREE.Sphere();
        this.planetBoundingSphere.center = new THREE.Vector3(-440,-240,50); // Set the center
        this.planetBoundingSphere.radius = 125*1.45; // Set 

        scene.add(this.group);
    }

    // loading earth into the world
    loadEarth() {
        const earthLoader = new GLTFLoader(loadingManager);
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

        

    }
}

export default Planet;

