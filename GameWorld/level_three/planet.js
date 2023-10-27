import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from '../loadingManager';

class Planet {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.moon = new THREE.Object3D();
        this.moon2 = new THREE.Object3D();
        this.earth = new THREE.Object3D();
        this.loadEarth();
        this.loadMoon();
        this.group.position.set(10, 5, -300);
        this.createMoon(scene, -250, 100, 100);
        this.createMoon(scene, 350, 20, 150);

        // Brethen Moon bounding box business
        const boundingBoxGeometry = new THREE.BoxGeometry(170, 160, 110);
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });     // change it to true to see the bounding box
        const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
        this.moonOneBoundingBox = new THREE.Group();
        this.moonTwoBoundingBox = new THREE.Group();
        this.moonTwoBoundingBox.add(cube);
        this.moonTwoBoundingBox.position.set(-280, 90, 100);
        scene.add(this.moonTwoBoundingBox);
        const cube2 = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
        this.moonThreeBoundingBox = new THREE.Group();
        this.moonThreeBoundingBox.add(cube2);
        this.moonThreeBoundingBox.position.set(320, 10, 130);
        scene.add(this.moonThreeBoundingBox);



        // bounding sphere of the red planet for collision detection
        this.planetBoundingSphere = new THREE.Sphere(new THREE.Vector3(10, 5, -300), 40);
        scene.add(this.group);
    }

    createMoon(scene, x, y, z) {
        const moonLoader = new GLTFLoader(loadingManager);
        moonLoader.load(
            './assets/objects_level3/brethren_moons/scene.gltf',
            (gltf) => {
                this.moon2 = gltf.scene;
                this.moon2.scale.set(100, 100, 100);
                this.moon2.position.set(x, y, z);
                scene.add(this.moon2);
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

    // loading moon in the world
    loadMoon() {
        const moonLoader = new GLTFLoader(loadingManager);
        moonLoader.load(
            './assets/objects_level3/brethren_moons/scene.gltf',
            (gltf) => {
                this.moon = gltf.scene;
                this.moon.scale.set(70, 70, 70);
                this.moon.position.set(30, 100, 50);
                this.group.add(this.moon);

                const boundingBoxGeometry = new THREE.BoxGeometry(110, 80, 70);
                const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // change it to true to see the bounding box
                const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
                
                this.moonOneBoundingBox.add(cube);
                this.moonOneBoundingBox.position.set(40, 105, -250);
                this.scene.add(this.moonOneBoundingBox);
                
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
        const earthLoader = new GLTFLoader(loadingManager);
        earthLoader.load(
            './assets/objects_level3/red_planet/scene.gltf',
            (gltf) => {

                this.earth = gltf.scene;
                this.earth.scale.set(15, 15, 15);
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

            this.moon.rotation.y -= 0.01;
        }

        if (this.moonOneBoundingBox) {
            this.moonOneBoundingBox.rotation.y -= 0.01;
        }
    }
}

export default Planet;

