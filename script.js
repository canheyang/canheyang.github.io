// 导航菜单交互
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-links a');

// 移动端菜单切换
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// 点击导航链接关闭菜单
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// 滚动时导航栏样式变化
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '20px 50px';
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(255, 255, 255, 0.1)';
    } else {
        navbar.style.padding = '30px 50px';
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// 平滑滚动（只对单页内锚点链接生效）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // 检查是否是外部页面链接
        if (this.getAttribute('href').length > 1) {
            // 保留默认行为
            return;
        }
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 作品筛选功能
const filterButtons = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有按钮的活动状态
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // 添加当前按钮的活动状态
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // 筛选作品
        workItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                // 添加淡入动画
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                // 延迟隐藏，等待动画完成
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 初始化作品项动画
workItems.forEach((item, index) => {
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 100 * index);
});

// 表单提交处理
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // 这里只是模拟提交，实际项目中需要添加AJAX请求
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';

        // 模拟网络延迟
        setTimeout(() => {
            submitBtn.textContent = '发送成功!';
            submitBtn.style.backgroundColor = '#4CAF50';

            // 重置表单
            contactForm.reset();

            // 恢复按钮状态
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}


// 作品页面视差滚动标题效果
if (document.getElementById('works')) {
    const artTitle = document.getElementById('artTitle');
    const designTitle = document.getElementById('designTitle');
    const fixedTitles = document.querySelector('.fixed-titles');
    const artWorksColumn = document.querySelector('.art-works');
    const designWorksColumn = document.querySelector('.design-works');
    const firstArtWork = artWorksColumn.querySelector('.work-item:nth-child(1)');
    const firstDesignWork = designWorksColumn.querySelector('.work-item:nth-child(1)');
    const secondArtWork = artWorksColumn.querySelector('.work-item:nth-child(2)');
    const secondDesignWork = designWorksColumn.querySelector('.work-item:nth-child(2)');
    
    // 计算标题开始变化和完全消失的位置
    let startPosition = 0;    // 开始变化的位置
    let endPosition = 0;      // 完全消失的位置
    const maxMoveDistance = 100;  // 最大向下移动距离（像素），可调整此值控制移动时间
    
    function initPositions() {
        if (firstArtWork && secondArtWork) {
            // 开始变化的位置：第一组图片完全进入视野
            startPosition = firstArtWork.offsetTop + firstArtWork.offsetHeight / 4;
            // 完全消失的位置：第二组图片进入视野
            endPosition = secondArtWork.offsetTop - window.innerHeight / 2;
        }
    }
    
    // 初始化位置
    initPositions();
    
    // 初始状态显示两个标题
    artTitle.classList.remove('title-hidden');
    designTitle.classList.remove('title-hidden');
    fixedTitles.style.opacity = '1';
    fixedTitles.style.transform = 'translate(-50%, -50%) translateY(0)';
    
    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // 更新标题状态的函数
    function updateTitleState() {
        const scrollPosition = window.scrollY;
        
        // 当滚动在开始位置之前，保持初始状态
        if (scrollPosition < startPosition) {
            artTitle.classList.remove('title-hidden');
            designTitle.classList.remove('title-hidden');
            fixedTitles.style.opacity = '1';
            fixedTitles.style.transform = 'translate(-50%, -50%) translateY(0)';
        }
        // 当滚动在开始位置和结束位置之间，应用视差效果
        else if (scrollPosition >= startPosition && scrollPosition < endPosition) {
            // 计算滚动进度 (0-1)
            const progress = (scrollPosition - startPosition) / (endPosition - startPosition);
            // 计算当前向下移动距离
            const currentMove = maxMoveDistance * progress;
            // 计算当前透明度
            const currentOpacity = 1 - progress;
            
            artTitle.classList.remove('title-hidden');
            designTitle.classList.remove('title-hidden');
            fixedTitles.style.opacity = currentOpacity.toString();
            fixedTitles.style.transform = `translate(-50%, -50%) translateY(${currentMove}px)`;
        }
        // 当滚动超过结束位置，隐藏标题
        else {
            artTitle.classList.add('title-hidden');
            designTitle.classList.add('title-hidden');
        }
    }
    
    // 监听滚动事件，使用节流优化性能，设置为约120fps
    window.addEventListener('scroll', throttle(updateTitleState, 8));
    
    // 监听窗口大小变化，重新计算位置
    window.addEventListener('resize', initPositions);
}

// 滚动动画
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-title, .about-content, .contact-info, .contact-form');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// 初始设置
const initializeElements = () => {
    const elements = document.querySelectorAll('.section-title, .about-content, .contact-info, .contact-form');

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // 初始动画
    setTimeout(() => {
        animateOnScroll();
    }, 300);
};

// 页面加载完成后初始化
window.addEventListener('load', () => {
    initializeElements();
    animateOnScroll();
});

// 滚动时触发动画
window.addEventListener('scroll', animateOnScroll);

// 窗口调整大小时重新布局
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});