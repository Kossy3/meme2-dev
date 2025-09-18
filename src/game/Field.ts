import Phaser from 'phaser';

export class Field extends Phaser.GameObjects.Container {
    private feed_interval: number = 5;
    private feed_amount: number = 20;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        const sprite = scene.add.image(360, 1000 - 360, 'field').setScale(2) 
        this.add(sprite);
        scene.add.existing(this);
    }

    turn() {
        if (this.scene.registry.get('day') % this.feed_interval === 0) {
            this.scene.registry.set('food', this.scene.registry.get('food') + this.feed_amount);
        }
    }

    isDead() {
        return false;
    }

    getInfo() {
        return `${this.feed_interval}日ごとに${this.feed_amount}餌`;
    }

}