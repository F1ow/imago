angular.module("ImagoWidgetsTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/imagoWidgets/image-widget.html","<div ng-style=\"elementStyle\" ng-class=\"status\" class=\"imagoimage imagowrapper\"><div ng-style=\"imageStyle\" class=\"image\"></div><div ng-hide=\"status === \'loaded\'\" class=\"loading\"><div class=\"spin\"></div><div class=\"spin2\"></div></div></div>");
$templateCache.put("/imagoWidgets/slider-widget.html","<div ng-class=\"elementStyle\"><div ng-transclude=\"ng-transclude\"></div><div ng-style=\"sliderStyle\" ng-swipe-left=\"goPrev()\" ng-swipe-right=\"goNext()\" class=\"nexslider\"><div ng-show=\"confSlider.enablearrows &amp;&amp; loadedData\" ng-click=\"goPrev()\" class=\"prev\"></div><div ng-show=\"confSlider.enablearrows &amp;&amp; loadedData\" ng-click=\"goNext()\" class=\"next\"></div><div ng-class=\"{\'active\':isCurrentSlideIndex($index)}\" ng-repeat=\"slide in slideSource\" ng-hide=\"!isCurrentSlideIndex($index)\" class=\"slide\"><div imago-image=\"imago-image\" source=\"slide\" sizemode=\"{{$parent.confSlider.sizemode}}\"></div></div></div></div>");
$templateCache.put("/imagoWidgets/video-widget.html","<div ng-style=\"wrapperStyle\" ng-click=\"videoActive = true\" class=\"imagovideo imagowrapper {{optionsVideo.align}} {{optionsVideo.size}} {{optionsVideo.sizemode}}\"><a ng-click=\"togglePlay()\" ng-hide=\"optionsVideo.playing\" class=\"playbig fa fa-play\"></a><video ng-style=\"videoStyle\" ng-show=\"videoActive\"><source ng-repeat=\"format in videoFormats\" src=\"{{format.src}}\" data-size=\"{{format.size}}\" data-codec=\"{{format.codec}}\" type=\"{{format.type}}\"/></video><div ng-if=\"controls\" class=\"controls\"><a ng-click=\"play()\" ng-hide=\"optionsVideo.playing\" class=\"play fa fa-play\"></a><a ng-click=\"pause()\" ng-show=\"optionsVideo.playing\" class=\"pause fa fa-pause\"></a><span class=\"time\">{{time}}</span><span class=\"seekbar\"><input type=\"range\" ng-model=\"seekTime\" ng-change=\"seek(seekTime)\" class=\"seek\"/></span><a ng-click=\"toggleSize()\" class=\"size\">hd</a><span class=\"volume\"><span ng-click=\"volumeUp()\" class=\"fa fa-volume-up icon-volume-up\"></span><input type=\"range\" ng-model=\"volumeInput\" ng-change=\"onVolumeChange(volumeInput)\"/><span ng-click=\"volumeDown()\" class=\"fa fa-volume-down icon-volume-down\"></span></span><a ng-click=\"fullScreen()\" class=\"fullscreen fa fa-expand\"></a><a class=\"screen fa fa-compress\"></a></div></div>");}]);