import {Wool} from "./Wool";
import { Wallet } from "./Wallet";
import Phaser from "phaser";

export class WoolManager {

    constructor(scene: Phaser.Scene, woolGroup: Phaser.GameObjects.Group, wallet: Wallet) {
        

        scene.events.on("pop_wool", (pos: Phaser.Math.Vector2, price: number) => {
            const wool = woolGroup.get() as Wool;
            if (!wool) return; // maxSize超えたら出せない
            wool.pop(pos, price);
            wool.setActive(true).setVisible(true).setScale(2);
        });

        scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            const radius = 80;
            const r2 = radius * radius;

            (woolGroup.getChildren() as Wool[]).forEach((wool: Wool) => {
                if (!wool.active || wool.isCollected()) return;

                const dx = wool.x - pointer.x;
                const dy = wool.y - pointer.y;
                if (dx * dx + dy * dy <= r2) {
                    wool.collect(wallet);
                }
            });
        });
    }
}