import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';


class enemySpaceship {
    constructor(scene,x,y,z) {
        this.group = new THREE.Group();
        this.scene=scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.health = 100;
        this.lasers = [];
        this.shooting =0;
        this.count =0;
        this.clock = new THREE.Clock();
        this.loadSpaceship();
        this.collided = false;
        this.group.position.set(this.x,this.y,this.z);
        scene.add(this.group);                      

        // bounding object of the enemy spaceship for collision detection
        const boundingBoxGeometry = new THREE.BoxGeometry(0.5*5, 0.5*2, 0.5*6);
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // change it to true to see the bounding box
        this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
        this.boundingBox.position.set(0,1,0)
        this.group.add(this.boundingBox);
    }

    Remove(scene){
        scene.remove(this.group);
        scene.remove(this.boundingBox);
    }


    // loads the enemy spaceship in the world
    loadSpaceship() {
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

    
    update(target) {

        const rotationMatrix = new THREE.Matrix4();
        const targetQuaternion = new THREE.Quaternion();

        const direction = new THREE.Vector3();
        this.group.getWorldDirection(direction);
        const raycaster = new THREE.Raycaster()
        raycaster.far=100;
        raycaster.near=4;
        raycaster.set(this.group.position, direction);

       const intersections = raycaster.intersectObject(this.scene, true);

       if (intersections.length !=0)
       {

        if ( this.count==0 && intersections[0].distance <5 )
        {
            this.count=20;
        }

        else if (intersections.some(e => e.object.userData.name == "player")) {
            if (this.shooting ==0)
            {
                this.shootAction(direction)
                this.shooting =5;
            }
            else{
                this.shooting = this.shooting -1;
            }
          }
       }

       if (this.count==0)
       {
            rotationMatrix.lookAt(target.group.position, this.group.position, this.group.up);
            targetQuaternion.setFromRotationMatrix(rotationMatrix);
       }
       else
       {
            this.count= this.count -1
            targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
       }

       if (!this.group.quaternion.equals(targetQuaternion)) {
        const step = 0.01;
        this.group.quaternion.rotateTowards(targetQuaternion, step);    
    }

    for (let i=0; i< this.lasers.length; i++)
    {
        let laser = this.lasers[i]
        const laser_direction = new THREE.Vector3();
        laser.getWorldDirection(laser_direction)
        laser.position.addScaledVector(laser_direction, 2);
    }
        this.group.position.addScaledVector(direction, 0.1);
        //this.detectLaserCollisions(target)
    }

    //functions
        shootAction( _direction) {
        this.laser1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({color: "green"}));
        this.laser1.position.copy(this.group.position);
        this.laser1.rotation.copy(this.group.rotation);
        this.scene.add(this.laser1);
        this.lasers.push(this.laser1)
    }
    
    /*detectLaserCollisions(target) {
        for (var i =0; i< this.lasers.length; i++)
        {
            console.log(this.lasers[i].boundingBox);
        }
    }*/
}

export default enemySpaceship;
