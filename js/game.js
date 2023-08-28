import { Player } from './player.js'
import * as common from './common.js'

const CARD_WIDTH = 50;
const CARD_HEIGHT = 80;
const CARD_SPACING = 20;
const UPPER_MARGIN = 10;
const LOWER_MARGIN = 10;
const RIGHT_MARGIN = 10;
const LEFT_MARGIN = 10;
const SHUFFLE_TIMES = 3;
const DELAY_ROBOT_PLAY = 1000;
const DELAY_SHOW_OUTCOME = 1000;
const DELAY_SHOW_OUTCOME_LAST_HAND = 2000;
const CARD_SPRITE_W = 81;
const CARD_SPRITE_H = 117;
const SCALE_DOWN = 0.7;
var g_card_width_scaledDown;
var g_card_height_scaledDown;

export class Game {
    x; y; width; height;
    cardsPlayed; deck;
    text_playerOneWin; text_playerTwoWin; text_playerOne; text_playerTwo;
    coord_cardPlayed_playerOne; coord_cardPlayed_playerTwo; coord_handCards_playerOne; coord_handCards_playerTwo; coord_deck; coord_trump;
    playerOne; playerTwo; playerThatStartedPlay; playerActive;
    gameState; trump; nav; cardsImage; winnerPlayer;
    suit_card_selected_PlayerOne; rank_card_selected_PlayerOne; ind_card_selected_PlayerOne;
    suit_card_selected_PlayerTwo; rank_card_selected_PlayerTwo; ind_card_selected_PlayerTwo;
    prev_suit_card_selected_PlayerOne; prev_rank_card_selected_PlayerOne;
    prev_suit_card_selected_PlayerTwo; prev_rank_card_selected_PlayerTwo;
    prev_winnerPlayer;
    coord_cardPlPrev_playerOne; coord_cardPlPrev_playerTwo;


    constructor (canvasWidth, canvasHeight, nav) {
        this.nav = nav;
        this.x = 0; this.y = 0;
        this.width = canvasWidth; this.height = canvasHeight;

        this.cardsImage = new Image ();
        this.cardsImage.src = "./js/resources/cards.gif";

        this.cardsPlayed = [];
        for (let i=0; i < common.CARDS_IN_THE_DECK; i++) {
            this.cardsPlayed [i] = new common.Card ();
            this.cardsPlayed [i].suit = common.Suit.NoSuit;
            this.cardsPlayed [i].rank = common.Rank.NoRank;
        }

        this.coord_cardPlayed_playerOne = {}; this.coord_cardPlayed_playerTwo = {};
        this.coord_cardPlPrev_playerOne = {}; this.coord_cardPlPrev_playerTwo = {};
        this.text_playerOneWin = {}; this.text_playerTwoWin = {};
        this.text_plPrevOneWin = {}; this.text_plPrevTwoWin = {};
        this.text_playerOne = {}; this.text_playerTwo = {};
        this.coord_handCards_playerOne = {}; this.coord_handCards_playerTwo = {};
        this.text_scorePlayerOne = {}; this.text_scorePlayerTwo = {};
        this.text_exit_game = {}; this.coord_deck = {}; this.coord_trump = {};
        for (let i=0; i < common.HAND_CARDS; i++) {
            this.coord_handCards_playerOne [i] = {}
            this.coord_handCards_playerTwo [i] = {}
        }
        this.initGraphicalData ();

        this.playerOne = new Player ();
        this.playerTwo = new Player ();
        this.playerTwo.setPlayerASRobot ();

        this.canvas = document.getElementById("myCanvas");
        document.addEventListener ("click", (event) => {
            this.clickHandler (event, nav);
        }, false);
        document.addEventListener ("keydown", (event) => {
            this.keydownkHandler (event, nav);
        }, false);
        this.newGame ();
    }

