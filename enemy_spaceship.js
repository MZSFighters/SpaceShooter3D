import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



class enemySpaceship {
    constructor(scene) {
        this.group = new THREE.Group();

        this.health = 100;
        this.loadSpaceship();
        this.position = this.group.position.set(-10, -20, -10);
        scene.add(this.group);                      // loading, setting initial position of the spaceship and adding it to the scene
    }


    loadSpaceship() {
        const spaceShipLoader = new GLTFLoader();
        spaceShipLoader.load(
            './assets/objects/enemy_spaceship/scene.gltf',
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

        const rotationMatrix = new THREE.Matrix4();
        const targetQuaternion = new THREE.Quaternion();
        const speed = 2;

        rotationMatrix.lookAt(target.group.position, this.group.position, this.group.up);
        targetQuaternion.setFromRotationMatrix(rotationMatrix);


        if (!this.group.quaternion.equals(targetQuaternion)) {

            const step = speed * 0.01;
            this.group.quaternion.rotateTowards(targetQuaternion, step);    
        }

        const direction = new THREE.Vector3();
        this.group.getWorldDirection(direction);


        
        const raycaster = new THREE.Raycaster()
        raycaster.far=10;
       raycaster.set(this.group.position, direction);

       const intersections = raycaster.intersectObject(target.group);


       if (intersections.length !=0) // then we are too close to another object
       {
        //do something
       }

        this.group.position.addScaledVector(direction, 0.1);
        //mesh -> this
        //target -> target
    }
}

export default enemySpaceship;