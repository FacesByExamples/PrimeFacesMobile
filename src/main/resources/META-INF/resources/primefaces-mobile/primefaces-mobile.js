PrimeFaces.ajax.AjaxUtils.updateElement = function(id, content) {        
    if(id == PrimeFaces.VIEW_STATE) {
        PrimeFaces.ajax.AjaxUtils.updateState.call(this, content);
    }
    else if(id == PrimeFaces.VIEW_ROOT) {
        document.open();
        document.write(content);
        document.close();
    }
    else {
        $(PrimeFaces.escapeClientId(id)).replaceWith(content);

        //PrimeFaces Mobile
        if($.mobile) {
            var controls = $(PrimeFaces.escapeClientId(id)).parent().find(":input, button, ul");

            //input text and textarea
            controls.filter("[type='text'],[type='search'],[type='tel'],[type='email'], textarea").textinput();
            
            //radio-checkbox
            controls.filter("[type='radio'], [type='checkbox']").checkboxradio();
            
            //selects
            controls.filter("select:not([data-role='slider'])" ).selectmenu();
            
            //slider
            controls.filter("input[type='range']").slider();
            
            //switch
            controls.filter("select[data-role='slider']" ).slider();
            
            //lists
            controls.filter("ul[data-role='listview']").listview();
            
            //buttons
            controls.filter("button, [type='button'], [type='submit'], [type='reset'], [type='image']").button();
        }
    }
}

PrimeFaces.navigate = function(to, cfg) {
    cfg.changeHash = false;
    
    //cast
    cfg.reverse = (cfg.reverse == 'true' || cfg.reverse == true) ? true : false;

    $.mobile.changePage(to, cfg);
}

/**
 * PrimeFaces InputText Widget
 */
PrimeFaces.widget.InputText = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.is(':input') ? this.jq : this.jq.children(':input');
        
        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces InputText Widget
 */
PrimeFaces.widget.InputTextarea = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.input = this.jq.is(':input') ? this.jq : this.jq.children(':input');
        
        this.cfg.rowsDefault = this.input.attr('rows');
        this.cfg.colsDefault = this.input.attr('cols');

        //AutoResize
        if(this.cfg.autoResize) {
            this.setupAutoResize();
        }

        //max length
        if(this.cfg.maxlength){
            this.applyMaxlength();
        }

        //Client behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }
    },
    
    setupAutoResize: function() {
        var _self = this;

        this.input.keyup(function() {
            _self.resize();
        }).focus(function() {
            _self.resize();
        }).blur(function() {
            _self.resize();
        });
    },
    
    resize: function() {
        var linesCount = 0,
        lines = this.input.val().split('\n');

        for(var i = lines.length-1; i >= 0 ; --i) {
            linesCount += Math.floor((lines[i].length / this.cfg.colsDefault) + 1);
        }

        var newRows = (linesCount >= this.cfg.rowsDefault) ? (linesCount + 1) : this.cfg.rowsDefault;

        this.input.attr('rows', newRows);
    },
    
    applyMaxlength: function() {
        var _self = this;

        this.input.keyup(function(e) {
            var value = _self.input.val(),
            length = value.length;

            if(length > _self.cfg.maxlength) {
                _self.input.val(value.substr(0, _self.cfg.maxlength));
            }
        });
    }
});

/**
 * PrimeFaces SelectBooleanCheckbox Widget
 */
PrimeFaces.widget.SelectBooleanCheckbox = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.input = $(this.jqId + '_input');

        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.input, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces SelectManyCheckbox Widget
 */
PrimeFaces.widget.SelectManyCheckbox = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        
        this.inputs = this.jq.find(':checkbox:not(:disabled)');
                        
        //Client Behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.inputs, this.cfg.behaviors);
        }
    }
});

/**
 * PrimeFaces SelectOneRadio Widget
 */
PrimeFaces.widget.SelectOneRadio = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);

        this.inputs = this.jq.find(':radio:not(:disabled)');
                
        //Client Behaviors
        if(this.cfg.behaviors) {
            PrimeFaces.attachBehaviors(this.inputs, this.cfg.behaviors);
        }
    }
});