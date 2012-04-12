Ext.define('ADV.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: ['ADV.view.AnimatedDataViewPanel'],

    layout: 'fit',

    initComponent: function() {
        this.items = [
            {
                xtype: 'animatedDataViewPanel'
            }
        ];
        return this.callParent(arguments);
    }
});