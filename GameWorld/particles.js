import * as THREE from 'three';

class Particles {
  constructor(scene) {
    this.scene = scene;
    this.stars;

    this.starMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.02,
    });
  }

  createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000; // number of particles

    const positions = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 3000; // the range and density of particles
      const y = (Math.random() - 0.5) * 3000;
      const z = (Math.random() - 0.5) * 3000;

      positions.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    this.stars = new THREE.Points(starGeometry, this.starMaterial);
    this.scene.add(this.stars);
  }

  animateStars() {
    const starSpeed = 0.01;

    this.stars.geometry.attributes.position.array.forEach((pos, i) => {

      this.stars.geometry.attributes.position.array[i] -= starSpeed;

      // checking if any particle's position is less than -500
      if (pos < -500) {
        this.stars.geometry.attributes.position.array[i] = (Math.random() - 0.5) * 1000;    // Reset stars when they go too far  // -100 here and on top 50
      }
    });

    this.stars.geometry.attributes.position.needsUpdate = true;
  }
}

export default Particles;