    initGraphicalData () {
        let ctx = this.nav.getCtx ();

        g_card_width_scaledDown = CARD_WIDTH * SCALE_DOWN;
        g_card_height_scaledDown = CARD_HEIGHT * SCALE_DOWN;
        let playedCardsBlock_width = CARD_WIDTH + CARD_SPACING + CARD_WIDTH;
        let handCardsBlock = CARD_WIDTH + CARD_SPACING + CARD_WIDTH + CARD_SPACING + CARD_WIDTH;

        this.coord_cardPlayed_playerOne.x = (this.width - playedCardsBlock_width) / 2;
        this.coord_cardPlayed_playerOne.y = (this.height - CARD_HEIGHT) / 2;

        this.coord_cardPlayed_playerTwo.x = this.coord_cardPlayed_playerOne.x + CARD_WIDTH + CARD_SPACING; 
        this.coord_cardPlayed_playerTwo.y = this.coord_cardPlayed_playerOne.y;

        this.text_playerOneWin.text = "YOU WIN"; 
        if (this.coord_cardPlayed_playerOne.y - 10 - 20 > UPPER_MARGIN + CARD_HEIGHT) {
            console.log ("you win 1");
            this.text_playerOneWin.x = this.coord_cardPlayed_playerOne.x; 
            this.text_playerOneWin.y = this.coord_cardPlayed_playerOne.y - 10;
        } else {
            console.log ("you win 2");
            this.text_playerOneWin.x = this.coord_cardPlayed_playerTwo.x + CARD_WIDTH + 10; 
            this.text_playerOneWin.y = this.coord_cardPlayed_playerTwo.y + 20;
        }
        this.text_playerOneWin.textAlign = "left";
        this.text_playerOneWin.font = "20px san-serif";

        this.text_playerTwoWin.text = "ROBOT WINS"; 
        if (this.coord_cardPlayed_playerOne.y - 10 -20 > UPPER_MARGIN + CARD_HEIGHT) {
            this.text_playerTwoWin.x = this.coord_cardPlayed_playerOne.x; 
            this.text_playerTwoWin.y = this.coord_cardPlayed_playerOne.y - 10;
        } else {
            this.text_playerTwoWin.x = this.coord_cardPlayed_playerTwo.x + CARD_WIDTH + 10; 
            this.text_playerTwoWin.y = this.coord_cardPlayed_playerTwo.y + 20;
        }
        this.text_playerTwoWin.textAlign = "left";
        this.text_playerTwoWin.font = "20px san-serif";

        this.coord_cardPlPrev_playerOne.x = LEFT_MARGIN;
        this.coord_cardPlPrev_playerOne.y = this.coord_cardPlayed_playerOne.y;

        this.coord_cardPlPrev_playerTwo.x = this.coord_cardPlPrev_playerOne.x + g_card_width_scaledDown + CARD_SPACING / 2;
        this.coord_cardPlPrev_playerTwo.y = this.coord_cardPlayed_playerOne.y;

        this.text_plPrevOneWin.text = "YOU WIN"; 
        this.text_plPrevOneWin.x = LEFT_MARGIN; 
        this.text_plPrevOneWin.y = this.coord_cardPlayed_playerOne.y - 10;
        this.text_plPrevOneWin.textAlign = "left";
        this.text_plPrevOneWin.font = "15px san-serif";

        this.text_plPrevTwoWin.text = "ROBOT WINS"; 
        this.text_plPrevTwoWin.x = LEFT_MARGIN; 
        this.text_plPrevTwoWin.y = this.coord_cardPlayed_playerOne.y - 10;
        this.text_plPrevTwoWin.textAlign = "left";
        this.text_plPrevTwoWin.font = "15px san-serif";

        this.coord_handCards_playerOne [0].x = (this.width - handCardsBlock) / 2;
        this.coord_handCards_playerOne [0].y = UPPER_MARGIN;
        for (let i=1; i < common.HAND_CARDS; i++) {
           this.coord_handCards_playerOne [i].x = this.coord_handCards_playerOne [0].x + (CARD_WIDTH + CARD_SPACING) * i;
           this.coord_handCards_playerOne [i].y = UPPER_MARGIN;
        }

        this.coord_handCards_playerTwo [0].x = (this.width - handCardsBlock) / 2; 
        this.coord_handCards_playerTwo [0].y = this.height - LOWER_MARGIN - CARD_HEIGHT;
        for (let i=1; i < common.HAND_CARDS; i++) {
           this.coord_handCards_playerTwo [i].x = this.coord_handCards_playerTwo[0].x + (CARD_WIDTH + CARD_SPACING) * i; 
           this.coord_handCards_playerTwo [i].y = this.height - LOWER_MARGIN - CARD_HEIGHT;
        }

        this.text_playerOne.text = "YOU"; 
        this.text_playerOne.x = LEFT_MARGIN;
        this.text_playerOne.y = this.coord_handCards_playerOne [0].y;
        this.text_playerOne.textAlign = "left"; 
        this.text_playerOne.font = "15px san-serif";

        this.text_playerTwo.text = "ROBOT"; 
        this.text_playerTwo.x = LEFT_MARGIN; 
        this.text_playerTwo.y = this.coord_handCards_playerTwo [0].y; 
        this.text_playerTwo.textAlign = "left"; 
        this.text_playerTwo.font = "15px san-serif";

        this.text_scorePlayerOne.text = ""; 
        this.text_scorePlayerOne.x = LEFT_MARGIN; 
        this.text_scorePlayerOne.y = 20; 
        this.text_scorePlayerOne.textAlign = "left"; 
        this.text_scorePlayerOne.font = "20px san-serif";

        this.text_scorePlayerTwo.text = ""; 
        this.text_scorePlayerTwo.x = LEFT_MARGIN; 
        this.text_scorePlayerTwo.y = UPPER_MARGIN + CARD_SPACING; 
        this.text_scorePlayerTwo.textAlign = "left";
        this.text_scorePlayerTwo.font = "20px san-serif";

        this.text_exit_game.text = "New Briscola Game";
        this.text_exit_game.x = this.width / 2; 
        this.text_exit_game.y = this.height - LOWER_MARGIN; 
        this.text_exit_game.textAlign = "center"; 
        this.text_exit_game.font = "20px san-serif";
        ctx.font = this.text_exit_game.font;
        this.text_exit_game.w = ctx.measureText(this.text_exit_game.text).width;
        this.text_exit_game.h = 20;

        this.coord_deck.x = this.width - RIGHT_MARGIN - CARD_WIDTH;
        this.coord_deck.y = (this.height / 2) - CARD_HEIGHT - (CARD_SPACING / 2);

        this.coord_trump.x = this.coord_deck.x; 
        this.coord_trump.y = (this.height / 2) + (CARD_SPACING / 2);
    }

