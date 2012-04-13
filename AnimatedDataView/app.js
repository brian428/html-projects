Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': 'ext-4.0/src',
        'ADV': 'app'
    }
});

Ext.require('ADV.view.Viewport');

Ext.onReady(function () {
    Deft.Injector.configure({
        animatedDataViewStore: 'ADV.store.AnimatedDataViewStore'
    });

    Ext.create('ADV.view.Viewport', {
        renderTo: 'body'
    });
});
