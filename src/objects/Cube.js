// src/objects/Cube.js

// 使用全局 THREE 变量（通过 CDN 加载）
const THREE = window.THREE;

export class Cube extends THREE.Mesh {
    constructor() {
        // 创建几何体 (BoxGeometry) 和材质 (MeshBasicMaterial)
        // 立方体尺寸缩小50%
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        // 使用更丰富的颜色，并添加线框效果
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        // 调用父类 Mesh 的构造函数
        super(geometry, material);
    }

    /**
     * 更新立方体状态，通常在渲染循环中调用
     * @param {number} deltaSeconds 距离上一帧的时间（秒）
     */
    update(deltaSeconds) {
        // 立方体旋转现在由鼠标拖动控制，不再自动旋转
        // 如果需要轻微的自动旋转，可以取消下面的注释
        // this.rotation.x += 0.1 * deltaSeconds;
        // this.rotation.y += 0.05 * deltaSeconds;
    }
    
    /**
     * 根据鼠标移动旋转立方体
     * @param {number} deltaX 鼠标X方向移动量
     * @param {number} deltaY 鼠标Y方向移动量
     */
    rotateByMouse(deltaX, deltaY) {
        // 根据鼠标移动旋转立方体
        this.rotation.y += deltaX * 0.01;
        this.rotation.x += deltaY * 0.01;
    }
}