    resize (canvasWidth, canvasHeight) {
        this.x = 0; this.y = 0;
        this.width = canvasWidth; this.height = canvasHeight;
        this.initGraphicalData ();
    }

    newGame () {
       this.prev_suit_card_selected_PlayerOne = common.Suit.NoSuit; this.prev_rank_card_selected_PlayerOne = common.Rank.NoRank;
       this.prev_suit_card_selected_PlayerTwo = common.Suit.NoSuit; this.prev_rank_card_selected_PlayerTwo = common.Rank.NoRank;

       this.shuffle ();
       this.trump = this.deck [0].suit;
       this.playerThatStartedPlay = this.playerActive = this.playerOne;
       this.playerOne.newGame();
       this.playerTwo.newGame();
       this.newHand ();
    }

    shuffle () {
        this.deck = [];
        let i = 0;
        for (let suit in common.Suit) {
            if (suit != common.Suit.NoSuit) {
                for (let rank in common.Rank) {
                    if (rank != "NoRank" && rank != "HighestRank") {
                        this.deck [i] = new common.Card ();
                        this.deck [i].suit = common.Suit [suit];
                        this.deck [i].rank = common.Rank [rank];                
                        i++;
                    }
                }
            }
        }
        
        let card = new common.Card ();
        let min = 0; let max = common.CARDS_IN_THE_DECK - 1;
        for (let j=0; j<SHUFFLE_TIMES; j++) {
            for (let z=0; z < common.CARDS_IN_THE_DECK; z++) {
                let y = Math.floor(Math.random() * (max - min + 1) + min);
                card.suit = this.deck [y].suit;
                card.rank = this.deck [y].rank;
                this.deck [y].suit = this.deck [z].suit; this.deck [y].rank = this.deck [z].rank;
                this.deck [z].suit = card.suit; this.deck [z].rank = card.rank;
            }
        }

       for (let j=0; j < common.CARDS_IN_THE_DECK; j++) {
           this.cardsPlayed [j].suit = common.Suit.NoSuit;
           this.cardsPlayed [j].rank = common.Rank.NoRank;
       }

    }

    newHand () {
        this.playerOne.newHand(); this.playerTwo.newHand();
        let suit; let rank;
        const card = new common.Card ();

        for (let i=0; i < common.HAND_CARDS; i++) {
            this.pullCardFromDeck (card);
            this.playerOne.receiveHandCard (card);
        }
        for (let i=0; i < common.HAND_CARDS; i++) {
            this.pullCardFromDeck (card);
            this.playerTwo.receiveHandCard (card);
        }
        this.gameState = common.GameState.WaitingForPlayersToPlayCard;
        this.suit_card_selected_PlayerOne = common.Suit.NoSuit; this.rank_card_selected_PlayerOne = common.Rank.NoRank; this.ind_card_selected_PlayerOne = -1;
        this.suit_card_selected_PlayerTwo = common.Suit.NoSuit; this.rank_card_selected_PlayerTwo = common.Rank.NoRank; this.ind_card_selected_PlayerTwo = -1;
    }    

