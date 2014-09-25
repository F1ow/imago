angular.module("ImagoWidgetsTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/imagoWidgets/contact-widget.html","<div class=\"nex form\"><form name=\"nexContact\" ng-submit=\"submitForm(nexContact.$valid)\" novalidate=\"novalidate\"><div class=\"nex field\"><label for=\"name\">Name</label><input type=\"text\" name=\"name\" ng-model=\"contact.name\" placeholder=\"Name\" require=\"require\"/></div><div class=\"nex field\"><label for=\"email\">Email</label><input type=\"email\" name=\"email\" ng-model=\"contact.email\" placeholder=\"Email\" require=\"require\"/></div><div class=\"nex field\"><label for=\"message\">Message</label><textarea name=\"message\" ng-model=\"contact.message\" placeholder=\"Your message.\" require=\"require\"></textarea></div><div class=\"nex checkbox\"><input type=\"checkbox\" name=\"subscribe\" ng-model=\"contact.subscribe\" checked=\"checked\"/><label for=\"subscribe\">Subscribe</label></div><div class=\"formcontrols\"><button type=\"submit\" ng-disabled=\"nexContact.$invalid\" class=\"send\">Send</button></div></form><div class=\"sucess\"><span>Thank You!</span></div><div class=\"error\"><span>Error!</span></div></div>");
$templateCache.put("/imagoWidgets/controls-widget.html","<div class=\"controls\"><a ng-click=\"togglePlay()\" ng-hide=\"isPlaying\" class=\"play fa fa-play\"></a><a ng-click=\"togglePlay()\" ng-show=\"isPlaying\" class=\"pause fa fa-pause\"></a><span class=\"time\">{{currentTime | time}}</span><span class=\"seekbar\"><input type=\"range\" ng-model=\"currentTime\" min=\"0\" max=\"{{duration}}\" ng-change=\"seek(currentTime)\" class=\"seek\"/></span><a ng-click=\"toggleSize()\" class=\"size\">{{wrapperStyle.size}}</a><span class=\"volume\"><span ng-click=\"volumeUp()\" class=\"fa fa-volume-up icon-volume-up\"></span><input type=\"range\" ng-model=\"volumeInput\" ng-change=\"onVolumeChange(volumeInput)\"/><span ng-click=\"volumeDown()\" class=\"fa fa-volume-down icon-volume-down\"></span></span><a ng-click=\"fullScreen()\" class=\"fullscreen fa fa-expand\"></a><a class=\"screen fa fa-compress\"></a></div>");
$templateCache.put("/imagoWidgets/image-widget.html","<div in-view=\"visible = $inview\" ng-style=\"elementStyle\" ng-class=\"status\" visible=\"visible\" class=\"imagoimage imagowrapper\"><div ng-style=\"imageStyle\" class=\"image\"></div><div class=\"loading\"><div class=\"spin\"></div><div class=\"spin2\"></div></div></div>");
$templateCache.put("/imagoWidgets/slider-widget.html","<div ng-class=\"elementStyle\"><div ng-transclude=\"ng-transclude\"></div><div ng-style=\"sliderStyle\" ng-swipe-left=\"goPrev()\" ng-swipe-right=\"goNext()\" class=\"nexslider {{confSlider.animation}}\"><div ng-show=\"confSlider.enablearrows &amp;&amp; loadedData\" ng-click=\"goPrev($event)\" class=\"prev\"></div><div ng-show=\"confSlider.enablearrows &amp;&amp; loadedData\" ng-click=\"goNext($event)\" stop-propagation=\"stop-propagation\" class=\"next\"></div><div ng-class=\"{\'active\': $index === currentIndex, \'nextslide\': $index === nextIndex, \'prevslide\': $index === prevIndex}\" ng-repeat=\"slide in slideSource\" ng-show=\"displaySlides($index)\" class=\"slide\"><div imago-image=\"imago-image\" dimensions=\"dimensions\" source=\"slide\" sizemode=\"{{ $parent.confSlider.sizemode }}\"></div></div></div></div>");
$templateCache.put("/imagoWidgets/video-widget.html","<div ng-class=\"{loading: loading}\" in-view=\"visible = $inview\" visible=\"visible\" class=\"imagovideo {{wrapperStyle.backgroundPosition}} {{wrapperStyle.size}} {{wrapperStyle.sizemode}}\"><div ng-style=\"wrapperStyle\" ng-class=\"{playing: isPlaying}\" class=\"imagowrapper\"><a ng-hide=\"loading\" ng-click=\"togglePlay()\" ng-class=\"{playing: isPlaying}\" class=\"playbig fa fa-play\"></a><video ng-style=\"videoStyle\"><source ng-repeat=\"format in videoFormats\" src=\"{{format.src}}\" data-size=\"{{format.size}}\" data-codec=\"{{format.codec}}\" type=\"{{format.type}}\"/></video><div imago-controls=\"imago-controls\" ng-style=\"controlStyle\" ng-if=\"controls\" ng-show=\"hasPlayed\"></div></div></div>");}]);
var App;

App = (function() {
  function App() {
    return ['ImagoWidgetsTemplates'];
  }

  return App;

})();

angular.module('imago.widgets.angular', App());

var imagoCompile;

imagoCompile = (function() {
  function imagoCompile($compile) {
    return function(scope, element, attrs) {
      var compile, htmlName;
      compile = function(newHTML) {
        newHTML = $compile(newHTML)(scope);
        return element.html("").append(newHTML);
      };
      htmlName = attrs.compile;
      return scope.$watch(htmlName, function(newHTML) {
        if (!newHTML) {
          return;
        }
        return compile(newHTML);
      });
    };
  }

  return imagoCompile;

})();

angular.module('imago.widgets.angular').directive('imagoCompile', ['$compile', imagoCompile]);

var imagoContact;

imagoContact = (function() {
  function imagoContact(imagoSubmit) {
    return {
      replace: true,
      scope: {},
      templateUrl: '/imagoWidgets/contact-widget.html',
      controller: function($scope) {
        return $scope.submitForm = (function(_this) {
          return function(isValid) {
            if (isValid) {
              return imagoSubmit.send($scope.contact);
            }
          };
        })(this);
      }
    };
  }

  return imagoContact;

})();

angular.module('imago.widgets.angular').directive('imagoContact', ['imagoSubmit', imagoContact]);

var imagoControls;

imagoControls = (function() {
  function imagoControls() {
    return {
      replace: true,
      scope: true,
      require: '^imagoVideo',
      templateUrl: '/imagoWidgets/controls-widget.html',
      controller: function($scope) {
        var videoPlayer;
        videoPlayer = angular.element($scope.player);
        $scope.currentTime = 0;
        videoPlayer.bind('loadeddata', function() {
          $scope.duration = parseInt($scope.player.duration);
          return $scope.$apply();
        });
        return videoPlayer.bind('timeupdate', function(e) {
          $scope.currentTime = $scope.player.currentTime;
          return $scope.$apply();
        });
      },
      link: function(scope, element, attrs) {
        scope.seek = function(value) {
          return scope.player.currentTime = value;
        };
        scope.onVolumeChange = (function(_this) {
          return function(e) {
            return scope.player.volume = parseFloat(e / 100);
          };
        })(this);
        scope.volumeDown = (function(_this) {
          return function() {
            scope.player.volume = 0;
            return scope.volumeInput = 0;
          };
        })(this);
        scope.volumeUp = (function(_this) {
          return function() {
            scope.player.volume = 1;
            return scope.volumeInput = 100;
          };
        })(this);
        return scope.fullScreen = (function(_this) {
          return function() {
            if (scope.player.requestFullscreen) {
              return scope.player.requestFullscreen();
            } else if (scope.player.webkitRequestFullscreen) {
              return scope.player.webkitRequestFullscreen();
            } else if (scope.player.mozRequestFullScreen) {
              return scope.player.mozRequestFullScreen();
            } else if (scope.player.msRequestFullscreen) {
              return scope.player.msRequestFullscreen();
            }
          };
        })(this);
      }
    };
  }

  return imagoControls;

})();

