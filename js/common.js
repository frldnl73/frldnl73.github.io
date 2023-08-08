export const WIN_CARDS_MAX = 40;
export const HAND_CARDS = 3;
export const CARDS_IN_THE_DECK = 40;
export const SUITS_COUNT = 4;
export const RANKS_COUNT = 10;
export const CANVAS_WIDTH = 600; 
export const CANVAS_HEIGHT = 600;

export const Suit = Object.freeze({
      Hearts: 0,
      Diamonds: 1,
      Clubs: 2,
      Spades: 3,
      NoSuit: 4
})

export const Rank = Object.freeze({
      Two: 0,
      Four: 2,
      Five: 3,
      Six: 4,
      Seven: 5,
      Eight: 9,
      Nine: 10,
      Ten: 11,
      Three: 1,
      One: 12,
      NoRank: 13,
      HighestRank: 99
})

export const GameState = Object.freeze({
      WaitingForPlayersToPlayCard: 0,
      WaitingForPlayersToPlayCard_delay: 1,
      CheckCardsPlayed: 2,
      ShowOutcomePlay: 3,
      WaitingForPlayersToPickCard: 4,
      ShowOutcomeGame: 5,
      ShowOutcomePlay_delay: 6
})

export function Card () {
      this.suit = null;
      this.rank = null;
}

export function RankScore () {
      this.rank = null;
      this.score = -1;
}

export function getRankValue (rank) {
    if (rank == Rank.One) {
        return 10;
    } else if (rank == Rank.Two) {
        return 1;
    } else if (rank == Rank.Three) {
        return 9;
    } else if (rank == Rank.Four) {
        return 2;
    } else if (rank == Rank.Five) {
        return 3;
    } else if (rank == Rank.Six) {
        return 4;
    } else if (rank == Rank.Seven) {
        return 5;
    } else if (rank == Rank.Eight) {
        return 6;
    } else if (rank == Rank.Nine) {
        return 7;
    } else if (rank == Rank.Ten) {
        return 8;
    } else if (rank == Rank.HighestRank) {
        return 99;
    }
    return -1;
}

export function getRankScore (rank) {
    if (rank == Rank.One) {
        return 11;
    } else if (rank == Rank.Three) {
        return 10;
    } else if (rank == Rank.Eight) {
        return 2;
    } else if (rank == Rank.Nine) {
        return 3;
    } else if (rank == Rank.Ten) {
        return 4;
    }
    return 0;
}

