/**
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
Ext.define('Deft.log.Logger', {
  alternateClassName: ['Deft.Logger'],
  singleton: true,
  log: function(message, priority) {},
  error: function(message) {
    this.log(message, 'error');
  },
  info: function(message) {
    this.log(message, 'info');
  },
  verbose: function(message) {
    this.log(message, 'verbose');
  },
  warn: function(message) {
    this.log(message, 'warn');
  },
  deprecate: function(message) {
    this.log(message, 'deprecate');
  }
}, function() {
  var _ref;
  if (Ext.isFunction((_ref = Ext.Logger) != null ? _ref.log : void 0)) {
    this.log = Ext.Logger.log;
  } else if (Ext.isFunction(Ext.log)) {
    this.log = function(message, priority) {
      if (priority == null) priority = 'info';
      if (priority === 'deprecate') priority = 'warn';
      Ext.log({
        msg: message,
        level: priority
      });
    };
  }
});
