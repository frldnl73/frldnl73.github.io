import * as common from './common.js'

export class Player {
    constructor () {
        this.win = [];
        for (let i=0; i < common.WIN_CARDS_MAX; i++) {
            this.win [i] = new common.Card ();
            this.win [i].suit = common.Suit.NoSuit;
            this.win [i].rank = common.Rank.NoRank;
        }
        this.hand = [];
        for (let i=0; i < common.HAND_CARDS; i++) {
            this.hand [i] = new common.Card ();
            this.hand [i].suit = common.Suit.NoSuit;
            this.hand [i].rank = common.Rank.NoRank;
        }
        this.robot = false;
        this.ranksWithScore_count = 5;
        this.ranksWithScore = [];
        for (let i=0; i < this.ranksWithScore_count; i++) {
            this.ranksWithScore [i] = new common.RankScore ();
        }
        this.ranksWithScore [0].rank = common.Rank.One;   this.ranksWithScore [0].score = 11;
        this.ranksWithScore [1].rank = common.Rank.Three; this.ranksWithScore [1].score = 10;
        this.ranksWithScore [2].rank = common.Rank.Ten;   this.ranksWithScore [2].score = 4;
        this.ranksWithScore [3].rank = common.Rank.Nine;  this.ranksWithScore [3].score = 3;
        this.ranksWithScore [4].rank = common.Rank.Eight; this.ranksWithScore [4].score = 2;
    }

    newGame () {
        for (let i=0; i < common.WIN_CARDS_MAX; i++) {
            this.win [i].suit = common.Suit.NoSuit;
            this.win [i].rank = common.Rank.NoRank;
        }
        for (let i=0; i < common.HAND_CARDS; i++) {
            this.hand [i].suit = common.Suit.NoSuit;
            this.hand [i].rank = common.Rank.NoRank;
        }    
    }

    newHand () {
        for (let i=0; i < common.HAND_CARDS; i++) {
            this.hand [i].suit = common.Suit.NoSuit;
            this.hand [i].rank = common.Rank.NoRank;
        }        
    }

    receiveHandCard (card) {
        let i;
        for (i=0; i < common.HAND_CARDS && this.hand [i].suit != common.Suit.NoSuit; i++);
        if (i < common.HAND_CARDS) {
            this.hand [i].suit = card.suit;
            this.hand [i].rank = card.rank;
        }
    }

    receiveWinCard (card) {
        let i;
        for (i=0; i < common.WIN_CARDS_MAX && this.win [i].suit != common.Suit.NoSuit; i++);
        if (i < common.WIN_CARDS_MAX) {
            this.win [i].suit = card.suit;
            this.win [i].rank = card.rank;
        }
    }

    playCard (indCardSelected, card, firstToPlay, playedCards, suitCardPlayedFirst, rankCardPlayedFirst, briscola, lastCardPicked) {
        if (this.robot) {
            this.robotPlayCard (indCardSelected, card, firstToPlay, playedCards, suitCardPlayedFirst, rankCardPlayedFirst, briscola, lastCardPicked);
        } else {
            if (indCardSelected > -1 && indCardSelected < common.HAND_CARDS) {
                card.suit = this.hand [indCardSelected].suit; card.rank = this.hand [indCardSelected].rank;
                this.hand [indCardSelected].suit = common.Suit.NoSuit; this.hand [indCardSelected].rank = common.Rank.NoRank;
            } else {
                card.suit = common.Suit.NoSuit; card.rank = common.Rank.NoRank;
            }
        }
    }

    noMoreCardsInHand () {
        for (let i=0; i < common.HAND_CARDS; i++) {
            if (this.hand [i].suit != common.Suit.NoSuit) {
                return false;
            }
        }
        return true;
    }

    getHandCard (card, ind) {
        card.suit = this.hand [ind].suit; card.rank = this.hand [ind].rank; 
    }

    getCardsWon (card, ind) {
        card.suit = this.win [ind].suit; card.rank = this.win [ind].rank; 
    }

    setPlayerASRobot () {
        this.robot = true;
    }

