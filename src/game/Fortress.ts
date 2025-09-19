import Phaser from 'phaser';
import { Weapon } from './Weapon';
import { FortressData } from './Types';
import TextureKeys from './TextureKeys';
import { MemeManager } from './MemeManager';

const bar = 500;
const h = 20;
const pad = 6;
const bary = -80;

export class Fortress extends Phaser.GameObjects.Container {
    private level: number
    private maxHp: number
    private hp: number;
    private fortressImage: Phaser.GameObjects.Image
    private weapons: Weapon[]
    private memeManager: MemeManager
    private bulletGroup: Phaser.GameObjects.Group
    private destroyed: boolean;
    private barBg: Phaser.GameObjects.Graphics
    private barFill: Phaser.GameObjects.Graphics

    constructor(scene: Phaser.Scene, x: number, y: number,  memeManager: MemeManager, bulletGroup: Phaser.GameObjects.Group) {
        super(scene);
        this.fortressImage = scene.make.image({key: TextureKeys.KEY_FORTRESS1, add:false});
        this.add(this.fortressImage);
        this.memeManager = memeManager;
        this.bulletGroup = bulletGroup;

        this.level = 0;
        this.destroyed = false;
        this.weapons = [];
        scene.add.existing(this);

        scene.events.on("damage_to_fortress", (damage: number) => {
            this.applyDamage(damage);
        });

        this.setPosition(x, y);
        
        // 背景（赤枠）
        
        this.barBg = scene.make.graphics();
        // 内側（パステルブルーのゲージ）
        this.barFill = scene.make.graphics();
        this.barBg.fillStyle(0x8b8b8b0, 1); // 赤色 #ff3300ff
        this.barBg.fillRoundedRect(-bar/2, bary, bar, h, h/2);
        this.barFill.fillStyle(0xff330, 1); // 灰色　#8b8b8bff
        this.barFill.fillRoundedRect( -(bar-pad*2)/2, pad + bary, (h-pad*2), (h-pad*2), (h-pad*2)/2);
        this.add(this.barBg);
        this.add(this.barFill);
        this.barBg.setDepth(100);
        this.barBg.setDepth(100);
        this.build();
    }

    async applyDamage(damage: number) {
        this.hp = Math.max(0, this.hp - damage);
        this.updateHpBar();
        if (this.hp == 0 && !this.destroyed) {
            this.destroyed = true;
            this.playClearEffect();
            this.scene.events.emit("stage_clear", (this));
            if (this.level < Fortress.List.length-1){
                this.level ++;
                //this.build();
            } else {
                this.scene.registry.set("clear", true);
                this.scene.time.delayedCall(1500, () => {
                    this.scene.events.emit("game_clear", (this));
                });
                
            }
        }
    }

    build() {
        this.setAlpha(1).setScale(1);
        const data = Fortress.List[this.level];
        this.fortressImage.setTexture(data.name);
        this.hp = data.hp;
        this.maxHp = data.hp
        for(let weaponData of data.weapon) {
            const weapon = new Weapon(this.scene, weaponData, this.memeManager, this.bulletGroup);
            this.addAt(weapon, 1);
            this.weapons.push(weapon);
        }
        this.updateHpBar();
        
    }

    private playClearEffect() {
        // カメラシェイク
        this.scene.cameras.main.shake(800, 0.02);

        // 1. 要塞フェードアウト
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: "Cubic.easeIn",
            onComplete: () => {
                for (let w of this.weapons) {
                    w.destroy();
                    
                }
                this.weapons = [];
                console.log(!this.scene.registry.get("clear"));
                if (!this.scene.registry.get("clear")) {
                    this.build();
                    this.playStartEffect()
                }
            }
        });
    }

    private playStartEffect () {
        this.setAlpha (1);
        const cy = this.y;
        this.setPosition(this.x, -300);
        this.scene.tweens.add({
            targets: this,
            y: cy,
            duration: 1500,
            ease: "Bounce.easeOut",
            onComplete: () => {this.destroyed = false;}
        });
    }

    private updateHpBar() {
        let remaining = this.hp / this.maxHp;
        this.barFill.clear();
        this.barFill.fillStyle(0xff3300, 1); // 水色
        if ((bar-pad*2) * remaining <= h - pad*2) {
            let a = (bar-pad*2) * remaining
            // x = r * cos(θ) から θ を求める
            let r = h/2-pad;
            // cos(θ) = α / r
            const theta = Math.acos((a-r) / r);
            let x = -bar/2 + pad;
            let y = bary + pad + r;
            // Graphics で描く
            this.barFill.moveTo(x, y); 
            this.barFill.beginPath();                    // 左端
            this.barFill.arc(x + r, y, r, Math.PI, Math.PI * 2 - theta, false); // 上半分
            this.barFill.arc(x + r, y, r, theta, Math.PI, false); // 下半分
            this.barFill.closePath();
            this.barFill.fillPath();
        } else {
            this.barFill.fillRoundedRect( -(bar-pad*2)/2, pad + bary, (bar-pad*2) * remaining, (h-pad*2), (h-pad*2)/2);
        }
        
    }


    public static List : FortressData[] = [
        {
            name: TextureKeys.KEY_FORTRESS1,
            hp: 10,
            weapon:[
                {x:0, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:1}
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS2,
            hp: 20,
            weapon:[
                {x:64, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:1.5},
                {x:-64, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:1},
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS3,
            hp: 30,
            weapon:[
                {x:80, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:1},
                {x:0, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:1},
                {x:-80, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:1},
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS4,
            hp: 40,
           weapon:[
                {x:75, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:0.7},
                {x:204, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:0.7},
                {x:-75, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:0.7},
                {x:-204, y:0, name:TextureKeys.KEY_WEAPON1, cooldown:0.7},
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS1,
            hp: 50,
            weapon:[
                {x:0, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1}
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS2,
            hp: 60,
            weapon:[
                {x:64, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-64, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1}
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS3,
            hp: 70,
            weapon:[
                {x:80, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:0, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-80, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1}
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS4,
            hp: 80,
            weapon:[
                {x:75, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:204, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-75, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-204, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1}
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS5,
            hp: 90,
            weapon:[
                {x:264, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:154, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:0, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-154, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-264, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1}
            ]
        },
        {
            name: TextureKeys.KEY_FORTRESS5,
            hp: 100,
            weapon:[
                {x:264, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:154, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:0, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-154, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-264, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:264, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:154, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:0, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-154, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1},
                {x:-264, y:0, name:TextureKeys.KEY_WEAPON2, cooldown:0.1}
            ]
        },
    ]
}