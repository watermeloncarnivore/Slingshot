class PurpleRain {
    constructor() {
        this.container = document.getElementById('background-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.raindrops = [];
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Create raindrop geometry
        const rainGeo = new THREE.BufferGeometry();
        const rainCount = 15000;
        const posArray = new Float32Array(rainCount * 3);
        const velocityArray = new Float32Array(rainCount);

        for(let i = 0; i < rainCount * 3; i += 3) {
            posArray[i] = Math.random() * 400 - 200;
            posArray[i + 1] = Math.random() * 500 - 250;
            posArray[i + 2] = Math.random() * 400 - 200;
            velocityArray[i/3] = 0.1 + Math.random() * 0.3;
        }

        rainGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        rainGeo.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 1));

        const rainMaterial = new THREE.PointsMaterial({
            color: 0x9933ff,
            size: 0.2,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.rain = new THREE.Points(rainGeo, rainMaterial);
        this.scene.add(this.rain);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x9933ff, 0.5);
        this.scene.add(ambientLight);

        // Position camera
        this.camera.position.z = 100;

        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const positions = this.rain.geometry.attributes.position.array;
        const velocities = this.rain.geometry.attributes.velocity.array;

        for(let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= velocities[i/3];

            if(positions[i + 1] < -250) {
                positions[i + 1] = 250;
            }
        }

        this.rain.geometry.attributes.position.needsUpdate = true;
        this.rain.rotation.y += 0.0001;

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
} 