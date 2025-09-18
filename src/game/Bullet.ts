import Phaser from 'phaser';
import TextureKeys from './TextureKeys';

export class Bullet extends Phaser.GameObjects.Container {

    private sprite: Phaser.GameObjects.Image;
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.sprite = scene.make.image({
            x:0, y:0, 
            key: TextureKeys.KEY_BULLET1})
            .setScale(0.25);
        this.add( this.sprite);
        this.particleEmitter = this.scene.add.particles(0, 0, "blood", {
            // config
            speed: { min: 50, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 300,
            quantity: 8,
            frequency: -1  // 一度だけ発射する burst モード
        });
        scene.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
    }

    fire(weaponName: string, from: Phaser.Math.Vector2, target: Phaser.Math.Vector2) {
        this.setPosition(from.x, from.y);

        this.sprite.setTexture(Bullet.bulletType[weaponName]);

        // 矢の角度を方向に合わせる
        const dir = target.clone().subtract(from).normalize();
        this.sprite.setRotation(dir.angle() - Math.PI/2);

        this.setActive(true).setVisible(true);

        // 簡易的な飛行アニメーション（瞬間移動を演出）
        const trailCount = 5; // 途中のトレイル数
        for (let i = 1; i <= trailCount; i++) {
            const t = i / trailCount;
            const trailX = Phaser.Math.Interpolation.Linear([from.x, target.x], t);
            const trailY = Phaser.Math.Interpolation.Linear([from.y, target.y], t);
            this.spawnTrailAt(trailX, trailY, dir.angle()- Math.PI/2, i*i*10);
        }

        // 最終的にターゲットに瞬間移動
        this.setPosition(target.x, target.y);

        this.explode(target);
    }

    private spawnTrailAt(x: number, y: number, rotation: number, lifespan:number) {
        const trail = this.scene.add.image(x, y, this.sprite.texture)
            .setScale(0.3)
            .setAlpha(0.5)
            .setRotation(rotation);

        this.scene.tweens.add({
            targets: trail,
            alpha: 0,
            duration: lifespan,
            onComplete: () => {
                trail.destroy();
                this.setActive(false).setVisible(false);
            }
        });
    }

    private explode(target: Phaser.Math.Vector2) {
        // この時点で this.x, this.y に着弾位置がある前提

        // このadd.particlesで直接ParticleEmitterを作成
        // this.particleEmitter.setPosition(target.x, target.y);
        // emitter.explodeは、emitterがこのタイプの場合使える
        this.particleEmitter.explode(8, target.x, target.y);

        // 少し待ってから emitter を破棄
        // this.scene.time.delayedCall(300, () => {
        //     emitter.remove();  // emitterを remove したり destroy
        // });
    }

    public static readonly bulletType : {[key: string]: string} = {
        "weapon1": TextureKeys.KEY_BULLET1,
        "weapon2": TextureKeys.KEY_BULLET2
    }
}