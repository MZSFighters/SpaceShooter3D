import * as THREE from 'three';
import Asteroids from './asteroids';

class CollisionDetection {
    constructor(scene) {
        this.asteroid_field = new Asteroids(scene);
    }

    // detects collision between two cube objects
    checkCollision(object1, object2) {
        const boundingBox1 = object1.boundingBox;
        const boundingBox2 = object2.boundingBox;

        const box1 = new THREE.Box3().setFromObject(boundingBox1);
        const box2 = new THREE.Box3().setFromObject(boundingBox2);
        return box1.intersectsBox(box2);
    }

    // detects collision specifically for a cube and asteroids
    checkAsteroidCollision(object1) {
        const boundingBox1 = object1.boundingBox;
        const box1 = new THREE.Box3().setFromObject(boundingBox1);
        const asteroidBoundingBoxes = this.asteroid_field.allBoundingAsteroids;

        for (let i = 0; i < asteroidBoundingBoxes.length; i++) {
            const box2 = new THREE.Box3().setFromObject(asteroidBoundingBoxes[i]);

            if (box1.intersectsBox(box2)) {
                //console.log('Spaceship collided with an asteroid');
                //object1.health = 0;
                return true;
                // ...
            }
            return false;
        }
    }

    // detects a collision between a cube and a sphere
    checkSphereCollision(object1, sphere) {
        const boundingBox1 = object1.boundingBox;
        const box1 = new THREE.Box3().setFromObject(boundingBox1);
        return box1.intersectsSphere(sphere);
    }
}

export default CollisionDetection;