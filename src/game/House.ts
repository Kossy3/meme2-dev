import Phaser from "phaser";
import { HouseData, FoodData } from "./Types";
import TextureKeys from "./TextureKeys";
import {Meme} from "./Meme"; 
import { Wallet } from "./Wallet";
const bar = 200;
const h = 30;
const pad = 5;
const bary = 120;

export class House extends Phaser.GameObjects.Container {
    private level: number 
    private currentHouse:HouseData
    private hosueImage: Phaser.GameObjects.Image
    private memeImage: Phaser.GameObjects.Image
    private foodAmount: number
    private barBg: Phaser.GameObjects.Graphics
    private barFill: Phaser.GameObjects.Graphics
    private upgradeButton: Phaser.GameObjects.Image
    private costText: Phaser.GameObjects.Text
    private canUpgrade: boolean

    constructor(scene: Phaser.Scene, x: number, y:number, wallet:Wallet) {
        super(scene, 0, 0);
        this.level = 0;
        this.foodAmount = 0;
        this.currentHouse = House.List[this.level];
        
        this.hosueImage = scene.make.image({x:0, y:20, key:this.currentHouse.name, add:false})
        .setDisplaySize(240, 200);
        this.memeImage = scene.make.image({x:40, y:40, key:Meme.List[0], add:false})
        .setScale(0.3);

        // 食事用の当たり判定
        this.setSize(240,240);
        this.setInteractive({ useHandCursor: true });

        // アップグレードボタン
        this.upgradeButton = scene.make.image({x:-60, y:40, key: "upgrade", add:false})
        .setDisplaySize(70, 70);
        this.upgradeButton.setInteractive({ useHandCursor: true });
        this.upgradeButton.setData("isUpgradeButton", true);
        this.upgradeButton.setActive(false).setVisible(false);

        // コスト表示
        this.costText  = scene.make.text({x:-60, y:90, text: `$${this.currentHouse.upgradeCost}`, style:{
            fontFamily: 'Arial Black', fontSize: 30, color: '#d6c400ff',
            stroke: '#827700ff', strokeThickness: 4,
            align: 'center'
        }}).setOrigin(0.5);
        this.costText.setActive(false).setVisible(false);


        this.add([this.hosueImage, this.memeImage, this.upgradeButton, this.costText]);

        this.upgradeButton.on("pointerdown", () => {
            scene.events.emit("upgrade_menu_close");
            // アップグレード
            if (this.canUpgrade) {
                wallet.useMoney(this.currentHouse.upgradeCost);
                this.upgrade();
                
            }
        });

        scene.events.on("upgrade_menu", () => {
            this.upgradeButton.setActive(true).setVisible(true);
            this.costText.setActive(true).setVisible(true);
            this.costText.setText(`$${this.currentHouse.upgradeCost}`);
            this.canUpgrade = wallet.getMoney() >= this.currentHouse.upgradeCost && this.level < House.List.length -1;
            if (this.canUpgrade) {
                this.upgradeButton.setTexture("upgrade");
            } else {
                this.upgradeButton.setTexture("upgrade2");
            }

        });

        scene.events.on("upgrade_menu_close", () => {
            this.upgradeButton.setActive(false).setVisible(false);
            this.costText.setActive(false).setVisible(false);
        });


        // 背景（白ピンク枠）
        
        this.barBg = scene.make.graphics();
        // 内側（パステルブルーのゲージ）
        this.barFill = scene.make.graphics();
        this.barBg.fillStyle(0xffc0cb, 1); // ピンク
        this.barBg.fillRoundedRect(-bar/2, bary, bar, h, h/2);
        this.barFill.fillStyle(0xadd8e6, 1); // 水色
        this.add(this.barBg);
        this.add(this.barFill);

        this.updateProgress(0);

        this.setPosition(x, y);

        // this.on("house_upgrade_menu", () => {

        // });

    }

    private upgrade() {
       
        this.level += 1;
        this.currentHouse = House.List[this.level];

        this.hosueImage.setTexture(this.currentHouse.name);
        this.foodAmount = 0;
        this.updateProgress(0);
    }

    private updateProgress(progress: number) {
        this.barFill.clear();
        const texture = Meme.List[Math.floor(progress * 6)];
        this.memeImage.setTexture(texture);
        this.barFill.fillStyle(0xadd8e6, 1); // 水色
        if ((bar-pad*2) * progress <= h - pad*2) {
            let a = (bar-pad*2) * progress
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
            this.barFill.fillRoundedRect( -(bar-pad*2)/2, pad + bary, (bar-pad*2) * progress, (h-pad*2), (h-pad*2)/2);
        }
        
    }

    public feed(foodData: FoodData) {
        this.foodAmount += foodData.calorie;
        if (this.foodAmount >= this.currentHouse.capacity * 10) {
            this.scene.events.emit("dispatch_meme", this.getWorldPoint(), this.currentHouse.capacity)
            this.foodAmount = 0;
        }
        this.updateProgress(this.foodAmount / (this.currentHouse.capacity * 10));
        
    }

    public static readonly List: HouseData[] = [
        {name: TextureKeys.KEY_HOUSE1, capacity:10, upgradeCost: 30},
        {name: TextureKeys.KEY_HOUSE2, capacity:2, upgradeCost: 60},
        {name: TextureKeys.KEY_HOUSE3, capacity:3, upgradeCost: 120},
        {name: TextureKeys.KEY_HOUSE4, capacity:4, upgradeCost: 250},
        {name: TextureKeys.KEY_HOUSE5, capacity:5, upgradeCost: 550},
        {name: TextureKeys.KEY_HOUSE6, capacity:6, upgradeCost: 1300},
        {name: TextureKeys.KEY_HOUSE7, capacity:8, upgradeCost: 3000},
        {name: TextureKeys.KEY_HOUSE8, capacity:10, upgradeCost: 8000},
        {name: TextureKeys.KEY_HOUSE9, capacity:15, upgradeCost: 20000},
        {name: TextureKeys.KEY_HOUSE10, capacity:20, upgradeCost: 50000},
    ];

}