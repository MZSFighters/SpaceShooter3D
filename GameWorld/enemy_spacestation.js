import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';
import enemySpaceship from './enemy_spaceship.js';


class enemySpacestation {
  constructor(scene, x, y, z) {
    this.scene=scene
    this.x = x;
    this.y = y;
    this.z = z;
    this.health = 500;
    this.ships=[]
    this.group = new THREE.Group();
    this.collided = false;
    this.loadSpaceStation();
    this.group.position.set(this.x, this.y, this.z);
    scene.add(this.group);
    
    // compound bounding object of enemy spaces station for collision detection
    // it is made up of two cubes (bounding boxes)
    const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});   // change it to true to see the bounding box
    this.boundingBox = new THREE.Group();
    const cube1Geometry = new THREE.BoxGeometry(25, 6, 20);
    const cube1 = new THREE.Mesh(cube1Geometry, boundingBoxMaterial);
    cube1.position.set(0,0,0);
    const cube2Geometry = new THREE.BoxGeometry(3, 40, 5);
    const cube2 = new THREE.Mesh(cube2Geometry, boundingBoxMaterial);
    cube2.position.set(0,-5,0);
    this.boundingBox.add(cube1);
    this.boundingBox.add(cube2);
    this.group.add(this.boundingBox);
  }

  Remove(scene){
    scene.remove(this.group);
    scene.remove(this.boundingBox);
}

  // loads the space station in the world
  loadSpaceStation() {
    const spaceStationLoader = new GLTFLoader(loadingManager);
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
      }) 
    }


      update(target)
      {
        if (this.ships.length <1)
        {
          this.ships.push(new enemySpaceship(this.scene ,this.x+10+this.ships.length, this.y+5, this.z))
        }

        for (var i =0; i< this.ships.length; i++)
        {
          this.ships[i].update(target);
        }
      }
}

export default enemySpacestation;