import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class enemySpacestation{
    constructor(scene, x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.group = new THREE.Group();
        this.loadSpaceStation();
        this.group.position.set(this.x,this.y,this.z);
        scene.add(this.group);
    }

    loadSpaceStation() {
        const spaceStationLoader = new GLTFLoader();
        spaceStationLoader.load(
          './assets/objects/space_station/scene.gltf',
          (gltf) => {
            const spaceStation = gltf.scene;
      
            spaceStation.scale.set(2, 2, 2);
            
      
            this.group.add(spaceStation);
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
}

export default enemySpacestation;