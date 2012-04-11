Ext.define('ADV.controller.AnimatedDataViewController',
    {
        // Extend the Controller class to handle events for the views.
        extend:'Ext.app.Controller',

        // Setup the views.
        views:[
            'AnimatedDataViewPanel'
        ],

        // Setup the stores and models so they can be referenced and loaded into the views.
        stores:[
            'AnimatedDataViewStore'
        ],

        // TODO: implement DeftJS injection here, override "store". Remove above declaration of stores.
        /*
         mixins: [ 'Deft.mixin.Injectable' ],
         inject: {
         store: 'animatedDataViewStore'
         },*/

        models:[
            'AnimatedDataViewModel'
        ],

        // Setup listeners here using the control function. References to view components are
        // retrieved using the ComponentQuery engine.
        init:function () {
            this.control(
                {
                    // Query the phone slider by id in the AnimatedViewPanel ':
                    'animatedDataViewPanel #phonSlider':{
                        // Pass in object, mapping event names to handler functions.
                        change:{
                            buffer:70,
                            fn:this.filterData
                        }
                    }

                });
        },

        // Handler function(s)
        filterData:function (slider) {
            var values = slider.getValues();

            // TODO: Removed when DeftJS injection is implemented. Injection should override "store".
            // This is what happens when you don't follow the naming convention.
            var store = this.getAnimatedDataViewStoreStore();

            store.suspendEvents();
            store.clearFilter();
            store.resumeEvents();
            store.filter([
                {
                    fn:function (record) {
                        return record.get('price') >= values[0] && record.get('price') <= values[1];
                    }
                }
            ]);

            store.sort('name', 'ASC');
            console.log('Slider Values: ' + values[0] + " " + values[1]);
        }

    });
