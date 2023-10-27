import * as THREE from 'three'

class powerUp {
    constructor(scene, powerUpName, x, y, z) {
        this.powerUpName = powerUpName;
        this.x = x;                 // x position for the power up
        this.y = y;                 // y position for the power up
        this.z = z;                 // z position for the power up
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.position.set(this.x, this.y, this.z);
        const boundingBoxGeometry = new THREE.BoxGeometry(7, 7, 7);
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({color: "lime", transparent: true, opacity: 0.1, visible: true });     // change it to true to see the bounding object
        this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);

        this.renderPowerUp();
        this.scene.add(this.group);
    }

    // method that renders the power ups in the scene
    renderPowerUp() {

        const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
        let cubeMaterials;
        // shield power up
        if (this.powerUpName == 'shield') {
            cubeMaterials = [
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/shield.png') }), // Right side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/shield.png') }),  // Left side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/shield.png') }),   // Top side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/shield.png') }), // Bottom side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/shield.png') }),  // Front side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/shield.png') }),   // Back side
            ];
        }
        // speed boost power up
        else if (this.powerUpName == 'speed_boost') {
            cubeMaterials = [
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed.png') }), // Right side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed.png') }),  // Left side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed.png') }),   // Top side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed.png') }), // Bottom side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed.png') }),  // Front side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed.png') }),   // Back side
            ];
        }
        // health power up
        else if (this.powerUpName == 'health') {
            cubeMaterials = [
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/health.png') }), // Right side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/health.png') }),  // Left side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/health.png') }),   // Top side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/health.png') }), // Bottom side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/health.png') }),  // Front side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/health.png') }),   // Back side
            ];
        }
        else if (this.powerUpName == 'slow'){
            cubeMaterials = [
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed_slow.jpg') }), // Right side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed_slow.jpg') }),  // Left side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed_slow.jpg') }),   // Top side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed_slow.jpg') }), // Bottom side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed_slow.jpg') }),  // Front side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/images/speed_slow.jpg') }),   // Back side
            ];
        }
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
        this.group.add(this.boundingBox);
        this.group.add(cube);
    }

    update(spaceship, scene) {
        if (this.powerUpName == 'shield') {
            console.log("Spaceship collided with the shield powerup");
            spaceship.shield = 100;
            spaceship.bindAttriAndUi();
        }
        else if (this.powerUpName == 'health') {
            console.log("Spaceship collided with the health powerup")
            spaceship.health = 100;
            spaceship.bindAttriAndUi();
        }
        else if (this.powerUpName == 'slow'){
            console.log("Spaceship collided with the slow speed boost powerup");
            spaceship.applySlowSpeed();
        }
        else {
            console.log("Spaceship collided with the speed boost powerup");
            spaceship.applyBoost();
        }
        scene.remove(this.group);
        this.group.traverse((object) => {
            if (object.isMesh) {
                object.geometry.dispose();
                //object.material.dispose();
            }
        });
    }
}

export default powerUp;