import * as THREE from 'three';
import Bullet from './bullet';

class shootBullets{
    constructor(scene, x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.bullets = [];
        const bulletSpeed = 1;
        const spaceshipDirection = new THREE.Vector3(0, 0, -1); 
        const bulletOne = new Bullet(this.scene, new THREE.Vector3(this.x + 1,this.y,this.z), spaceshipDirection, bulletSpeed,"cyan");
        const bulletTwo = new Bullet(this.scene, new THREE.Vector3(this.x - 1,this.y,this.z), spaceshipDirection, bulletSpeed,"cyan");
        this.bullets.push(bulletOne);
        this.bullets.push(bulletTwo);
    }

    shouldRemoveBullet(bullet) {

        const bulletPosition = bullet.mesh.position;
        const boundary = 100;
      
        // Check if the bullet's position exceeds the boundary.
        if (
          Math.abs(bulletPosition.x) > boundary ||
          Math.abs(bulletPosition.y) > boundary ||
          Math.abs(bulletPosition.z) > boundary
        ) {
          return true;
        }
      
        return false;
      }

    shootupdate(){
         // Update bullets shot
    for (let i = 0; i < this.bullets.length; i++) {
        this.bullets[i].update();

        // Check for collisions and removing bullets
        if (this.shouldRemoveBullet(this.bullets[i])) {
            this.bullets[i].destroy(this.scene);
            this.bullets.splice(i, 1);
            i--;
        }
    }
    }

    
}

export default shootBullets;