angular.module('imago.widgets.angular').directive('imagoControls', [imagoControls]);

var imagoImage;

imagoImage = (function() {
  function imagoImage($window, $q) {
    return {
      replace: true,
      scope: true,
      templateUrl: '/imagoWidgets/image-widget.html',
      controller: function($scope, $element, $attrs) {
        $scope.status = 'loading';
        return $scope.imageStyle = {};
      },
      link: function(scope, element, attrs) {
        var defaults, key, opts, render, self, source, sourcePromise, value, visiblePromise;
        self = {};
        opts = {};
        source = {};
        defaults = {
          align: 'center center',
          sizemode: 'fit',
          hires: true,
          responsive: true,
          scale: 1,
          lazy: true,
          maxsize: 2560,
          mediasize: false,
          width: '',
          height: ''
        };
        for (key in defaults) {
          value = defaults[key];
          opts[key] = value;
        }
        for (key in attrs) {
          value = attrs[key];
          opts[key] = value;
        }
        if (opts.lazy) {
          visiblePromise = (function(_this) {
            return function() {
              var deffered;
              deffered = $q.defer();
              self.visibleFunc = scope.$watch(attrs['visible'], function(value) {
                if (!value) {
                  return;
                }
                return deffered.resolve(value);
              });
              return deffered.promise;
            };
          })(this)();
        }
        sourcePromise = (function(_this) {
          return function() {
            var deffered;
            deffered = $q.defer();
            self.watch = scope.$watch(attrs['source'], function(data) {
              if (!data) {
                return;
              }
              return deffered.resolve(data);
            });
            return deffered.promise;
          };
        })(this)();
        sourcePromise.then((function(_this) {
          return function(data) {
            if (!attrs['watch']) {
              self.watch();
            }
            source = data;
            if (opts.lazy) {
              return visiblePromise.then(function(value) {
                self.visibleFunc();
                return render(source);
              });
            } else {
              return render(data);
            }
          };
        })(this));
        render = (function(_this) {
          return function(data) {
            var dpr, height, img, r, servingSize, servingUrl, width, wrapperRatio;
            if (!(data != null ? data.serving_url : void 0)) {
              element.remove();
              return;
            }
            if (opts.dimensions && attrs['dimensions']) {
              scope.$watch(attrs['dimensions'], function(value) {
                return angular.forEach(value, function(value, key) {
                  return opts[key] = value;
                });
              });
            }
            if (!scope.elementStyle) {
              scope.elementStyle = {};
            }
            if (angular.isString(data.resolution)) {
              r = data.resolution.split('x');
              opts.resolution = {
                width: r[0],
                height: r[1]
              };
              opts.assetRatio = r[0] / r[1];
            }
            if (opts.width && opts.height) {
              width = parseInt(opts.width);
              height = parseInt(opts.height);
            } else {
              width = element[0].clientWidth;
              height = element[0].clientHeight;
            }
            wrapperRatio = width / height;
            dpr = opts.hires ? Math.ceil($window.devicePixelRatio) || 1 : 1;
            if (opts.sizemode === 'crop') {
              if (opts.assetRatio <= wrapperRatio) {
                servingSize = Math.round(Math.max(width, width / opts.assetRatio));
              } else {
                servingSize = Math.round(Math.max(height, height * opts.assetRatio));
              }
            } else {
              if (opts.assetRatio <= wrapperRatio) {
                servingSize = Math.round(Math.max(height, height * opts.assetRatio));
              } else {
                servingSize = Math.round(Math.max(width, width / opts.assetRatio));
              }
            }
            servingSize = parseInt(Math.min(servingSize * dpr, opts.maxsize), 10);
            servingUrl = "" + data.serving_url + "=s" + (servingSize * opts.scale);
            opts.servingSize = servingSize;
            if (!opts.responsive) {
              scope.imageStyle.width = "" + (parseInt(width, 10)) + "px";
              scope.imageStyle.height = "" + (parseInt(height, 10)) + "px";
            }
            img = angular.element('<img>');
            img.on('load', function(e) {
              scope.imageStyle.backgroundImage = "url(" + servingUrl + ")";
              scope.imageStyle.backgroundSize = scope.calcMediaSize();
              scope.imageStyle.backgroundPosition = opts.align;
              scope.imageStyle.display = 'inline-block';
              scope.status = 'loaded';
              return scope.$apply();
            });
            return img[0].src = servingUrl;
          };
        })(this);
        scope.calcMediaSize = (function(_this) {
          return function() {
            var wrapperRatio;
            opts.width = element[0].clientWidth || opts.width;
            opts.height = element[0].clientHeight || opts.height;
            if (!(opts.width && opts.height)) {
              return;
            }
            wrapperRatio = opts.width / opts.height;
            if (opts.sizemode === 'crop') {
              if (opts.assetRatio < wrapperRatio) {
                return "100% auto";
              } else {
                return "auto 100%";
              }
            } else {
              if (opts.assetRatio > wrapperRatio) {
                return "100% auto";
              } else {
                return "auto 100%";
              }
            }
          };
        })(this);
        scope.onResize = (function(_this) {
          return function() {
            return scope.imageStyle['background-size'] = scope.calcMediaSize();
          };
        })(this);
        scope.$on('resizelimit', (function(_this) {
          return function() {
            if (opts.responsive) {
              return scope.onResize();
            }
          };
        })(this));
        return scope.$on('resizestop', (function(_this) {
          return function() {
            if (opts.responsive) {
              return render(source);
            }
          };
        })(this));
      }
    };
  }

  return imagoImage;

})();

angular.module('imago.widgets.angular').directive('imagoImage', ['$window', '$q', imagoImage]);

var imagoSlider;

