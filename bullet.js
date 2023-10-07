import * as THREE from 'three'

class Bullet {
    constructor(scene, position, direction, speed, colour) {
      this.geometry = new THREE.SphereGeometry(0.1, 8, 8);
      this.colour = colour;
      if (this.colour == "cyan"){
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      }
      else{
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      }
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.copy(position);
      scene.add(this.mesh);
  
      this.velocity = direction.clone().normalize().multiplyScalar(speed); 
      this.alive = true;
    }
  
    // Updating the bullet's position based on its velocity.
    update() {
      if (this.alive) {
        this.mesh.position.add(this.velocity); 
      }
    }
  
    // remove bullet
    destroy(scene) {
      if (this.alive) {
        scene.remove(this.mesh); 
        this.alive = false;
      }
    }
  }
  

  export default Bullet