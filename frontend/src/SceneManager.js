// src/SceneManager.js

// 使用全局 THREE 变量（通过 CDN 加载）
const THREE = window.THREE;
import { Cube } from './objects/Cube.js';
import { ParticleSystem } from './objects/ParticleSystem.js';

export class SceneManager {
    constructor(container) {
        // 核心 THREE.js 组件
        this.scene = new THREE.Scene();
        
        // 使用窗口尺寸而不是容器尺寸，确保正确初始化
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        // 初始化渲染器
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);

        // 设置相机位置，让立方体占据整个屏幕
        // 根据立方体大小(4x4x4)和相机视野(75度)计算合适的位置
        this.camera.position.z = 8;

        // 创建并添加我们的 3D 对象
        this.cube = new Cube();
        this.scene.add(this.cube);
        
        // 创建粒子系统
        try {
            this.particleSystem = new ParticleSystem(3000);
            this.scene.add(this.particleSystem);
            console.log('粒子系统创建成功，粒子数量:', 3000);
        } catch (error) {
            console.error('粒子系统创建失败:', error);
        }

        // 使用 Three.js 内置的 Clock 追踪时间
        this.clock = new THREE.Clock();
        
        // 存储鼠标位置
        this.mouse = new THREE.Vector2();
        
        // 拖动状态
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
    }
    
    /**
     * 处理鼠标移动
     * @param {number} x 鼠标X坐标（归一化到-1到1）
     * @param {number} y 鼠标Y坐标（归一化到-1到1）
     * @param {boolean} isDragging 是否正在拖动
     */
    onMouseMove(x, y, isDragging = false) {
        this.particleSystem.setMousePosition(x, y);
        
        // 如果正在拖动，旋转立方体
        if (isDragging && this.isDragging) {
            const deltaX = x - this.previousMousePosition.x;
            const deltaY = y - this.previousMousePosition.y;
            this.cube.rotateByMouse(deltaX, deltaY);
        }
        
        // 更新上一帧的鼠标位置
        this.previousMousePosition.x = x;
        this.previousMousePosition.y = y;
    }
    
    /**
     * 开始拖动
     * @param {number} x 鼠标X坐标（归一化到-1到1）
     * @param {number} y 鼠标Y坐标（归一化到-1到1）
     */
    onMouseDown(x, y) {
        this.isDragging = true;
        this.previousMousePosition.x = x;
        this.previousMousePosition.y = y;
    }
    
    /**
     * 结束拖动
     */
    onMouseUp() {
        this.isDragging = false;
    }
    
    /**
     * 处理鼠标点击
     * @param {number} x 鼠标X坐标（归一化到-1到1）
     * @param {number} y 鼠标Y坐标（归一化到-1到1）
     */
    onMouseClick(x, y) {
        // 将屏幕坐标转换为3D空间坐标
        const raycaster = new THREE.Raycaster();
        this.mouse.set(x, y);
        raycaster.setFromCamera(this.mouse, this.camera);
        
        // 在相机前方创建一个点击位置
        const distance = 5;
        const clickPosition = new THREE.Vector3();
        raycaster.ray.at(distance, clickPosition);
        
        // 产生爆炸效果
        this.particleSystem.explode(clickPosition.x, clickPosition.y, clickPosition.z);
    }

    /**
     * 渲染循环函数
     */
    animate = () => {
        // 递归调用，创建循环
        requestAnimationFrame(this.animate);

        // 获取距离上一帧的时间差
        const delta = this.clock.getDelta();

        // 更新场景中的所有对象
        this.cube.update(delta);
        this.particleSystem.update(delta);

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }
}