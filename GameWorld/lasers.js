import * as THREE from 'three';
import Sound from './sound.js';

export class Laser
{
    constructor(scene, colour, position, rotation)
    {
        this.scene = scene;
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 30, 30, 0, Math.PI*2, 0, 5.66), new THREE.MeshBasicMaterial({color: colour}));
        this.mesh.position.copy(position);
        this.mesh.rotation.copy(rotation);
        this.initial_position = position; //position laser was fired from
        this.hit =false

        //add box for collisions
        const boundingBox = new THREE.Box3().setFromObject(this.mesh);

        const boundingBoxGeometry = new THREE.BoxGeometry();
        const boundingBoxMaterial = new THREE.MeshBasicMaterial({ visible: false});     // change it to true to see the bounding box
        
        //set scale of hitbox
        this.boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        this.boundingBox.scale.set(size.x, size.y, size.z);

        //set position of hit box
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        this.boundingBox.position.copy(center);
        this.boundingBox.rotation.copy(rotation)

    }

    delete()
    {   
        this.scene.remove(this.boundingBox);
        this.scene.remove( this.mesh );
    }
}

export class Lasers
{
    constructor(scene, camera)
    {
        this.scene = scene;
        this.lasers =[];
        this.clock = new THREE.Clock();
        //initialize sound
        this.sound = new Sound(camera);
       
    }

    shoot(colour, position, rotation)
    {
        var laser = new Laser(this.scene, colour, position, rotation)
        this.lasers.push(laser);
        this.scene.add(laser.mesh);
        this.scene.add(laser.boundingBox);
        this.sound.shoot.play();
    }

    
    checkCollision(object1, object2) {
        const boundingBox1 = object1.boundingBox;
        const boundingBox2 = object2.boundingBox;

        const box1 = new THREE.Box3().setFromObject(boundingBox1);
        const box2 = new THREE.Box3().setFromObject(boundingBox2);
        return box1.intersectsBox(box2);
    }



    update(bases)
    {
        this.delta = this.clock.getDelta();

        for (var i= this.lasers.length-1 ; i>=0; i--)
        {
            let l = this.lasers[i];

            if (l.hit || l.mesh.position.distanceTo(l.initial_position) > 100 ) //delete lasers if they have gone too far from their source
            {
                l.delete();
                this.lasers.splice(i, 1);
            }
        }

        this.lasers.forEach(l => {
                bases.forEach(b => {

                    if (this.checkCollision(b, l))
                    {
                        b.health -=10;
                        console.log(b.health);
                        l.hit =true;
                    }

                    
                    b.ships.forEach(s =>{
                        if (this.checkCollision(s, l))
                        {
                            s.health -=20;
                            l.hit =true;
                        }
                } ) })

                //move laser forwards
                l.boundingBox.translateZ(-100 * this.delta)
                l.mesh.translateZ(-100 * this.delta);
            })
    };
}


export class enemyLasers
{
    constructor(scene, camera)
    {
        this.scene = scene;
        this.lasers =[];
        this.clock = new THREE.Clock();
        this.sound = new Sound(camera);
    }

    shoot(colour, position, rotation)
    {
        var laser = new Laser(this.scene, colour, position, rotation)
        this.lasers.push(laser);
        this.scene.add(laser.mesh);
        this.scene.add(laser.boundingBox);
        this.sound.shoot.play();
    }

    update(target)
    {
        this.delta = this.clock.getDelta();
        
        for (var i= this.lasers.length-1 ; i>=0; i--)
        {
            let l = this.lasers[i];

            if (l.hit || l.mesh.position.distanceTo(l.initial_position) > 100 ) //delete lasers if they have gone too far from their source
            {
                l.delete();
                this.lasers.splice(i, 1);
            }
        }

        this.lasers.forEach(l => {

            
                if (this.checkCollision(target, l))
                {
                    target.health -=1;
                    console.log(target.health);
                    l.hit =true;
                }

                //move laser forwards
                l.boundingBox.translateZ(100 * this.delta)
                l.mesh.translateZ(100 * this.delta);
            })
    };

    checkCollision(object1, object2) {
        const boundingBox1 = object1.boundingBox;
        const boundingBox2 = object2.boundingBox;

        const box1 = new THREE.Box3().setFromObject(boundingBox1);
        const box2 = new THREE.Box3().setFromObject(boundingBox2);
        return box1.intersectsBox(box2);
    }


}

export default Lasers; 