    pullCardFromDeck (card) {
        for (let i = common.CARDS_IN_THE_DECK - 1; i>-1; i--) {
            if (this.deck [i].suit != common.Suit.NoSuit) {
               card.suit = this.deck [i].suit;
               card.rank = this.deck [i].rank;
               this.deck [i].suit = common.Suit.NoSuit;
               this.deck [i].rank = common.Rank.NoRank;
               return;
            }
        }
    
       card.suit = common.Suit.NoSuit; card.rank = common.Rank.NoRank;
       return;
    }

    render () {
        let ctx = this.nav.getCtx ();
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#FFFFFF";
        ctx.textBaseline = "bottom";
        const card = new common.Card ();
        let xI; let yI;

        if (this.gameState == common.GameState.ShowOutcomeGame) {
            ctx.font = this.text_scorePlayerOne.font;
            ctx.textAlign = this.text_scorePlayerOne.textAlign;
            ctx.fillText(this.text_scorePlayerOne.text, this.text_scorePlayerOne.x, this.text_scorePlayerOne.y);  

            let xW = LEFT_MARGIN; let yW = this.text_scorePlayerOne.y + 5;
            for (let i=0; i < common.WIN_CARDS_MAX; i++) {
                this.playerOne.getCardsWon (card, i);
                if (card.suit != common.Suit.NoSuit) {
                    if (common.getRankScore (card.rank) > 0) {
                        ctx.globalAlpha = 1.0;
                    } else {
                        ctx.globalAlpha = 0.6;
                    }
                    ctx.drawImage (this.cardsImage, card.rank * CARD_SPRITE_W, card.suit * CARD_SPRITE_H, CARD_SPRITE_W, CARD_SPRITE_H, 
                                    xW, yW, g_card_width_scaledDown, g_card_height_scaledDown);
                } else {
                    break;
                }
                if (xW + g_card_width_scaledDown + 10 < (this.width - g_card_width_scaledDown) ) {
                    xW = xW + g_card_width_scaledDown + 10;
                } else {
                    xW = LEFT_MARGIN; 
                    yW = yW + g_card_height_scaledDown + 10;
                }
            }

            ctx.globalAlpha = 1.0;
            xW = LEFT_MARGIN; yW = yW + g_card_height_scaledDown + 10 + 20;
            ctx.font = this.text_scorePlayerTwo.font;
            ctx.textAlign = this.text_scorePlayerTwo.textAlign;
            ctx.fillText(this.text_scorePlayerTwo.text, xW, yW);

            yW = yW + 5;
            for (let i=0; i < common.WIN_CARDS_MAX; i++) {
                this.playerTwo.getCardsWon (card, i);
                if (card.suit != common.Suit.NoSuit) {
                    if (common.getRankScore (card.rank) > 0) {
                        ctx.globalAlpha = 1.0;
                    } else {
                        ctx.globalAlpha = 0.6;
                    }
                    ctx.drawImage (this.cardsImage, card.rank * CARD_SPRITE_W, card.suit * CARD_SPRITE_H, CARD_SPRITE_W, CARD_SPRITE_H, 
                                    xW, yW, g_card_width_scaledDown, g_card_height_scaledDown);
                } else {
                    break;
                }
                if (xW + g_card_width_scaledDown + 10 < (this.width - g_card_width_scaledDown) ) {
                    xW = xW + g_card_width_scaledDown + 10;
                } else {
                    xW = LEFT_MARGIN; 
                    yW = yW + g_card_height_scaledDown + 10;
                }
            }

            if ( (xW + g_card_width_scaledDown + 10) > (this.text_exit_game.x - this.text_exit_game.w / 2 - 10) &&
                 (yW + g_card_width_scaledDown + 10) > (this.text_exit_game.y - this.text_exit_game.h - 10) ) {
               let delta = (xW + g_card_width_scaledDown + 10) - (this.text_exit_game.x - this.text_exit_game.w / 2 - 10) + 10;
               this.text_exit_game.x += delta;
            }
            ctx.beginPath();
            ctx.rect( (this.text_exit_game.x - this.text_exit_game.w / 2 - 10), (this.text_exit_game.y - this.text_exit_game.h - 10), 
                        this.text_exit_game.w + 20, this.text_exit_game.h + 10);
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
            ctx.closePath();

            ctx.globalAlpha = 1.0;
            ctx.font = this.text_exit_game.font;
            ctx.textAlign = this.text_exit_game.textAlign;
            ctx.fillText(this.text_exit_game.text, this.text_exit_game.x, this.text_exit_game.y);
            return;
        }

        ctx.globalAlpha = 1.0;
        if (this.suit_card_selected_PlayerOne != common.Suit.NoSuit) {
            xI = this.rank_card_selected_PlayerOne * CARD_SPRITE_W;
            yI = this.suit_card_selected_PlayerOne * CARD_SPRITE_H;
            ctx.drawImage (this.cardsImage, xI, yI, CARD_SPRITE_W, CARD_SPRITE_H, 
                            this.coord_cardPlayed_playerOne.x, this.coord_cardPlayed_playerOne.y, CARD_WIDTH, CARD_HEIGHT);
        }

        if (this.suit_card_selected_PlayerTwo != common.Suit.NoSuit) {
            xI = this.rank_card_selected_PlayerTwo * CARD_SPRITE_W;
            yI = this.suit_card_selected_PlayerTwo * CARD_SPRITE_H;
            ctx.drawImage (this.cardsImage, xI, yI, CARD_SPRITE_W, CARD_SPRITE_H, 
                            this.coord_cardPlayed_playerTwo.x, this.coord_cardPlayed_playerTwo.y, CARD_WIDTH, CARD_HEIGHT);
        }

        for (let i=0; i < common.HAND_CARDS; i++) {
            this.playerOne.getHandCard (card, i);
            if (card.suit != common.Suit.NoSuit) {
                if (this.playerOne.isPlayerARobot ()) {
                    xI = 0;
                    yI = CARD_SPRITE_H*4;
                } else {


                    xI = card.rank * CARD_SPRITE_W;
                    yI = card.suit * CARD_SPRITE_H;
                }
                ctx.drawImage (this.cardsImage, xI, yI, CARD_SPRITE_W, CARD_SPRITE_H, 
                                this.coord_handCards_playerOne[i].x, this.coord_handCards_playerOne[i].y, CARD_WIDTH, CARD_HEIGHT);
            } else {
                continue;
            }
        }
        ctx.font = this.text_playerOne.font;
        ctx.textAlign = this.text_playerOne.textAlign;
        ctx.textBaseline = "top";
        ctx.fillText(this.text_playerOne.text, this.text_playerOne.x, this.text_playerOne.y);                

        for (let i=0; i < common.HAND_CARDS; i++) {
            this.playerTwo.getHandCard (card, i);
            if (card.suit != common.Suit.NoSuit) {
                if (this.playerTwo.isPlayerARobot ()) {
                    xI = 0;
                    yI = CARD_SPRITE_H*4;
                } else {
                    xI = card.rank * CARD_SPRITE_W;
                    yI = card.suit * CARD_SPRITE_H;
                }
                ctx.drawImage (this.cardsImage, xI, yI, CARD_SPRITE_W, CARD_SPRITE_H, 
                                this.coord_handCards_playerTwo[i].x, this.coord_handCards_playerTwo[i].y, CARD_WIDTH, CARD_HEIGHT);
            } else {
                continue;
            }
        }
        ctx.font = this.text_playerTwo.font;
        ctx.textAlign = this.text_playerTwo.textAlign;
        ctx.textBaseline = "top";
        ctx.fillText(this.text_playerTwo.text, this.text_playerTwo.x, this.text_playerTwo.y);               

        ctx.drawImage (this.cardsImage, 0, CARD_SPRITE_H*4, CARD_SPRITE_W, CARD_SPRITE_H, 
                        this.coord_deck.x, this.coord_deck.y, CARD_WIDTH, CARD_HEIGHT);

        if (this.deck [0].suit != common.Suit.NoSuit) {
            ctx.drawImage (this.cardsImage, this.deck[0].rank*CARD_SPRITE_W, this.deck[0].suit*CARD_SPRITE_H, CARD_SPRITE_W, CARD_SPRITE_H, 
                            this.coord_trump.x, this.coord_trump.y, CARD_WIDTH, CARD_HEIGHT);
        }

        ctx.textBaseline = "bottom";
        if (this.gameState == common.GameState.ShowOutcomePlay || this.gameState == common.GameState.ShowOutcomePlay_delay ) {
            if  (this.winnerPlayer == this.playerOne) {
                ctx.font = this.text_playerOneWin.font;
                ctx.textAlign = this.text_playerOneWin.textAlign;
                ctx.fillText(this.text_playerOneWin.text, this.text_playerOneWin.x, this.text_playerOneWin.y);                
            } else {
                ctx.font = this.text_playerTwoWin.font;
                ctx.textAlign = this.text_playerTwoWin.textAlign;
                ctx.fillText(this.text_playerTwoWin.text, this.text_playerTwoWin.x, this.text_playerTwoWin.y);                
            }
        }
  
        if (this.prev_suit_card_selected_PlayerOne != common.Suit.NoSuit) {
            if  (this.prev_winnerPlayer == this.playerOne) {
                ctx.font = this.text_plPrevOneWin.font;
                ctx.textAlign = this.text_plPrevOneWin.textAlign;
                ctx.fillText(this.text_plPrevOneWin.text, this.text_plPrevOneWin.x, this.text_plPrevOneWin.y);                
            } else {
                ctx.font = this.text_plPrevTwoWin.font;
                ctx.textAlign = this.text_plPrevTwoWin.textAlign;
                ctx.fillText(this.text_plPrevTwoWin.text, this.text_plPrevTwoWin.x, this.text_plPrevTwoWin.y);                
            }
            ctx.drawImage (this.cardsImage, 
                            this.prev_rank_card_selected_PlayerOne*CARD_SPRITE_W, this.prev_suit_card_selected_PlayerOne*CARD_SPRITE_H, CARD_SPRITE_W, CARD_SPRITE_H, 
                            this.coord_cardPlPrev_playerOne.x, this.coord_cardPlPrev_playerOne.y, g_card_width_scaledDown, g_card_height_scaledDown);

        }

        if (this.prev_suit_card_selected_PlayerTwo != common.Suit.NoSuit) {
            ctx.drawImage (this.cardsImage, 
                            this.prev_rank_card_selected_PlayerTwo*CARD_SPRITE_W, this.prev_suit_card_selected_PlayerTwo*CARD_SPRITE_H, CARD_SPRITE_W, CARD_SPRITE_H, 
                            this.coord_cardPlPrev_playerTwo.x, this.coord_cardPlPrev_playerTwo.y, g_card_width_scaledDown, g_card_height_scaledDown);
        }
      

    }

