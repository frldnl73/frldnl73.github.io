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
        let ctx = nav.getCtx ();
        let xOff = nav.getCanvasWidth () / 2;
        let yOff = nav.getCanvasHeight () / 2;
        let verticalSpacing = 30;

        this.text_exit = {text : "- Exit -> Q", x : xOff, y : yOff, textAlign : "center", font : "25px san-serif", w : 0 , h : 25};
        ctx.font = this.text_exit.font;
        this.text_exit.w = ctx.measureText(this.text_exit.text).width;

        this.text_game = {text : "  New Briscola Game  ", x : xOff, y : yOff + verticalSpacing, textAlign : "center", font : "25px san-serif", w : 0, h : 25};
        ctx.font = this.text_game.font;
        this.text_game.w = ctx.measureText(this.text_game.text).width;

        this.nav = nav;
        this.canvas = document.getElementById("myCanvas");

        if (!this.clickListenerActive) {
            document.addEventListener ("click", (event) => {
                this.clickHandler (event, nav);
            }, false);
        }
        this.clickListenerActive = true;

        if (!this.keydownListenerActive) {
            document.addEventListener ("keydown", (event) => {
                this.keyDownHandler (event, nav);
            }, false);
        }
        this.keydownListenerActive = true;
    }

    resize (nav) {
        this.init (nav);
    }

    clickHandler(e, nav) {
        let relativeX = e.clientX - this.canvas.offsetLeft;
        let relativeY = e.clientY - this.canvas.offsetTop;
        if (relativeX > (this.text_game.x - this.text_game.w / 2) + this.text_game.w || relativeX < (this.text_game.x - this.text_game.w / 2) ||
            relativeY > (this.text_game.y - this.text_game.h) + this.text_game.h || relativeY < (this.text_game.y - this.text_game.h) ) {
        } else {
            this.nav.setState (navGame_instance);
        }
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

//        ctx.font = this.text_exit.font;
//        ctx.textAlign = this.text_exit.textAlign;
//        ctx.fillText(this.text_exit.text, this.text_exit.x, this.text_exit.y);                

        ctx.beginPath();
        ctx.rect( (this.text_game.x - this.text_game.w / 2), (this.text_game.y - this.text_game.h), this.text_game.w, this.text_game.h + 10);
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.closePath();

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

    resize (nav) {
        this.game.resize (this.nav.getCanvasWidth (), this.nav.getCanvasHeight ());
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


