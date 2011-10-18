class MainLogin extends Spine.Controller

  constructor: (form, displayField = '._flash') ->
    super
    @displayField = $('.flash')
    @passwordField = $('#UserPassword')
    
  submit: =>
    $.ajax
      data: @el.serialize()
      type: 'POST'
      success: @success
      error: @error
      complete: @complete
      
  complete: (xhr) =>
    json = xhr.responseText
    @passwordField.val('').focus()
    
  success: (json) =>
    User.fetch()
    User.deleteAll()
    user = new User @newAttributes(json)
    user.save()
    redirect_url = base_url + 'director_app'
    @displayField.html json.flash
    delayedFunc = -> 
      window.location = redirect_url
    @delay delayedFunc, 1000

  error: (xhr) =>
    json = $.parseJSON(xhr.responseText)
    oldMessage = @displayField.html()
    delayedFunc = -> @displayField.html oldMessage
    
    @displayField.html json.flash
    @delay delayedFunc, 2000
    
  newAttributes: (json) ->
      id: json.id
      username: json.username
      name: json.name
      groupname: json.groupname
      sessionid: json.sessionid
    
    