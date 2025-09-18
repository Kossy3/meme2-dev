import Phaser from 'phaser';
import { MemeManager } from './MemeManager';
import TextureKeys from './TextureKeys';
import { Bullet } from './Bullet';
import {WeaponData} from './Types';

export class Weapon extends Phaser.GameObjects.Container {
    private weaponData: WeaponData;
    private fireTimer: number;
    private memeManager: MemeManager;
    private rotateSpeed: Number;
    private range: number;
    private bulletGroup: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, weaponData:WeaponData, memeManager: MemeManager, bulletGroup: Phaser.GameObjects.Group) {
        super(scene);
        this.memeManager = memeManager;
        this.bulletGroup = bulletGroup;
        const sprite = scene.make.image({key:weaponData.name, add:false}).setScale(0.4);
        this.add(sprite);
        scene.add.existing(this);
        this.setPosition(weaponData.x, weaponData.y);

        this.weaponData = weaponData;
        this.fireTimer = weaponData.cooldown;
        this.range = 700;
        this.rotateSpeed = 0.2 * Math.PI;
    }

    preUpdate(time:number, delta: number) {
        const dt = delta / 1000;
        this.fireTimer -= dt;

        if (this.fireTimer <= 0) {
            let meme = this.memeManager.getTargetMeme(this.range);
            if (!meme) return;

            this.fireTimer = this.weaponData.cooldown;

            let pos = meme.getWorldPoint();
            let myPos = this.getWorldPoint();

            // pos方向に回転する
            const angle = Phaser.Math.Angle.Between(myPos.x, myPos.y, pos.x, pos.y);
            this.rotation = angle - Math.PI/2;

            // 弾を発射する処理
            meme.attacked(10);
            this.fire(this.getWorldPoint(), meme.getWorldPoint());
        }
    }

    fire(from: Phaser.Math.Vector2, target: Phaser.Math.Vector2) {
        const bullet = this.bulletGroup.get() as Bullet;
        if (bullet) {
            bullet.fire(this.weaponData.name, from, target);
        }
    }
}