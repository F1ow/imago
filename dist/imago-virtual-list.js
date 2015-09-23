var ImagoVirtualList;

ImagoVirtualList = (function() {
  function ImagoVirtualList($window, $document, $rootScope, $timeout) {
    return {
      scope: true,
      templateUrl: '/imago/imago-virtual-list.html',
      transclude: true,
      controller: function() {},
      controllerAs: 'imagovirtuallist',
      bindToController: {
        data: '=',
        onBottom: '&',
        scroll: '=',
        offsetBottom: '@'
      },
      link: function(scope, element, attrs, ctrl, transclude) {
        var masterDiv, self, watchers;
        transclude(scope, function(clone) {
          return element.children().append(clone);
        });
        self = {};
        self.scrollTop = 0;
        if (!scope.imagovirtuallist.offsetBottom) {
          scope.imagovirtuallist.offsetBottom = $window.innerHeight;
        }
        masterDiv = document.createElement('div');
        masterDiv.id = 'master-item';
        masterDiv.className = attrs.classItem;
        masterDiv.style.opacity = 0;
        masterDiv.style.zIndex = -1;
        element.append(masterDiv);
        scope.init = function() {
          if (this.initRunning) {
            return;
          }
          this.initRunning = true;
          return $timeout((function(_this) {
            return function() {
              var cellsPerHeight;
              scope.resetSize();
              self.itemsPerRow = Math.floor(element[0].clientWidth / masterDiv.clientWidth);
              cellsPerHeight = Math.round($window.innerHeight / masterDiv.clientHeight);
              self.cellsPerPage = cellsPerHeight * self.itemsPerRow;
              self.numberOfCells = 3 * self.cellsPerPage;
              if (self.itemsPerRow > 1) {
                self.canvasWidth = self.itemsPerRow * masterDiv.clientWidth;
              }
              self.updateData();
              return _this.initRunning = false;
            };
          })(this), 100);
        };
        self.updateData = function() {
          if (!scope.imagovirtuallist.data) {
            return;
          }
          self.canvasHeight = Math.ceil(scope.imagovirtuallist.data.length / self.itemsPerRow) * masterDiv.clientHeight;
          scope.canvasStyle = {
            height: self.canvasHeight + "px",
            width: self.canvasWidth + "px"
          };
          return self.updateDisplayList();
        };
        self.updateDisplayList = function() {
          var cellsToCreate, chunks, data, findIndex, firstCell, i, idx, l;
          firstCell = Math.max(Math.round(self.scrollTop / masterDiv.clientHeight) - (Math.round($window.innerHeight / masterDiv.clientHeight)), 0);
          cellsToCreate = Math.min(firstCell + self.numberOfCells, self.numberOfCells);
          data = firstCell * self.itemsPerRow;
          scope.visibleProvider = scope.imagovirtuallist.data.slice(data, data + cellsToCreate);
          chunks = _.chunk(scope.visibleProvider, self.itemsPerRow);
          i = 0;
          l = scope.visibleProvider.length;
          while (i < l) {
            findIndex = function() {
              var chunk, idx, indexChunk, indexItem, item, j, k, len, len1;
              for (indexChunk = j = 0, len = chunks.length; j < len; indexChunk = ++j) {
                chunk = chunks[indexChunk];
                for (indexItem = k = 0, len1 = chunk.length; k < len1; indexItem = ++k) {
                  item = chunk[indexItem];
                  if (item._id !== scope.visibleProvider[i]._id) {
                    continue;
                  }
                  idx = {
                    chunk: indexChunk,
                    inside: indexItem
                  };
                  return idx;
                }
              }
            };
            idx = findIndex();
            scope.visibleProvider[i].styles = {
              'transform': "translate(" + ((masterDiv.clientWidth * idx.inside) + 'px') + ", " + ((firstCell + idx.chunk) * masterDiv.clientHeight + 'px') + ")"
            };
            i++;
          }
          if (scope.imagovirtuallist.scroll) {
            return scope.scroll();
          }
        };
        scope.scroll = function() {
          if (!scope.imagovirtuallist.scroll) {
            return;
          }
          return $timeout(function() {
            self.scrollTop = angular.copy(scope.imagovirtuallist.scroll);
            scope.imagovirtuallist.scroll = 0;
            return $document.scrollTop(self.scrollTop, 0);
          });
        };
        scope.onScroll = function() {
          self.scrollTop = $window.scrollY;
          if ((self.canvasHeight - self.scrollTop) <= Number(scope.imagovirtuallist.offsetBottom)) {
            scope.imagovirtuallist.onBottom();
          }
          self.updateDisplayList();
          return scope.$digest();
        };
        scope.resetSize = function() {
          scope.visibleProvider = [];
          scope.canvasStyle = {};
          self.cellsPerPage = 0;
          return self.numberOfCells = 0;
        };
        scope.init();
        scope.$watch('imagovirtuallist.data', function(value) {
          return self.updateData();
        });
        angular.element($window).on('resize', (function(_this) {
          return function() {
            if (Math.floor(element[0].clientWidth / masterDiv.clientWidth) !== self.itemsPerRow) {
              return scope.init();
            }
          };
        })(this));
        angular.element($window).on('scroll', scope.onScroll);
        watchers = [];
        watchers.push($rootScope.$on('imagovirtuallist:init', function() {
          return scope.init();
        }));
        return scope.$on('$destroy', function() {
          var j, len, results, watcher;
          angular.element($window).off('scroll', scope.onScroll);
          results = [];
          for (j = 0, len = watchers.length; j < len; j++) {
            watcher = watchers[j];
            results.push(watcher());
          }
          return results;
        });
      }
    };
  }

  return ImagoVirtualList;

})();

angular.module('imago').directive('imagoVirtualList', ['$window', '$document', '$rootScope', '$timeout', ImagoVirtualList]);

angular.module("imago").run(["$templateCache", function($templateCache) {$templateCache.put("/imago/imago-virtual-list.html","<div ng-style=\"canvasStyle\" class=\"canvas\"></div>");}]);