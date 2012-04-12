Ext.define('ADV.view.AnimatedDataViewPanel', {

        extend:'Ext.panel.Panel',
        alias:'widget.animatedDataViewPanel',
        setConfig:{enabled:true},
        title:'Animated DataView MVC DeftJS',
        autoShow:true,
        height:555,
        width:650,
        layout:'fit',

        mixins: [ 'Deft.mixin.Injectable', 'Deft.mixin.Controllable' ],
        controller: 'ADV.controller.AnimatedDataViewController',
        inject: {
           store: 'animatedDataViewStore'
        },

        // Create child components.
        initComponent:function () {
            this.createChildren();
            this.callParent(arguments);
        },

        createChildren:function () {

            // Tab bar label.
            var tabBarLabel = Ext.create('Ext.form.Label', {
                text:'Filter phone price:',
                margins:'0 5 0 5'
            });

            // Phone slider.
            var phoneSlider = Ext.create('Ext.slider.Multi', {
                id:'phoneSlider',
                hideLabel:true,
                width:300,
                minValue:0,
                maxValue:500,
                values:[80, 320]
            });

            //  Add label and slider to a tab bar.
            var tabBar = Ext.create('Ext.tab.Bar', {
                layout:'fit',
                items:[tabBarLabel, phoneSlider]

            });

            // Create the main data view.
            var dataview = Ext.create('Ext.view.View', {
                deferInitialRefresh:false,
                store: this.store,
                tpl:Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<div class="phone">',
                    (!Ext.isIE6 ? '<img width="64" height="64" src="resources/images/phones/{[values.name.replace(/ /g, "-")]}.png" />' :
                        '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'images/phones/{[values.name.replace(/ /g, "-")]}.png\',sizingMethod=\'scale\')"></div>'),
                    '<strong>{name}</strong>',
                    '<span>{price:usMoney} ({reviews} Review{[values.reviews == 1 ? "" : "s"]})</span>',
                    '</div>',
                    '</tpl>'
                ),

                 plugins:[
                 Ext.create('ADV.view.Animated', {
                 duration:550,
                 idProperty:'id'
                 })
                 ],
                id:'phones',

                itemSelector:'div.phone',
                overItemCls:'phone-hover',
                multiSelect:true,
                autoScroll:true
            });

            this.tbar = tabBar;
            this.items = [dataview];
        }
    }
);