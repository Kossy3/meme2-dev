import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({}, ref)
{
    const game = useRef<Phaser.Game | null>(null!);
    const key = import.meta.hot ? Date.now() : "static-key";

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {

            game.current = StartGame("game-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref, key]);

    return (
        <div id="game-container"></div>
    );

});
