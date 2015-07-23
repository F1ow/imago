class imagoPage extends Controller

  constructor: ($location, $state, imagoModel) ->

    if $state.current.data?.path
      @path = {path: $state.current.data.path}
    else if $location.path() is '/'
      @path = {path: '/home'}

    if $state.current.data?.recursive
      @path or= {}
      @path.path = $location.path() unless @path.path
      @path.recursive = true

    imagoModel.getData(@path).then (response) =>
      for data in response
        @data = data
        break