/**
 * Three.js 3D Background Scene
 * Creates an immersive particle system with interactive elements
 */

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometricShapes = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.isDarkMode = document.documentElement.classList.contains('dark');
        
        this.init();
        this.createParticles();
        this.createGeometricShapes();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('three-canvas'),
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x6366f1, 1);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 1000 : 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const color1 = new THREE.Color(0x6366f1); // Primary
        const color2 = new THREE.Color(0x8b5cf6); // Secondary
        const color3 = new THREE.Color(0x06b6d4); // Accent
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 50;
            
            // Color - randomly choose between the three colors
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.33) {
                color = color1;
            } else if (colorChoice < 0.66) {
                color = color2;
            } else {
                color = color3;
            }
            
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: this.isDarkMode ? 0.15 : 0.1,
            vertexColors: true,
            transparent: true,
            opacity: this.isDarkMode ? 0.8 : 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createGeometricShapes() {
        // Create floating geometric shapes
        const shapes = [
            { geometry: new THREE.TorusGeometry(2, 0.5, 16, 100), color: 0x6366f1 },
            { geometry: new THREE.OctahedronGeometry(1.5), color: 0x8b5cf6 },
            { geometry: new THREE.TetrahedronGeometry(1.8), color: 0x06b6d4 }
        ];
        
        shapes.forEach((shapeData, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });
            
            const mesh = new THREE.Mesh(shapeData.geometry, material);
            
            // Position shapes
            mesh.position.x = (index - 1) * 20;
            mesh.position.y = Math.sin(index) * 10;
            mesh.position.z = -20;
            
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        });
    }
    
    addEventListeners() {
        // Mouse move for parallax effect
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Theme change listener
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.isDarkMode = document.documentElement.classList.contains('dark');
                    this.updateTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    updateTheme() {
        // Update particle opacity based on theme
        if (this.particles) {
            this.particles.material.opacity = this.isDarkMode ? 0.8 : 0.6;
            this.particles.material.size = this.isDarkMode ? 0.15 : 0.1;
        }
        
        // Update geometric shapes opacity
        this.geometricShapes.forEach(shape => {
            shape.material.opacity = this.isDarkMode ? 0.15 : 0.1;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            this.particles.rotation.x = this.mouse.y * 0.1;
            this.particles.rotation.y += this.mouse.x * 0.05;
        }
        
        // Animate geometric shapes
        this.geometricShapes.forEach((shape, index) => {
            shape.rotation.x += 0.001 * (index + 1);
            shape.rotation.y += 0.002 * (index + 1);
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });
        
        // Camera parallax
        this.camera.position.x = this.mouse.x * 2;
        this.camera.position.y = this.mouse.y * 2;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if device supports WebGL
    if (window.WebGLRenderingContext) {
        try {
            new ThreeScene();
        } catch (error) {
            console.warn('Three.js initialization failed:', error);
        }
    }
});
