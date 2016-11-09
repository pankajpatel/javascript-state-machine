function jQueryHelper (fsm, states, controls, state, control)
{
    // fsm
    this.fsm = fsm;

    // selectors
    this.selectors =
    {
        states   : states   || '#states',
        controls : controls || '#controls',
        state    : state    || '[id]',
        control  : control  || '[name]'
    };

    // elements
    this.elements =
    {
        states      : $(this.selectors.states),
        controls    : $(this.selectors.controls)
    };

    // live-bind button clicks to fsm actions
    this.elements.controls.on('click', this.selectors.control, event => {
        this.fsm.do(event.target.name);
    });

    // bind event handlers
    this.fsm
        .on('change', this.onChange.bind(this))
        .on('pause',  this.onPause.bind(this))
        .on('resume', this.onPause.bind(this));

    // update
    this.update();
}

jQueryHelper.prototype =
{
    fsm : null,

    elements : null,

    selectors : null,

    update:function()
    {
        this.updateStates();
        this.updateButtons();
    },

    updateStates ()
    {
        // assign state
        this.elements.states
            .attr('data-state', this.fsm.state);

        // assign active class to the current state
        this.elements.states
            .find(this.selectors.state)
            .removeClass('active')
            .filter('#'  + this.fsm.state)
            .addClass('active');
    },

    updateButtons ()
    {
        var paused = this.fsm.isPaused();
        this.elements.controls
            .find(this.selectors.control)
            .each( (i, e) => {
                e.disabled = ! this.fsm.canDo(e.name) || paused;
            });
    },

    onChange (event)
    {
        this.updateStates();
        this.updateButtons();
    },

    onPause (event)
    {
        // assign paused
        this.elements.states
            .toggleClass('paused', this.fsm.isPaused());

        // update buttons
        this.updateButtons();
    }

};

export default function setup (fsm, states, controls, state, control)
{
    return new jQueryHelper(fsm, states, controls, state, control);
}
