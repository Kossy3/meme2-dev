import Phaser from 'phaser';
import TextureKeys from './TextureKeys';
import { MemeStatus } from "./Types";

export class Meme extends Phaser.GameObjects.Container {
    private dir: Phaser.Math.Vector2;
    private hp: number;
    // private info: Phaser.GameObjects.Text;
    private dead: boolean = false;
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    private status: MemeStatus;
    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, 0, 0);
        const sprite = scene.make.image({x:0, y:0, key:TextureKeys.KEY_MEME6, add:false}).setScale(0.25);
        this.add(sprite);
        // this.info = scene.make.text({x:0, y:0, text:`x:${x}, y:${y}`, style:{
        //     fontFamily: 'Arial Black', fontSize: 20, color: '#b60000ff',
        //     stroke: '#ff6464ff', strokeThickness: 8,
        //     align: 'center'
        // },
        // add:false}).setOrigin(0.5);
        // this.add(this.info);
        this.setPosition(x,y);

        this.particleEmitter = this.scene.add.particles(0, 0, "wool", {
            // config
            speed: { min: 50, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 1 },
            alpha: { start: 1, end: 0 },
            lifespan: 300,
            quantity: 8,
            frequency: -1  // 一度だけ発射する burst モード
        });
        
        this.speed = Phaser.Math.Between(50, 100);
        this.dir = new Phaser.Math.Vector2(0,-1).normalize();

        scene.events.on("stage_clear", ()=> {this.release();})

        scene.add.existing(this);
    }

    isDead() {
        return this.dead;
    }

    spawn(positioin: Phaser.Math.Vector2, status: MemeStatus) {
        this.dead = false;
        this.hp = 1;
        this.status = status;
        this.setScale(1);
        if (this.status.diversity > Phaser.Math.Between(0, 100)) {
            this.setScale(2);
            this.hp = 100;
        }
        this.speed = Phaser.Math.Between(status.speed * 10 + 50, status.speed * 10 + 100 );
        const targetX = Phaser.Math.Between(260, 460);
        const targetY = 150;
        this.setPosition(positioin.x, positioin.y);
        this.dir = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y).normalize();
        this.setActive(true).setVisible(true).setAlpha(1);
        if (!this.scene.children.exists(this)) {
            this.scene.add.existing(this);
        }
    }

    attacked(damage: number) {
        this.hp -= damage;
        if (this.hp <= 0) {
            // console.log("meme dead")
            this.dead = true;
            this.scene.events.emit("pop_wool", this.getWorldPoint(), this.status.price);
            this.setActive(false).setVisible(false);
        }
    }

    release() {
        this.hp = 0;
        this.dead = true;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1,
            duration: 1000,
            ease: "Cubic.easeIn",
            onComplete: () => {
                this.setActive(false).setVisible(false);
            }
        });
        
    }

    preUpdate(time: number, delta: number) {
        if (!this.dead) { 
            this.x += this.dir.x * this.speed * (delta / 1000);
            this.y += this.dir.y * this.speed * (delta / 1000);
           //  this.info.setText(`x:${Math.floor(this.x)}, y:${Math.floor(this.y)}`);
            if (this.y < 200) {
                this.release();
                this.particleEmitter.explode(8, this.x, this.y);
                this.scene.events.emit("damage_to_fortress", 1);
            }
        }
    }

    public static readonly List = [
        TextureKeys.KEY_MEME1,
        TextureKeys.KEY_MEME2,
        TextureKeys.KEY_MEME3,
        TextureKeys.KEY_MEME4,
        TextureKeys.KEY_MEME5,
        TextureKeys.KEY_MEME6
    ]
}