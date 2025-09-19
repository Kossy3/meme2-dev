import Phaser from "phaser";

export class Wallet extends Phaser.GameObjects.Container {
  private coinSprite: Phaser.GameObjects.Image;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private money: number
  private moneyText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x:number, y:number) {
    super(scene);

    // 背景（白ピンク枠）
    const bg = scene.make.graphics();
    bg.fillStyle(0x726800, 0.3); // きいろ
    "#726800ff"
    bg.fillRoundedRect(-65, -60, 540, 120, 60);
    this.add(bg);

    // wool と coin のスプライト
    this.coinSprite = scene.make.image({x:0,key: "coin", add: false }).setScale(0.5)
    this.add([this.coinSprite]);

    // パーティクルを make で生成して Container に add
    this.particleEmitter = scene.make.particles({key:"sparkle", config:{
         x: 0, 
         y: 0, 
         speed: { min: 500, max: 800 }, 
         angle: { min: 0, max: 360 }, 
         lifespan: 200, 
         quantity: 8, 
         scale: { start: 0.15, end: 0.5 },
         frequency: -1  // 一度だけ発射する burst モード
         }, add: false});
    this.add(this.particleEmitter);

    this.money = 0;

    this.moneyText  = scene.make.text({x:450, y:0, text: `$${this.money}`, style:{
            fontFamily: 'Arial Black', fontSize: 100, color: '#d6c400ff',
            stroke: '#fff264ff', strokeThickness: 10,
            align: 'center'
        }}).setOrigin(1,0.5);
    this.add(this.moneyText);

    

    // Container をシーンに追加
    scene.add.existing(this);
    this.setPosition(x, y);
  }

    public earnMoney(price: number) {
      (async()=>this.particleEmitter.explode())();
      this.money += price;
      this.moneyText.setText(`$${this.money}`);
      this.scene.events.emit("change_money");
    }

    public getMoney() : number {
        return this.money;
    }

    public useMoney(price: number) {
        this.money -= price;
        this.moneyText.setText(`$${this.money}`);
        this.scene.events.emit("change_money");
    }

}