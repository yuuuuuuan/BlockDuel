package main

import (
    "fmt"
    "log"
    "game"
    "github.com/hajimehoshi/ebiten/v2"
)

var (
    player *game.Player
    deck   *game.Deck
)

func init() {
    player = game.NewPlayer("Player 1")
    deck = game.NewDeck()
}

func update(screen *ebiten.Image) error {
    // 游戏逻辑：比如发牌
    if len(player.Hand) < 2 {
        // 玩家初始两张手牌
        player.AddCard(deck.Deal())
        player.AddCard(deck.Deal())
    }
    
    // 渲染
    game.UIRender(screen, player, deck)
    return nil
}

func main() {
    ebiten.SetWindowSize(800, 600)
    ebiten.SetWindowTitle("单人德州扑克")
    
    if err := ebiten.RunGame(&ebiten.Game{
        Update: update,
        Draw:   update,
        Layout: func(w, h int) (int, int) {
            return w, h
        },
    }); err != nil {
        log.Fatal(err)
    }
}
