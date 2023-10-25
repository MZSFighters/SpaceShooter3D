import PowerUp from './powerups';

class SpawningPowerups {
    constructor(scene, p_array) {
        this.powerups = p_array;
        this.scene = scene;

        this.powerUpTypes = ['shield', 'health', 'speed_boost'];
        this.powerUpTypes.sort(() => Math.random() - 0.5);

        for (let i = 0; i < 2; i++) {
            const type = this.powerUpTypes[i];
            const posX = this.randomPosition(-10, 10);  
            const posY = this.randomPosition(-10, 10);  
            const posZ = this.randomPosition(-10,10); 
            const powerUp = new PowerUp(this.scene, type, posX, posY, posZ);
            this.powerups.push(powerUp);
        }
    }

    update(){
        if (this.powerups.length < 2){
            this.powerUpTypes.sort(() => Math.random() - 0.5);
            const type = this.powerUpTypes[0];
            const posX = this.randomPosition(-10, 10);  
            const posY = this.randomPosition(-10, 10);  
            const posZ = this.randomPosition(-10, 10); 
            const powerUp = new PowerUp(this.scene, type, posX, posY, posZ);
            this.powerups.push(powerUp);
        }
    }

    // Creating a function to generate a random position
    randomPosition(min, max) {
        return Math.random() * (max - min) + min;
    }
}

export default SpawningPowerups;