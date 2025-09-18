import Phaser from "phaser";
import {Food} from "./Food";
import {House} from "./House"

export class FeedManager extends Phaser.GameObjects.Container {
    private food: Food;
    private foodCursor: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, houseList: House[], food: Food) {
        super(scene);
        this.food = food;

        this.foodCursor = scene.make.image({key:food.getCurrentFood().name, add:false});
        this.add(this.foodCursor);
        this.foodCursor.setVisible(false);

        food.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.foodCursor.setPosition(pointer.x, pointer.y)
            this.foodCursor.setTexture(this.food.getCurrentFood().name)
            this.foodCursor.setVisible(true);
        });

        scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.foodCursor.visible) {
                this.foodCursor.setPosition(pointer.x, pointer.y);
            }
        });
        scene.sys.game.canvas.addEventListener('mouseleave', () => {
            this.foodCursor.setVisible(false);
        });

        
        scene.input.on('pointerup', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
            if (this.foodCursor.visible) {
                this.foodCursor.setVisible(false);
                for (let house of houseList) {
                    if (gameObjects.includes(house)) {
                        house.feed(food.getCurrentFood());
                    }
                    
                }
            }
        });
    }
}