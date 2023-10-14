import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import loadingManager from './loadingManager.js';


class Spaceship {
    constructor(scene) {
        this.group = new THREE.Group();
        this.health = 100;
        this.shield = 0;
        this.loadSpaceship();

        this._position = this.group.position
        this._direction = new THREE.Vector3()
        this.group.getWorldDirection(this._direction)
        this._velocity =0
        this.acceleration = .1

                //Laser stuff
        this.lasers = [];
        this.lasSpeed = 300;
        this.clock = new THREE.Clock();
        this.delta = 0;
        this._scene = scene;
        // scene.add(this.laser1);

        this.controller = new ControllerInput(this.group);
        scene.add(this.group);                      // loading, setting initial position of the spaceship and adding it to the scene
    }

    loadSpaceship() {
        const spaceShipLoader = new GLTFLoader(loadingManager);
        spaceShipLoader.load(
            './assets/objects/spaceship/scene.gltf',
            (gltf) => {
                this.spaceShip = gltf.scene;
                this.spaceShip.scale.set(0.7, 0.7, 0.7);
                this.group.add(this.spaceShip);
            },
            (xhr) => {
                // Loading progress callback
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
                // Error callback
                console.error('Error loading GLTF model', error);
            }
        );
    }

    update()
    {
        var target = this.group

        if (this.controller._keys.right)
        {
            this.group.rotation.y -=0.01
        }

        if (this.controller._keys.left)
        {
            this.group.rotation.y +=0.01
        }
        

        if (this.controller._keys.forward) {

            if (this._velocity < 1)
            {
                console.log("Forwards")
                this._velocity+=this.acceleration
            }
        }

        if (this.controller._keys.backward) {

            if (this._velocity !=0 )
                this._velocity-=this.acceleration
        }

        if (this.controller._keys.space) {
            console.log("shooting hopefully");
            this.shootAction();
        }

        this._velocity = Math.max(0, this._velocity)
        this.group.getWorldDirection(this._direction)
        this._position.addScaledVector(this._direction, -this._velocity)

        //laser updating
        this.delta = this.clock.getDelta();
        this.lasers.forEach(l => {
            l.translateZ(-this.lasSpeed * this.delta);
        });

    }

    shootAction(_direction) {
        this.laser1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshBasicMaterial({color: "red"}));
        this.laser1.position.copy(this._position);
        // this.laser1.quaternion.copy(this.quaternion);
        this.laser1.rotation.copy(this.group.rotation);
        this._scene.add(this.laser1);
        this.lasers.push(this.laser1);
    }
}


class ControllerInput {

    constructor(target) {this.target = target,this._Init() }

    _Init()
    {
        this._current ={
            leftButton: false,
            rightButton: false,
            mouseX: 0.0,
            mouseY: 0.0
        }
        this._keys ={
            forward: false,
            backward:false,
            left: false,
            right: false,
            space:false,
            shift:false,
            space:false,
        };

        this._previous = null;

        // event listeners for keys
        document.addEventListener('keydown', (e)=> this._OnKeyDown(e), false);
        document.addEventListener('keyup', (e)=> this._OnKeyUp(e), false);

        //event listeners for mouse
        document.addEventListener('mousedown', (e)=> this._OnMouseDown(e), false);
        document.addEventListener('mouseup', (e)=> this._OnMouseUp(e), false);
        document.addEventListener('mousemove', (e)=> this._OnMouseMove(e), false);
    } 

    _OnMouseDown(e)
    {
        switch(e.button)
        {
            case 0: {
                this._current.leftButton =true
                break
            }
            case 2: {
                this._current.rightButton =true
                break
            }
        }
    }

    _OnMouseUp(e)
    {
        switch(e.button)
        {
            case 0: {
                this._current.leftButton =false
                break
            }
            case 2: {
                this._current.rightButton =false
                break
            }
        }
    }

    _OnMouseMove(e)
    {
        this._current.mouseX = e.pageX - window.innerWidth/2;
        this._current.mouseY = e.pageY - window.innerHeight/2;

        if (this._previous == null)
        {
            this._previous ={...this._current};
        }
    }

    _OnKeyDown(event)
    {
        switch(event.keyCode)
        {
            case 87: //w
            this._keys.forward =true;
            break;

            case 65: //a
            this._keys.left =true;
            break;

            case 83: //s
            this._keys.backward =true;
            break;

            case 68: //d
            this._keys.right =true;
            break;

            case 32: //space
            this._keys.space =true;
            break;

            case 16: //Shift
            this._keys.shift=true;
            break;

            case 32: //Spacebar
            this._keys.space=true;
            break;
        }
    }

    _OnKeyUp(event)
    {
        switch(event.keyCode)
        {
            case 87: //w
            this._keys.forward =false;
            break;

            case 65: //a
            this._keys.left =false;
            break;

            case 83: //s
            this._keys.backward =false;
            break;

            case 68: //d
            this._keys.right =false;
            break;

            case 32: //space
            this._keys.space =false;
            break;

            case 16: //Shift
            this._keys.shift=false;
            break;

            case 32: //Spacebar
            this._keys.space=false;
            break;
        }

    }


}


export default Spaceship;