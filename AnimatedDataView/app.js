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

        // TODO: DeftJS, this results in Uncaught Ext.Error: Error while resolving
        // value to inject: no dependency provider found for 'animatedDataViewStore'.
        Deft.Injector.configure({
            animatedDataViewStore:'ADV.store.AnimatedDataViewStore'

        });

        Ext.create('Ext.container.Viewport', {
            items:[
                {
                    xtype:'animatedDataViewPanel'
                }
            ]
        })



    }
});