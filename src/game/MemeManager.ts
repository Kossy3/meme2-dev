import Phaser from "phaser";
import { Meme } from "./Meme";

export class MemeManager extends Phaser.GameObjects.Container  {
    private memePool: Phaser.GameObjects.Group
    private activeMeme: Meme[] = []
    
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
                meme?.spawn(spawnPos);
            }
        });

        // setInterval(()=>{
        //     scene.events.emit("dispatch_meme", {x: 120, y:720}, 10);
        //     scene.events.emit("dispatch_meme", {x: 240, y:720}, 10);
        //     scene.events.emit("dispatch_meme", {x: 360, y:720}, 10);
        //     scene.events.emit("dispatch_meme", {x: 480, y:720}, 10);
        // }, 100)
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