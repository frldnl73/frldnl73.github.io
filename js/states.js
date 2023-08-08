import { Game } from './game.js'

var navMenu_instance;
var navGame_instance;
 
class NavState
{
    constructor () {
        if (this.constructor == NavState) {
            throw new Error("You cannot create an instance of Abstract Class");
        }
    }

    enter (nav) {
        throw new Error("You cannot call the method enter of NavState abstract class");
    }

    toggle (nav) {
        throw new Error("You cannot call the method toggl of NavState abstract class");
    }

    exit (nav) {
        throw new Error("You cannot call the method evit of NavState abstract class");
    }

    init (nav) {
        throw new Error("You cannot call the method init of NavState abstract class");
    }

    handleEvent (nav) {
        throw new Error("You cannot call the method handleEvent of NavState abstract class");
    }

    update (nav) {
        throw new Error("You cannot call the method update of NavState abstract class");
    }

    render (nav) {
        throw new Error("You cannot call the method render of NavState abstract class");
    }

    clean (nav) {
        throw new Error("You cannot call the method enter of NavState abstract class");
    }

};

export class NavMenu extends NavState {
    constructor (key) {
        super ();
        if (key !== "NavMenuSingleton") {
            throw new Error("NavMenu must be a singleton");
        }
    }

    static getInstance () {
        if (navMenu_instance) {
            return navMenu_instance;
        } else {
            let key = "NavMenuSingleton"
            navMenu_instance = new NavMenu (key);
            return navMenu_instance;
        }
    }

    enter () {
    }

    toggle () {
    }

    exit () {
    }

    init (nav) {
        let xOff = nav.getCanvasWidth () / 2;
        let yOff = nav.getCanvasHeight () / 2;
        let verticalSpacing = 30;

        this.text_exit = {text : "- Exit -> Q", x : xOff, y : yOff, textAlign : "center", font : "25px san-serif"};
        this.text_game = {text : "- Game -> G", x : xOff, y : yOff + verticalSpacing, textAlign : "center", font : "25px san-serif"};

        this.nav = nav;
        document.addEventListener ("keydown", (event) => {
            this.keyDownHandler (event, nav);
        }, false);
    }

    keyDownHandler(e) {
        if (e.key == "G" || e.key == "g") {
           this.nav.setState (navGame_instance);
        }
    }

    handleEvent () {
    }

    update () {
    }

    render () {
        let ctx = this.nav.getCtx ();
        ctx.fillStyle = "#FFFFFF";

        ctx.font = this.text_exit.font;
        ctx.textAlign = this.text_exit.textAlign;
        ctx.fillText(this.text_exit.text, this.text_exit.x, this.text_exit.y);                

        ctx.font = this.text_game.font;
        ctx.textAlign = this.text_game.textAlign;
        ctx.fillText(this.text_game.text, this.text_game.x, this.text_game.y);                
    }

    clean () {
    }
}


export class NavGame extends NavState {
    constructor (key) {
        super ();
        if (key !== "NavGameSingleton") {
            throw new Error("NavGame must be a singleton");
        }
    }

    static getInstance () {
        if (navGame_instance) {
            return navGame_instance;
        } else {
            let key = "NavGameSingleton"
            navGame_instance = new NavGame (key);
            return navGame_instance;
        }
    }

    enter () {
    }

    toggle () {
    }

    exit () {
    }

    init (nav) {
        this.nav = nav;
        this.game = new Game (this.nav.getCanvasWidth (), this.nav.getCanvasHeight (), nav);
    }

    handleEvent () {
    }

    update () {
        this.game.update();
    }

    render () {
        this.game.render();
    }

    clean () {
    }
}


