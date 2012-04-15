Ext.define('ADV.controller.AnimatedDataViewController',
    {
        // Extend DeftJS ViewController
        extend: 'Deft.mvc.ViewController',

        // Mark the Controller as Injectable and specify dependencies for injection.
        mixins:[ 'Deft.mixin.Injectable' ],
        inject:{
            store:'animatedDataViewStore'
        },

        // Use the control annotation to configure a reference to the component using a
        // view-relative component query selector and also add the event listener.
        control:{
            phoneSlider: {
                listeners: {
                    change: {
                        fn: 'filterData',
                        buffer: 70
                    }
                }
            }
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
