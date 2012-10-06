(function() {
    //do not try to focus an element when it is clicked on.
    //The browser will automatically focus it and a double focus
    //causes a scrolling issue in IE
    var preventFocusOnSelectionChange = false;

    /*
     * A sublcass of view that allows nodes to be navigated using tab
     * focus in addition to arrow keys
     */
    Ext.define('Ozone.components.focusable.FocusableView', {
        extend: 'Ext.view.View',

        initComponent: function () {


            this.callParent(arguments);

            this.on('selectionchange', function (selectionModel, selections) {
                //keep focus in sync with selection
                Ext.Array.each(selections, function(it) {
                    var dom = this.getNode(it);
                    if (dom != null) {
                        if (preventFocusOnSelectionChange) {
                            preventFocusOnSelectionChange = false;
                        }
                        else if (document.activeElement !== dom) {
                            // Tries to focus the element. Any exceptions are caught and ignored.
                            try {
                                dom.focus();
                            }
                            catch(e) {}
                        }
                    }
                }, this);
            }, this);

            this.on('itemupdate', function(record, index, node) {
                this.setupFocusListeners(node);
            }, this);
        },

        refresh: function() {
            this.callParent(arguments);

            //add focusability to each item
            this.getEl().select(this.itemSelector).each(function (fly) {
                this.setupFocusListeners(fly.dom);
            }, this);

        },

        setupFocusListeners: function(dom) {
            var el = new Ext.Element(dom);

            this.mon(el, 'focus', function(evt, dom) {
                //select the focused el if it isn't already (check to stop recursion)
                if (this.getSelectedNodes()[0] !== dom) {
                    this.select(this.getRecord(dom));
                }
            }, this);

            this.mon(el, 'mousedown', function(evt, dom) {
                preventFocusOnSelectionChange = true;
            });

            this.mon(el, 'blur', function(evt, dom) {
                // blur gets fired when destroying components
                // so make sure that store actually exists before deselecting item
                if(this.store)
                    this.deselect(this.getRecords([dom]));
            }, this);

            Ozone.components.focusable.Focusable.clearOutline(el);

        }
    });
})();