    update () {
        const card = new common.Card ();

        switch (this.gameState) {
            case common.GameState.WaitingForPlayersToPlayCard :
                if (this.suit_card_selected_PlayerOne != common.Suit.NoSuit && this.suit_card_selected_PlayerTwo != common.Suit.NoSuit) {
                    this.gameState = common.GameState.CheckCardsPlayed;
                    return;
                }

                if (!this.playerActive.isPlayerARobot ()) {
                    if (this.ind_card_selected_PlayerOne == -1 && this.ind_card_selected_PlayerTwo == -1) return;
                }
                if (this.playerActive == this.playerOne) {
                    this.playerActive.playCard (this.ind_card_selected_PlayerOne, card, 
                                                                  (this.playerThatStartedPlay == this.playerOne), this.cardsPlayed,
                                                                   this.suit_card_selected_PlayerTwo, this.rank_card_selected_PlayerTwo, 
                                                                   this.trump, (this.deck [0].suit == common.Suit.NoSuit) );
                    this.suit_card_selected_PlayerOne = card.suit; this.rank_card_selected_PlayerOne = card.rank;
                    if (this.suit_card_selected_PlayerOne != common.Suit.NoSuit) {
                        this.updCardsPlayedArray (card);
                        this.playerActive = this.playerTwo;
                    }
                } else {
                    if (this.playerActive.isPlayerARobot ()) {
                        setTimeout ( function () {
                            this.playerActive.playCard (this.ind_card_selected_PlayerTwo, card, 
                                                                          (this.playerThatStartedPlay == this.playerTwo), this.cardsPlayed,
                                                                           this.suit_card_selected_PlayerOne, this.rank_card_selected_PlayerOne, 
                                                                           this.trump, (this.deck [0].suit == common.Suit.NoSuit) );
                            this.suit_card_selected_PlayerTwo = card.suit; this.rank_card_selected_PlayerTwo = card.rank;
                            if (this.suit_card_selected_PlayerTwo != common.Suit.NoSuit) {
                                this.updCardsPlayedArray (card);
                                this.playerActive = this.playerOne;
                            }
                            this.gameState = common.GameState.WaitingForPlayersToPlayCard;
                        }.bind(this), DELAY_ROBOT_PLAY);
                        this.gameState = common.GameState.WaitingForPlayersToPlayCard_delay;
                    } else {
                        this.playerActive.playCard (this.ind_card_selected_PlayerTwo, card, 
                                                                      (this.playerThatStartedPlay == this.playerTwo), this.cardsPlayed,
                                                                       this.suit_card_selected_PlayerTwo, this.rank_card_selected_PlayerTwo, 
                                                                       this.trump, (this.deck [0].suit == common.Suit.NoSuit) );
                        this.suit_card_selected_PlayerTwo = card.suit; this.rank_card_selected_PlayerTwo = card.rank;
                        if (this.suit_card_selected_PlayerTwo != common.Suit.NoSuit) {
                            this.updCardsPlayedArray (card);
                            this.playerActive = this.playerOne;
                        }
                    }
                }
                break;
            case common.GameState.WaitingForPlayersToPlayCard_delay :
                break;
            case common.GameState.CheckCardsPlayed :
                this.checkPlay ();
                if  (this.winnerPlayer == this.playerOne) {
                    card.suit = this.suit_card_selected_PlayerOne; card.rank = this.rank_card_selected_PlayerOne;
                    this.playerOne.receiveWinCard (card);
                    card.suit = this.suit_card_selected_PlayerTwo; card.rank = this.rank_card_selected_PlayerTwo;
                    this.playerOne.receiveWinCard (card);
                    this.playerThatStartedPlay = this.playerActive = this.playerOne;
                } else {
                    card.suit = this.suit_card_selected_PlayerOne; card.rank = this.rank_card_selected_PlayerOne;
                    this.playerTwo.receiveWinCard (card);
                    card.suit = this.suit_card_selected_PlayerTwo; card.rank = this.rank_card_selected_PlayerTwo;
                    this.playerTwo.receiveWinCard (card);
                    this.playerThatStartedPlay = this.playerActive = this.playerTwo;
                }
                this.gameState = common.GameState.ShowOutcomePlay;
                break;
            case common.GameState.ShowOutcomePlay :
                if (this.playerOne.noMoreCardsInHand () && this.playerTwo.noMoreCardsInHand ()) {
                    setTimeout (function () {
                        this.checkGame();
                        this.gameState = common.GameState.ShowOutcomeGame;
                    }.bind(this), DELAY_SHOW_OUTCOME_LAST_HAND);
                    this.gameState = common.GameState.ShowOutcomePlay_delay;
                } else {
                    setTimeout (function () {
                        this.pickCard();
                        this.gameState = common.GameState.WaitingForPlayersToPlayCard;
                    }.bind(this), DELAY_SHOW_OUTCOME);
                    this.gameState = common.GameState.ShowOutcomePlay_delay;
                }
                break;
            case common.GameState.ShowOutcomePlay_delay :
                break;
            case common.GameState.ShowOutcomeGame :
                break;
        }

    }

