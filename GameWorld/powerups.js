import * as THREE from 'three'

class powerUp {
    constructor(scene, powerUp, x, y, z) {
        this.powerUp = powerUp;
        this.x = x;                 // x position for the power up
        this.y = y;                 // y position for the power up
        this.z = z;                 // z position for the power up
        this.scene = scene;
        

        const boundingBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // change it to true to see the bounding object
        this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);

        this.renderPowerUp();
    }

    // method that renders the power ups in the scene
    renderPowerUp() {

        // shield power up
        if (this.powerUp == 'shield') {
            const map = new THREE.TextureLoader().load('./assets/images/shield.png');
            const material = new THREE.SpriteMaterial({ map: map });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(this.x, this.y, this.z);
            this.boundingBox.position.set(this.x,this.y,this.z);
            this.scene.add(this.boundingBox);
            this.scene.add(sprite);
        }
        // speed boost power up
        else if (this.powerUp == 'speed_boost') {
            const map = new THREE.TextureLoader().load('./assets/images/speed.png');
            const material = new THREE.SpriteMaterial({ map: map });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(this.x, this.y, this.z);
            this.boundingBox.position.set(this.x,this.y,this.z);
            this.scene.add(this.boundingBox);
            this.scene.add(sprite);
        }
        // health power up
        else if (this.powerUp == 'health') {
            const map = new THREE.TextureLoader().load('./assets/images/health.png');
            const material = new THREE.SpriteMaterial({ map: map });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(1, 1);
            sprite.position.set(this.x, this.y, this.z);
            this.boundingBox.position.set(this.x,this.y,this.z);
            this.scene.add(this.boundingBox);
            this.scene.add(sprite);
        }

    }
}

export default powerUp;