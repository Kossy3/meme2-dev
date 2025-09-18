import Phaser from "phaser";
import { Wallet } from "./Wallet";

export class Wool extends Phaser.GameObjects.Container {
  private woolSprite: Phaser.GameObjects.Image;
  private coinSprite: Phaser.GameObjects.Image;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private collected: boolean;
  private price: number

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    // wool と coin のスプライト
    this.woolSprite = scene.make.image({ x: 0, y: 0, key: "wool", add: false }).setScale(1);
    this.coinSprite = scene.make.image({ x: 0, y: 0, key: "coin", add: false }).setScale(0).setVisible(false).setActive(false);
    this.add([this.woolSprite, this.coinSprite]);

    // パーティクルを make で生成して Container に add
    this.particleEmitter = this.scene.make.particles({x:0, y:0, key:"sparkle", config:{
         x: 0, 
         y: 0, 
         speed: { min: 200, max: 300 }, 
         angle: { min: 0, max: 360 }, 
         lifespan: 200, 
         quantity: 8, 
         scale: { start: 0.05, end: 0.3 },
         frequency: -1  // 一度だけ発射する burst モード
         }, add: false});
    this.add(this.particleEmitter);
    this.collected = false;

    // Container をシーンに追加
    scene.add.existing(this);
  }

  public pop(pos: Phaser.Math.Vector2, price: number) {
    this.price = price;
    this.collected = false;
    this.setPosition(pos.x, pos.y);
    this.setAlpha(0.5);

    this.woolSprite
        .setVisible(true)
        .setActive(true)
        .setScale(1); // これで元の大きさに戻す

    this.coinSprite
        .setVisible(false)
        .setActive(false)
        .setScale(0);
  }

  public isCollected  () :boolean{
    return this.collected;
  }

  public collect(wallet: Wallet) {
    this.collected = true;

    this.scene.tweens.add({
        targets: this.woolSprite,
        scale: 0,
        duration: 75,
        onComplete: () => {
            // coin に差し替え
            this.woolSprite.setVisible(false).setActive(false);
            this.coinSprite.setVisible(true).setActive(true);
            // キラキラ演出（再利用可能）
            // (async()=>this.particleEmitter.explode())();
            this.setAlpha(1);
            this.scene.tweens.add({
                targets: this.coinSprite,
                scale: 0.2,
                duration: 75,
                onComplete: () => {

                    const startY = this.y;
                    // const startX = this.x;
                    // const endX = wallet.x;
                    const endY = wallet.y;
                    // 財布に吸い込む
                    this.scene.tweens.add({
                        targets: this,
                        x: wallet.x,
                        y: wallet.y,
                        scale: 0.5,
                        duration: 600,
                        onUpdate: (tween) => {
                            const progress = tween.progress; // 0〜1
                            // Y方向の減速カーブ（例: easeOutQuad）
                            this.y = startY + (endY - startY) * (1 - Math.pow(1 - progress, 2));
                        },
                        onComplete: () => {
                            // 破棄せず非アクティブ化
                            this.scene.events.emit("get_money", );
                            wallet.earnMoney(this.price);
                            this.setVisible(false).setActive(false);
                        }
                    });
                }
            });
        }
    });
  }
}