    updCardsPlayedArray (card) {
        for (let j=0; j < common.CARDS_IN_THE_DECK; j++) {
            if (this.cardsPlayed [j].suit == common.Suit.NoSuit) {
                this.cardsPlayed [j].suit = card.suit;
                this.cardsPlayed [j].rank = card.rank;
                j = common.CARDS_IN_THE_DECK;
            }
        }
    }

    checkPlay () {
        if (this.suit_card_selected_PlayerOne == this.suit_card_selected_PlayerTwo) {
            if (common.getRankValue (this.rank_card_selected_PlayerOne) > common.getRankValue (this.rank_card_selected_PlayerTwo)) {
                this.winnerPlayer = this.playerOne;
            } else {
                this.winnerPlayer = this.playerTwo;
            }
        } else {
            if (this.suit_card_selected_PlayerOne == this.trump) {
                this.winnerPlayer = this.playerOne;
            } else if (this.suit_card_selected_PlayerTwo == this.trump) { 
                this.winnerPlayer = this.playerTwo;
            } else {
                this.winnerPlayer = this.playerThatStartedPlay;
            }
        }
    }

    pickCard () {
        const card = new common.Card ();

        if  (this.winnerPlayer == this.playerOne) {
            this.pullCardFromDeck (card);
            this.playerOne.receiveHandCard (card);
            this.pullCardFromDeck (card);
            this.playerTwo.receiveHandCard (card);
        } else {
            this.pullCardFromDeck (card);
            this.playerTwo.receiveHandCard (card);
            this.pullCardFromDeck (card);
            this.playerOne.receiveHandCard (card);
        };

        this.prev_winnerPlayer = this.winnerPlayer;
        this.prev_suit_card_selected_PlayerOne = this.suit_card_selected_PlayerOne; this.prev_rank_card_selected_PlayerOne = this.rank_card_selected_PlayerOne;
        this.prev_suit_card_selected_PlayerTwo = this.suit_card_selected_PlayerTwo; this.prev_rank_card_selected_PlayerTwo = this.rank_card_selected_PlayerTwo;

        this.suit_card_selected_PlayerOne = common.Suit.NoSuit; this.rank_card_selected_PlayerOne = common.Rank.NoRank; this.ind_card_selected_PlayerOne = -1;
        this.suit_card_selected_PlayerTwo = common.Suit.NoSuit; this.rank_card_selected_PlayerTwo = common.Rank.NoRank; this.ind_card_selected_PlayerTwo = -1;
    }


