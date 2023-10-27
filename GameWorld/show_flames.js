import Explosion from './explosion';

class showFlames{
    constructor(scene, camera, x, y, z){
        this.explosive = new Explosion({parent: scene, camera: camera, x:x, y:y, z:z});
        this.flameTimer = 0;
        this.timeElapsed = 0.02;
        this.explode = false;
        this.finished = false;
    }


    update(){
        if (this.explode && this.flameTimer < 150) {
            this.explosive.Step(this.timeElapsed);
            this.flameTimer += 1;
        }
        else {
            if (this.finished){
            this.explosive.Pause();
            this.explosive.UpdateGeometry();
            this.timeElapsed = 0;
            this.explode = false;
            }
        }
    }
}

export default showFlames;