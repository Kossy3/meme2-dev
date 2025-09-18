import Phaser from "phaser";

export class StageClear extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene) {
        super(scene);
        // 2. STAGE CLEAR テキストを右から流す
        const text = this.scene.make.text({
            x:720 + 500,  
            y:640, 
            text:"STAGE CLEAR!", 
            style: {
                fontSize: "100px",
                color: "#FFD700",
                stroke: '#188100ff', strokeThickness: 10,
                fontStyle: "bold"
            }
        }).setOrigin(0.5);
        this.add(text);

        scene.events.on("stage_clear", () => {
            text.setPosition(720 + 500, 640);
            scene.tweens.add({
                targets: text,
                x: 360,
                duration: 500,
                ease: "Cubic.easeOut",
                onComplete : () => {
                    this.scene.time.delayedCall(500, () => {
                        scene.tweens.add({
                            targets: text,
                            x: -500,
                            duration: 500,
                            ease: "Cubic.easeOut",
                        });
                    });
                    
                }
            });
        })

        
    }
}