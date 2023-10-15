import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Asteroids {
    constructor(scene) {
        this.group = new THREE.Group();
        this.allBoundingAsteroids = [];
        this.loadAsteroids(scene);
    }

    // creates the asteroid field and adds it to the scene
    loadAsteroids(scene) {
        const asteroidUrl = new URL('../assets/Asteroid/astroid1.gltf', import.meta.url);
        const assetLoader = new GLTFLoader();

        assetLoader.load(asteroidUrl.href, (gltf) => {
            const model = gltf.scene;
            const scaleFactor = 10;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // make it true to see the bounding box

            // random asteroids generater
            for (let i = 0; i < 10; i++) { 

                // Asteroids - Type 1
                const asteroidClone = model.clone();
                asteroidClone.position.set(
                    Math.random() * 500 - 150, 
                    Math.random() * 350 - 150, 
                    Math.random() * 500 - 150 
                );
                asteroidClone.rotation.set(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );
                asteroidClone.scale.set(1,1,1);

                // creating a bounding box for the asteroid and adding both the asteroid and the bounding box to the scene
                const boundingBoxGeometry = new THREE.BoxGeometry(1*10,1*10,1*10);                
                this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
                this.boundingBox.position.copy(asteroidClone.position);
                scene.add(this.boundingBox);
                this.allBoundingAsteroids.push(this.boundingBox);
                scene.add(asteroidClone);


                // Asteroids - Type 2
                const asteroidClone2 = model.clone();
                asteroidClone2.position.set(
                    Math.random() * 1000 - 300,
                    Math.random() * 500 - 300, 
                    Math.random() * 1000 - 300  
                );
                asteroidClone2.rotation.set(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );
                asteroidClone2.scale.set(3,2,3);
                
                // creating a bounding box for the asteroid and adding both the asteroid and the bounding box to the scene
                const boundingBoxGeometry2 = new THREE.BoxGeometry(3*10,3*10,3*10);                
                this.boundingBox2 = new THREE.Mesh(boundingBoxGeometry2, boundingBoxMaterial);
                this.boundingBox2.position.copy(asteroidClone2.position);
                scene.add(this.boundingBox2);
                this.allBoundingAsteroids.push(this.boundingBox2);
                scene.add(asteroidClone2);


                // Asteroids - Type 3
                const asteroidClone3 = model.clone();
                asteroidClone3.position.set(
                    Math.random() * 1000 - 300, 
                    Math.random() * 500 - 300, 
                    Math.random() * 1000 - 300  
                );
                asteroidClone3.rotation.set(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );
                asteroidClone3.scale.set(5,4,2);
                
                // creating a bounding box for the asteroid and adding both the asteroid and the bounding box to the scene
                const boundingBoxGeometry3 = new THREE.BoxGeometry(5*10,5*10,5*10);                
                this.boundingBox3 = new THREE.Mesh(boundingBoxGeometry3, boundingBoxMaterial);
                this.boundingBox3.position.copy(asteroidClone3.position);
                scene.add(this.boundingBox3);
                this.allBoundingAsteroids.push(this.boundingBox3);
                scene.add(asteroidClone3);
            }
            
        }, undefined, (error) => {
            console.error(error);
        });
    }
}

export default Asteroids;



