import * as THREE from 'three';
import Spaceship from './spaceship';
import PlanetLevelOne from './level_one/planet';
import PlanetLevelTwo from './level_two/planet';
import PlanetLevelThree from './level_three/planet';
import SpawningPowerups from './spawning_powerups';
import enemySpacestation from './enemy_spacestation';
import Particles from './particles';
import ThirdPersonCamera from './custom_cameras.js';
import loadingManager from './loadingManager.js';
import CollisionDetection from './collisions';
import Lights from './lighting';
import SkySphere from './skysphere';
import Timer from './timer';
import Sound from './sound';
import LineAnimation from './line_animation';
import showFlames from './show_flames';


class GameWorld {
  constructor(level) {

    // initial setup
    this.canvas = document.querySelector('.webgl'); // Fix: Use '.webgl' to select the canvas element
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.level = level;                             // level number
    this.gameRunning = true;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);
    this.camera.useLogarithmicDepth = true;
        // minimap scene
    this.minimapScene = new THREE.Scene();
    // variable for minimap
    this.countPrev = 0;
    this.countCurr = 0;
    this.countFin = 3;
    this.status = 0;
    this.counter = 0;
    this.setupMiniMapScene();
    this.setupCameras();
    this.setupScene();
    this.CollisionDetection = new CollisionDetection(this.scene);
    this.boostTime = 0;
    this.slowTime = 0;
    this.timer = new Timer();
    //initialize sound
    this.sound = new Sound(this.camera);
    this.sound.loadBackground();
  }

  setupCameras() {
    // default camera positioning for both cameras
    this.camera.position.z = 5;
    this.camera.position.y = 1;
  }

  setupMiniMapScene() {
    if (this.level == 1) {
      const minimapTexture = new THREE.TextureLoader().load("assets/images/GameOver_WinningScreen_Images/Level1.png");
      this.minimapScene.background = minimapTexture;
    }
    else if (this.level == 2) {
      const minimapTexture = new THREE.TextureLoader().load("assets/images/GameOver_WinningScreen_Images/Level2.png");
      this.minimapScene.background = minimapTexture;
    }
    else if (this.level == 3) {
      const minimapTexture = new THREE.TextureLoader().load("assets/images/GameOver_WinningScreen_Images/Level3.png");
      this.minimapScene.background = minimapTexture;
    }
  }

  setupScene() {

    // loading the skybox, earth and moon in the scene

    if (this.level != 1) {
      this.skySphere = new SkySphere(this.scene, this.level);
    }
    this.Flames = [];
    if (this.level == 1) {
      this.setupSkybox();
      this.planet = new PlanetLevelOne(this.scene);
      this.enemyStationOne = new enemySpacestation(this.scene, -100, 50, -50, this.level, this.camera,this.Flames);
      this.enemyStationTwo = new enemySpacestation(this.scene, 0, 100, 400, this.level, this.camera,this.Flames);
      this.enemyStationThree = new enemySpacestation(this.scene, 300, 0, -150, this.level, this.camera,this.Flames);
    }
    else if (this.level == 2) {
      this.planet = new PlanetLevelTwo(this.scene);
      this.enemyStationOne = new enemySpacestation(this.scene, 400, 50, 350, this.level, this.camera,this.Flames);
      this.enemyStationTwo = new enemySpacestation(this.scene, -425, 100, 400, this.level, this.camera,this.Flames);
      this.enemyStationThree = new enemySpacestation(this.scene, 200, 0, -450, this.level, this.camera,this.Flames);
    }
    else {
      this.planet = new PlanetLevelThree(this.scene);
      this.enemyStationOne = new enemySpacestation(this.scene, -300, 0, -400, this.level, this.camera,this.Flames);
      this.enemyStationTwo = new enemySpacestation(this.scene, 0, 100, 400, this.level, this.camera,this.Flames);
      this.enemyStationThree = new enemySpacestation(this.scene, 300, 0, -150, this.level, this.camera,this.Flames);
    }

    // loading the 3 enemy station bases and adding them to the enemy bases list
    this.enemyBases = [];
    this.enemyBases.push(this.enemyStationOne);
    this.enemyBases.push(this.enemyStationTwo);
    this.enemyBases.push(this.enemyStationThree);

    // loading player spaceship
    this.spaceship = new Spaceship(this.scene, this.camera, this.enemyStationOne.ships, this.enemyBases);

    this.lines = new LineAnimation(this.scene, this.spaceship);

    this.powerups = [];
    this.spawningpowerups = new SpawningPowerups(this.scene, this.powerups);

    // creating the particles in background and adding lighting depending on the background
    this.particles = new Particles(this.scene, this.level);
    this.light = new Lights(this.scene, this.level);

    // setting up the third person camera and its target which is the spaceship
    this.thirdPersonCamera = new ThirdPersonCamera({ camera: this.camera, target: this.spaceship.group })

    // rear view camera
    const aspect = window.innerWidth / innerHeight;
    this.rearViewCamera = new THREE.PerspectiveCamera(
      70,
      aspect,
      0.01,
      1500
    )
    // setting up rear view camera  
    this.rearViewCamera.position.set(0, 0, -8);
    this.rearViewCamera.lookAt(0, 0, 0.2);
    this.insetWidth = window.innerWidth / 4;
    this.insetHeight = window.innerHeight / 4;
    this.rearViewCamera.aspect = this.insetWidth / this.insetHeight;
    // adding rear view camera as child to camera
    this.camera.add(this.rearViewCamera);

        // minimap camera or radar
    // const viewsize = 1000;
    this.miniMapCamera = new THREE.OrthographicCamera(
      window.innerWidth * 1.2 / -2,
      window.innerWidth * 1.2 / 2,
      window.innerHeight * 1.2 / 2,
      window.innerHeight * 1.2 / -2,
      1, 5000
    )
    // setting up and positioning minimap camera 
    this.miniMapCamera.position.set(0, 500, 0);
    this.miniMapCamera.lookAt(0, 0, 0);
    this.minimapMainShip = new THREE.Mesh(new THREE.SphereGeometry(20), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));

    this.spaceshipWorldPos = new THREE.Vector3();
    this.planetWorldPos = new THREE.Vector3();
    this.spaceship.boundingBox.getWorldPosition(this.spaceshipWorldPos);
    this.planet.group.getWorldPosition(this.planetWorldPos);
    // player spaceship on minimap
    this.minimapScene.add(this.minimapMainShip);
    this.minimapMainShip.position.copy(this.spaceshipWorldPos);
    // planet (with respect to map) on minimap 
    this.minimapplanet = new THREE.Mesh(new THREE.SphereGeometry(60), new THREE.MeshBasicMaterial({ color: 0x0000FF }));
    this.minimapScene.add(this.minimapplanet);
    this.minimapplanet.position.copy(this.planetWorldPos);
    // enemy stations (with respect to map) on minimap 
    this.minimapStationPos = new THREE.Vector3();
    this.minimapEnemyShipPos = new THREE.Vector3();
    this.enemyBases.forEach(b => {
      b.group.getWorldPosition(this.minimapStationPos);
      this.minimapEnemyStation = new THREE.Mesh(new THREE.SphereGeometry(40), new THREE.MeshBasicMaterial({ color: 0xFF00FF }));
      this.minimapScene.add(this.minimapEnemyStation);
      this.minimapEnemyStation.position.copy(this.minimapStationPos);
      // b.ships.forEach(ship => {
      //   ship.group.getWorldPosition(this.minimapEnemyShipPos);
      //   this.minimapEnemyShipPip = new THREE.Mesh(new THREE.SphereGeometry(60), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
      //   this.scene.add(this.minimapEnemyShipPip);
      //   this.minimapEnemyShipPip.position.copy(this.minimapEnemyShipPos);
      // })
    })


    //virtual listener for all audio effects in scene
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    //initialize all sounds for the ship here
    this.backgroundSound = new THREE.Audio(this.listener);
    this.impact = new THREE.Audio(this.listener);
    this.hype = new THREE.Audio(this.listener);
    this.fire = new THREE.Audio(this.listener);
    this.power = new THREE.Audio(this.listener);
  }

  updateMiniMap() {
    // updating player spaceship position on minimap
    this.position11 = new THREE.Vector3();
    this.position12 = new THREE.Vector3();
    this.spaceship.boundingBox.getWorldPosition(this.position11);
    this.minimapMainShip.position.copy(this.position11);
    console.log(this.countCurr);
    console.log(this.countPrev);


    // while (this.counter < 3) {
    //   this.enemyBases.forEach( base => {
    //     base.ships.forEach( ship => {
    //       ship.group.getWorldPosition(this.minimapEnemyShipPos);
    //       this.minimapEnemyShipPip = new THREE.Mesh(new THREE.SphereGeometry(20), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
    //       this.minimapScene.add(this.minimapEnemyShipPip);
    //       this.minimapEnemyShipPip.position.copy(this.minimapEnemyShipPos);
    //     })
    //   })
    //   this.counter++;
    // }

    // updating enemy spaceship position on minimap
    this.enemyBases.forEach(b => {
      for (let j = 0; j < this.enemyBases.length-2; j++) {
        console.log("j : "+j);
        console.log("first for loop : curr, prev : " + this.countCurr + " " + this.countPrev + " poeslength " + b.ships.length);
        if (b.ships.length > this.countPrev) {
          this.countCurr = b.ships.length;
          console.log("first ifififififififififififififififififififififififififififif statement : curr, prev : " + this.countCurr + " " + this.countPrev);
          for (let i = this.countPrev; i < this.countCurr; i++) {
            console.log("inside secondsecondsecondsecondseocndsecondsecond for loop : curr, prev : " + this.countCurr + " " + this.countPrev);
            // this.minimapScene.remove(this.minimapEnemyShipPip);
            b.ships[j].group.getWorldPosition(this.minimapEnemyShipPos);
            this.minimapEnemyShipPip = new THREE.Mesh(new THREE.SphereGeometry(20), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
            this.minimapScene.add(this.minimapEnemyShipPip);
            this.minimapEnemyShipPip.position.copy(this.minimapEnemyShipPos);

          }
          this.countPrev = b.ships.length;
        }
      }
    })

    // this.enemyBases.forEach( base => {
    //   base.ships.forEach( ship => {
    //     if (ship.drawn == false) {
    //       ship.group.getWorldPosition(this.minimapEnemyShipPos);
    //       this.minimapEnemyShipPip = new THREE.Mesh(new THREE.SphereGeometry(60), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
    //       this.minimapScene.add(this.minimapEnemyShipPip);
    //       this.minimapEnemyShipPip.position.copy(this.minimapEnemyShipPos);
          
    //     }
    //     ship.drawn = true;
    //   })
    // })

    // for (let i = 0; i < this.enemyBases.length; i++) {
    //   console.log("I AM HERE MOSSS V2")
    //   this.enemyBases[i].group.getWorldPosition(this.minimapStationPos);
    //   this.minimapEnemyStation.position.copy(this.minimapStationPos);
    //   for (let j = 0; j < this.enemyBases.ships.length; j++) {
    //     console.log("Ship number : "+this.enemyBases.ships[j] + " in station number : " + this.enemyBases[i]);
    //     this.enemyBases.ships[j].group.getWorldPosition(this.minimapEnemyShipPos);
    //     this.minimapEnemyShipPip.position.copy(this.minimapEnemyShipPos);
    //   }
    // }


    this.enemyBases.forEach(c => {
      console.log("I AM HERE MOSSS")
      c.group.getWorldPosition(this.minimapStationPos);
      this.minimapEnemyStation.position.copy(this.minimapStationPos);
      c.ships.forEach(enemyship => {
        enemyship.group.getWorldPosition(this.minimapEnemyShipPos);
        this.minimapEnemyShipPip.position.copy(this.minimapEnemyShipPos);
      })
    })

  }

  animate() {
    if (this.gameRunning) {
      requestAnimationFrame(this.animate.bind(this));

      for (var i=this.enemyBases.length-1; i>=0 ; i--)
      {
        var b = this.enemyBases[i]
        if (b.health <=0 && b.ships.length ==0)
        {
          this.enemyBases.splice(i,1);
        }
      }

      if (this.enemyBases.length ==0)
      {
        this.spaceship.Winner();  
      }

      //start timer
      this.timer.startTime();

      // updating planet and moon position
      this.planet.update();

      // animating the particles 
      this.particles.animateStars();

      // rendering according to the camera type
      this.thirdPersonCamera.update();

      // updating the spaceship's position
      this.spaceship.update();

      // updating the warning screen
      this.spaceship.Warning();

      this.spawningpowerups.update();


      if (this.spaceship.boosting && this.spaceship.slowSpeed){
        this.spaceship.removeBoost();
        this.boostTime = 0;
        this.slowTime = 0;
        this.spaceship.bindAttriAndUi();
      }
      else if (this.spaceship.boosting && this.boostTime < 300){
        this.boostTime += 1;
        this.spaceship.boost -= (100/300);
        this.spaceship.bindAttriAndUi();
         //update lines
         this.lines.update();
      }
      else if (this.spaceship.slowSpeed && this.slowTime < 300){
        this.slowTime += 1;
        this.spaceship.slow -= (100/300);
      }
      else{
        this.spaceship.removeBoost();
        this.boostTime = 0;
        this.slowTime = 0;
        this.lines.remove();
      }

      // Showing the Flames!!!
      for (let i = 0; i < this.Flames.length; i++){
        this.Flames[i].update();

        if (this.Flames[i].finished && !this.Flames[i].explode){
          const index = this.Flames.indexOf(this.Flames[i]);
          const x = this.Flames.splice(index, 1);
        }
      }      
      

      //updating rearview camera, setting viewport
      // allows main camera and rear view camera toi be viewed at same time 
      this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
      this.renderer.setScissorTest(true);

      this.renderer.setScissor(
        window.innerWidth - this.insetWidth - 17,
        window.innerHeight - this.insetHeight - 17,
        this.insetWidth + 2,
        this.insetHeight + 2
      );

      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.clearColor();

      this.renderer.setViewport(
        window.innerWidth - this.insetWidth - 16,
        window.innerHeight - this.insetHeight - 16,
        this.insetWidth,
        this.insetHeight
      );

      this.renderer.render(this.scene, this.rearViewCamera);
      this.renderer.setScissorTest(false);

    // Second Scissor for minimap 
    this.renderer.setScissorTest(true);

    this.renderer.setScissor(
      window.innerWidth - this.insetWidth - 17,
      window.innerHeight - this.insetHeight - 600,
      this.insetWidth+2,
      this.insetHeight+2
    );

    this.renderer.setClearColor( 0xffffff, 1 );
    this.renderer.clearColor();

    this.renderer.setViewport(
      window.innerWidth - this.insetWidth - 16,
      window.innerHeight - this.insetHeight - 599,
      this.insetWidth,
      this.insetHeight
    );

    this.renderer.render(this.minimapScene, this.miniMapCamera);
    this.renderer.setScissorTest(false);


      if(this.level != 1 ){
        this.skySphere.update();
      }

      // updating enemy bases and their spaceships
      for (let i = 0; i < this.enemyBases.length; i++) {
        this.enemyBases[i].update(this.spaceship);
      }

      this.collisionDetection();
      this.updateMiniMap();

    } else {
      //stop timer
      this.timer.stopTime();
      this.spaceship.GameOver();
      this.spaceship.Warning();
    }
  }

  // adds the skybox to the scene 
  setupSkybox() {
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
    this.scene.background = cubeTextureLoader.setPath("./assets/images/space_skybox/").load(["right.png",
      "left.png",
      "top.png",
      "bottom.png",
      "front.png",
      "back.png"
    ]);
  }

  //----------------------------------------------------------Collisions-------------------------------------------------------------------//

  // Detects collisions between objects 
  collisionDetection() {

    // Spaceship-Enemy Spaceships Collision
    for (let i = 0; i < this.enemyBases.length; ++i) {
      for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {

        if (this.enemyBases[i].health > 0)
        {
          if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyBases[i].ships[j])) {
            console.log("Spaceship collided with an enemy spaceship");
            this.enemyBases[i].ships[j].health =0;
            this.sound.impact.play();
            const index = this.enemyBases[i].ships.indexOf(this.enemyBases[i].ships[j]);
            if (this.spaceship.shield !=0)
            {
              this.spaceship.shield=0;
            }
            else{

              this.spaceship.health = 0;
              this.gameRunning = false;
            }

          }
        }
   
      }
    }

    // Spaceship-Enemy Base Collisions
    for (let i = 0; i < this.enemyBases.length; i++) {
      if (this.enemyBases[i].health > 0) //dont know why this work but it worked
      {
        if (this.CollisionDetection.checkCollision(this.spaceship, this.enemyBases[i]) && this.spaceship._position.x != 0 ) {
          console.log("Spaceship collided with an enemy base");
          this.sound.impact.play();
          this.spaceship.health = 0;
          this.spaceship.bindAttriAndUi();
          this.gameRunning = false;
        }
      }

    }

    // Spaceship-Power Up Collision
    for (let i = 0; i < this.powerups.length; i++) {
      if (this.CollisionDetection.checkCollision(this.spaceship, this.powerups[i])) {
        this.sound.power.play();
        this.powerups[i].update(this.spaceship,this.scene);
        const index = this.powerups.indexOf(this.powerups[i]);
        const x = this.powerups.splice(index, 1);
      }
    }

    if (this.level == 1) {
      // Spaceship-Earth Collision
      if (this.CollisionDetection.checkSphereCollision(this.spaceship, this.planet.earthBoundingSphere)) {
        console.log("Spaceship collided with the earth");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      // Enemy Spaceship-Earth Collision
      for (let i = 0; i < this.enemyBases.length; ++i) {
        for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
          if (this.CollisionDetection.checkSphereCollision(this.enemyBases[i].ships[j], this.planet.earthBoundingSphere)) {
            console.log("An enemy spaceship collided with the earth");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health =0;
          }
        }
      }

    }
    else if (this.level == 2) {

      // Spaceship-Moon Collision
      if (this.CollisionDetection.checkSphereCollision(this.spaceship, this.planet.moonBoundingSphere)) {
        console.log("Spaceship collided with the moon");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      // Spaceship-Planet Collision
      if (this.CollisionDetection.checkSphereCollision(this.spaceship, this.planet.planetBoundingSphere)) {
        console.log("Spaceship collided with the planet");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      // Enemy Spaceship-Moon/Planet Collision
      for (let i = 0; i < this.enemyBases.length; ++i) {
        for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
          if (this.CollisionDetection.checkSphereCollision(this.enemyBases[i].ships[j], this.planet.moonBoundingSphere)) {
            console.log("An enemy spaceship collided with the moon");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health = 0;
          }

          if (this.CollisionDetection.checkSphereCollision(this.enemyBases[i].ships[j], this.planet.planetBoundingSphere)) {
            console.log("An enemy spaceship collided with the planet");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health = 0;
          }
        }
      }

    }
    else {
      // Spaceship-Moon One Collision
      if (this.CollisionDetection.checkPlanetCollisions(this.spaceship, this.planet.moonOneBoundingBox)) {
        console.log("Spaceship collided with the first moon");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      // Spaceship-Moon Two Collision
      if (this.CollisionDetection.checkPlanetCollisions(this.spaceship, this.planet.moonTwoBoundingBox)) {
        console.log("Spaceship collided with the second moon");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      // Spaceship-Moon Three Collision
      if (this.CollisionDetection.checkPlanetCollisions(this.spaceship, this.planet.moonThreeBoundingBox)) {
        console.log("Spaceship collided with the third moon");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      // Spaceship-Planet Collision
      if (this.CollisionDetection.checkSphereCollision(this.spaceship, this.planet.planetBoundingSphere)) {
        console.log("Spaceship collided with the planet");
        this.sound.impact.play();
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
      }

      for (let i = 0; i < this.enemyBases.length; ++i) {
        for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
          // Enemy Spaceship-Moon One Collision
          if (this.CollisionDetection.checkPlanetCollisions(this.enemyBases[i].ships[j], this.planet.moonOneBoundingBox)) {
            console.log("Enemy Spaceship collided with the first moon");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health = 0;
          }

          // Enemy Spaceship-Moon Two Collision
          if (this.CollisionDetection.checkPlanetCollisions(this.enemyBases[i].ships[j], this.planet.moonTwoBoundingBox)) {
            console.log("Enemy Spaceship collided with the second moon");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health = 0;
          }

          // Enemy Spaceship-Moon Three Collision
          if (this.CollisionDetection.checkPlanetCollisions(this.enemyBases[i].ships[j], this.planet.moonThreeBoundingBox)) {
            console.log("Enemy Spaceship collided with the third moon");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health = 0;
          }

          // Enemy Spaceship-Planet Collision
          if (this.CollisionDetection.checkSphereCollision(this.enemyBases[i].ships[j], this.planet.planetBoundingSphere)) {
            console.log("Enemy Spaceship collided with the planet");
            this.sound.impact.play();
            this.enemyBases[i].ships[j].health = 0;
          }
        }

      }
    }


    // Spaceship-Asteroids Collision
    if (this.CollisionDetection.checkAsteroidCollision(this.spaceship)) {
      console.log("Spaceship collided with an asteroid");
      this.sound.impact.play();
      this.spaceship.health = 0;
      this.spaceship.bindAttriAndUi();
      this.gameRunning = false;
    }


    // Enemy Spaceship-Asteroids Collision
    for (let i = 0; i < this.enemyBases.length; ++i) {
      for (let j = 0; j < this.enemyBases[i].ships.length; ++j) {
        if (this.CollisionDetection.checkAsteroidCollision(this.enemyBases[i].ships[j])) {
          console.log("Enemy Spaceship collided with an asteroid");
          this.sound.impact.play();
          this.enemyBases[i].ships[j].health=0
        }
      }
    }

    if (this.spaceship.group.position.x > 800 || this.spaceship.group.position.x < -800 || this.spaceship.group.position.y > 800
       || this.spaceship.group.position.y < -800 || this.spaceship.group.position.z > 800 || this.spaceship.group.position.z < -800){
        console.log("You ran away");
        this.spaceship.health = 0;
        this.spaceship.bindAttriAndUi();
        this.gameRunning = false;
       }

  }
}

export default GameWorld;
