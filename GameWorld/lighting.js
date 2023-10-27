import * as THREE from 'three';

class Lights {
    constructor(scene, level) {
        this.scene = scene;
        this.level = level;

        if (this.level == 1) {
            this.lightingLevel1();
        }
        else if (this.level == 2) {
            this.lightingLevel2();
        }
        else {
            this.lightingLevel3();
        }
    }

    lightingLevel1() {
        // adding directional light from the sun which is on far right - work in progress
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1000, 0, 0);
        this.scene.add(directionalLight);

        // adding some ambient light to the scene
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
        this.scene.add(ambientLight);
    }

    lightingLevel2() {
        // adding directional light from random holes - work in progress
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-600, -800, 500);
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(-1000, 200, -150);
        this.scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(-1000, 500, 250);
        this.scene.add(directionalLight3);

        // adding some ambient light to the scene
        var ambientLight = new THREE.AmbientLight(0xFF00FF, 0.8);
        this.scene.add(ambientLight);
    }

    lightingLevel3() {
        // adding directional light from the sun which is on far right - work in progress
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1000, 0, 0);
        this.scene.add(directionalLight);

        // adding some ambient light to the scene
        var ambientLight = new THREE.AmbientLight(0xFF0000, 0.5);
        this.scene.add(ambientLight);
    }
}

export default Lights;