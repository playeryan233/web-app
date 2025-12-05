// src/main.js

import { SceneManager } from './SceneManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // 获取渲染器要附着的容器 (这里直接使用 body)
    const container = document.body;

    // 实例化场景管理器
    const manager = new SceneManager(container);

    // 启动渲染循环
    manager.animate();

    // 监听窗口大小变化以响应式调整相机和渲染器
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // 更新相机的宽高比
        manager.camera.aspect = width / height;
        manager.camera.updateProjectionMatrix();

        // 更新渲染器的大小
        manager.renderer.setSize(width, height);
    });
    
    // 鼠标按下 - 开始拖动
    container.addEventListener('mousedown', (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        manager.onMouseDown(x, y);
    });
    
    // 鼠标移动交互
    container.addEventListener('mousemove', (event) => {
        // 将鼠标坐标归一化到 -1 到 1
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        manager.onMouseMove(x, y, true);
    });
    
    // 鼠标释放 - 结束拖动
    container.addEventListener('mouseup', () => {
        manager.onMouseUp();
    });
    
    // 鼠标离开窗口 - 结束拖动
    container.addEventListener('mouseleave', () => {
        manager.onMouseUp();
    });
    
    // 鼠标点击交互（用于粒子爆炸效果）
    container.addEventListener('click', (event) => {
        // 将鼠标坐标归一化到 -1 到 1
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        manager.onMouseClick(x, y);
    });
    
    // 触摸交互（移动设备）
    container.addEventListener('touchstart', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        manager.onMouseDown(x, y);
    });
    
    container.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        manager.onMouseMove(x, y, true);
    });
    
    container.addEventListener('touchend', (event) => {
        event.preventDefault();
        manager.onMouseUp();
        // 触摸结束时也可以触发粒子爆炸
        if (event.changedTouches.length > 0) {
            const touch = event.changedTouches[0];
            const x = (touch.clientX / window.innerWidth) * 2 - 1;
            const y = -(touch.clientY / window.innerHeight) * 2 + 1;
            manager.onMouseClick(x, y);
        }
    });
});