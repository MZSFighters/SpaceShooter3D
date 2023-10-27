import * as THREE from 'three';

class Sound {
    constructor(camera) {
        //initialize the virtual listener
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
    
        //initialize all sounds for the entire game here
        this.shoot = new THREE.Audio(this.listener);
        this.backgroundSound = new THREE.Audio(this.listener);
        this.impact = new THREE.Audio(this.listener);
        this.hype = new THREE.Audio(this.listener);
        this.fire = new THREE.Audio(this.listener);
        this.power = new THREE.Audio(this.listener);
        this.loadAudio();
    }

    loadBackground(){
        //Loader to load all audio files
        this.audioLoader = new THREE.AudioLoader();

         //Here we can load multiple audios with the same loader
         this.audioLoader.load(
            './assets/sound/space_line-27593.mp3', 
            (buffer) => {
            this.backgroundSound.setBuffer(buffer);
            this.backgroundSound.setLoop(true);
            this.backgroundSound.setVolume(0.5);
            this.backgroundSound.play();
       });

       this.audioLoader.load(
        './assets/sound/scary-swoosh-142323.mp3', 
        (buffer) => {
        this.hype.setBuffer(buffer);
        this.hype.setLoop(false);
        this.hype.setVolume(1);
        this.hype.play();
    });



    }

    loadAudio(){
        //Loader to load all audio files
        this.audioLoader = new THREE.AudioLoader();
    
       
    
    
       
    
        this.audioLoader.load(
            './assets/sound/big-impact-7054.mp3', 
            (buffer) => {
            this.impact.setBuffer(buffer);
            this.impact.setLoop(false);
            this.impact.setVolume(1);
        });
    
       
        this.audioLoader.load(
            './assets/sound/fire-magic-6947.mp3', 
            (buffer) => {
            this.fire.setBuffer(buffer);
            this.fire.setLoop(false);
            this.fire.setVolume(1);
        });
    
    
        this.audioLoader.load(
          './assets/sound/success-1-6297.mp3', 
          (buffer) => {
          this.power.setBuffer(buffer);
          this.power.setLoop(false);
          this.power.setVolume(1);
      });

        this.audioLoader.load(
            './assets/sound/blaster-2-81267.mp3', 
            (buffer) => {
            this.shoot.setBuffer(buffer);
            this.shoot.setLoop(false);
            this.shoot.setVolume(1);
        });
    
      }
}

export default Sound;