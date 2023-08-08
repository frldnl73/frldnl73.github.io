import { NavGame, NavMenu } from './states.js'

export class Nav {
    constructor (canvasWidth, canvasHeight, ctx) {
        this.navMenu = NavMenu.getInstance ();
        this.navGame = NavGame.getInstance ();
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ctx = ctx;
        this.navMenu.init (this);
        this.navGame.init (this);
    }

    init () {
        this.currentState = this.navMenu;
    }

    render () {
        this.currentState.render ();
    }

    update () {
        this.currentState.update ();
    }

    setState (newState) {
        this.currentState.exit ();
        this.currentState = newState;
        this.currentState.enter ();
    }

    getCanvasWidth () {return this.canvasWidth;} 
    getCanvasHeight () {return this.canvasHeight;} 
    getCtx () {return this.ctx;}

}