    robotPlayCard (indCardSelected, card, firstToPlay, playedCards, suitCardPlayedFirst, rankCardPlayedFirst, briscola, lastCardPicked) {
        console.log ("robot plays card, first to play, briscola -> " + firstToPlay + ", " + briscola);
        for (let i=0; i < common.HAND_CARDS; i++) {
             console.log ("robot plays card, card in hands -> " + this.hand [i].suit, "-" + this.hand [i].rank );
        }

        if (firstToPlay) {

//if briscolas played + briscolas in hand + briscola at the bottom of deck = 10 and robot has ace or threes that are not briscola, play them
            let briscolaPlayedCount = 0;
            for (let i=0; i < common.HAND_CARDS; i++) {
                if (this.hand [i].suit == briscola) briscolaPlayedCount++;
            }
            for (let i=0; i < common.CARDS_IN_THE_DECK; i++) {
                if (playedCards [i].suit == briscola) briscolaPlayedCount++;
            }
            if ( (lastCardPicked && briscolaPlayedCount == 10) || (!lastCardPicked && briscolaPlayedCount == 9) ) {
                for (let i=0;  i < common.HAND_CARDS; i++) {
                    if ( this.hand [i].suit != briscola && (this.hand [i].rank == common.Rank.Ten || this.hand [i].rank == common.Rank.One) ) {
                        card.suit = this.hand [i].suit; card.rank = this.hand [i].rank;
                        this.hand [i].suit = common.Suit.NoSuit; this.hand [i].rank = common.Rank.NoRank;
                        console.log ("robot play 1, 0 suit-rank -> " + card.suit + "-" + card.rank);
                        return;
                    }
                }                
            }

//play card (J or Q or K), if they are not briscola, if no ACE or THREE of the same suit are available
            for (let i=0; i < common.HAND_CARDS; i++) {
                if ( this.hand [i].suit != briscola && 
                    (this.hand [i].rank == common.Rank.Eight || this.hand [i].rank == common.Rank.Nine || this.hand [i].rank == common.Rank.Ten) ) {
                    let acePlayed = false; let threePlayed = false;
                    for (let j=0; j < common.CARDS_IN_THE_DECK; j++) {
                        if (playedCards [j].suit == this.hand [i].suit && playedCards [j].rank == common.Rank.One) acePlayed = true;
                        if (playedCards [j].suit == this.hand [i].suit && playedCards [j].rank == common.Rank.Three) threePlayed = true;
                    }
                    if (acePlayed && threePlayed) {
                        card.suit = this.hand [i].suit; card.rank = this.hand [i].rank;
                        this.hand [i].suit = common.Suit.NoSuit; this.hand [i].rank = common.Rank.NoRank;
                        console.log ("robot play 2, 0 suit-rank -> " + card.suit + "-" + card.rank);
                        return;
                    }
                }
            }                

//play card (J or Q or K), that is no briscola, with the lowest number of ACE THREE of the same SUIT still available; if more than one card qualifies, 
//play the card with the lowest number of  higher ranked cards of the same suit that are still available
            let candidate_aceThreeRemainingCount = 99; let candidate_cardsHighestRankedRemaining = 99; let candidate_ind = -1; 
            for (let i=0; i < common.HAND_CARDS; i++) {
                if ( this.hand [i].suit != briscola && 
                    (this.hand [i].rank == common.Rank.Eight || this.hand [i].rank == common.Rank.Nine || this.hand [i].rank == common.Rank.Ten) ) {
                    let aceThreePlayedCount = 0; let cardsHighestRankedPlayed = 0;
                    for (let j=0; j < common.CARDS_IN_THE_DECK; j++) {
                        if (playedCards [j].suit == this.hand [i].suit && 
                            (playedCards [j].rank == common.Rank.One || playedCards [j].rank == common.Rank.Three) ) aceThreePlayedCount++;
                        if (playedCards [j].suit == this.hand [i].suit && 
                            common.getRankValue (playedCards [j].rank) > common.getRankValue (this.hand [i].rank) ) cardsHighestRankedPlayed++;
                    }
                    if ( 2 - aceThreePlayedCount < candidate_aceThreeRemainingCount) {
                        candidate_aceThreeRemainingCount = 2 - aceThreePlayedCount;
                        candidate_cardsHighestRankedRemaining = 10 - common.getRankValue(this.hand [i].rank) - cardsHighestRankedPlayed;
                        candidate_ind = i;
                    } else if ( 2 - aceThreePlayedCount == candidate_aceThreeRemainingCount ) {
                        if (10 - common.getRankValue(this.hand [i].rank) - cardsHighestRankedPlayed < candidate_cardsHighestRankedRemaining) {
                            candidate_cardsHighestRankedRemaining = 10 - common.getRankValue(this.hand [i].rank) - cardsHighestRankedPlayed;
                            candidate_ind = i;
                        }
                    }
                }
            }          
            if (candidate_ind > -1) {
                console.log ("robot play 3, 0 suit-rank, ind -> " + this.hand [candidate_ind].suit + "-" + this.hand [candidate_ind].rank + ", " + candidate_ind);
                card.suit = this.hand [candidate_ind].suit; card.rank = this.hand [candidate_ind].rank;
                this.hand [candidate_ind].suit = common.Suit.NoSuit; this.hand [candidate_ind].rank = common.Rank.NoRank;
                console.log ("robot play 3, 1 suit-rank, ind -> " + card.suit + "-" + card.rank + ", " + candidate_ind);
                return;
            }      

//play card, no briscola, with the risk of lowest score based on remaining cards
            let lowestPotentialScore = 99; let lowestPotentialScoreInd = -1;
            for (let i=0; i < common.HAND_CARDS; i++) {
                if ( this.hand [i].suit != briscola && this.hand [i].suit != common.Suit.NoSuit) {
                    let potentialScore = 0;
                    for (let j=0; j < this.ranksWithScore_count; j++) {
                        for (let z=0; z < common.CARDS_IN_THE_DECK; z++) {
                            if (playedCards [z].suit == this.hand [i].suit && playedCards [z].rank == this.ranksWithScore[j].rank) {
                            } else {
                                potentialScore += this.ranksWithScore[j].score;
                                z = common.CARDS_IN_THE_DECK;
                            }
                        }
                    }
                    if (this.hand [i].rank != common.Rank.One && this.hand [i].rank != common.Rank.Three) {
                        if (potentialScore < lowestPotentialScore) {
                            lowestPotentialScore = potentialScore; lowestPotentialScoreInd = i;
                        }
                    }
                }
            } 
            let briscola_count = 0;
            for (let i=0; i < common.HAND_CARDS; i++) {
                if (this.hand [i].suit == briscola) briscola_count++;
            }
            if ( (lowestPotentialScoreInd > -1 && lowestPotentialScore < 10) || (lowestPotentialScoreInd > -1 && briscola_count < 2) ) {
                card.suit = this.hand [lowestPotentialScoreInd].suit; card.rank = this.hand [lowestPotentialScoreInd].rank;
                this.hand [lowestPotentialScoreInd].suit = common.Suit.NoSuit; this.hand [lowestPotentialScoreInd].rank = common.Rank.NoRank;
                console.log ("robot play 4, 0 suit-rank -> " + card.suit + "-" + card.rank);
                return;
            }         

//play the lowest briscola
            let lowestBriscola = common.Rank.HighestRank; let lowestBriscolaInd = -1;
            for (let i=0; i < common.HAND_CARDS; i++) {
                if ( this.hand [i].suit == briscola) {
                    if ( common.getRankValue (this.hand [i].rank) < common.getRankValue (lowestBriscola) ) {
                        lowestBriscola = this.hand [i].rank;
                        lowestBriscolaInd = i;
                    }
                }
            }
            if (lowestBriscolaInd > -1) {
                card.suit = this.hand [lowestBriscolaInd].suit; card.rank = this.hand [lowestBriscolaInd].rank;
                this.hand [lowestBriscolaInd].suit = common.Suit.NoSuit; this.hand [lowestBriscolaInd].rank = common.Rank.NoRank;
                console.log ("robot play 5, 0 suit-rank -> " + card.suit + "-" + card.rank);
                return;
            }

        } else {
// If available, play three or ace of the same suit of the card played by competition, if it is not the 'briscola'
            if (suitCardPlayedFirst != briscola) {
                for (let i=0; i < common.HAND_CARDS; i++) {
                  if (this.hand [i].suit == suitCardPlayedFirst && common.getRankValue(this.hand [i].rank) > common.getRankValue(rankCardPlayedFirst) 
                                                             && (this.hand [i].rank == common.Rank.Three || this.hand [i].rank == common.Rank.One) ) {
                    card.suit = this.hand [i].suit; card.rank = this.hand [i].rank;
                    this.hand [i].suit = common.Suit.NoSuit; this.hand [i].rank = common.Rank.NoRank;
                    console.log ("robot play 6, 0 suit-rank -> " + card.suit + "-" + card.rank);
                    return;
                  }
                }

// If available, play the lowest briscola when the card played is an ace or three of a suit other than briscola
                if (rankCardPlayedFirst == common.Rank.One || rankCardPlayedFirst == common.Rank.Three) {
                    let lowerRank = common.Rank.HighestRank; let lowerRankInd = -1;
                    for (let i=0; i < common.HAND_CARDS; i++) {
                        if ( this.hand [i].suit == briscola && common.getRankValue (this.hand [i].rank) < common.getRankValue (lowerRank)) {
                            lowerRank = this.hand [i].rank;
                            lowerRankInd = i;
                        }
                    }                
                    if (lowerRankInd > -1) {
                        card.suit = this.hand [lowerRankInd].suit; card.rank = this.hand [lowerRankInd].rank;
                        this.hand [lowerRankInd].suit = common.Suit.NoSuit; this.hand [lowerRankInd].rank = common.Rank.NoRank;
                        console.log ("robot play 7, 0 suit-rank -> " + card.suit + "-" + card.rank);
                        return;
                    }
                }

// Play K, if suit is no briscola, if Q or J of the same suit on the table
                if (rankCardPlayedFirst == common.Rank.Eight || rankCardPlayedFirst == common.Rank.Nine) {
                    for (let i=0; i < common.HAND_CARDS; i++) {
                        if ( this.hand [i].suit == suitCardPlayedFirst && this.hand [i].rank == common.Rank.Ten) {
                            card.suit = this.hand [i].suit; card.rank = this.hand [i].rank;
                            this.hand [i].suit = common.Suit.NoSuit; this.hand [i].rank = common.Rank.NoRank;
                            console.log ("robot play 8, 0 suit-rank -> " + card.suit + "-" + card.rank);
                            return;
                        }
                    }                
                }
            }

// Play the lowest ranked card that is not briscola
            let lowestRankedCard = common.Rank.HighestRank; let lowestRankedCardInd = -1; 
            for (let i=0; i < common.HAND_CARDS; i++) {
                 if ( this.hand [i].suit != briscola && this.hand [i].suit != common.Suit.NoSuit && this.hand [i].rank != common.Rank.One 
                                                                                            && this.hand [i].rank != common.Rank.Three ) {
                    if (common.getRankValue (this.hand [i].rank) < common.getRankValue (lowestRankedCard) ) {
                        lowestRankedCard = this.hand [i].rank;
                        lowestRankedCardInd = i;
                    }
                 }
            }                        
            if (lowestRankedCardInd > -1) {
                card.suit = this.hand [lowestRankedCardInd].suit; card.rank = this.hand [lowestRankedCardInd].rank;
                this.hand [lowestRankedCardInd].suit = common.Suit.NoSuit; this.hand [lowestRankedCardInd].rank = common.Rank.NoRank;
                console.log ("robot play 9, 0 suit-rank -> " + card.suit + "-" + card.rank);
                return;
            }

// Play the lowest ranked briscola
            lowestRankedCard = common.Rank.HighestRank; lowestRankedCardInd = -1; 
            for (let i=0; i < common.HAND_CARDS; i++) {
                 if ( this.hand [i].suit == briscola) {
                    if (common.getRankValue (this.hand [i].rank) < common.getRankValue (lowestRankedCard) ) {
                        lowestRankedCard = this.hand [i].rank;
                        lowestRankedCardInd = i;
                    }
                 }
            }                        
            if (lowestRankedCardInd > -1) {
                card.suit = this.hand [lowestRankedCardInd].suit; card.rank = this.hand [lowestRankedCardInd].rank;
                this.hand [lowestRankedCardInd].suit = common.Suit.NoSuit; this.hand [lowestRankedCardInd].rank = common.Rank.NoRank;
                console.log ("robot play 10, 0 suit-rank -> " + card.suit + "-" + card.rank);
                return;
            }
        }

        for (let i=0; i < common.HAND_CARDS; i++) {
            if (this.hand [i].suit != common.Suit.NoSuit) {
                card.suit = this.hand [i].suit; card.rank = this.hand [i].rank;
                this.hand [i].suit = common.Suit.NoSuit; this.hand [i].rank = common.Rank.NoRank;
                console.log ("robot play 11, 0 suit-rank -> " + card.suit + "-" + card.rank);
                return;
            }
        } 

    }

    isPlayerARobot () {
        return this.robot;
    }
    

}