imagoSlider = (function() {
  function imagoSlider($q, $document, imagoModel) {
    return {
      replace: true,
      scope: true,
      transclude: true,
      templateUrl: '/imagoWidgets/slider-widget.html',
      controller: function($scope) {
        $scope.confSlider = {};
        this.defaults = {
          animation: 'fade',
          sizemode: 'fit',
          current: 0,
          enablekeys: true,
          enablearrows: true,
          enablehtml: true,
          subslides: false,
          loop: true,
          noResize: false,
          current: 0,
          lazy: false,
          align: 'center center'
        };
        return angular.forEach(this.defaults, function(value, key) {
          return $scope.confSlider[key] = value;
        });
      },
      link: function(scope, element, attrs) {
        var getSiblings, prepareSlides, self, sourcePromise;
        self = {};
        angular.forEach(attrs, function(value, key) {
          return scope.confSlider[key] = value;
        });
        sourcePromise = (function(_this) {
          return function() {
            var deffered;
            deffered = $q.defer();
            self.watch = scope.$watch(attrs['source'], function(data) {
              if (!data) {
                return;
              }
              return deffered.resolve(data);
            });
            return deffered.promise;
          };
        })(this)();
        sourcePromise.then((function(_this) {
          return function(data) {
            if (!data) {
              return;
            }
            if (!attrs['watch']) {
              self.watch();
            }
            if (!angular.isArray(data)) {
              return imagoModel.getData(data.path).then(function(response) {
                data = imagoModel.findChildren(response[0]);
                return prepareSlides(data);
              });
            } else {
              return prepareSlides(data);
            }
          };
        })(this));
        prepareSlides = function(data) {
          var item, _i, _len, _ref;
          scope.loadedData = true;
          scope.slideSource = [];
          scope.dimensions = {
            width: element[0].clientWidth,
            height: element[0].clientHeight
          };
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            item = data[_i];
            if (item.serving_url) {
              scope.slideSource.push(item);
            }
          }
          if (((_ref = scope.slideSource) != null ? _ref.length : void 0) <= 1 || !scope.slideSource) {
            scope.confSlider.enablearrows = false;
            scope.confSlider.enablekeys = false;
          }
          scope.currentIndex = 0;
          scope.sliderLength = scope.slideSource.length - 1;
          return getSiblings();
        };
        scope.setCurrentSlideIndex = function(index) {
          scope.currentIndex = index;
          return getSiblings();
        };
        scope.displaySlides = function(index) {
          if (index === scope.currentIndex || scope.nextIndex || scope.prevIndex) {
            return true;
          }
        };
        scope.goNext = function($event) {
          scope.currentIndex = scope.currentIndex < scope.slideSource.length - 1 ? ++scope.currentIndex : 0;
          return getSiblings();
        };
        scope.goPrev = function($event) {
          scope.currentIndex = scope.currentIndex > 0 ? --scope.currentIndex : scope.slideSource.length - 1;
          return getSiblings();
        };
        getSiblings = function() {
          scope.nextIndex = scope.currentIndex === scope.sliderLength ? 0 : scope.currentIndex + 1;
          return scope.prevIndex = scope.currentIndex === 0 ? scope.sliderLength : scope.currentIndex - 1;
        };
        scope.getLast = function() {
          return scope.slideSource.length - 1;
        };
        return $document.on('keydown', function(e) {
          if (!scope.confSlider.enablekeys) {
            return;
          }
          switch (e.keyCode) {
            case 37:
              return scope.$apply(function() {
                return scope.goPrev();
              });
            case 39:
              return scope.$apply(function() {
                return scope.goNext();
              });
          }
        });
      }
    };
  }

  return imagoSlider;

})();

angular.module('imago.widgets.angular').directive('imagoSlider', ['$q', '$document', 'imagoModel', imagoSlider]);

var imagoVideo;

imagoVideo = (function() {
  function imagoVideo($q, $window, imagoUtils, $timeout) {
    return {
      replace: true,
      scope: true,
      templateUrl: '/imagoWidgets/video-widget.html',
      controller: function($scope, $element, $attrs, $transclude) {
        $scope.player = $element.find('video')[0];
        $scope.loading = true;
        return angular.element($scope.player).bind('ended', (function(_this) {
          return function(e) {
            $scope.player.currentTime = 0;
            return $scope.isPlaying = false;
          };
        })(this));
      },
      link: function(scope, element, attrs) {
        var defaults, detectCodec, render, resize, self, sourcePromise, videoOpts, visiblePromise;
        self = {};
        videoOpts = {};
        defaults = {
          autobuffer: null,
          autoplay: false,
          controls: true,
          preload: 'none',
          size: 'hd',
          align: 'left top',
          sizemode: 'fit',
          lazy: true,
          width: '',
          height: '',
          hires: true
        };
        angular.forEach(defaults, (function(_this) {
          return function(value, key) {
            return videoOpts[key] = value;
          };
        })(this));
        angular.forEach(attrs, (function(_this) {
          return function(value, key) {
            return videoOpts[key] = value;
          };
        })(this));
        if (videoOpts.lazy) {
          visiblePromise = (function(_this) {
            return function() {
              var deffered;
              deffered = $q.defer();
              self.visibleFunc = scope.$watch(attrs['visible'], function(value) {
                if (!value) {
                  return;
                }
                return deffered.resolve(value);
              });
              return deffered.promise;
            };
          })(this)();
        }
        sourcePromise = (function(_this) {
          return function() {
            var deffered;
            deffered = $q.defer();
            self.watch = scope.$watch(attrs['source'], function(data) {
              if (!data) {
                return;
              }
              return deffered.resolve(data);
            });
            return deffered.promise;
          };
        })(this)();
        sourcePromise.then((function(_this) {
          return function(data) {
            var r, resolution;
            if (!data) {
              return;
            }
            self.source = data;
            if (angular.isString(data.resolution)) {
              r = data.resolution.split('x');
              resolution = {
                width: r[0],
                height: r[1]
              };
              videoOpts.assetRatio = r[0] / r[1];
            }
            scope.loading = false;
            if (videoOpts.lazy) {
              return visiblePromise.then(function(value) {
                self.visibleFunc();
                return render(self.source);
              });
            } else {
              return render(self.source);
            }
          };
        })(this));
        render = (function(_this) {
          return function(data) {
            var codec, dpr, format, height, i, serving_url, width, _i, _len, _ref;
            if (!scope.wrapperStyle) {
              scope.wrapperStyle = {};
            }
            scope.controls = videoOpts.controls;
            if (videoOpts.width && videoOpts.height) {
              width = parseInt(videoOpts.width);
              height = parseInt(videoOpts.height);
            } else {
              width = element[0].clientWidth;
              height = element[0].clientHeight;
            }
            dpr = _this.hires ? Math.ceil(window.devicePixelRatio) || 1 : 1;
            serving_url = data.serving_url;
            serving_url += "=s" + (Math.ceil(Math.min(Math.max(width, height) * dpr, 1600)));
            scope.wrapperStyle = {
              size: videoOpts.size,
              sizemode: videoOpts.sizemode,
              backgroundPosition: videoOpts.align,
              backgroundImage: "url(" + serving_url + ")",
              backgroundRepeat: "no-repeat"
            };
            scope.player.setAttribute("autoplay", videoOpts.autoplay);
            scope.player.setAttribute("preload", videoOpts.preload);
            scope.player.setAttribute("x-webkit-airplay", "allow");
            scope.player.setAttribute("webkitAllowFullscreen", true);
            scope.videoFormats = [];
            codec = detectCodec();
            data.formats.sort(function(a, b) {
              return b.height - a.height;
            });
            _ref = data.formats;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              format = _ref[i];
              if (codec !== format.codec) {
                continue;
              }
              scope.videoFormats.push({
                "src": "http://" + tenant + ".imagoapp.com/assets/api/\nplay_redirect?uuid=" + data.id + "&codec=" + format.codec + "\n&quality=hd&max_size=" + format.size,
                "size": format.size,
                "codec": format.codec,
                "type": "video/" + codec
              });
            }
            return resize();
          };
        })(this);
        resize = (function(_this) {
          return function() {
            var height, videoStyle, width, wrapperRatio;
            if (!videoOpts) {
              return;
            }
            videoStyle = {};
            width = element[0].clientWidth;
            height = element[0].clientHeight;
            wrapperRatio = width / height;
            if (imagoUtils.isiOS()) {
              videoStyle.width = '100%';
              videoStyle.height = '100%';
              if (videoOpts.align === 'center center' && videoOpts.sizemode === 'crop') {
                videoStyle.top = '0';
                videoStyle.left = '0';
              }
            } else {
              if (videoOpts.sizemode === 'crop') {
                if (videoOpts.assetRatio < wrapperRatio) {
                  videoStyle.width = '100%';
                  videoStyle.height = 'auto';
                  if (videoOpts.align === 'center center') {
                    videoStyle.top = '50%';
                    videoStyle.left = 'auto';
                    videoStyle.marginTop = "-" + (parseInt(height / 2)) + "px";
                    videoStyle.marginLeft = '0px';
                  }
                  scope.wrapperStyle.backgroundSize = '100% auto';
                } else {
                  videoStyle.width = 'auto';
                  videoStyle.height = '100%';
                  if (videoOpts.align === 'center center') {
                    videoStyle.top = 'auto';
                    videoStyle.left = '50%';
                    videoStyle.marginTop = '0px';
                    videoStyle.marginLeft = "-" + (parseInt(width / 2)) + "px";
                  }
                  scope.wrapperStyle.backgroundSize = 'auto 100%';
                }
              } else {
                if (videoOpts.assetRatio < wrapperRatio) {
                  videoStyle.width = 'auto';
                  videoStyle.height = '100%';
                  scope.wrapperStyle.width = "" + (parseInt(height * videoOpts.assetRatio)) + "px";
                  scope.wrapperStyle.height = "" + height + "px";
                  scope.wrapperStyle.backgroundSize = 'auto 100%';
                } else {
                  videoStyle.width = '100%';
                  videoStyle.height = 'auto';
                  scope.wrapperStyle.width = "" + width + "px";
                  scope.wrapperStyle.height = "" + (parseInt(width / videoOpts.assetRatio)) + "px";
                  scope.wrapperStyle.backgroundSize = '100% auto';
                }
              }
            }
            return scope.videoStyle = videoStyle;
          };
        })(this);
        detectCodec = function() {
          var codecs, key, value;
          if (!scope.player.canPlayType) {
            return;
          }
          codecs = {
            mp4: 'video/mp4; codecs="mp4v.20.8"',
            mp4: 'video/mp4; codecs="avc1.42E01E"',
            mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            ogg: 'video/ogg; codecs="theora"'
          };
          for (key in codecs) {
            value = codecs[key];
            if (scope.player.canPlayType(value)) {
              return key;
            }
          }
        };
        scope.togglePlay = (function(_this) {
          return function() {
            if (scope.player.paused) {
              scope.isPlaying = true;
              scope.hasPlayed = true;
              return scope.player.play();
            } else {
              scope.isPlaying = false;
              return scope.player.pause();
            }
          };
        })(this);
        scope.toggleSize = function() {
          if (videoOpts.size === 'hd') {
            videoOpts.size = 'sd';
            scope.wrapperStyle.size = 'sd';
          } else {
            videoOpts.size = 'hd';
            scope.wrapperStyle.size = 'hd';
          }
          return scope.videoFormats.reverse();
        };
        return scope.$on('resizelimit', function() {
          return scope.$apply(resize);
        });
      }
    };
  }

  return imagoVideo;

})();

