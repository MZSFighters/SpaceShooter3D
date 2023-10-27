
import * as THREE from 'three';

class LineAnimation {
    constructor(scene,spaceship) {
        this.spaceship = spaceship;
        this.scene = scene;
        this.LINE_COUNT = 1000;
        this.initGeometry();
        this.createLines();
        this.lines;
    }

    initGeometry() {
        this.geom = new THREE.BufferGeometry();
        this.geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * this.LINE_COUNT), 3));
        this.geom.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2 * this.LINE_COUNT), 1));
        this.pos = this.geom.getAttribute("position");
        this.pa = this.pos.array;
        this.vel = this.geom.getAttribute("velocity");
        this.va = this.vel.array;
    }

    createLines() {
        if (this.spaceship){
        for (let line_index = 0; line_index < this.LINE_COUNT; line_index++) {
            const x = Math.random() * (this.spaceship.group.position.x + 400) - (this.spaceship.group.position.x+ 200);
            const y = Math.random() * (this.spaceship.group.position.y+200) - (this.spaceship.group.position.y+100);
            const z = Math.random() * (this.spaceship.group.position.z-100) - (this.spaceship.group.position.z+100);
            const xx = x;
            const yy = y;
            const zz = z;

            //console.log(x);

            this.pa[6 * line_index] = x;
            this.pa[6 * line_index + 1] = y;
            this.pa[6 * line_index + 2] = z;
            this.pa[6 * line_index + 3] = xx;
            this.pa[6 * line_index + 4] = yy;
            this.pa[6 * line_index + 5] = zz;

            this.va[2 * line_index] = this.va[2 * line_index + 1] = 0;
        }
    }

        const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lines = new THREE.LineSegments(this.geom, mat);
        this.lines = lines;
        this.spaceship.group.add(lines);
        //this.scene.add(lines);
    }


    update() {
        this.spaceship.group.add(this.lines);
        for (let line_index = 0; line_index < this.LINE_COUNT; line_index++) {
            this.va[2 * line_index] += 0.03;
            this.va[2 * line_index + 1] += 0.025;

            this.pa[6 * line_index + 2] += this.va[2 * line_index];
            this.pa[6 * line_index + 5] += this.va[2 * line_index + 1];

            if (this.pa[6 * line_index + 5] > this.spaceship.group.position.z-5) {
                const z = Math.random() * (this.spaceship.group.position.z+200) - (this.spaceship.group.position.z + 100);
                this.pa[6 * line_index + 2] = z;
                this.pa[6 * line_index + 5] = z;
                this.va[2 * line_index] = 0;
                this.va[2 * line_index + 1] = 0;
            }
        }

        this.pos.needsUpdate = true;
    }

    remove(){
        //this.scene.remove(lines)
        this.spaceship.group.remove(this.lines);
    }

    
}

export default LineAnimation;
//const lineAnimation = new LineAnimation();
