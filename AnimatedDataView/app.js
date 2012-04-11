Ext.onReady(function () {
    Deft.Injector.configure({
        animatedDataViewStore: 'ADV.store.AnimatedDataViewStore'
    });
});

Ext.application({
    name:'ADV',
    appFolder:'app',
    setConfig:({enabled:true}),
    layout:'fit',

    // Load the controllers.
    controllers:[
        'AnimatedDataViewController'
    ],

    launch:function () {
        Ext.create('Ext.container.Viewport', {
            items:[
                {
                    xtype:'animatedDataViewPanel'
                }
            ]
        });
    }
});