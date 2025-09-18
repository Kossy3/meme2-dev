import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 720,
    height: 1280,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,        // ブラウザにフィットさせる
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, // 横・縦とも中央に配置
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0,  y: 0 }, 
            debug: false 
        }
    }
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });

}

export default StartGame;
