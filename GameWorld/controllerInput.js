class ControllerInput {

    constructor(target) {this.target = target,this._Init() }

    _Init()
    {
        this._current ={
            leftButton: false,
            rightButton: false,
            mouseX: 0.0,
            mouseY: 0.0
        }
        this._keys ={
            forward: false,
            backward:false,
            left: false,
            right: false,
            shift:false,
            up:false,
            down:false,
            space:false
        };

        this._previous = null;

        // event listeners for keys
        document.addEventListener('keydown', (e)=> this._OnKeyDown(e), false);
        document.addEventListener('keyup', (e)=> this._OnKeyUp(e), false);

        //event listeners for mouse
        document.addEventListener('mousedown', (e)=> this._OnMouseDown(e), false);
        document.addEventListener('mouseup', (e)=> this._OnMouseUp(e), false);
        document.addEventListener('mousemove', (e)=> this._OnMouseMove(e), false);
    } 

    _OnMouseDown(e)
    {
        switch(e.button)
        {
            case 0: {
                this._current.leftButton =true
                break
            }
            case 2: {
                this._current.rightButton =true
                break
            }
        }
    }

    _OnMouseUp(e)
    {
        switch(e.button)
        {
            case 0: {
                this._current.leftButton =false
                break
            }
            case 2: {
                this._current.rightButton =false
                break
            }
        }
    }

    _OnMouseMove(e)
    {
        this._current.mouseX = e.pageX - window.innerWidth/2;
        this._current.mouseY = e.pageY - window.innerHeight/2;

        if (this._previous == null)
        {
            this._previous ={...this._current};
        }
    }

    _OnKeyDown(event)
    {
        switch(event.keyCode)
        {
            case 87: //w
            this._keys.forward =true;
            break;

            case 65: //a
            this._keys.left =true;
            break;

            case 83: //s
            this._keys.backward =true;
            break;

            case 68: //d
            this._keys.right =true;
            break;

            case 32: //space
            this._keys.space =true;
            break;

            case 16: //Shift
            this._keys.shift=true;
            break;

            case 69: // e
            this._keys.up=true;
            break;

            case 82: // r
            this._keys.down=true;
            break;
        }
    }

    _OnKeyUp(event)
    {
        switch(event.keyCode)
        {
            case 87: //w
            this._keys.forward =false;
            break;

            case 65: //a
            this._keys.left =false;
            break;

            case 83: //s
            this._keys.backward =false;
            break;

            case 68: //d
            this._keys.right =false;
            break;

            case 32: //space
            this._keys.space =false;
            break;

            case 16: //Shift
            this._keys.shift=false;
            break;

            case 69: // e
            this._keys.up=false;
            break;

            case 82: // r
            this._keys.down=false;
            break;
        }
    }
}

export default ControllerInput;