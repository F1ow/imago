class ImagoSubscribe extends Directive

  constructor: ->

    return {

      require: 'form'
      restrict: 'A'
      transclude: true
      controller: 'imagoSubscribeController as imagosubscribe'
      templateUrl: (element, attrs) ->
        return attrs.templateurl or '/imago/imago-subscribe.html'

    }

class ImagoSubscribeController extends Controller

  constructor:($http, $parse, imagoSettings) ->

    @submit = (validate) ->
      return if validate.$invalid
      form = $parse($attrs.imagoSubscribe)($scope)

      @submitted = true

      $http.post("#{imagoSettings.host}/api/subscribe", form).then (response) =>
        @error = false
        console.log 'response', response
      , (error) ->
        @error = true
        console.log 'error', error
