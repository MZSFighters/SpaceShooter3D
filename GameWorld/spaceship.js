import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';
import ControllerInput from './controllerInput.js';
import Shield from './shield.js';
import Lasers from './lasers.js'


class Spaceship {
    constructor(scene, camera, enemies, bases) {
        this.scene = scene;
        this.healthUi = document.getElementById('health-bar');
        this.shieldUi = document.getElementById('sheld-bar');
        this.boostUi = document.getElementById('speed-bar');
        this.group = new THREE.Group();
        this.health = 100;
        this.shield = 0;
        this.boost = 0;
        this.slow = 0;
        this.loadSpaceship();
        this.backlightIntensity = 0;
        this.addBackLights();
        this.enemies = enemies;
        this.bases = bases;
        this.bindAttriAndUi();

        //shooting
        this.lasers = new Lasers(this.scene, camera);

        // velocity-acceleration business
        this._position = this.group.position;
        this._velocity = new THREE.Vector3();
        this.acceleration = 0.04;       // 0.02
        this.maxVelocity = 1;
        this.rotationSpeed = 0.03;      // 0.02
        this.yAcceleration = 0.04;
        this.maxYVelocity = 1;
        this.boosting = false;
        this.slowSpeed = false;
        // spaceship laser constructor values
        this.clock = new THREE.Clock();
        this.delta = 0;


        // controller input listeners
        this.controller = new ControllerInput(this.group);
        this.initMouseWheelListener();
        scene.add(this.group);

        // bounding box of the spaceship for collision detection 
        const boundingBoxGeometry = new THREE.BoxGeometry(0.7 * 3, 0.5 *2, 0.7 * 4.5);
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: true});     // change it to true to see the bounding object
        this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
        this.group.add(this.boundingBox);

        //initialize shield
        this.shieldReal = new Shield(scene);
    }

    // speed boost effects
    applyBoost() {
        this.acceleration = this.acceleration * 2;
        this.maxVelocity = this.maxVelocity * 2;
        this.rotationSpeed = this.rotationSpeed * 2;
        this.yAcceleration = this.yAcceleration * 2;
        this.maxYVelocity = this.maxYVelocity * 2;
        this.boosting = true;
        this.boost = 100;
        this.backlight.color.set("orange");
        this.backlight1.color.set("orange");
        this.backlight2.color.set("orange");
    }

    // reset boost effects
    removeBoost() {
        this.acceleration = 0.04;
        this.maxVelocity = 1;
        this.rotationSpeed = 0.03;
        this.yAcceleration = 0.04;
        this.maxYVelocity = 1;
        this.boosting = false;
        this.boost = 0;
        this.slowSpeed = false;
        this.slow = 0;
        this.backlight.color.set(0xFF0000);
        this.backlight1.color.set(0xFF0000);
        this.backlight2.color.set(0xFF0000);
    }

     // slow speed effects
     applySlowSpeed() {
        this.acceleration = this.acceleration / 2;
        this.maxVelocity = this.maxVelocity / 2;
        this.rotationSpeed = this.rotationSpeed / 2;
        this.yAcceleration = this.yAcceleration / 2;
        this.maxYVelocity = this.maxYVelocity / 2;
        this.slowSpeed = true;
        this.slow = 100;
        this.backlight.color.set("green");
        this.backlight1.color.set("green");
        this.backlight2.color.set("green");
    }

     // mouse event listener for the scrollbar movement
     initMouseWheelListener() {
        const self = this;
        window.addEventListener('wheel', function (e) {
            if (e.deltaY > 0) {
                self._velocity.y -= self.yAcceleration;
            } else {
                self._velocity.y += self.yAcceleration;
            }
            self._velocity.y = THREE.MathUtils.clamp(self._velocity.y, -self.maxYVelocity, self.maxYVelocity);
        });
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
                    function (object) {
                        object.userData.name = "player"
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

        this.lasers.update(this.bases);
        
        if (this.health <=0)
        {
            this.GameOver();
        }
        // spaceship's movement event listeners
        const keys = this.controller._keys;

        if (keys.space) {
            this.lasers.shoot("red", this.group.position, this.group.rotation);
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

        if (keys.up) {
            this._velocity.y += this.yAcceleration;
        } else if (keys.down) {
            this._velocity.y -= this.yAcceleration;
        }
        this._velocity.y = THREE.MathUtils.clamp(this._velocity.y, -this.maxYVelocity, this.maxYVelocity);

        // adding and controlling the velocity as well as the intensity of the back lights
        this.group.position.add(this._velocity);
        const velocityFactor = this._velocity.length() / this.maxVelocity;
        const intensity = Math.min(30, 30 * Math.max(0, velocityFactor));

        // updating the point light intensity
        this.backlight.intensity = intensity;
        this.backlight1.intensity = intensity;
        this.backlight2.intensity = intensity;

        // velocity dampening staff
        this._velocity.clampLength(0, this.maxVelocity);
        this._velocity.y = THREE.MathUtils.clamp(this._velocity.y, -this.maxYVelocity, this.maxYVelocity);
        this._velocity.multiplyScalar(0.95);
        this._position.add(this._velocity);

        //update shield position
        this.shieldReal.sphere.position.copy(this._position);
        this.shieldReal.frame.position.copy(this._position);

        //run shield when shield health is greater than zero
        if (this.shield > 0) {
            this.shieldReal.shieldOn = true;
        }
        if (this.shield <= 0) {
            this.shieldReal.shieldOn = false;
        }
        this.shieldReal.runShield();

        this.bindAttriAndUi();


    }



    bindAttriAndUi() {
        this.shieldUi.style.width = `${this.shield * 2}px`;
        this.healthUi.style.width = `${this.health * 2}px`;
        this.boostUi.style.width = `${this.boost * 2}px`;
    }

    Remove(scene) {
        scene.remove(this.group);
        scene.remove(this.boundingBox);
    }

    // Game Over screen
    GameOver() {
        const gameOverText = document.querySelector('.game-over');
        if (this.health == 0) {
            console.log("Game Over");
            gameOverText.style.display = 'block';

        }
    }

    // Winner screen
    Winner() {
        const winnerText = document.querySelector('.winner');
        winnerText.style.display = 'block';
    }

    // Warning screen
    Warning(){
        const warningScreen = document.querySelector('.warning');
        if (this.health > 0 && this.health < 30) {
            console.log('Warning screen');
            warningScreen.style.display = 'block';   
        }
        else{
            warningScreen.style.display = 'none';
        }
    }

}

export default Spaceship;



