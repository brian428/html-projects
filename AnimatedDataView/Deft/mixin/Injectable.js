/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
/**
A mixin that marks a class as participating in dependency injection.

Used in conjunction with {@link Deft.ioc.Injector}.
*/
Ext.define('Deft.mixin.Injectable', {
  requires: ['Deft.ioc.Injector'],
  /**
  	@private
  */
  onClassMixedIn: function(targetClass) {
    targetClass.prototype.constructor = Ext.Function.createInterceptor(targetClass.prototype.constructor, function() {
      return Deft.Injector.inject(this.inject, this);
    });
  }
});
