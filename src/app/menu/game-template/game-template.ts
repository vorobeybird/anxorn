import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game-template.html',
  styleUrl: './game-template.css'
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;

  private characterTextures: { [key: string]: THREE.Texture } = {};
  private characterSprite!: THREE.Sprite;
  private currentDirection = 'idle';


  private character!: THREE.Group;
  private readonly WORLD_SIZE = 40;
  // Character position
  characterX = 0;
  characterZ = 0;

  // Movement keys
  private keys: { [key: string]: boolean } = {};

  ngOnInit() {
    this.initThreeJS();
    this.createWorld();
    this.createCharacter();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer?.dispose();
  }

  private initThreeJS() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.gameCanvas.nativeElement,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private createWorld() {
    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(this.WORLD_SIZE * 2, this.WORLD_SIZE * 2);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.createRoom();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }

  private createRoom() {
    // Room dimensions
    const roomWidth = 20;
    const roomDepth = 15;
    const wallHeight = 8;
    const wallThickness = 0.5;

    // Wall material
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: 0x8B4513, // Brown brick color
      transparent: false
    });

    // Back wall (North)
    const backWallGeometry = new THREE.BoxGeometry(roomWidth, wallHeight, wallThickness);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, wallHeight / 2, -roomDepth / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Left wall (West)
    const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right wall (East)
    const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(roomWidth / 2, wallHeight / 2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Optional: Add some room decorations
    this.addRoomDecorations(roomWidth, roomDepth, wallHeight);
  }

  private addRoomDecorations(roomWidth: number, roomDepth: number, wallHeight: number) {
    // Add a simple table in the room
    const tableGeometry = new THREE.BoxGeometry(3, 1, 2);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(-5, 0.5, -3);
    table.castShadow = true;
    table.receiveShadow = true;
    this.scene.add(table);

    // Add a chair
    const chairGeometry = new THREE.BoxGeometry(1, 2, 1);
    const chairMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const chair = new THREE.Mesh(chairGeometry, chairMaterial);
    chair.position.set(-5, 1, -1);
    chair.castShadow = true;
    chair.receiveShadow = true;
    this.scene.add(chair);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.handleMovement();
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  private createCharacter() {
    this.character = new THREE.Group();

    // Load multiple textures
    const textureLoader = new THREE.TextureLoader();
    const texturePaths = {
      idle: 'assets/charFront.png',
      back: 'assets/charFront.png',
      left: 'assets/charLeft.png',  
      right: 'assets/charRight.png',
      straight: 'assets/charBack.png'   
    };

    let texturesLoaded = 0;
    const totalTextures = Object.keys(texturePaths).length;

    // Load all textures
    Object.entries(texturePaths).forEach(([direction, path]) => {
      textureLoader.load(
        path,
        // onLoad callback
        (texture) => {
          console.log(`${direction} texture loaded successfully`);
          this.characterTextures[direction] = texture;
          texturesLoaded++;

          // When all textures are loaded, create the sprite
          if (texturesLoaded === totalTextures) {
            this.createCharacterSprite();
          }
        },
        // onProgress callback
        undefined,
        // onError callback
        (error) => {
          console.error(`Error loading ${direction} texture:`, error);
          
          // Create a fallback colored texture for this direction
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 96;
          const context = canvas.getContext('2d')!;
          
          // Different colors for different directions
          const colors = { idle: '#ff6b6b', left: '#4ecdc4', right: '#45b7d1' };
          context.fillStyle = colors[direction as keyof typeof colors] || '#ff6b6b';
          context.fillRect(0, 0, 64, 96);
          
          this.characterTextures[direction] = new THREE.CanvasTexture(canvas);
          texturesLoaded++;

          if (texturesLoaded === totalTextures) {
            this.createCharacterSprite();
          }
        }
      );
    });

    // Position character at origin
    this.character.position.set(this.characterX, 0, this.characterZ);
    this.scene.add(this.character);
  }

  private createCharacterSprite() {
    // Create sprite material with the idle texture initially
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.characterTextures['idle'],
      transparent: true,
      alphaTest: 0.01,
      fog: false
    });

    // Create sprite
    this.characterSprite = new THREE.Sprite(spriteMaterial);
    this.characterSprite.scale.set(2, 3, 1);
    this.characterSprite.position.y = 1.5;

    this.character.add(this.characterSprite);
    console.log('Character sprite created with all textures loaded');
  }

  private updateCharacterTexture(direction: string) {
    if (this.characterSprite && this.characterTextures[direction]) {
      // Change the texture based on direction
      (this.characterSprite.material as THREE.SpriteMaterial).map = this.characterTextures[direction];
      (this.characterSprite.material as THREE.SpriteMaterial).needsUpdate = true;
      this.currentDirection = direction;
    }
  }

  private handleMovement() {
    const moveSpeed = 0.3;
    let newX = this.characterX;
    let newZ = this.characterZ;
    let isMoving = false;
    let newDirection = 'idle';

    if (this.keys['w'] || this.keys['ArrowUp']) {
      newZ -= moveSpeed;
      isMoving = true;
      newDirection = 'straight'; // or create a 'up' texture if you want
    }
    if (this.keys['s'] || this.keys['ArrowDown']) {
      newZ += moveSpeed;
      isMoving = true;
      newDirection = 'back';
    }
    if (this.keys['a'] || this.keys['ArrowLeft']) {
      newX -= moveSpeed;
      isMoving = true;
      newDirection = 'left';
    }
    if (this.keys['d'] || this.keys['ArrowRight']) {
      newX += moveSpeed;
      isMoving = true;
      newDirection = 'right';
    }

    // Update texture if direction changed
    if (newDirection !== this.currentDirection) {
      this.updateCharacterTexture(newDirection);
    }

    // Apply boundaries (room boundaries)
    const roomBoundaryX = 9; // Half of roomWidth minus some margin
    const roomBoundaryZ = 6;  // Half of roomDepth minus some margin

    newX = Math.max(-roomBoundaryX, Math.min(roomBoundaryX, newX));
    newZ = Math.max(-roomBoundaryZ, Math.min(roomBoundaryZ, newZ));

    // Update character position
    if (newX !== this.characterX || newZ !== this.characterZ) {
      this.characterX = newX;
      this.characterZ = newZ;

      // Update 3D character position
      this.character.position.set(this.characterX, 0, this.characterZ);

      if (isMoving) {
        const time = Date.now() * 0.01;
        this.character.position.y = Math.sin(time) * 0.1;
      }
    }

    // If not moving, return to idle after a short delay
    if (!isMoving && this.currentDirection !== 'idle') {
      setTimeout(() => {
        if (!isMoving) { // Double check we're still not moving
          this.updateCharacterTexture('idle');
        }
      }, 200); // 200ms delay before returning to idle
    }
  }

  private updateCamera() {
    // Follow character
    this.camera.position.x = this.characterX;
    this.camera.position.z = this.characterZ + 20;
    this.camera.lookAt(this.characterX, 2, this.characterZ);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    this.keys[event.key.toLowerCase()] = true;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keys[event.key.toLowerCase()] = false;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}