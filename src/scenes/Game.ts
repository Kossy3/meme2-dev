import {Meme} from '../game/Meme';
import Phaser from 'phaser';
import { Food} from '../game/Food';
import { Fortress } from '../game/Fortress';
import TextureKeys from "../game/TextureKeys";
import { Scene } from 'phaser';
import {HousePanel} from '../game/UI/HousePanel';
import { House } from '../game/House';
import { FeedManager } from '../game/FeedManager';
import {MemeManager} from '../game/MemeManager';
import { Weapon } from '../game/Weapon';
import { Bullet } from '../game/Bullet';
import { Wool } from '../game/Wool';
import {WoolManager} from '../game/WoolManager';
import {UpgradeMenu} from '../game/UI/UpgradeMenu';
import { Wallet } from '../game/Wallet';
import { StageClear } from '../game/UI/StageClear';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    private memePool: Phaser.GameObjects.Group;
    private day: Phaser.GameObjects.Text;
    private fortress: Fortress;
    private housePanel: HousePanel;

    constructor ()
    {
        super('Game');
    }

    preload()
    {
        this.load.setPath('public');
        this.load.image("bg", "assets/bg_ground.png");
        this.load.svg(TextureKeys.KEY_MEME1, "assets/meme/meme1.svg");
        this.load.svg(TextureKeys.KEY_MEME2, "assets/meme/meme2.svg");
        this.load.svg(TextureKeys.KEY_MEME3, "assets/meme/meme3.svg");
        this.load.svg(TextureKeys.KEY_MEME4, "assets/meme/meme4.svg");
        this.load.svg(TextureKeys.KEY_MEME5, "assets/meme/meme5.svg");
        this.load.svg(TextureKeys.KEY_MEME6, "assets/meme/meme6.svg");
        this.load.image(TextureKeys.KEY_HOUSE1, "assets/house/meme_house1_akichi.png");
        this.load.image(TextureKeys.KEY_HOUSE2, "assets/house/meme_house2_jukyo.png");
        this.load.image(TextureKeys.KEY_HOUSE3, "assets/house/meme_house3_wara.png");
        this.load.image(TextureKeys.KEY_HOUSE4, "assets/house/meme_house4_kaya.png");
        this.load.image(TextureKeys.KEY_HOUSE5, "assets/house/meme_house5_kominka.png");
        this.load.image(TextureKeys.KEY_HOUSE6, "assets/house/meme_house6_nagaya.png");
        this.load.image(TextureKeys.KEY_HOUSE7, "assets/house/meme_house7_purehabu.png");
        this.load.image(TextureKeys.KEY_HOUSE8, "assets/house/meme_house8.png");
        this.load.image(TextureKeys.KEY_HOUSE9, "assets/house/meme_house9_goutei.png");
        this.load.image(TextureKeys.KEY_HOUSE10, "assets/house/meme_house10_plant.png");
        this.load.image(TextureKeys.KEY_FIELD, "assets/牧場.png");
        this.load.image(TextureKeys.KEY_WEAPON1, "assets/弩.png");
        this.load.svg(TextureKeys.KEY_WEAPON2, "assets/ガトリング.svg");
        this.load.image(TextureKeys.KEY_BULLET1, "assets/矢.png");
        this.load.svg(TextureKeys.KEY_BULLET2, "assets/弾丸.svg");
        this.load.svg("upgrade", "assets/upgrade.svg");
        this.load.svg("upgrade2", "assets/upgrade2.svg");
        this.load.svg("upgrade_moji", "assets/upgrade_moji.svg");
        this.load.svg("upgrade_mono", "assets/upgrade_mono.svg");
        this.load.svg("coin", "assets/coin.svg");
        this.load.svg("blood", "assets/blood.svg");
        this.load.svg("wool", "assets/羊毛.svg");
        this.load.svg("sparkle", "assets/pikapika.svg");
        this.load.svg("wool", "assets/upgrade.svg");
        this.load.svg("sparkle", "assets/upgrade_moji.svg")
        this.load.image(TextureKeys.KEY_FORTRESS1, "assets/要塞1.svg");
        this.load.image(TextureKeys.KEY_FORTRESS2, "assets/要塞2.svg");
        this.load.image(TextureKeys.KEY_FORTRESS3, "assets/要塞3.svg");
        this.load.image(TextureKeys.KEY_FORTRESS4, "assets/要塞4.svg");
        this.load.image(TextureKeys.KEY_FORTRESS5, "assets/要塞5.svg");
        this.load.svg("close", "assets/close.svg");
        const images = [
            "gomi_ringo_shin",
            "gomi_banana_kawa",
            "vegetable_toumyou",
            "vegetable_zenmai",
            "vegetable_fukinotou",
            "vegetable_sayaendou",
            "vegetable_hatsuka_daikon",
            "vegetable_satoukibi",
            "vegetable_kureson",
            "vegetable_negi",
            "vegetable_maru_dansyaku",
            "vegetable_jinenjo",
            "vegetable_magaridake",
            "vegetable_renkon",
            "vegetable_ninjin",
            "vegetable_green_lettuce",
            "vegetable_komatsuna",
            "vegetable_nasu",
            "vegetable_cabbage2",
            "vegetable_romanesco",
            "vegetable_toumorokoshi"
        ]
        for (let i=0; i<images.length; i++) {
            this.load.image(`food${i+1}`,`assets/food/${images[i]}.png`);
        }
        this.load.image("food1", "assets/banana_kawa.png");
        this.load.image("food2", "assets/fruit_banana_black.png");
        // ここで必要なアセットをプリロード
        this.load.image('ground', 'assets/tilemaps/spritesheet.png');

    }

    create() {

        const mainCamera = this.cameras.main;
        const UICamera = this.cameras.add(0, 0, 720, 1280);
        const gameContainer = this.add.container(0, 0);
        const UIContainer = this.add.container(0, 0);
        gameContainer.setDepth(0);  // 背景用
        UIContainer.setDepth(1);
       
        
        mainCamera.ignore(UIContainer);
        UICamera.ignore(gameContainer);

        for (let y=-100; y< 1380; y +=140) {
            let bg = this.make.image({x:360, y:y, key:"bg", add:false});
            gameContainer.add(bg);
        }
        

        this.memePool = this.add.group({
            classType: Meme,
            maxSize: 200,
            runChildUpdate: true,
        });
        
        let memeManager = new MemeManager(this, this.memePool);

        const bulletGroup = this.add.group({
            classType: Bullet,
            maxSize: 20,
            runChildUpdate: true
        });
        

        const woolGroup = this.add.group({
            classType: Wool,
            maxSize: 100,
            runChildUpdate: true
        });
        
        const wallet = new Wallet(this, 480, 40).setScale(0.5);
        new WoolManager(this, woolGroup, wallet);

        this.fortress = new Fortress(this, 360, 150, memeManager, bulletGroup);
        

        gameContainer.add(this.fortress);
        gameContainer.add(this.memePool.getChildren());


        
        let houseList: House[] = []
        let food = null;
        for (let x=0; x < 720; x += 240) {
            for (let y=1130-480; y < 1130; y += 240) {
                if (x === 240 && y === 890) {
                    food = new Food(this, x+120, y+120, wallet);
                    food.setInteractive();
                    //food.setSize(240,240);
                    gameContainer.add(food);

                } else {
                    const house = new House(this, x+120, y+120, wallet);
                    house.setInteractive();
                    houseList.push(house);
                    
                    gameContainer.add(house);
                }
            }
        }

        this.housePanel = new HousePanel(this);
        this.housePanel.setPosition(720/2, 1280/2 );
        const feedManager = new FeedManager(this, houseList, food as Food);
        const upgradeMenu = new UpgradeMenu(this, 600, 1225);

        const clear = new StageClear(this);

        UIContainer.add([this.housePanel, feedManager, upgradeMenu, wallet, clear]);


        this.day = this.add.text(50, 10, ``, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#b60000ff',
            stroke: '#ff6464ff', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0.5);

        UIContainer.add([this.day]);

        this.events.on("destoroyed", (fortress: Fortress) => {
            console.log(fortress)
            this.changeScene();
        });
    }

    update() {
        this.day.setText(`FPS: ${this.game.loop.actualFps.toFixed(1)}`);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