    checkGame () {
        const card = new common.Card ();

        let playerOneScore = 0;
        for (let i=0; i < common.WIN_CARDS_MAX; i++) {
            this.playerOne.getCardsWon (card, i);
            if (card.suit != common.Suit.NoSuit) {
                playerOneScore += common.getRankScore (card.rank);
            } else {
                break;
            }
        }

        let playerTwoScore = 0;
        for (let i=0; i < common.WIN_CARDS_MAX; i++) {
            this.playerTwo.getCardsWon (card, i);
            if (card.suit != common.Suit.NoSuit) {
                playerTwoScore += common.getRankScore (card.rank);
            } else {
                break;
            }
        }
    
        if (playerOneScore > playerTwoScore) {
            this.winnerPlayer = this.playerOne;
        } else {
            this.winnerPlayer = this.playerTwo;
        }

        this.text_scorePlayerOne.text = "You scored : " + playerOneScore;
        this.text_scorePlayerTwo.text = "Robot scored : " + playerTwoScore;
    }

    clickHandler (e, nav) {
        if (this.gameState == common.GameState.WaitingForPlayersToPlayCard && !this.playerActive.isPlayerARobot ()) {
            let relativeX = e.clientX - this.canvas.offsetLeft;
            let relativeY = e.clientY - this.canvas.offsetTop;
            if (this.playerActive == this.playerOne) {
                for (let i=0; i < common.HAND_CARDS; i++) {
                    if (relativeX > this.coord_handCards_playerOne[i].x + CARD_WIDTH || relativeX < this.coord_handCards_playerOne[i].x ||
                        relativeY > this.coord_handCards_playerOne[i].y + CARD_HEIGHT || relativeY < this.coord_handCards_playerOne[i].y) {
                        continue;
                    }
                    this.ind_card_selected_PlayerOne = i; return;
                }
            } else {
                for (let i=0; i < common.HAND_CARDS; i++) {
                    if (relativeX > this.coord_handCards_playerTwo[i].x + CARD_WIDTH || relativeX < this.coord_handCards_playerTwo[i].x ||
                        relativeY > this.coord_handCards_playerTwo[i].y + CARD_HEIGHT || relativeY < this.coord_handCards_playerTwo[i].y) {
                        continue;
                    }
                    this.ind_card_selected_PlayerTwo = i; return;
                }
            }
        }
        if (this.gameState == common.GameState.ShowOutcomeGame) {
            let relativeX = e.clientX - this.canvas.offsetLeft;
            let relativeY = e.clientY - this.canvas.offsetTop;
            if (relativeX > (this.text_exit_game.x - this.text_exit_game.w / 2 - 10) + this.text_exit_game.w + 20 || 
                relativeX < (this.text_exit_game.x - this.text_exit_game.w / 2 - 10) ||
                relativeY > (this.text_exit_game.y - this.text_exit_game.h - 10) + this.text_exit_game.h + 10 || 
                relativeY < (this.text_exit_game.y - this.text_exit_game.h - 10) ) {
            } else {
                this.newGame();
                this.gameState = common.GameState.WaitingForPlayersToPlayCard;
            }

        }
        
    }

    keydownkHandler (e, nav) {
        if (e.key == "G" || e.key == "g") {
            this.newGame();
            this.gameState = common.GameState.WaitingForPlayersToPlayCard;
        }
    }

s}