angular.module('imago.widgets.angular').directive('imagoVideo', ['$q', '$window', 'imagoUtils', '$timeout', imagoVideo]);

var StopPropagation;

StopPropagation = (function() {
  function StopPropagation() {
    return {
      link: function(scope, element, attr) {
        element.bind('click', function(e) {
          return e.stopPropagation();
        });
        return element.bind('dblclick', function(e) {
          return e.stopPropagation();
        });
      }
    };
  }

  return StopPropagation;

})();

angular.module('imago.widgets.angular').directive('stopPropagation', [StopPropagation]);

var imagoPage;

imagoPage = (function() {
  function imagoPage($scope, $state, imagoModel) {
    var path;
    path = '/';
    imagoModel.getData(path).then(function(response) {
      $scope.collection = response[0];
      return $scope.assets = imagoModel.getChildren(response[0]);
    });
  }

  return imagoPage;

})();

angular.module('imago.widgets.angular').controller('imagoPage', ['$scope', '$state', 'imagoModel', imagoPage]);

var imagoModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

imagoModel = (function() {
  function imagoModel($rootScope, $http, $location, $q, $filter, imagoUtils) {
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$location = $location;
    this.$q = $q;
    this.$filter = $filter;
    this.imagoUtils = imagoUtils;
    this.prepareCreation = __bind(this.prepareCreation, this);
    this.isDuplicated = __bind(this.isDuplicated, this);
    this.batchChange = __bind(this.batchChange, this);
    this.orderChanged = __bind(this.orderChanged, this);
    this.reindexAll = __bind(this.reindexAll, this);
    this.reorder = __bind(this.reorder, this);
    this.batchAddRemove = __bind(this.batchAddRemove, this);
    this.paste = __bind(this.paste, this);
    this.move = __bind(this.move, this);
    this["delete"] = __bind(this["delete"], this);
    this.update = __bind(this.update, this);
    this.add = __bind(this.add, this);
    this.findIdx = __bind(this.findIdx, this);
    this.find = __bind(this.find, this);
    this.findByAttr = __bind(this.findByAttr, this);
    this.findParent = __bind(this.findParent, this);
    this.findChildren = __bind(this.findChildren, this);
    this.create = __bind(this.create, this);
    this.getData = __bind(this.getData, this);
  }

  imagoModel.prototype.data = [];

  imagoModel.prototype.currentCollection = void 0;

  imagoModel.prototype.searchUrl = data === 'online' && debug ? "" + window.location.protocol + "//imagoapi.jit.su/api/search" : "/api/search";

  imagoModel.prototype.search = function(query) {
    var params;
    params = this.formatQuery(query);
    return this.$http.post(this.searchUrl, angular.toJson(params));
  };

  imagoModel.prototype.getData = function(query, cache) {
    var promises;
    if (angular.isString(query)) {
      query = [
        {
          path: query
        }
      ];
    }
    query = this.imagoUtils.toArray(query);
    promises = [];
    _.forEach(query, (function(_this) {
      return function(value) {
        return promises.push(_this.search(value).then(function(response) {
          if (!(response.data.length > 0)) {
            return;
          }
          if (value.page) {
            _.forEach(response.data, function(data) {
              return data.page = value.page;
            });
          }
          return _.forEach(response.data, function(data) {
            return _this.create(data);
          });
        }));
      };
    })(this));
    return this.$q.all(promises).then((function(_this) {
      return function(data) {
        data = _.flatten(data);
        return data;
      };
    })(this));
  };

  imagoModel.prototype.formatQuery = function(query) {
    var elem, key, querydict, value, _i, _j, _len, _len1, _ref;
    querydict = {};
    if (angular.isArray(query)) {
      for (_i = 0, _len = query.length; _i < _len; _i++) {
        elem = query[_i];
        for (key in elem) {
          value = elem[key];
          querydict[key] || (querydict[key] = []);
          querydict[key].push(value);
        }
      }
    } else {
      for (key in query) {
        value = query[key];
        querydict[key] = angular.isArray(value) ? value : [value];
      }
    }
    _ref = ['page', 'pagesize'];
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      key = _ref[_j];
      if (querydict.hasOwnProperty(key)) {
        querydict[key] = querydict[key][0];
      }
    }
    return querydict;
  };

  imagoModel.prototype.create = function(data) {
    var oldData;
    oldData = this.find(data._id) || false;
    if (data.assets) {
      _.forEach(data.assets, (function(_this) {
        return function(asset) {
          var oldAsset, _ref;
          oldAsset = _this.find(asset._id) || false;
          if (_.isEqual(oldAsset, asset)) {

          } else if (oldAsset && !_.isEqual(oldAsset, asset)) {
            return _this.update(asset);
          } else {
            if ((_ref = asset.serving_url) != null ? _ref.indexOf('data:image' === 0) : void 0) {
              asset.base64 = true;
            } else {
              asset.base64 = false;
            }
            return _this.data.push(asset);
          }
        };
      })(this));
    }
    if (_.isEqual(oldData, data)) {
      return data;
    } else if (oldData && !_.isEqual(oldData, data)) {
      this.update(data);
      return data;
    } else {
      if (data.items) {
        data = _.omit(data, 'assets');
      }
      this.data.push(data);
      return data;
    }
  };

  imagoModel.prototype.findChildren = function(asset) {
    return _.where(this.data, {
      parent: asset._id
    });
  };

  imagoModel.prototype.findParent = function(asset) {
    return _.find(this.data, {
      _id: asset.parent
    });
  };

  imagoModel.prototype.findByAttr = function(attr) {
    return _.where(this.data, attr);
  };

  imagoModel.prototype.find = function(id) {
    return _.find(this.data, {
      '_id': id
    });
  };

  imagoModel.prototype.findIdx = function(id, attribute) {
    var parameter;
    if (attribute == null) {
      attribute = '_id';
    }
    parameter = {};
    parameter[attribute] = id;
    return _.findIndex(this.data, parameter);
  };

  imagoModel.prototype.add = function(asset) {
    var _ref;
    if (!asset._id) {
      return;
    }
    if ((_ref = asset.serving_url) != null ? _ref.indexOf('data:image' === 0) : void 0) {
      asset.base64 = true;
    } else {
      asset.base64 = false;
    }
    this.data.unshift(asset);
    return this.$rootScope.$broadcast('assets:update');
  };

  imagoModel.prototype.update = function(data, attribute) {
    var asset, idx, _i, _len;
    if (attribute == null) {
      attribute = '_id';
    }
    if (_.isPlainObject(data)) {
      if (!data[attribute]) {
        return;
      }
      if (data.assets) {
        delete data.assets;
      }
      idx = this.findIdx(data[attribute]);
      this.data[idx] = _.assign(this.data[idx], data);
    } else if (_.isArray(data)) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        asset = data[_i];
        if (asset.assets) {
          delete asset.assets;
        }
        idx = this.findIdx(asset[attribute]);
        _.assign(this.data[idx], asset);
      }
    }
    return this.$rootScope.$broadcast('assets:update', data);
  };

  imagoModel.prototype["delete"] = function(id) {
    if (!id) {
      return;
    }
    this.data = _.reject(this.data, {
      _id: id
    });
    this.$rootScope.$broadcast('assets:update');
    return this.data;
  };

  imagoModel.prototype.move = function(data) {
    var assets;
    assets = this.findChildren(data);
    return _.forEach(assets, (function(_this) {
      return function(asset) {
        var order;
        order = _.indexOf(assets, asset);
        return assets.splice(order, 1);
      };
    })(this));
  };

  imagoModel.prototype.paste = function(assets, checkdups) {
    var asset, assetsChildren, defer, exists, i, original_name, _i, _len;
    if (checkdups == null) {
      checkdups = true;
    }
    defer = this.$q.defer();
    assetsChildren = this.findChildren(this.currentCollection);
    for (_i = 0, _len = assets.length; _i < _len; _i++) {
      asset = assets[_i];
      if (!checkdups || _.where(assetsChildren, {
        name: asset.name
      }).length === 0) {
        this.data.unshift(asset);
      } else {
        i = 1;
        exists = true;
        original_name = asset.name;
        while (exists) {
          asset.name = "" + original_name + "_" + i;
          i++;
          exists = (_.where(assetsChildren, {
            name: asset.name
          }).length > 0 ? true : false);
        }
        this.data.unshift(asset);
      }
    }
    this.$rootScope.$broadcast('assets:update');
    defer.resolve(assets);
    return defer.promise;
  };

  imagoModel.prototype.batchAddRemove = function(assets) {
    var asset, _i, _len;
    for (_i = 0, _len = assets.length; _i < _len; _i++) {
      asset = assets[_i];
      this.data = _.reject(this.data, {
        _id: asset.id
      });
      this.data.push(asset);
    }
    return this.$rootScope.$broadcast('assets:update');
  };

  imagoModel.prototype.reorder = function(assets) {
    var args, asset, idx, idxAsset, _i, _len;
    for (_i = 0, _len = assets.length; _i < _len; _i++) {
      asset = assets[_i];
      idxAsset = this.findIdx(asset._id);
      idx = (idxAsset > idx ? idx : idxAsset);
    }
    args = [idx, assets.length].concat(assets);
    Array.prototype.splice.apply(this.data, args);
    return this.$rootScope.$broadcast('assets:update');
  };

  imagoModel.prototype.reindexAll = function(list) {
    var asset, count, key, newList, ordered, orderedList, _i, _len;
    newList = [];
    count = list.length;
    for (key = _i = 0, _len = list.length; _i < _len; key = ++_i) {
      asset = list[key];
      asset.order = (count - key) * 1000;
      ordered = {
        _id: asset._id,
        order: asset.order
      };
      newList.push(ordered);
    }
    orderedList = {
      assets: newList
    };
    return orderedList;
  };

  imagoModel.prototype.orderChanged = function(start, finish, dropped, list) {
    var asset, assets, count, next, orderedList, prev, _i, _len;
    if (dropped < finish) {
      finish = finish + 1;
      prev = list[dropped - 1] ? list[dropped - 1].order : list[0].order + 1000;
      next = list[finish] ? list[finish].order : 0;
      assets = list.slice(dropped, finish);
    } else if (dropped > start) {
      dropped = dropped + 1;
      prev = list[start - 1] ? list[start - 1].order : list[0].order + 1000;
      next = list[dropped] ? list[dropped].order : 0;
      assets = list.slice(start, dropped);
    } else {
      return;
    }
    console.log('prev', prev, 'next', next);
    count = prev - 1000;
    for (_i = 0, _len = assets.length; _i < _len; _i++) {
      asset = assets[_i];
      asset.order = count;
      count = count - 1000;
    }
    orderedList = {
      assets: assets
    };
    return orderedList;
  };

  imagoModel.prototype.batchChange = function(assets, save) {
    var asset, idx, key, object, _base, _base1, _i, _len;
    if (save == null) {
      save = false;
    }
    for (_i = 0, _len = assets.length; _i < _len; _i++) {
      asset = assets[_i];
      idx = this.findIdx(asset._id);
      if (idx === -1) {
        return;
      }
      if (_.isBoolean(asset.visible)) {
        this.data[idx]['visible'] = asset.visible;
      }
      for (key in asset.fields) {
        (_base = this.data[idx])['fields'] || (_base['fields'] = {});
        (_base1 = this.data[idx]['fields'])[key] || (_base1[key] = {});
        this.data[idx]['fields'][key]['value'] = asset.fields[key]['value'];
      }
    }
    if (save) {
      object = {
        assets: assets
      };
      return object;
    } else {
      return false;
    }
  };

  imagoModel.prototype.isDuplicated = function(name, rename) {
    var assets, assetsChildren, defer, exists, i, original_name, result;
    if (rename == null) {
      rename = false;
    }
    defer = this.$q.defer();
    if (!name) {
      defer.reject(name);
    }
    name = this.imagoUtils.normalize(name);
    result = {
      count: 0,
      value: ''
    };
    assetsChildren = _.where(this.findChildren(this.currentCollection), {
      name: name
    });
    result.count = assetsChildren.length;
    if (assetsChildren.length > 0) {
      if (rename) {
        assets = this.findChildren(this.currentCollection);
        i = 1;
        exists = true;
        original_name = name;
        while (exists) {
          name = "" + original_name + "_" + i;
          i++;
          exists = (_.where(assets, {
            name: name
          }).length > 0 ? true : false);
        }
        result.value = name;
        defer.resolve(result);
      } else {
        result.value = true;
        defer.resolve(result);
      }
    } else {
      result.value = false;
      defer.resolve(result);
    }
    return defer.promise;
  };

  imagoModel.prototype.prepareCreation = function(asset, parent, order, rename) {
    var defer;
    if (rename == null) {
      rename = false;
    }
    defer = this.$q.defer();
    if (!asset.name) {
      defer.reject(asset.name);
    }
    this.isDuplicated(asset.name, rename).then((function(_this) {
      return function(isDuplicated) {
        var assets;
        if (isDuplicated.value && _.isBoolean(isDuplicated.value)) {
          return defer.resolve('duplicated');
        } else {
          if (_.isString(isDuplicated.value)) {
            asset.name = isDuplicated.value;
          }
          if (order) {
            asset.order = order;
          } else {
            assets = _this.findChildren(parent);
            asset.order = (assets.length === 0 ? 1000 : assets[0].order + 1000);
          }
          asset.parent = parent;
          asset._tenant = _this.tenant;
          return defer.resolve(asset);
        }
      };
    })(this));
    return defer.promise;
  };

  return imagoModel;

})();

