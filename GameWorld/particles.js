import * as THREE from 'three';

class Particles {
  constructor(scene, level) {
    this.scene = scene;
    this.level = level;
    this.stars;
    this.color;

    if (this.level == 1) {
      this.color = 0xFFFFFF;
    }
    else if (this.level == 2) {
      this.color = 0xFF00FF;
    }
    else {
      this.color = 0xFF0000;
    }

    this.starMaterial = new THREE.PointsMaterial({
      color: this.color,
      size: 0.02,
    });

    this.createStars();
  }

  createStars() {
    const starGeometry = new THREE.BufferGeometry();
    let starCount;

    if (this.level == 1) {
      starCount = 1000; // number of particles
    }
    else{
      starCount = 3000;
    }

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