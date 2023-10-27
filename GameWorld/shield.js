import * as THREE from 'three';

class Shield{
    constructor(scene){
        //set up shield
        this.geometry = new THREE.IcosahedronGeometry(2.4, 1); 
        this.material = new THREE.MeshBasicMaterial( { color: 0x00ffff } ); 
        this.sphere = new THREE.Mesh( this.geometry, this.material );
        this.sphere.material.transparent = true;
        this.sphere.material.opacity = 0.2;
        this.sphere.material.visible = false;
        this.material1 = new THREE.MeshBasicMaterial( { color: 0x00ffff } ); 
        this.frame = new THREE.Mesh(this.geometry, this.material1);
        this.frame.material.wireframe = true;
        this.frame.material.visible = false;
        scene.add( this.sphere );
        scene.add(this.frame);

        //initialize time
        this.date = new Date();

        this.shieldOn = false;
    }

    runShield(){
        if(this.shieldOn){
            this.startShield();
            this.startFrame();            
        }

        if(!this.shieldOn){
            this.stop();            
        }
    }

    startShield(){
        if(!this.sphere.material.visible){
            this.sphere.material.visible = true;
        }
    }

    startFrame(){
        if(!this.frame.material.visible){
            this.frame.material.visible = true;
        }
    }

    stop(){
        this.frame.material.visible = false;
        this.sphere.material.visible = false;
    }
}

export default Shield;