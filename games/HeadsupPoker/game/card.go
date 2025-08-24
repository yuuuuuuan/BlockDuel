package game

// Card 代表一张扑克牌
type Card struct {
    Rank string
    Suit string
}

// NewCard 创建一张新卡牌
func NewCard(rank, suit string) *Card {
    return &Card{Rank: rank, Suit: suit}
}
