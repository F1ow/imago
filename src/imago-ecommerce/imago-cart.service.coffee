class imagoCart extends Service

  show: false
  itemsLength: 0
  settings: []

  constructor: (@$q, @$rootScope, @$location, @$window, @$http, @imagoUtils, @imagoModel, @fulfillmentsCenter, @geoIp, @imagoSettings, tenantSettings, @imagoCartUtils) ->

    @cart =
      items: []

    if tenantSettings.loaded
      @onSettings()
    else
      @$rootScope.$on 'settings:loaded', (evt, message) =>
        @onSettings()

  onSettings: ->
    @currencies = @$rootScope.tenantSettings.currencies
    local = @imagoUtils.cookie('imagoCart')
    if local
      @checkStatus(local)
    else
      @checkGeoIp()

  checkGeoIp: ->
    unless @geoIp.loaded
      @checkCurrency()
      watcher = @$rootScope.$on 'geoip:loaded', (evt, data) =>
        @checkCurrency()
        watcher()
    else
      @checkCurrency()

  checkCurrency: ->
    currency = @imagoUtils.CURRENCY_MAPPING[@geoIp.data.country] unless _.isEmpty @geoIp.data
    if currency and @currencies and currency in @currencies
      @currency = currency
    else if @currencies?.length
      @currency = @currencies[0]
    else
      console.log 'you need to enable at least one currency in the settings'

    @$rootScope.$emit 'imagocart:currencyloaded'

    return unless @cart
    if @cart.currency isnt @currency
      @cart.currency = angular.copy @currency
      @update()
    @calculate()

  checkStatus: (id) =>
    @$http.get("#{@imagoSettings.host}/api/carts?cartid=#{id}").then (response) =>
      console.log 'check cart', response.data
      _.assign @cart, response.data
      unless @fulfillmentsCenter.loaded
        watcher = @$rootScope.$on 'fulfillments:loaded', (evt, data) =>
          @statusLoaded()
          watcher()
      else
        @statusLoaded()

  statusLoaded: ->
    update = false
    for item in @cart.items
      item.stock = Number(item.fields?.stock?.value?[@fulfillmentsCenter.selected._id])
      item = @imagoCartUtils.updateChangedItem(item)
      if item.updates?.length
        @newmessages = true
        update = true

    @currency = angular.copy(@cart.currency) unless @currency
    @update() if update
    @calculate()
    @checkGeoIp()

  checkCart: =>
    defer = @$q.defer()
    if @cart._id
      defer.resolve('update')
    else
      @create(@cart).then (response) =>
        _.assign @cart, response.data
        @imagoUtils.cookie('imagoCart', response.data._id)
        # localStorage.setItem('imagoCart', response.data._id)
        defer.resolve('created')
    defer.promise

  create: (cart) =>
    return @$http.post("#{@imagoSettings.host}/api/carts", cart)

  add: (item, options, fields) ->
    return console.log 'item required' unless item
    return console.log 'quantity required' unless item.qty

    item.finalsale = item.fields?.finalSale?.value
    item.presale = item.fields?.presale?.value

    if _.isArray(options) and options?.length
      item.options = {}
      for option in options
        item.options[option] = item.fields[option]
    else if _.isPlainObject options
      item.options = options

    if item.options?.name
      item.name = item.options.name
      delete item.options.name

    parent = @imagoModel.find {'_id' : item.parent}

    if parent
      item.name = parent.fields?.title?.value unless item.name
      item.serving_url = parent.serving_url unless item.serving_url
      item.fields?.title?.value = parent.fields?.title?.value
      item.fields?.description?.value = parent.fields?.description?.value
      if _.isArray(fields) and fields.length
        for field in fields
          item.fields[field] = parent.fields[field]
      else if _.isPlainObject fields
        _.assign item.fields, parent.fields

    copy = angular.copy item
    filter = _.find @cart.items, { _id: copy._id }

    if copy.fields?.discountedPrice?.value?[@currency]
      copy.price = copy.fields.discountedPrice.value
    else
      copy.price = copy.fields.price.value

    copy.link = @$location.url()

    if filter
      filter.name = copy.name unless filter.name
      filter.qty += copy.qty if filter.qty isnt filter.stock
      _.assign filter.options, copy.options
      _.assign filter.fields, copy.fields
    else
      @cart.items.push copy

    @show = true
    @calculate()

    # console.log '@cart', @cart

    @checkCart().then (response) =>
      @update() if response is 'update'

  update: =>
    return unless @cart._id
    @$http.put("#{@imagoSettings.host}/api/carts/#{@cart._id}", @cart)

  remove: (item) =>
    _.remove(@cart.items, {'_id': item._id})
    @calculate()
    @update()

  calculate: ->
    @itemsLength = 0
    @subtotal = 0

    unless @cart.items.length
      @subtotal = 0
      @itemsLength = 0
      return

    for item in @cart.items
      @itemsLength += item.qty
      continue unless item.qty and item.price?[@currency]
      @subtotal += item.qty * item.price[@currency]



  checkout: ->
    return unless tenant

    url = "https://#{tenant}.imago.io/account/checkout/#{@cart._id}"

    decorated = ''
    ga? (tracker) =>
      linker = new (@$window.gaplugins.Linker)(tracker)
      decorated = linker.decorate(url, true)

    @$window.location.href = decorated or url
