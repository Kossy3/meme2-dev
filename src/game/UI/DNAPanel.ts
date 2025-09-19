// UpgradeMenu.ts
import Phaser from "phaser";
import { MemeManager} from "../MemeManager";
import TextureKeys from "../TextureKeys";
import { Wallet } from "../Wallet";
import { MemeStatus } from "../Types";

// レイアウト定数

const BG_WIDTH = 500;
const BG_HEIGHT = 500;
const PADDING = 40;
const ICON_SIZE = 150;
const BTN_SIZE = 70;

export class DNAPanel extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Image;
  private icon: Phaser.GameObjects.Image;
  private priceText: Phaser.GameObjects.Text;
  private speedText: Phaser.GameObjects.Text;
  private diversityText: Phaser.GameObjects.Text;
  private priceBtn: Phaser.GameObjects.Image;
  private speedBtn: Phaser.GameObjects.Image;
  private diversityBtn: Phaser.GameObjects.Image;
  private closeBtn: Phaser.GameObjects.Image;
  private visibleFlag = false;
  private memeManager: MemeManager;
  private wallet : Wallet;
  private cost: MemeStatus;
  private status : MemeStatus;


  constructor(scene: Phaser.Scene, memeManager: MemeManager, wallet: Wallet) {
    super(scene);

    this.memeManager = memeManager;
    this.wallet = wallet;

    // background
    this.bg = scene.make.image({key: "dna_bg",add: false})
      .setAlpha(0.7)
      .setDisplaySize(BG_WIDTH, BG_HEIGHT);
    this.setData("isDnaPanel", true);
    this.setSize(BG_WIDTH, BG_HEIGHT);
    this.setInteractive({ useHandCursor: true });
    this.add(this.bg);

    // icon placeholder
    this.icon = scene.make.image({
      x: PADDING + ICON_SIZE/2 - BG_WIDTH/2, 
      y: PADDING + ICON_SIZE/2 - BG_HEIGHT/2,
      key: TextureKeys.KEY_MEME6,
      add: false});
    this.icon.displayWidth = ICON_SIZE;
    this.icon.scaleY = this.icon.scaleX;
    this.add(this.icon);
    const FontSize = 40;
    // 毛並み
    {
      const Y = -40;
      const label = scene.make.text({
        x: -BG_WIDTH/2 + PADDING,
        y: Y - FontSize/2,
        text: "けなみ",
        style: { 
          fontFamily: 'Kiwi Maru', fontSize: FontSize, fontStyle: "bold", color: '#ffd166' ,
          stroke: '#827700ff', strokeThickness: 4,},
        add: false });
      this.priceText  = scene.make.text({
        x: BG_WIDTH/2 - PADDING - BTN_SIZE -10, 
        y: Y,
        text: `$0`,
        style:{
          fontFamily: 'Arial Black', fontSize: FontSize, color: '#ffd166',
          stroke: '#827700ff',fontStyle: "bold", strokeThickness: 4,
          align: 'center'
        },
        add:false}).setOrigin(1,0.5);
      // アップグレードボタン
      const button = scene.make.image({x:BG_WIDTH/2 - PADDING - BTN_SIZE/2, y:Y, key: "upgrade", add:false})
        .setDisplaySize(BTN_SIZE, BTN_SIZE)
        .setData("isDnaPanel", true)
        .setInteractive({ useHandCursor: true });
      button.on("pointerdown", () => {
        if (button.texture.key == "upgrade") {
          this.memeManager.upgradePrice({price:1, speed:0, diversity:0});
          this.wallet.useMoney(this.cost.price);
        }
      })
      this.priceBtn = button;
      
      this.add([this.priceText, label, button]);
    }

    // はやさ
    {
      const Y = 40;
      const label = scene.make.text({
        x: -BG_WIDTH/2 + PADDING,
        y: Y - FontSize/2,
        text: "はやさ",
        style: { 
          fontFamily: 'Kiwi Maru', fontSize: FontSize, fontStyle: "bold", color: '#ffd166' ,
          stroke: '#827700ff', strokeThickness: 4,},
        add: false });
      this.speedText  = scene.make.text({
        x: BG_WIDTH/2 - PADDING - BTN_SIZE -10, 
        y: Y,
        text: `$0`,
        style:{
          fontFamily: 'Arial Black', fontSize: FontSize, color: '#ffd166',
          stroke: '#827700ff',fontStyle: "bold", strokeThickness: 4,
          align: 'center'
        },
        add:false}).setOrigin(1,0.5);
      // アップグレードボタン
      const button = scene.make.image({x:BG_WIDTH/2 - PADDING - BTN_SIZE/2, y:Y, key: "upgrade", add:false})
        .setDisplaySize(BTN_SIZE, BTN_SIZE)
        .setData("isDnaPanel", true)
        .setInteractive({ useHandCursor: true });
      button.on("pointerdown", () => {
        if (button.texture.key == "upgrade") {
          this.memeManager.upgradePrice({price:0, speed:1, diversity:0});
          this.wallet.useMoney(this.cost.speed);
        }
      })
      this.speedBtn = button;
      
      this.add([this.speedText, label, button]);
    }

    // 多様性
    {
      const Y = 120;
      const label = scene.make.text({
        x: -BG_WIDTH/2 + PADDING,
        y: Y - FontSize/2,
        text: "多様性",
        style: { 
          fontFamily: 'Kiwi Maru', fontSize: FontSize, fontStyle: "bold", color: '#ffd166' ,
          stroke: '#827700ff', strokeThickness: 4,},
        add: false });
      this.diversityText  = scene.make.text({
        x: BG_WIDTH/2 - PADDING - BTN_SIZE -10, 
        y: Y,
        text: `$0`,
        style:{
          fontFamily: 'Arial Black', fontSize: FontSize, color: '#ffd166',
          stroke: '#827700ff',fontStyle: "bold", strokeThickness: 4,
          align: 'center'
        },
        add:false}).setOrigin(1,0.5);
      // アップグレードボタン
      const button = scene.make.image({x:BG_WIDTH/2 - PADDING - BTN_SIZE/2, y:Y, key: "upgrade", add:false})
        .setDisplaySize(BTN_SIZE, BTN_SIZE)
        .setData("isDnaPanel", true)
        .setInteractive({ useHandCursor: true });
      button.on("pointerdown", () => {
        if (button.texture.key == "upgrade") {
          this.memeManager.upgradePrice({price:0, speed:0, diversity:1});
          this.wallet.useMoney(this.cost.diversity);
        }
      })
      this.diversityBtn = button;
      
      this.add([this.diversityText, label, button]);
    }
    
    // this.upgradeButton.setInteractive({ useHandCursor: true });
    // this.upgradeButton.setData("isUpgradeButton", true);
    // this.upgradeButton.setActive(false).setVisible(false);

    // close button (small X)
    const CLOSE_BTN_SIZE = 32;
    this.closeBtn = scene.make.image({
      x: BG_WIDTH/2 - CLOSE_BTN_SIZE * 2,
      y: -BG_HEIGHT/2 + CLOSE_BTN_SIZE * 2,
      key: 'close',
      add: false})
      .setDisplaySize(CLOSE_BTN_SIZE, CLOSE_BTN_SIZE)
      .setInteractive({ useHandCursor: true });
    this.add(this.closeBtn);

    this.closeBtn.on('pointerup', () => scene.events.emit("dna_menu_close"));
    scene.events.on("dna_menu_close", ()=> this.hide());

    // 初期は非表示にしてシーンに追加
    this.setVisible(false);
   //  scene.add.existing(this);
    scene.events.on("dna_menu", () =>{
      this.show();
    })

    scene.events.on("change_money", ()=> {
      this.populate();
    })
    // ドラッグやフォーカス挙動などを追加したければここに実装
  }

  // show at world coords (x,y)
  show() {
    this.populate();

    // show with small pop animation
    this.setScale(0.8);
    this.setAlpha(0);
    this.setVisible(true);
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      alpha: 1,
      ease: 'Back.easeOut',
      duration: 180,
    });

    this.visibleFlag = true;
  }

  private populate() {
    const cost = this.memeManager.getUpgradeCost();
    const status = this.memeManager.getStatus();
    const money = this.wallet.getMoney();
    if (cost.price <= money) {
      this.priceBtn.setTexture("upgrade");
    } else {
      this.priceBtn.setTexture("upgrade2");
    } 
    if (cost.speed <= money) {
      this.speedBtn.setTexture("upgrade");
    } else {
      this.speedBtn.setTexture("upgrade2");
    } 
    if (cost.diversity <= money) {
      this.diversityBtn.setTexture("upgrade");
    } else {
      this.diversityBtn.setTexture("upgrade2");
    } 
    this.priceText.setText(`$${cost.price}`);
    this.speedText.setText(`$${cost.speed}`);
    this.diversityText.setText(`$${cost.diversity}`);

    this.cost = cost;
    this.status = status;
    // enable/disable upgrade button depending on player's funds
    
  }

  hide() {
    if (!this.visibleFlag) return;
    this.visibleFlag = false;

    // closeアニメーション
    this.scene.tweens.add({
      targets: this,
      scale: 0.9,
      alpha: 0,
      duration: 140,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.setVisible(false);
        this.setScale(1);

      }
    });
  }

}
