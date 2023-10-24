import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';
import ControllerInput from './controllerInput.js';


class Spaceship {
    constructor(scene, camera,enemies,bases) {
        this.healthUi = document.getElementById('health-bar');
        this.shieldUi = document.getElementById('sheld-bar');
        //this.boostUi = document.getElementById('speed-bar');
        this.group = new THREE.Group();
        this.health = 100;
        this.shield = 0;
        this.loadSpaceship();
        this.backlightIntensity = 0;
        this.addBackLights();
        this.enemies = enemies;
        this.bases = bases;
        this.bindAttriAndUi();
        this.GameOver();

        // velocity-acceleration business
        this._position = this.group.position;
        this._velocity = new THREE.Vector3();
        this.acceleration = 0.02;
        this.maxVelocity = 1;
        this.rotationSpeed = 0.02;
        this.yAcceleration = 0.04;
        this.maxYVelocity = 1;

        // spaceship laser constructor values
        this.lasers1 = [];
        // this.lasers2 = [];
        this.lasSpeed = 300;
        this.clock = new THREE.Clock();
        this.delta = 0;
        this._scene = scene;

        // controller input listeners
        this.controller = new ControllerInput(this.group);
        scene.add(this.group);

        // bounding box of the spaceship for collision detection 
        const boundingBoxGeometry = new THREE.BoxGeometry(0.7*3, 0.7*2, 0.7*4.5);
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });     // change it to true to see the bounding object
        this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
        this.group.add(this.boundingBox);
    }

    // adding the back boost lights
    addBackLights() {
        this.backlight = new THREE.PointLight(0xFF0000, this.backlightIntensity, 3);
        this.backlight.position.set(0, 0, 1.5); 
        this.backlight1 = new THREE.PointLight(0xFF0000, this.backlightIntensity, 3);
        this.backlight1.position.set(1, 0, 2); 
        this.backlight2 = new THREE.PointLight(0xFF0000, this.backlightIntensity, 3);
        this.backlight2.position.set(-1, 0, 2);
        this.group.add(this.backlight);
        this.group.add(this.backlight1);
        this.group.add(this.backlight2);
    }

    // loading the spaceship model
    loadSpaceship() {
        const spaceShipLoader = new GLTFLoader(loadingManager);
        spaceShipLoader.load(
            './assets/objects/spaceship/scene.gltf',
            (gltf) => {
                this.spaceShip = gltf.scene;
                this.spaceShip.scale.set(0.7, 0.7, 0.7);
                this.group.add(this.spaceShip);
                this.spaceShip.traverse(
                    function(object) {
                      object.userData.name ="player"
                    })
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

        // spaceship's movement event listeners
        const keys = this.controller._keys;

        if (keys.space) {
            this.shootAction();
        }

        if (keys.forward) {
            this._velocity.add(this.group.getWorldDirection(new THREE.Vector3()).multiplyScalar(-this.acceleration));

        } else if (keys.backward) {
            if (this._velocity > 0) {
                this._velocity.add(this.group.getWorldDirection(new THREE.Vector3()).multiplyScalar(this.acceleration));
            }
        }

        if (keys.right) {
            this.group.rotation.y -= this.rotationSpeed;
        } else if (keys.left) {
            this.group.rotation.y += this.rotationSpeed;
        }

        if (keys.up){
            this._velocity.y += this.yAcceleration;
        } else if(keys.down){
            this._velocity.y -= this.yAcceleration;
        }
        this._velocity.y = THREE.MathUtils.clamp(this._velocity.y, -this.maxYVelocity, this.maxYVelocity);

        // adding and controlling the velocity as well as the intensity of the back lights
        this.group.position.add(this._velocity);
        const velocityFactor = this._velocity.length() / this.maxVelocity;
        const intensity = Math.min(1, Math.max(0, velocityFactor));

        //laser updating
        this.delta = this.clock.getDelta();
        this.lasers1.forEach(l => {
            l.mesh.translateZ(-this.lasSpeed * this.delta);
            l.boundingBox.setFromObject(l.mesh);
        });

        // updating the point light intensity
        this.backlight.intensity = intensity;
        this.backlight1.intensity = intensity;
        this.backlight2.intensity = intensity;

        // velocity dampening staff
        this._velocity.clampLength(0, this.maxVelocity);
        this._velocity.y = THREE.MathUtils.clamp(this._velocity.y, -this.maxYVelocity, this.maxYVelocity);
        this._velocity.multiplyScalar(0.95);
        this._position.add(this._velocity);

        //this.detectLaserCollisions();
        //this.detectLaserCollisions2();
    }

    
    shootAction(_direction) {
        this.laser1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 2, 0, Math.PI*2, 0, 5.66), new THREE.MeshBasicMaterial({color: "red"}));
        this.laser1.position.copy(this._position);
        // this.laser1.translateX(-1.1);
        this.laser1.rotation.copy(this.group.rotation);
        
        //this.lasers1.push(this.laser1);
        const laserBoundingBox = new THREE.Box3().setFromObject(this.laser1);
        this.lasers1.push({ mesh: this.laser1, boundingBox: laserBoundingBox });
        this._scene.add(this.laser1);

    }

    detectLaserCollisions() {
        this.lasers1.forEach(laser => {
          this.enemies.forEach(enemySpaceship => {
            const box = new THREE.Box3().setFromObject(enemySpaceship.boundingBox);
            if (laser.boundingBox.intersectsBox(box)) {
              enemySpaceship.health -= 40;
              console.log(enemySpaceship.health);
              if (enemySpaceship.health <= 0){
               enemySpaceship.collided = true;
                enemySpaceship.Remove(this._scene);
              }
            }
          });
        });
    }

    detectLaserCollisions2() {
        this.lasers1.forEach(laser => {
          this.bases.forEach(base => {
            const box = new THREE.Box3().setFromObject(base.boundingBox);
            if (laser.boundingBox.intersectsBox(box)) {
              base.health -= 5;
              console.log(base.health);
              if (base.health <= 0){
                base.collided = true;
                base.Remove(this._scene);
              }
            }
          });
        });
    }

    

    bindAttriAndUi(){
        this.shieldUi.style.width = `${this.shield * 2}px`;
        this.healthUi.style.width = `${this.health * 2}px`;
    }

    Remove(scene){
        scene.remove(this.group);
        scene.remove(this.boundingBox);
    }

    GameOver(){
        const gameOverText = document.querySelector('.game-over');
        if(this.health == 0){
            console.log("Game Over");
            gameOverText.style.display = 'block';
        
        }
    }
}

export default Spaceship;



