Ext.define('ADV.controller.AnimatedDataViewController',
    {
        // Extend the Controller class to handle events for the views.
        extend:'Ext.app.Controller',

        // Setup the views.
        views:[
            'AnimatedDataViewPanel'
        ],

        // Mark the Controller as Injectable and specify dependencies for injection.
        mixins: [ 'Deft.mixin.Injectable' ],
        inject: {
            store: 'animatedDataViewStore'
        },

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

            this.store.suspendEvents();
            this.store.clearFilter();
            this.store.resumeEvents();
            this.store.filter([
                {
                    fn:function (record) {
                        return record.get('price') >= values[0] && record.get('price') <= values[1];
                    }
                }
            ]);

            this.store.sort('name', 'ASC');
            console.log('Slider Values: ' + values[0] + " " + values[1]);
        }

    });
