/**
 * @license
 *
 * Bring
 * loads data with several options (cache, callback, progress bar ...)
 * @author idomusha / https://github.com/idomusha
 *
 * Dependencies:
 *  - NProgress [OPTIONAL]
 */

(function(window, $) {
  var s;
  var Bring = {

    defaults: {

      // processing status
      ready: true,

      // processing class
      class: 'js-bring-loading',

      // debug mode
      debug: false,

      oDataCache: {}
    },

    options: {},

    settings: {},

    init: function() {
      // merge defaults and options, without modifying defaults explicitly
      this.settings = $.extend({}, this.defaults, this.options);
      s = this.settings;

      if (s.debug) console.log('##################### init()');
    },

    /**
     * AJAX request
     * generic function to load data
     *
     * @method load
     * @param {String} url (default: The current page): A string containing the URL to which the request is sent (path relative to the 'ajax/' directory ).
     * @param {String} returned (default: Intelligent Guess (xml, json, script, or html)): The type of data that you're expecting back from the server.
     * @param {Function} success: A function to be called if the request succeeds.
     * @param {Object or String} param: Data to be sent to the server. It is converted to a query string, if not already a string.
     * @param {String} request (default: 'GET'): The type of request to make ("POST" or "GET").
     * @param {Boolean} [loader=false]: Active or not the pre-request callback function beforeSend.
     * @param {Boolean} [fail=false]: Active or not the error callback function (if the request fails).
     */
    load: function(options) {

      options = $.extend({
        url: '',
        returned: 'html',
        callback: null,
        param: {},
        request: 'GET',
        loader: null,
        fail: null
      }, options);

      if (s.debug) console.log('##################### load()');
      var loading;
      var after;
      var succeed;
      var failed;

      loading = function(jqXHR, settings) {
        if (s.debug) console.log('~~~~~~~~ beforeSend ~~~~~~~~');
        s.ready = false;
        $('body').addClass(s.class);

        // loader specified
        if ($.isFunction(options.loader)) {
          eval(options.loader());
        }

        // NProgress (default loader) : start
        try {
          NProgress.start();
        }
        catch (e) {
          console.info('Bring: NProgress is not installed.');
        }
      }

      after = function(jqXHR, textStatus ){
        if (s.debug) console.log('~~~~~~~~ complete ~~~~~~~~');
        s.ready = true;
        $('body').removeClass(s.class);

        // NProgress (default loader) : end
        try {
          NProgress.done();
        }
        catch (e) {
          //console.log(e);
        }
      }

      succeed = function(data) {
        if (s.debug) console.log('~~~~~~~~ success ~~~~~~~~');

        s.oDataCache[options.url] = data;

        // default callback

        // callback specified
        if ($.isFunction(options.callback)) {
          eval(options.callback(data));
        }
      }

      failed = function(jqXHR, textStatus, errorThrown) {
        if (s.debug) console.log('~~~~~~~~ error ~~~~~~~~');

        // callback specified
        if ($.isFunction(options.fail)) {
          eval(options.fail());
        }
      }

      // Relative URL
      /*if (!(url.match('^http'))) {
       url = settingsGlobal.pathAjax + url;
       }*/

      //console.log('url: '+url);
      //console.log('datType: '+returned);
      //console.log('success: '+callback);
      //console.log('data: '+param);
      //console.log('type: '+request);
      //console.log('beforeSend: '+loader);
      //console.log('error: '+fail);

      $.ajax({
        cache: false,
        type: options.request,
        url: options.url,
        data: options.param,
        dataType: options.returned,
        error: failed,
        beforeSend: loading,
        complete: after,
        success: succeed
      });
    },

    destroy: function() {
      if (s.debug) console.log('##################### destroy()');
      $.removeData(Bring.get(0));
    },

    refresh: function() {
      if (s.debug) console.log('##################### refresh()');
      Bring.destroy();
      Bring.init();
    }
  }
  window.Bring = Bring;
  Bring.init();
})(window, jQuery);
