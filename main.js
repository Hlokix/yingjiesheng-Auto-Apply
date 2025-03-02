// ==UserScript==
// @name         Auto Apply Job Script with Pagination
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  Automatically apply to jobs and navigate through pages
// @author       You
// @match        https://q.yingjiesheng.com/pc/searchintention
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yingjiesheng.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建开始按钮
    const startButton = document.createElement('button');
    startButton.textContent = '开始自动申请';
    startButton.style.position = 'fixed';
    startButton.style.top = '10px';
    startButton.style.right = '10px';
    startButton.style.zIndex = '9999';
    startButton.style.padding = '10px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';

    // 将按钮添加到页面
    document.body.appendChild(startButton);

    // 投递当前页面的函数
    function applyCurrentPage(callback) {
        // 获取所有 .right-btn 下的直接子 div 元素
        const buttons = document.querySelectorAll('.right-btn > div');

        // 过滤出可申请的按钮
        const applyButtons = Array.from(buttons).filter(button =>
            button.textContent.trim() === '立即申请' && !button.classList.contains('hasdelivery')
        );

        if (applyButtons.length === 0) {
            console.log('当前页面没有可投递的职位，尝试跳转下一页');
            callback();
            return;
        }

        // 遍历并依次点击每个“立即申请”按钮
        applyButtons.forEach((button, index) => {
            setTimeout(() => {
                button.click();
                console.log(`Clicked "立即申请" button ${index + 1} of ${applyButtons.length} on page ${getCurrentPage()}`);

                // 如果是最后一个按钮，执行回调（跳转下一页）
                if (index === applyButtons.length - 1) {
                    setTimeout(callback, 2000); // 等待2秒后跳转下一页
                }
            }, index * 2000); // 每隔2秒点击一个按钮
        });
    }

    // 获取当前页码
    function getCurrentPage() {
        const activePage = document.querySelector('.el-pager .number.active');
        return activePage ? parseInt(activePage.textContent) : 1;
    }

    // 检查并跳转到下一页
    function goToNextPage() {
        const nextButton = document.querySelector('.btn-next:not([disabled])');

        if (nextButton) {
            console.log(`当前页 ${getCurrentPage()} 投递完成，跳转到下一页`);
            nextButton.click();

            // 等待页面加载完成后再继续投递
            setTimeout(() => {
                applyCurrentPage(goToNextPage);
            }, 3000); // 等待3秒确保页面加载完成
        } else {
            // 没有下一页，结束投递
            console.log('已到达最后一页，投递完成');
            startButton.disabled = false;
            startButton.textContent = '开始自动申请';
            startButton.style.backgroundColor = '#4CAF50';
            alert('所有页面投递完成！');
        }
    }

    // 开始投递的入口函数
    function startClicking() {
        const buttons = document.querySelectorAll('.right-btn > div');
        const applyButtons = Array.from(buttons).filter(button =>
            button.textContent.trim() === '立即申请' && !button.classList.contains('hasdelivery')
        );

        if (buttons.length === 0) {
            alert('未找到任何职位按钮，请确保页面已加载！');
            return;
        }

        // 禁用开始按钮
        startButton.disabled = true;
        startButton.textContent = '正在申请...';
        startButton.style.backgroundColor = '#808080';

        // 开始投递当前页面，并设置回调为跳转下一页
        applyCurrentPage(goToNextPage);
    }

    // 为开始按钮添加点击事件监听
    startButton.addEventListener('click', startClicking);
})();
