/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
Ext.define('Deft.promise.Deferred', {
  alternateClassName: ['Deft.Deferred'],
  constructor: function() {
    this.state = 'pending';
    this.progress = void 0;
    this.value = void 0;
    this.progressCallbacks = [];
    this.successCallbacks = [];
    this.failureCallbacks = [];
    this.cancelCallbacks = [];
    this.promise = Ext.create('Deft.Promise', this);
    return this;
  },
  /**
  	Returns a new {@link Deft.promise.Promise} with the specified callbacks registered to be called when this {@link Deft.promise.Deferred} is resolved, rejected, updated or cancelled.
  */
  then: function(callbacks) {
    var callback, cancelCallback, deferred, failureCallback, progressCallback, successCallback, wrapCallback, wrapProgressCallback, _i, _len, _ref;
    if (Ext.isObject(callbacks)) {
      successCallback = callbacks.success, failureCallback = callbacks.failure, progressCallback = callbacks.progress, cancelCallback = callbacks.cancel;
    } else {
      successCallback = arguments[0], failureCallback = arguments[1], progressCallback = arguments[2], cancelCallback = arguments[3];
    }
    _ref = [successCallback, failureCallback, progressCallback, cancelCallback];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      if (!(Ext.isFunction(callback) || callback === null || callback === void 0)) {
        Ext.Error.raise({
          msg: 'Error while configuring callback: a non-function specified.'
        });
      }
    }
    deferred = Ext.create('Deft.promise.Deferred');
    wrapCallback = function(callback, action) {
      return function(value) {
        var result;
        if (Ext.isFunction(callback)) {
          try {
            result = callback(value);
            if (result === void 0) {
              deferred[action](value);
            } else if (result instanceof Ext.ClassManager.get('Deft.promise.Promise') || result instanceof Ext.ClassManager.get('Deft.promise.Deferred')) {
              result.then(Ext.bind(deferred.resolve, deferred), Ext.bind(deferred.reject, deferred), Ext.bind(deferred.update, deferred), Ext.bind(deferred.cancel, deferred));
            } else {
              deferred.resolve(result);
            }
          } catch (error) {
            deferred.reject(error);
          }
        } else {
          deferred[action](value);
        }
      };
    };
    this.register(wrapCallback(successCallback, 'resolve'), this.successCallbacks, 'resolved', this.value);
    this.register(wrapCallback(failureCallback, 'reject'), this.failureCallbacks, 'rejected', this.value);
    this.register(wrapCallback(cancelCallback, 'cancel'), this.cancelCallbacks, 'cancelled', this.value);
    wrapProgressCallback = function(callback) {
      return function(value) {
        var result;
        if (Ext.isFunction(callback)) {
          result = callback(value);
          if (result === void 0) {
            deferred.update(value);
          } else {
            deferred.update(result);
          }
        } else {
          deferred.update(value);
        }
      };
    };
    this.register(wrapProgressCallback(progressCallback), this.progressCallbacks, 'pending', this.progress);
    return deferred.getPromise();
  },
  /**
  	Returns a new {@link Deft.promise.Promise} with the specified callbacks registered to be called when this {@link Deft.promise.Deferred} is either resolved, rejected, or cancelled.
  */
  always: function(alwaysCallback) {
    return this.then({
      success: alwaysCallback,
      failure: alwaysCallback,
      cancel: alwaysCallback
    });
  },
  /**
  	Update progress for this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */
  update: function(progress) {
    if (this.state === 'pending') {
      this.progress = progress;
      this.notify(this.progressCallbacks, progress);
    } else {
      Ext.Error.raise({
        msg: 'Error: this Deferred has already been completed and cannot be modified.'
      });
    }
  },
  /**
  	Resolve this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */
  resolve: function(value) {
    this.complete('resolved', value, this.successCallbacks);
  },
  /**
  	Reject this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */
  reject: function(error) {
    this.complete('rejected', error, this.failureCallbacks);
  },
  /**
  	Cancel this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */
  cancel: function(reason) {
    this.complete('cancelled', reason, this.cancelCallbacks);
  },
  /**
  	Get this {@link Deft.promise.Deferred}'s associated {@link Deft.promise.Promise}.
  */
  getPromise: function() {
    return this.promise;
  },
  /**
  	Get this {@link Deft.promise.Deferred}'s current state.
  */
  getState: function() {
    return this.state;
  },
  /**
  	Register a callback for this {@link Deft.promise.Deferred} for the specified callbacks and state, immediately notifying with the specified value (if applicable).
  	@private
  */
  register: function(callback, callbacks, state, value) {
    if (Ext.isFunction(callback)) {
      if (this.state === 'pending') callbacks.push(callback);
      if (this.state === state && value !== void 0) this.notify([callback], value);
    }
  },
  /**
  	Complete this {@link Deft.promise.Deferred} with the specified state and value.
  	@private
  */
  complete: function(state, value, callbacks) {
    if (this.state === 'pending') {
      this.state = state;
      this.value = value;
      this.notify(callbacks, value);
      this.releaseCallbacks();
    } else {
      Ext.Error.raise({
        msg: 'Error: this Deferred has already been completed and cannot be modified.'
      });
    }
  },
  /**
  	Notify the specified callbacks with the specified value.
  	@private
  */
  notify: function(callbacks, value) {
    var callback, _i, _len;
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      callback(value);
    }
  },
  /**
  	Release references to all callbacks registered with this {@link Deft.promise.Deferred}.
  	@private
  */
  releaseCallbacks: function() {
    this.progressCallbacks = null;
    this.successCallbacks = null;
    this.failureCallbacks = null;
    this.cancelCallbacks = null;
  }
});
