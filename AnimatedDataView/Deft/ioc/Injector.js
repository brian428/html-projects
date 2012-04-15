/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
/**
A lightweight IoC container for dependency injection.

Used in conjunction with {@link Deft.mixin.Injectable}.
*/
Ext.define('Deft.ioc.Injector', {
  alternateClassName: ['Deft.Injector'],
  requires: ['Deft.log.Logger', 'Deft.ioc.DependencyProvider'],
  singleton: true,
  constructor: function() {
    this.providers = {};
    return this;
  },
  /**
  	Configure the Injector.
  */
  configure: function(configuration) {
    Deft.Logger.log('Configuring injector.');
    Ext.Object.each(configuration, function(identifier, config) {
      var provider;
      Deft.Logger.log("Configuring dependency provider for '" + identifier + "'.");
      if (Ext.isString(config)) {
        provider = Ext.create('Deft.ioc.DependencyProvider', {
          identifier: identifier,
          className: config
        });
      } else {
        provider = Ext.create('Deft.ioc.DependencyProvider', Ext.apply({
          identifier: identifier
        }, config));
      }
      this.providers[identifier] = provider;
    }, this);
    Ext.Object.each(this.providers, function(identifier, provider) {
      if (provider.getEager()) {
        Deft.Logger.log("Eagerly creating '" + (provider.getIdentifier()) + "'.");
        provider.resolve();
      }
    }, this);
  },
  /**
  	Indicates whether the Injector can resolve a dependency by the specified identifier with the corresponding object instance or value.
  */
  canResolve: function(identifier) {
    var provider;
    provider = this.providers[identifier];
    return provider != null;
  },
  /**
  	Resolve a dependency (by identifier) with the corresponding object instance or value.
  	
  	Optionally, the caller may specify the target instance (to be supplied to the dependency provider's factory function, if applicable).
  */
  resolve: function(identifier, targetInstance) {
    var provider;
    provider = this.providers[identifier];
    if (provider != null) {
      return provider.resolve(targetInstance);
    } else {
      Ext.Error.raise({
        msg: "Error while resolving value to inject: no dependency provider found for '" + identifier + "'."
      });
    }
  },
  /**
  	Inject dependencies (by their identifiers) into the target object instance.
  */
  inject: function(identifiers, targetInstance, targetInstanceIsInitialized) {
    var injectConfig, name, originalInitConfigFunction, setterFunctionName, value;
    if (targetInstanceIsInitialized == null) targetInstanceIsInitialized = true;
    injectConfig = {};
    if (Ext.isString(identifiers)) identifiers = [identifiers];
    Ext.Object.each(identifiers, function(key, value) {
      var identifier, resolvedValue, targetProperty;
      targetProperty = Ext.isArray(identifiers) ? value : key;
      identifier = value;
      resolvedValue = this.resolve(identifier, targetInstance);
      if (targetProperty in targetInstance.config) {
        Deft.Logger.log("Injecting '" + identifier + "' into '" + targetProperty + "' config.");
        injectConfig[targetProperty] = resolvedValue;
      } else {
        Deft.Logger.log("Injecting '" + identifier + "' into '" + targetProperty + "' property.");
        targetInstance[targetProperty] = resolvedValue;
      }
    }, this);
    if (targetInstanceIsInitialized) {
      for (name in injectConfig) {
        value = injectConfig[name];
        setterFunctionName = 'set' + Ext.String.capitalize(name);
        targetInstance[setterFunctionName].call(targetInstance, value);
      }
    } else {
      if (Ext.isFunction(targetInstance.initConfig)) {
        originalInitConfigFunction = targetInstance.initConfig;
        targetInstance.initConfig = function(config) {
          var result;
          result = originalInitConfigFunction.call(this, Ext.Object.merge({}, config || {}, injectConfig));
          this.initConfig = originalInitConfigFunction;
          return result;
        };
      }
    }
    return targetInstance;
  }
});