angular.module('imago.widgets.angular').service('imagoModel', ['$rootScope', '$http', '$location', '$q', '$filter', 'imagoUtils', imagoModel]);

var imagoPanel;

imagoPanel = (function() {
  function imagoPanel($http, imagoUtils, $q, $location) {
    return {
      search: function(query) {
        var params;
        params = this.objListToDict(query);
        return $http.post(this.getSearchUrl(), angular.toJson(params));
      },
      getData: function(query) {
        var data, promises;
        if (!query) {
          query = $location.$$path;
        }
        if (angular.isString(query)) {
          query = [
            {
              path: query
            }
          ];
        }
        query = imagoUtils.toArray(query);
        promises = [];
        data = [];
        angular.forEach(query, (function(_this) {
          return function(value) {
            return promises.push(_this.search(value).success(function(response) {
              var result;
              if (response.length === 1 && response[0].kind === 'Collection') {
                return data.push(response[0]);
              } else {
                result = {
                  items: response,
                  count: response.length
                };
                return data.push(result);
              }
            }));
          };
        })(this));
        return $q.all(promises).then((function(_this) {
          return function() {
            return data;
          };
        })(this));
      },
      objListToDict: function(obj_or_list) {
        var elem, key, querydict, value, _i, _j, _len, _len1, _ref;
        querydict = {};
        if (angular.isArray(obj_or_list)) {
          for (_i = 0, _len = obj_or_list.length; _i < _len; _i++) {
            elem = obj_or_list[_i];
            for (key in elem) {
              value = elem[key];
              querydict[key] || (querydict[key] = []);
              querydict[key].push(value);
            }
          }
        } else {
          for (key in obj_or_list) {
            value = obj_or_list[key];
            querydict[key] = angular.isArray(value) ? value : [value];
          }
        }
        _ref = ['page', 'pagesize'];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          key = _ref[_j];
          if (querydict.hasOwnProperty(key)) {
            querydict[key] = querydict[key][0];
          }
        }
        return querydict;
      },
      getSearchUrl: function() {
        if (data === 'online' && debug) {
          return "" + window.location.protocol + "//imagoapi.jit.su/api/search";
        } else {
          return "/api/search";
        }
      }
    };
  }

  return imagoPanel;

})();

