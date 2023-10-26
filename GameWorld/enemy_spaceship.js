import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';
import { enemyLasers } from './lasers.js';


class enemySpaceship {
    constructor(scene, x, y, z, level) {
        this.group = new THREE.Group();
        this.scene = scene;
        this.level = level;
        this.x = x;
        this.y = y;
        this.z = z;
        this.health = 100;
        this.lasers = new enemyLasers(this.scene)
        this.shooting = 0;
        this.count = 0;
        this.collided = false;
        this.clock = new THREE.Clock();

        if (this.level == 1) {
            this.loadSpaceshipLevel1();
        }
        else if (this.level == 2) {
            this.loadSpaceshipLevel2();
        }
        else {
            this.loadSpaceshipLevel3();
        }

        this.group.position.set(this.x, this.y, this.z);
        this.scene.add(this.group);

        this.boundingBox = new THREE.Group();
        // bounding object of the enemy spaceship for collision detection
        if (this.level == 1) {
            const boundingBoxGeometry = new THREE.BoxGeometry(0.5 * 5, 0.5 * 2, 0.5 * 6);
            const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });     // change it to true to see the bounding box
            const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
            this.boundingBox.add(cube);
            this.boundingBox.position.set(0, 1, 0);
        }
        else if (this.level == 2){
            const boundingBoxGeometry = new THREE.BoxGeometry(0.5 * 5, 0.5 * 2, 0.5 * 6);
            const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // change it to true to see the bounding box
            const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
            this.boundingBox.add(cube);
            this.boundingBox.position.set(0, 1, 0);
        }
        else{
            const boundingBoxGeometry = new THREE.BoxGeometry(0.5 * 7, 0.5 * 3.5, 0.5 * 6);
            const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // change it to true to see the bounding box
            const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
            this.boundingBox.add(cube);
            this.boundingBox.position.set(0, 0, 0);
        }
        
        this.group.add(this.boundingBox);
    }

    delete(){
        this.scene.remove(this.group);
        this.scene.remove(this.boundingBox);

        for (var i=this.lasers.lasers.length-1; i>=0 ; i--)
        {
            this.lasers.lasers[i].delete();
        }

        this.group.children.forEach(child => {
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                child.material.dispose();
            }
         });
        }

    // loads the enemy spaceship in the world
    loadSpaceshipLevel1() {
        const spaceShipLoader = new GLTFLoader(loadingManager);
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

    loadSpaceshipLevel2() {
        const spaceShipLoader = new GLTFLoader();
        spaceShipLoader.load(
            './assets/objects_level2/enemy_spaceship/scene.gltf',
            (gltf) => {
                this.spaceShip = gltf.scene;
                this.spaceShip.scale.set(0.5, 0.5, 0.5);
                //this.spaceShip.rotation.set(0, Math.PI, 0);
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

    loadSpaceshipLevel3() {
        const spaceShipLoader = new GLTFLoader();
        spaceShipLoader.load(
            './assets/objects_level3/enemy_spaceship/scene.gltf',
            (gltf) => {
                this.spaceShip = gltf.scene;
                this.spaceShip.scale.set(0.7, 0.7, 0.7);
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


    update(target) {

        this.lasers.update(target)

        const rotationMatrix = new THREE.Matrix4();
        const targetQuaternion = new THREE.Quaternion();

        const direction = new THREE.Vector3();
        this.group.getWorldDirection(direction);
        const raycaster = new THREE.Raycaster()
        raycaster.far = 100;
        raycaster.near = 1;
        raycaster.set(this.group.position, direction);

        const intersections = raycaster.intersectObject(target.group, true);

        if (intersections.length != 0) {

            if (this.count == 0 && intersections[0].distance < 5) {
                this.count = 20; 
            }

            else if (intersections.some(e => e.object.userData.name == "player")) {
                if (this.shooting == 0) {
                    if(this.level == 1){
                        this.lasers.shoot("lime", this.group.position, this.group.rotation);
                    }
                    else if (this.level == 2){
                        this.lasers.shoot("yellow", this.group.position, this.group.rotation);
                    }
                    else{
                        this.lasers.shoot("orange", this.group.position, this.group.rotation);
                    }
                    
                    this.shooting = 0;
                }
                else {
                    this.shooting = this.shooting - 1;
                }
            }
        }

        if (this.count == 0) {
            rotationMatrix.lookAt(target.group.position, this.group.position, this.group.up);
            targetQuaternion.setFromRotationMatrix(rotationMatrix);
        }
        else {
            this.count = this.count - 1
            targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        }

        if (!this.group.quaternion.equals(targetQuaternion)) {
            const step = 0.01;
            this.group.quaternion.rotateTowards(targetQuaternion, step);
        }

        this.group.position.addScaledVector(direction, 0.3);
    }

}

export default enemySpaceship;
