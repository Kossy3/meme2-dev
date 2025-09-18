import Phaser from "phaser";
import { FoodData } from "./Types";
import { Wallet } from "./Wallet";
import TextureKeys from "./TextureKeys";

export class Food extends Phaser.GameObjects.Container {
    private level: number 
    private currentFood :FoodData
    private foodArea: Phaser.GameObjects.Image
    private upgradeButton: Phaser.GameObjects.Image
    private canUpgrade: boolean
    private costText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y:number,  wallet:Wallet) {
        super(scene);
        this.level = 0;
        this.currentFood = Food.List[this.level];
        
        this.foodArea = scene.make.image({y:20, key: this.currentFood.name, add: false})
        .setDisplaySize(240, 200);

        // アップグレードボタン
        this.upgradeButton = scene.make.image({x:-60, y:40, key: "upgrade", add:false})
        .setDisplaySize(70, 70);
        this.upgradeButton.setInteractive({ useHandCursor: true });
        this.upgradeButton.setData("isUpgradeButton", true);
        this.upgradeButton.setActive(false).setVisible(false);

        this.costText  = scene.make.text({x:-60, y:90, text: `$${this.currentFood.upgradeCost}`, style:{
            fontFamily: 'Arial Black', fontSize: 30, color: '#d6c400ff',
            stroke: '#827700ff', strokeThickness: 4,
            align: 'center'
        }}).setOrigin(0.5);
        this.costText.setActive(false).setVisible(false);

        this.add([this.foodArea, this.upgradeButton, this.costText]);

        this.upgradeButton.on("pointerdown", () => {
            scene.events.emit("upgrade_menu_close");
            // アップグレード
            if (this.canUpgrade) {
                wallet.useMoney(this.currentFood.upgradeCost);
                this.upgrade();
                
            }
        });

        scene.events.on("upgrade_menu", () => {
            this.upgradeButton.setActive(true).setVisible(true);
            this.costText.setActive(true).setVisible(true);
            this.costText.setText(`$${this.currentFood.upgradeCost}`);
            this.canUpgrade = wallet.getMoney() >= this.currentFood.upgradeCost && this.level < Food.List.length -1;;
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


        this.setSize(240,240);

        this.setPosition(x, y);
    }

    private upgrade() {
       
        this.level += 1;
        this.currentFood = Food.List[this.level];

        this.foodArea.setTexture(this.currentFood.name);
    }

    public getCurrentFood(): FoodData {
        return this.currentFood;
    }
    
    public static List: FoodData[] = [
        {name: "food1", calorie: 1000, upgradeCost: 30},
        {name: "food2", calorie: 2, upgradeCost: 50},
        {name: "food3", calorie: 3, upgradeCost: 80},
        {name: "food4", calorie: 4, upgradeCost: 120},
        {name: "food5", calorie: 5, upgradeCost: 180},
        {name: "food6", calorie: 6, upgradeCost: 270},
        {name: "food7", calorie: 7, upgradeCost: 400},
        {name: "food8", calorie: 8, upgradeCost: 600},
        {name: "food9", calorie: 9, upgradeCost: 900},
        {name: "food10", calorie: 10, upgradeCost: 1400},
        {name: "food11", calorie: 11, upgradeCost: 2100},
        {name: "food12", calorie: 12, upgradeCost: 3200},
        {name: "food13", calorie: 13, upgradeCost: 4800},
        {name: "food14", calorie: 14, upgradeCost: 7200},
        {name: "food15", calorie: 15, upgradeCost: 11000},
        {name: "food16", calorie: 16, upgradeCost: 16000},
        {name: "food17", calorie: 17, upgradeCost: 24000},
        {name: "food18", calorie: 18, upgradeCost: 36000},
        {name: "food19", calorie: 19, upgradeCost: 48000},
        {name: "food20", calorie: 20, upgradeCost: 72000},
        {name: "food21", calorie: 100, upgradeCost: 100000},

    ]
}