angular.module('imago.widgets.angular').factory('imagoPanel', ['$http', 'imagoUtils', '$q', '$location', imagoPanel]);

var imagoSubmit,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

imagoSubmit = (function() {
  function imagoSubmit($http, imagoUtils) {
    return {
      getxsrf: function() {
        var url;
        url = data === 'online' && debug ? "http://" + tenant + ".imagoapp.com/api/v2/getxsrf" : "/api/v2/getxsrf";
        return $http.get(url);
      },
      formToJson: function(form) {
        var defaultFields, key, message, obj, value;
        defaultFields = ['message', 'subscribe'];
        obj = {};
        message = '';
        for (key in form) {
          value = form[key];
          if (__indexOf.call(defaultFields, key) < 0) {
            message += "" + (imagoUtils.titleCase(key)) + ": " + value + "<br><br>";
          }
          obj[key] = value || '';
        }
        obj.message = message + imagoUtils.replaceNewLines(obj.message || '');
        return angular.toJson(obj);
      },
      send: function(data) {
        return this.getxsrf().then((function(_this) {
          return function(response) {
            var postUrl, xsrfHeader;
            console.log('getxsrf success: ', response);
            xsrfHeader = {
              "Nex-Xsrf": response.data
            };
            postUrl = data === 'online' && debug ? "http://" + tenant + ".imagoapp.com/api/v2/contact" : "/api/v2/contact";
            return $http.post(postUrl, _this.formToJson(data), {
              headers: xsrfHeader
            }).then(function(response) {
              console.log('success: ', response);
              return true;
            }, function(error) {
              console.log('error: ', error);
              return false;
            });
          };
        })(this), function(error) {
          return console.log('getxsrf error: ', error);
        });
      }
    };
  }

  return imagoSubmit;

})();

angular.module('imago.widgets.angular').factory('imagoSubmit', ['$http', 'imagoUtils', imagoSubmit]);

var imagoUtils;

