// 配置游戏主体
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    // 如果需要加载资源，可以在这里添加
}

function create() {
    this.cameras.main.setBackgroundColor('#f5f5dc');  // 设置背景颜色
    this.score = 0;  // 初始化计分器
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '20px', 
        fill: '#000',
        backgroundColor: '#ffffff',
        padding: { left: 5, right: 5, top: 5, bottom: 5 }
    });
    this.scoreText.setDepth(1); // 确保计数器在最上层

    this.circles = []; // 存储所有圆形的数组
    for (let i = 0; i < 5; i++) {
        createCircle(this);
    }

    var graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x000000 } });
    // 绘制竖线
    for (let i = 1; i <= 3; i++) {
        let x = i * 800 / 4;
        graphics.lineBetween(x, 0, x, 600);
    }
    // 绘制横线
    for (let j = 1; j <= 3; j++) {
        let y = j * 600 / 4;
        graphics.lineBetween(0, y, 800, y);
    }
}

function update() {
    this.circles.forEach(circle => {
        if (!circle.stopped) {
            circle.x += circle.vx;
            circle.y += circle.vy;

            // 边界碰撞检查
            if (circle.x < 50 || circle.x > 750) circle.vx *= -1;
            if (circle.y < 50 || circle.y > 550) circle.vy *= -1;
        }
    });
}

function createCircle(scene) {
    let x = Phaser.Math.Between(100, 700);
    let y = Phaser.Math.Between(50, 500);  // 确保不与顶部计分器重叠
    let color = Phaser.Display.Color.RandomRGB(100, 255).color;
    let circle = scene.add.circle(x, y, 100, color).setInteractive();
    circle.setDepth(0);  // 设置较低的深度，保证计数器文本在其上面
    circle.vx = Phaser.Math.Between(-100, 100) / 100 * 0.5;
    circle.vy = Phaser.Math.Between(-100, 100) / 100 * 0.5;

    circle.on('pointerdown', function () {
        scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: 'Linear',
            duration: 250,
            onComplete: () => {
                this.destroy();
                createCircle(scene); // 创建新的圆形
                scene.score += 1;  // 增加分数
                scene.scoreText.setText('Score: ' + scene.score);  // 更新分数显示
            }
        });
    });

    scene.circles.push(circle);
}
