// UpgradeMenu.ts
import Phaser from "phaser";
import {House} from "../House"
import { HouseData } from "../Types";

export class HousePanel extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private icon: Phaser.GameObjects.Image;
  private nameText: Phaser.GameObjects.Text;
  private capacityText: Phaser.GameObjects.Text;
  private costText: Phaser.GameObjects.Text;
  private upgradeBtn: Phaser.GameObjects.Container;
  private closeBtn: Phaser.GameObjects.Image;
  private visibleFlag = false;

  // レイアウト定数
  private static readonly BG_WIDTH = 500;
  private static readonly BG_HEIGHT = 500;
  private static readonly PADDING = 28;
  private static readonly ICON_SIZE = 100;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    // background
    this.bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, HousePanel.BG_WIDTH, HousePanel.BG_HEIGHT, 0x1e1e1e, 0.95)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x000000);
    this.add(this.bg);

    const top = -HousePanel.BG_HEIGHT/2 + HousePanel.PADDING
    const left = -HousePanel.BG_WIDTH/2 + HousePanel.PADDING

    // icon placeholder
    this.icon = scene.make.image({
      x:left + HousePanel.ICON_SIZE/2, 
      y: top + HousePanel.ICON_SIZE/2,
      key: "",
      add: false})
      .setVisible(false);
    this.add(this.icon);

    // name
    this.nameText = scene.make.text({
      x: left + HousePanel.ICON_SIZE + HousePanel.PADDING, 
      y: top,
      style: { fontSize: '40px', color: '#ffffff' },
      add: false });
    this.add(this.nameText);

    // capacity
    this.capacityText = scene.make.text({
      x: -HousePanel.BG_WIDTH/2 + 100,
      y: -6,
      style: { fontSize: '40px', color: '#cccccc' },
      add: false });
    this.add(this.capacityText);

    // cost
    this.costText = scene.make.text({
      x: -HousePanel.BG_WIDTH/2 + 100,
      y: 18, 
      style: { fontSize: '40px', color: '#ffd166' },
      add: false });
    this.add(this.costText);

    // upgrade button (container with bg + text)
    const btnW = 84;
    const btnH = 30;
    const btnBg = new Phaser.GameObjects.Rectangle(scene, 
      HousePanel.BG_WIDTH/2 - HousePanel.PADDING - btnW/2, 0, btnW, btnH, 0x2b8a3e)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    const btnText = scene.make.text({
      x: btnBg.x, 
      y: btnBg.y, 
      text: "Upgrade", 
      style: { fontSize: '13px', color: '#ffffff' },
      add: false})
      .setOrigin(0.5);
    this.upgradeBtn = scene.make.container({x:0, y:0, add: false});
    this.upgradeBtn.add([btnBg, btnText]);
    this.add(this.upgradeBtn);

    // close button (small X)
    const CLOSE_BTN_SIZE = 32;
    this.closeBtn = scene.make.image({
      x: HousePanel.BG_WIDTH/2 - 32,
      y: -HousePanel.BG_HEIGHT/2 + 32,
      key: 'close',
      add: false})
      .setDisplaySize(32, 32)
      .setInteractive({ useHandCursor: true });
    this.add(this.closeBtn);

    // interactive handlers
    btnBg.on('pointerup', () => this.onUpgradeClick());
    this.closeBtn.on('pointerup', () => this.hide(false));

    // 初期は非表示にしてシーンに追加
    this.setVisible(false);
   //  scene.add.existing(this);
    scene.events.on("show_HousePanel", (house: House, houseData:HouseData) =>{
      this.show(houseData);
    })

    // ドラッグやフォーカス挙動などを追加したければここに実装
  }

  // show at world coords (x,y)
  show(data: HouseData) {

    // set position — メニューが画面端からはみ出さない処理
    // let px = 360;
    // let py = 640;

    // this.setPosition(px, py);
    this.populate(data);

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

  private populate(data: HouseData) {
    // icon
    if (data.name) {
      this.icon.setTexture(data.name);
      this.icon.setVisible(true);
      this.icon.setDisplaySize(HousePanel.ICON_SIZE, HousePanel.ICON_SIZE)
    } else {
      this.icon.setVisible(false);
    }

    this.nameText.setText(data.name ?? "");
    this.capacityText.setText(`Capacity: ${data.capacity}`);
    this.costText.setText(`Cost: ${data.upgradeCost}`);

    // enable/disable upgrade button depending on player's funds
    const canAfford = this.checkPlayerCanAfford(data.upgradeCost);
    this.setUpgradeButtonEnabled(canAfford);
  }

  private checkPlayerCanAfford(cost: number) {
    // ここはゲームのステートに合わせて差し替える
    const playerMoney = (this.scene.registry.get('playerMoney') as number) ?? 0;
    return playerMoney >= cost;
  }

  private setUpgradeButtonEnabled(enabled: boolean) {
    const btnBg = this.upgradeBtn.list[0] as Phaser.GameObjects.Rectangle;
    const btnText = this.upgradeBtn.list[1] as Phaser.GameObjects.Text;

    if (enabled) {
      btnBg.setFillStyle(0x2b8a3e);
      btnBg.setInteractive({ useHandCursor: true });
      btnText.setColor('#ffffff');
    } else {
      btnBg.setFillStyle(0x666666);
      btnBg.disableInteractive();
      btnText.setColor('#cccccc');
    }
  }

  private onUpgradeClick() {
    // 確認コールバックを呼ぶ（支払いはコールバック側で行うのが柔軟）
    if (!this.visibleFlag) return;
    this.hide(true);
  }

  hide(accepted: boolean) {
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

  // optional: force update enable/disable if player's money changed while open
  refresh() {
    const costText = this.costText.text;
    const matches = costText.match(/Cost:\s*(\d+)/);
    if (matches) {
      const cost = Number(matches[1]);
      this.setUpgradeButtonEnabled(this.checkPlayerCanAfford(cost));
    }
  }
}
