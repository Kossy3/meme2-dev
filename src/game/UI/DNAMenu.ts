import Phaser from 'phaser';

export class DNAMenu extends Phaser.GameObjects.Container {
    private openMenu: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene);
        const sprite = scene.make.image({key: 'dna'}).setScale(1) 
        this.add(sprite);
        sprite.setInteractive({ useHandCursor: true });

        this.openMenu = false;

        sprite.on("pointerdown", () => {
            if (!this.openMenu) {
                this.openMenu = true;
                scene.events.emit("dna_menu");
                sprite.setTexture("dna_mono");
            }
        });

        sprite.setData("isDnaPanel", true);

        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer , targets: Phaser.GameObjects.GameObject[]) => {
            if (!targets.some(obj => obj.getData("isDnaPanel"))) {
                scene.events.emit("dna_menu_close");
            }
        });

        scene.events.on("dna_menu_close", () => {
            this.openMenu = false;
            sprite.setTexture("dna");
        });

        scene.add.existing(this);
        this.setPosition(x, y);
        this.setScale(0.35);

    }

}