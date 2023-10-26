import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';
import enemySpaceship from './enemy_spaceship.js';


class enemySpacestation {
  constructor(scene, x, y, z, level) {
    this.scene = scene;
    this.level = level;
    this.x = x;
    this.y = y;
    this.z = z;
    this.health = 500;
    this.ships = []
    this.group = new THREE.Group();
    this.collided = false;

    if (this.level == 1) {

      this.loadSpaceStationLevel1();
    }
    else if (this.level == 2) {
      this.loadSpaceStationLevel2();
    }
    else {
      this.loadSpaceStationLevel3();
    }

    this.group.position.set(this.x, this.y, this.z);
    this.scene.add(this.group);

    // compound bounding object of enemy spaces station for collision detection
    // it is made up of two cubes (bounding boxes)
    const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });   // change it to true to see the bounding box
    this.boundingBox = new THREE.Group();

    if (this.level == 1) {
      const cube1Geometry = new THREE.BoxGeometry(25, 6, 20);
      const cube1 = new THREE.Mesh(cube1Geometry, boundingBoxMaterial);
      cube1.position.set(0, 0, 0);
      const cube2Geometry = new THREE.BoxGeometry(3, 40, 5);
      const cube2 = new THREE.Mesh(cube2Geometry, boundingBoxMaterial);
      cube2.position.set(0, -5, 0);
      this.boundingBox.add(cube1);
      this.boundingBox.add(cube2);
      this.group.add(this.boundingBox);
    }
    else if (this.level == 2) {
      const boundingBoxGeometry = new THREE.BoxGeometry(100, 100, 200);
      const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });     // change it to true to see the bounding box
      const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
      cube.position.set(0,50,0);
      this.boundingBox.add(cube);
      this.group.add(this.boundingBox);
    }
    else {
      const boundingBoxGeometry = new THREE.BoxGeometry(120, 15, 150);
      const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });     // change it to true to see the bounding box
      const cube = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
      this.boundingBox.add(cube);
      this.group.add(this.boundingBox);
    }

  }
  Remove(scene) {
    scene.remove(this.group);
    this.group.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
  }

  delete(scene) {
    scene.remove(this.group);
    this.group.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
  }

  // loads the space station in the world
  loadSpaceStationLevel1() {
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

  loadSpaceStationLevel2() {
    const spaceStationLoader = new GLTFLoader();
    spaceStationLoader.load(
      './assets/objects_level2/enemy_ufo/scene.gltf',
      (gltf) => {
        const spaceStation = gltf.scene;
        spaceStation.scale.set(35, 35, 35);
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

  loadSpaceStationLevel3() {
    const spaceStationLoader = new GLTFLoader();
    spaceStationLoader.load(
      './assets/objects_level3/space_station/scene.gltf',
      (gltf) => {
        const spaceStation = gltf.scene;
        spaceStation.scale.set(0.1, 0.1, 0.1);
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


  update(target) {
    if (this.health <= 0)
    {
      this.delete(this.scene) //remove from scene but not from update loop since we control its space ships through it
    }

    if (this.ships.length <1 && this.health > 0)
    {
      this.ships.push(new enemySpaceship(this.scene ,this.x+10+this.ships.length, this.y+5, this.z, this.level ))
    }

    for (var i = this.ships.length -1; i>=0; i--)
    {
      if (this.ships[i].health <=0)
      {
        this.ships[i].delete();
        this.ships.splice(i, 1);
      }
      else
      {
        this.ships[i].update(target);
      }
    }
  }
}

export default enemySpacestation;