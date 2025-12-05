// src/objects/ParticleSystem.js

// 使用全局 THREE 变量（通过 CDN 加载）
const THREE = window.THREE;

export class ParticleSystem extends THREE.Points {
    constructor(count = 2000) {
        // 确保 THREE 已加载
        if (!THREE) {
            console.error('THREE.js is not loaded!');
            return;
        }
        // 创建粒子几何体
        const geometry = new THREE.BufferGeometry();
        
        // 创建位置数组
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        // 丰富的颜色调色板
        const colorPalette = [
            new THREE.Color(0xff0080), // 粉红
            new THREE.Color(0x00ff80), // 青绿
            new THREE.Color(0x8000ff), // 紫色
            new THREE.Color(0xff8000), // 橙色
            new THREE.Color(0x0080ff), // 蓝色
            new THREE.Color(0xffff00), // 黄色
            new THREE.Color(0xff0080), // 洋红
            new THREE.Color(0x00ffff), // 青色
        ];
        
        // 初始化粒子位置、颜色和大小
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // 随机位置（在相机视野范围内分布）
            positions[i3] = (Math.random() - 0.5) * 15;
            positions[i3 + 1] = (Math.random() - 0.5) * 15;
            positions[i3 + 2] = (Math.random() - 0.5) * 10 - 2; // 在相机前方
            
            // 随机颜色
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // 随机大小（不再使用，改用统一的 PointsMaterial size）
        }
        
        // 设置几何体属性
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // 使用 PointsMaterial（更简单、兼容性更好）
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });
        
        super(geometry, material);
        
        // 存储原始位置用于重置和动画
        this.originalPositions = new Float32Array(positions);
        this.positions = positions;
        this.mousePosition = new THREE.Vector2(0, 0);
        this.time = 0;
    }
    
    /**
     * 更新粒子系统
     * @param {number} deltaSeconds 距离上一帧的时间（秒）
     */
    update(deltaSeconds) {
        this.time += deltaSeconds;
        
        // 更新粒子位置，添加波浪动画效果
        const positions = this.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // 从原始位置开始
            let x = this.originalPositions[i3];
            let y = this.originalPositions[i3 + 1];
            let z = this.originalPositions[i3 + 2];
            
            // 添加波浪效果
            x += Math.sin(this.time + y * 0.1) * 0.5;
            y += Math.cos(this.time + x * 0.1) * 0.5;
            
            // 鼠标交互：粒子向鼠标位置移动
            const mouseInfluenceX = (this.mousePosition.x - x) * 0.01;
            const mouseInfluenceY = (this.mousePosition.y - y) * 0.01;
            x += mouseInfluenceX;
            y += mouseInfluenceY;
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
        }
        
        this.geometry.attributes.position.needsUpdate = true;
        
        // 让粒子系统旋转
        this.rotation.y += 0.2 * deltaSeconds;
        this.rotation.x += 0.1 * deltaSeconds;
    }
    
    /**
     * 设置鼠标位置（用于交互）
     * @param {number} x 鼠标X坐标（归一化到-1到1）
     * @param {number} y 鼠标Y坐标（归一化到-1到1）
     */
    setMousePosition(x, y) {
        // 将屏幕坐标转换为3D空间坐标
        this.mousePosition.set(x * 10, y * 10);
    }
    
    /**
     * 点击效果：在点击位置产生粒子爆炸
     */
    explode(x, y, z) {
        const positions = this.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const dx = positions[i3] - x;
            const dy = positions[i3 + 1] - y;
            const dz = positions[i3 + 2] - z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < 3) {
                // 在爆炸范围内的粒子向外推
                const force = (3 - distance) / 3;
                positions[i3] += dx * force * 0.5;
                positions[i3 + 1] += dy * force * 0.5;
                positions[i3 + 2] += dz * force * 0.5;
            }
        }
        
        this.geometry.attributes.position.needsUpdate = true;
    }
}

