/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
/**
A lightweight MVC view controller.

Used in conjunction with {@link Deft.mixin.Controllable}.
*/
Ext.define('Deft.mvc.ViewController', {
  alternateClassName: ['Deft.ViewController'],
  requires: ['Deft.log.Logger'],
  config: {
    /**
    		View controlled by this ViewController.
    */
    view: null
  },
  constructor: function(config) {
    this.initConfig(config);
    if (this.getView() instanceof Ext.ClassManager.get('Ext.Component')) {
      this.registeredComponents = {};
      this.isExtJS = this.getView().events != null;
      this.isSenchaTouch = !this.isExtJS;
      if (this.isExtJS) {
        if (this.getView().rendered) {
          this.onViewInitialize();
        } else {
          this.getView().on('afterrender', this.onViewInitialize, this, {
            single: true
          });
        }
      } else {
        if (this.getView().initialized) {
          this.onViewInitialize();
        } else {
          this.getView().on('initialize', this.onViewInitialize, this, {
            single: true
          });
        }
      }
    } else {
      Ext.Error.raise({
        msg: 'Error constructing ViewController: the configured \'view\' is not an Ext.Component.'
      });
    }
    return this;
  },
  /**
  	Initialize the ViewController
  */
  init: function() {},
  /**
  	Destroy the ViewController
  */
  destroy: function() {
    return true;
  },
  /**
  	@private
  */
  onViewInitialize: function() {
    var component, config, id, listeners, originalViewDestroyFunction, self, _ref;
    if (this.isExtJS) {
      this.getView().on('beforedestroy', this.onViewBeforeDestroy, this);
      this.getView().on('destroy', this.onViewDestroy, this, {
        single: true
      });
    } else {
      self = this;
      originalViewDestroyFunction = this.getView().destroy;
      this.getView().destroy = function() {
        if (self.destroy()) {
          originalViewDestroyFunction.call(this);
          this.destroy = originalViewDestroyFunction;
        }
      };
    }
    _ref = this.control;
    for (id in _ref) {
      config = _ref[id];
      component = this.locateComponent(id, config);
      listeners = Ext.isObject(config.listeners) ? config.listeners : !(config.selector != null) ? config : void 0;
      this.registerComponent(id, component, listeners);
    }
    this.init();
  },
  /**
  	@private
  */
  onViewBeforeDestroy: function() {
    if (this.destroy()) {
      this.getView().un('beforedestroy', this.onBeforeDestroy, this);
      return true;
    }
    return false;
  },
  /**
  	@private
  */
  onViewDestroy: function() {
    var id;
    for (id in this.registeredComponents) {
      this.unregisterComponent(id);
    }
  },
  /**
  	@private
  */
  getComponent: function(id) {
    var _ref;
    return (_ref = this.registeredComponents[id]) != null ? _ref.component : void 0;
  },
  /**
  	@private
  */
  registerComponent: function(id, component, listeners) {
    var event, existingComponent, getterName, listener;
    Deft.Logger.log("Registering '" + id + "' component.");
    existingComponent = this.getComponent(id);
    if (existingComponent != null) {
      Ext.Error.raise({
        msg: "Error registering component: an existing component already registered as '" + id + "'."
      });
    }
    this.registeredComponents[id] = {
      component: component,
      listeners: listeners
    };
    if (id !== 'view') {
      getterName = 'get' + Ext.String.capitalize(id);
      if (!this[getterName]) {
        this[getterName] = Ext.Function.pass(this.getComponent, [id], this);
      }
    }
    if (Ext.isObject(listeners)) {
      for (event in listeners) {
        listener = listeners[event];
        Deft.Logger.log("Adding '" + event + "' listener to '" + id + "'.");
        if (Ext.isFunction(this[listener])) {
          component.on(event, this[listener], this);
        } else {
          Ext.Error.raise({
            msg: "Error adding '" + event + "' listener: the specified handler '" + listener + "' is not a Function or does not exist."
          });
        }
      }
    }
  },
  /**
  	@private
  */
  unregisterComponent: function(id) {
    var component, event, existingComponent, getterName, listener, listeners, _ref;
    Deft.Logger.log("Unregistering '" + id + "' component.");
    existingComponent = this.getComponent(id);
    if (!(existingComponent != null)) {
      Ext.Error.raise({
        msg: "Error unregistering component: no component is registered as '" + id + "'."
      });
    }
    _ref = this.registeredComponents[id], component = _ref.component, listeners = _ref.listeners;
    if (Ext.isObject(listeners)) {
      for (event in listeners) {
        listener = listeners[event];
        Deft.Logger.log("Removing '" + event + "' listener from '" + id + "'.");
        if (Ext.isFunction(this[listener])) {
          component.un(event, this[listener], this);
        } else {
          Ext.Error.raise({
            msg: "Error removing '" + event + "' listener: the specified handler '" + listener + "' is not a Function or does not exist."
          });
        }
      }
    }
    if (id !== 'view') {
      getterName = 'get' + Ext.String.capitalize(id);
      this[getterName] = null;
    }
    this.registeredComponents[id] = null;
  },
  /**
  	@private
  */
  locateComponent: function(id, config) {
    var matches, view;
    view = this.getView();
    if (id === 'view') return view;
    if (Ext.isString(config)) {
      matches = view.query(config);
      if (matches.length === 0) {
        Ext.Error.raise({
          msg: "Error locating component: no component found matching '" + config + "'."
        });
      }
      if (matches.length > 1) {
        Ext.Error.raise({
          msg: "Error locating component: multiple components found matching '" + config + "'."
        });
      }
      return matches[0];
    } else if (Ext.isString(config.selector)) {
      matches = view.query(config.selector);
      if (matches.length === 0) {
        Ext.Error.raise({
          msg: "Error locating component: no component found matching '" + config.selector + "'."
        });
      }
      if (matches.length > 1) {
        Ext.Error.raise({
          msg: "Error locating component: multiple components found matching '" + config.selector + "'."
        });
      }
      return matches[0];
    } else {
      matches = view.query('#' + id);
      if (matches.length === 0) {
        Ext.Error.raise({
          msg: "Error locating component: no component found with an itemId of '" + id + "'."
        });
      }
      if (matches.length > 1) {
        Ext.Error.raise({
          msg: "Error locating component: multiple components found with an itemId of '" + id + "'."
        });
      }
      return matches[0];
    }
  }
});
