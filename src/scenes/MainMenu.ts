import { GameObjects, Scene } from 'phaser';

import { EventBus } from './EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(360, 1000, 'background');
        this.logo = this.add.image(360, 600, 'logo').setDepth(100).setInteractive();
        this.logo.on("pointerover",() => {
            this.tweens.add({
                targets: this.logo,
                scale: 1.2,
                angle: 5,
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        this.logo.on("pointerdown", () => this.changeScene() );
        this.logo.on("pointerout", () => {
            this.tweens.killTweensOf(this.logo);
            this.logo.setScale(1);
            this.logo.setAngle(0);
        });

        this.title = this.add.text(360, 450, 'タイトル', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#b60000ff',
            stroke: '#ff6464ff', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
