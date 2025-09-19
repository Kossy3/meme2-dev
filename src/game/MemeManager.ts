import Phaser from "phaser";
import { Meme } from "./Meme";
import { MemeStatus } from "./Types";

export class MemeManager extends Phaser.GameObjects.Container  {
    private memePool: Phaser.GameObjects.Group
    private activeMeme: Meme[] = [];
    private diversity: number;
    private speed: number;
    private price: number;
    
    constructor(scene: Phaser.Scene, memePool: Phaser.GameObjects.Group) {
        super(scene);
        this.memePool = memePool;
        scene.events.on("dispatch_meme", (position: Phaser.Math.Vector2, amount: number) => {
            for (let i=0; i<amount; i++) {
                const meme = memePool.get() as Meme;
                // ランダムに少しずつずらす
                const randomRange = 100;
                // 新しい座標
                const spawnPos = new Phaser.Math.Vector2(
                    position.x + Phaser.Math.Between(-randomRange, randomRange), 
                    position.y + Phaser.Math.Between(-randomRange, randomRange));
                meme?.spawn(spawnPos, {
                    diversity: this.diversity,
                    speed: this.speed,
                    price: this.price,
                });
            }
        });

        this.diversity = 1;
        this.speed = 1;
        this.price = 1;

        // setInterval(()=>{
        //     scene.events.emit("dispatch_meme", {x: 120, y:720}, 10);
        //     scene.events.emit("dispatch_meme", {x: 240, y:720}, 10);
        //     scene.events.emit("dispatch_meme", {x: 360, y:720}, 10);
        //     scene.events.emit("dispatch_meme", {x: 480, y:720}, 10);
        // }, 100)
    }

    public getUpgradeCost() :MemeStatus {
        const twoSign = (num: number): number  => {
          const factor = 10 ** (1 - Math.floor(Math.log10(Math.abs(num))));
          return Math.floor(num * factor) / factor;
        }
        let upgrades = this.diversity + this.speed + this.price / 3;
        return {
            diversity: twoSign(1.5  ** this.diversity * upgrades * 20),
            speed: twoSign(1.5 ** this.speed * upgrades * 20),
            price: twoSign(1.5 ** this.price * upgrades * 20),
        }
    }

    public getStatus() :MemeStatus {
        return {
            diversity: this.diversity,
            speed: this.speed,
            price: this.price,
        }
    }

    public upgradePrice(status: MemeStatus) {
        this.price += status.price;
        this.speed += status.speed;
        this.diversity  += status.diversity;

    }

    public getTargetMeme(range: number) : Meme | null {
        this.activeMeme = this.memePool.getMatching('active', true)
                           .filter((meme) => meme.getWorldPoint().y < range && !meme.isDead());
        // 近い奴優先
        if (this.activeMeme.length > 0) {
            const target = this.activeMeme.reduce((prev, curr) => (curr.y < prev.y ? curr : prev), this.activeMeme[0]);
            return target
        } else {
            return null;
        }
    }
}