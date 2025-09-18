import Phaser from 'phaser';

export class UpgradeMenu extends Phaser.GameObjects.Container {
    private openMenu: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene);
        const sprite = scene.make.image({key: 'upgrade_moji'}).setScale(1) 
        this.add(sprite);
        sprite.setInteractive({ useHandCursor: true });

        this.openMenu = false;

        sprite.on("pointerdown", () => {
            if (!this.openMenu) {
                this.openMenu = true;
                scene.events.emit("upgrade_menu");
                sprite.setTexture("upgrade_mono");
            }
        });

        sprite.setData("isUpgradeButton", true);

        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer , targets: Phaser.GameObjects.GameObject[]) => {
            if (!targets.some(obj => obj.getData("isUpgradeButton"))) {
                scene.events.emit("upgrade_menu_close");
            }
        });

        scene.events.on("upgrade_menu_close", () => {
            this.openMenu = false;
            sprite.setTexture("upgrade_moji");
        });

        scene.add.existing(this);
        this.setPosition(x, y);
        this.setScale(0.35);

    }

}