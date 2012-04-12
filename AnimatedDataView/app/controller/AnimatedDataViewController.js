Ext.define('ADV.controller.AnimatedDataViewController',
    {
        // Extend the Controller class to handle events for the views.
        extend:'Ext.app.Controller',
        // TODO: Extend DeftJS ViewController instead.
        //extend: 'Deft.mvc.ViewController',

        // Mark the Controller as Injectable and specify dependencies for injection.
        mixins:[ 'Deft.mixin.Injectable' ],
        inject:{
            store:'animatedDataViewStore'
        },

        // TODO: Trying to set up the component reference and listener.  Doesn't want to compile though, syntax issue perhaps?.
        /*
         // Use the control annotation to configure a reference to the component using a
         // view-relative component query selector and also add the event listener.
         control: {
            phoneSlider:
                selector: 'animatedDataViewPanel #phonSlider'
                // TODO: how to specify the buffer argument? See line 46.
                listeners: 'change': 'filterData'
         },
         */

        // Setup the views.
        views:[
            'AnimatedDataViewPanel'
        ],

        models:[
            'AnimatedDataViewModel'
        ],

        // Setup listeners here using the control function. References to view components are
        // retrieved using the ComponentQuery engine.
        init:function () {

            // TODO: Remove when DeftJS controller is implemented.
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

            return this.callParent(arguments);
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