imagoUtils = (function() {
  function imagoUtils() {
    var alphanum;
    return {
      KEYS: {
        '16': 'onShift',
        '18': 'onAlt',
        '17': 'onCommand',
        '91': 'onCommand',
        '93': 'onCommand',
        '224': 'onCommand',
        '13': 'onEnter',
        '32': 'onSpace',
        '37': 'onLeft',
        '38': 'onUp',
        '39': 'onRight',
        '40': 'onDown',
        '46': 'onDelete',
        '8': 'onBackspace',
        '9': 'onTab',
        '188': 'onComma',
        '190': 'onPeriod',
        '27': 'onEsc',
        '186': 'onColon',
        '65': 'onA',
        '67': 'onC',
        '86': 'onV',
        '88': 'onX',
        '68': 'onD',
        '187': 'onEqual',
        '189': 'onMinus'
      },
      SYMBOLS: {
        EUR: '&#128;',
        USD: '&#36;',
        SEK: 'SEK',
        YEN: '&#165;',
        GBP: '&#163;',
        GENERIC: '&#164;'
      },
      CURRENCY_MAPPING: {
        "United Arab Emirates": "AED",
        "Afghanistan": "AFN",
        "Albania": "ALL",
        "Armenia": "AMD",
        "Angola": "AOA",
        "Argentina": "ARS",
        "Australia": "AUD",
        "Aruba": "AWG",
        "Azerbaijan": "AZN",
        "Bosnia and Herzegovina": "BAM",
        "Barbados": "BBD",
        "Bangladesh": "BDT",
        "Bulgaria": "BGN",
        "Bahrain": "BHD",
        "Burundi": "BIF",
        "Bermuda": "BMD",
        "Brunei": "BND",
        "Bolivia": "BOB",
        "Brazil": "BRL",
        "Bahamas": "BSD",
        "Bhutan": "BTN",
        "Botswana": "BWP",
        "Belarus": "BYR",
        "Belize": "BZD",
        "Canada": "CAD",
        "Switzerland Franc": "CHF",
        "Chile": "CLP",
        "China": "CNY",
        "Colombia": "COP",
        "Costa Rica": "CRC",
        "Cuba Convertible": "CUC",
        "Cuba Peso": "CUP",
        "Cape Verde": "CVE",
        "Czech Republic": "CZK",
        "Djibouti": "DJF",
        "Denmark": "DKK",
        "Dominican Republic": "DOP",
        "Algeria": "DZD",
        "Egypt": "EGP",
        "Eritrea": "ERN",
        "Ethiopia": "ETB",
        "Autria": "EUR",
        "Fiji": "FJD",
        "United Kingdom": "GBP",
        "Georgia": "GEL",
        "Guernsey": "GGP",
        "Ghana": "GHS",
        "Gibraltar": "GIP",
        "Gambia": "GMD",
        "Guinea": "GNF",
        "Guatemala": "GTQ",
        "Guyana": "GYD",
        "Hong Kong": "HKD",
        "Honduras": "HNL",
        "Croatia": "HRK",
        "Haiti": "HTG",
        "Hungary": "HUF",
        "Indonesia": "IDR",
        "Israel": "ILS",
        "Isle of Man": "IMP",
        "India": "INR",
        "Iraq": "IQD",
        "Iran": "IRR",
        "Iceland": "ISK",
        "Jersey": "JEP",
        "Jamaica": "JMD",
        "Jordan": "JOD",
        "Japan": "JPY",
        "Kenya": "KES",
        "Kyrgyzstan": "KGS",
        "Cambodia": "KHR",
        "Comoros": "KMF",
        "North Korea": "KPW",
        "South Korea": "KRW",
        "Kuwait": "KWD",
        "Cayman Islands": "KYD",
        "Kazakhstan": "KZT",
        "Laos": "LAK",
        "Lebanon": "LBP",
        "Sri Lanka": "LKR",
        "Liberia": "LRD",
        "Lesotho": "LSL",
        "Lithuania": "LTL",
        "Latvia": "LVL",
        "Libya": "LYD",
        "Morocco": "MAD",
        "Moldova": "MDL",
        "Madagascar": "MGA",
        "Macedonia": "MKD",
        "Mongolia": "MNT",
        "Macau": "MOP",
        "Mauritania": "MRO",
        "Mauritius": "MUR",
        "Malawi": "MWK",
        "Mexico": "MXN",
        "Malaysia": "MYR",
        "Mozambique": "MZN",
        "Namibia": "NAD",
        "Nigeria": "NGN",
        "Nicaragua": "NIO",
        "Norway": "NOK",
        "Nepal": "NPR",
        "New Zealand": "NZD",
        "Oman": "OMR",
        "Panama": "PAB",
        "Peru": "PEN",
        "Papua New Guinea": "PGK",
        "Philippines": "PHP",
        "Pakistan": "PKR",
        "Poland": "PLN",
        "Paraguay": "PYG",
        "Qatar": "QAR",
        "Romania": "RON",
        "Serbia": "RSD",
        "Russia": "RUB",
        "Rwanda": "RWF",
        "Saudi Arabia": "SAR",
        "Solomon Islands": "SBD",
        "Seychelles": "SCR",
        "Sudan": "SDG",
        "Sweden": "SEK",
        "Singapore": "SGD",
        "Saint Helena": "SHP",
        "Suriname": "SRD",
        "El Salvador": "SVC",
        "Syria": "SYP",
        "Swaziland": "SZL",
        "Thailand": "THB",
        "Tajikistan": "TJS",
        "Turkmenistan": "TMT",
        "Tunisia": "TND",
        "Tonga": "TOP",
        "Turkey": "TRY",
        "Trinidad and Tobago": "TTD",
        "Tuvalu": "TVD",
        "Taiwan": "TWD",
        "Tanzania": "TZS",
        "Ukraine": "UAH",
        "Uganda": "UGX",
        "United States": "USD",
        "Uruguay": "UYU",
        "Uzbekistan": "UZS",
        "Venezuela": "VEF",
        "Vietnam": "VND",
        "Vanuatu": "VUV",
        "Samoa": "WST",
        "Yemen": "YER",
        "South Africa": "ZAR",
        "Zambia": "ZMW",
        "Zimbabwe": "ZWD",
        "Austria": "EUR",
        "Belgium": "EUR",
        "Bulgaria": "EUR",
        "Croatia": "EUR",
        "Cyprus": "EUR",
        "Czech Republic": "EUR",
        "Denmark": "EUR",
        "Estonia": "EUR",
        "Finland": "EUR",
        "France": "EUR",
        "Germany": "EUR",
        "Greece": "EUR",
        "Hungary": "EUR",
        "Ireland": "EUR",
        "Italy": "EUR",
        "Latvia": "EUR",
        "Lithuania": "EUR",
        "Luxembourg": "EUR",
        "Malta": "EUR",
        "Netherlands": "EUR",
        "Poland": "EUR",
        "Portugal": "EUR",
        "Romania": "EUR",
        "Slovakia": "EUR",
        "Slovenia": "EUR",
        "Spain": "EUR"
      },
      toType: function(obj) {
        return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
      },
      requestAnimationFrame: (function() {
        var request;
        request = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
          return window.setTimeout(callback, 1000 / 60);
        };
        return function(callback) {
          return request.call(window, callback);
        };
      })(),
      cookie: function(name, value) {
        var cookie, _i, _len, _ref;
        if (!value) {
          _ref = document.cookie.split(';');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cookie = _ref[_i];
            if (cookie.indexOf(name) === 1) {
              return cookie.split('=')[1];
            }
          }
          return false;
        }
        return document.cookie = "" + name + "=" + value + "; path=/";
      },
      sha: function() {
        var i, possible, text, _i;
        text = '';
        possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (i = _i = 0; _i <= 56; i = ++_i) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      },
      uuid: function() {
        var S4;
        S4 = function() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
      },
      urlify: function(query) {
        return console.log('urlify');
      },
      queryfy: function(url) {
        var facet, filter, key, query, value, _i, _len, _ref;
        query = [];
        _ref = url.split('+');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          filter || (filter = 'collection:/');
          facet = filter.split(':');
          key = facet[0].toLowerCase();
          value = decodeURIComponent(facet[1] || '');
          facet = {};
          facet[key] = value;
          query.push(facet);
        }
        return query;
      },
      pluralize: function(str) {
        return str + 's';
      },
      singularize: function(str) {
        return str.replace(/s$/, '');
      },
      titleCase: function(str) {
        if (typeof str !== 'string') {
          return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      normalize: function(s) {
        var mapping, r, str;
        mapping = {
          'ä': 'ae',
          'ö': 'oe',
          'ü': 'ue',
          '&': 'and',
          'é': 'e',
          'ë': 'e',
          'ï': 'i',
          'è': 'e',
          'à': 'a',
          'ù': 'u',
          'ç': 'c',
          'ø': 'o'
        };
        s = s.toLowerCase();
        r = new RegExp(Object.keys(mapping).join('|'), 'g');
        str = s.trim().replace(r, function(s) {
          return mapping[s];
        }).toLowerCase();
        return str.replace(/[',:;#]/g, '').replace(/[^\/\w]+/g, '-').replace(/\W?\/\W?/g, '\/').replace(/^-|-$/g, '');
      },
      alphaNumSort: alphanum = function(a, b) {
        var aa, bb, c, chunkify, d, x;
        chunkify = function(t) {
          var i, j, m, n, tz, x, y;
          tz = [];
          x = 0;
          y = -1;
          n = 0;
          i = void 0;
          j = void 0;
          while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            m = i === 46 || (i >= 48 && i <= 57);
            if (m !== n) {
              tz[++y] = "";
              n = m;
            }
            tz[y] += j;
          }
          return tz;
        };
        aa = chunkify(a);
        bb = chunkify(b);
        x = 0;
        while (aa[x] && bb[x]) {
          if (aa[x] !== bb[x]) {
            c = Number(aa[x]);
            d = Number(bb[x]);
            if (c === aa[x] && d === bb[x]) {
              return c - d;
            } else {
              return (aa[x] > bb[x] ? 1 : -1);
            }
          }
          x++;
        }
        return aa.length - bb.length;
      },
      isiOS: function() {
        return !!navigator.userAgent.match(/iPad|iPhone|iPod/i);
      },
      isiPad: function() {
        return !!navigator.userAgent.match(/iPad/i);
      },
      isiPhone: function() {
        return !!navigator.userAgent.match(/iPhone/i);
      },
      isiPod: function() {
        return !!navigator.userAgent.match(/iPod/i);
      },
      isChrome: function() {
        return !!navigator.userAgent.match(/Chrome/i);
      },
      isIE: function() {
        return !!navigator.userAgent.match(/MSIE/i);
      },
      isFirefox: function() {
        return !!navigator.userAgent.match(/Firefox/i);
      },
      isSafari: function() {
        return !!navigator.userAgent.match(/Safari/i) && !this.isChrome();
      },
      isEven: function(n) {
        return this.isNumber(n) && (n % 2 === 0);
      },
      isOdd: function(n) {
        return this.isNumber(n) && (n % 2 === 1);
      },
      isNumber: function(n) {
        return n === parseFloat(n);
      },
      toFloat: function(value, decimal) {
        var floats, ints;
        if (decimal == null) {
          decimal = 2;
        }
        if (!decimal) {
          return value;
        }
        value = String(value).replace(/\D/g, '');
        floats = value.slice(value.length - decimal);
        while (floats.length < decimal) {
          floats = '0' + floats;
        }
        ints = value.slice(0, value.length - decimal) || '0';
        return "" + ints + "." + floats;
      },
      toPrice: function(value, currency) {
        var price, symbol;
        price = this.toFloat(value).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        symbol = this.getCurrencySymbol(currency);
        return "" + symbol + " " + price;
      },
      isEmail: function(value) {
        var pattern;
        pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !!value.match(pattern);
      },
      getAssetKind: function(id) {
        var kind;
        if (id.indexOf('Collection-') === 0) {
          kind = 'Collection';
        } else if (id.indexOf('Proxy-') === 0) {
          kind = 'Proxy';
        } else if (id.indexOf('Order-') === 0) {
          kind = 'Order';
        } else if (id.indexOf('Generic') === 0) {
          kind = 'Generic';
        } else if (id.match(/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/)) {
          kind = 'Image';
        } else if (id.match(/[0-9a-z]{56}/)) {
          kind = 'Video';
        }
        return kind;
      },
      getKeyName: function(e) {
        return KEYS[e.which];
      },
      getURLParameter: function(name) {
        var regex, results;
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        results = regex.exec(location.search);
        if (results == null) {
          return "";
        } else {
          return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
      },
      inUsa: function(value) {
        var _ref;
        return (_ref = value != null ? value.toLowerCase() : void 0) === 'usa' || _ref === 'united states' || _ref === 'united states of america';
      },
      replaceNewLines: function(msg) {
        return msg.replace(/(\r\n\r\n|\r\n|\n|\r)/gm, "<br>");
      },
      getCurrencySymbol: function(currency) {
        return SYMBOLS[currency] || SYMBOLS.GENERIC;
      },
      getCurrency: function(country) {
        return CURRENCY_MAPPING[country];
      },
      toArray: function(elem) {
        if (angular.isArray(elem)) {
          return elem;
        } else {
          return [elem];
        }
      },
      getMeta: function(asset, attribute) {
        if (!asset.meta[attribute]) {
          return console.log("This asset does not contain a " + attribute + " attribute");
        }
        return asset.fields[attribute].value;
      }
    };
  }

  return imagoUtils;

})();

angular.module('imago.widgets.angular').factory('imagoUtils', [imagoUtils]);

var Meta;

Meta = (function() {
  function Meta() {
    return function(input, value) {
      if (!(input && value)) {
        return;
      }
      if (input.fields[value].value.type) {
        return input.fields[value].value.value;
      } else {
        return input.fields[value].value;
      }
    };
  }

  return Meta;

})();

angular.module('imago.widgets.angular').filter('meta', [Meta]);

var Time;

Time = (function() {
  function Time() {
    return function(input) {
      var calc, hours, minutes, pad, seconds;
      if (!input) {
        return;
      }
      pad = function(num) {
        if (num < 10) {
          return "0" + num;
        }
        return num;
      };
      calc = [];
      minutes = Math.floor(input / 60);
      hours = Math.floor(input / 3600);
      seconds = (input === 0 ? 0 : input % 60);
      seconds = Math.round(seconds);
      if (hours > 0) {
        calc.push(pad(hours));
      }
      calc.push(pad(minutes));
      calc.push(pad(seconds));
      return calc.join(":");
    };
  }

  return Time;

})();

angular.module('imago.widgets.angular').filter('time', [Time]);
