Spine ?= require("spine")
$      = Spine.$
Model  = Spine.Model

Model.Extender =

  extended: ->

    Extend =
      
      record: false

      selection: [global:[]]

      joinTableRecords: {}

      fromJSON: (objects) ->
        Spine.joinTableRecords = @createJoinTables objects
        #@createJoinTables objects
        #console.log @joinTableRecords
        #@createJoinTables objects
        #json = @__super__.constructor.fromJSON.call @, objects
        key = @className
        json = @fromArray(objects, key) if @isArray(objects) #test for READ or PUT !
        json || @__super__.constructor.fromJSON.call @, objects

      createJoinTables_: (arr) ->
        console.log 'ModelExtender::createJoinTable'
        return unless @isArray(arr) or @isArray(@joinTables)
        table = {}
        res = @createJoin arr, table for table in @joinTables
        table[item.id] = item for item in res
        console.log table
        table

      createJoinTables: (arr) ->
        return unless @isArray(arr)
        table = {}
        joinTables = @joinTables()
 
        for key in joinTables
          Spine.Model[key].refresh(@createJoin arr, key )
        

      fromArray: (arr, key) ->
        res = []
        extract = (obj) =>
          unless @isArray obj[key]
            item = =>
              inst = new @(obj[key])
              res.push inst
            itm = item()
        
        extract(obj) for obj in arr
        res
        
      createJoin: (json, tableName) ->
        res = []
        introspect = (obj) =>
          if @isObject(obj)
            for key, val of obj
              if key is tableName then res.push(new Spine.Model[tableName](obj[key]))
              else introspect obj[key]
          
          if @isArray(obj)
            for val in obj
              introspect val

        for obj in json
          introspect(obj)
        res
      

      selectionList: (recordID) =>
        id = recordID or @record.id
        return @selection[0].global unless id
        for item in @selection
          return item[id] if item[id]

      updateSelection: (list, id) ->
        @emptySelection list, id

      emptySelection: (list = [], id) ->
        originalList = @selectionList(id)
        originalList[0...originalList.length] = list
        originalList

      removeFromSelection: (model, id) ->
        record = @find(id) if @exists(id)
        return unless record
        list = model.selectionList()
        record.remove list

      isArray: (value) ->
        Object::toString.call(value) is "[object Array]"

      isObject: (value) ->
        Object::toString.call(value) is "[object Object]"

      current: (record) ->
        rec = false
        rec = @find(record.id) if @exists(record?.id)
        @record = rec
        @record or false

      selected: ->
        @record
        
      toID: (records = @records) ->
        ids = for record in records
          record.id
      
    Include =
      
      selectionList: ->
        @constructor.selectionList @id

      updateSelection: (list) ->
        @constructor.updateSelection list, @id

      emptySelection: (list) ->
        @constructor.updateSelection list, @id

      addRemoveSelection: (model, isMetaKey) ->
        list = model.selectionList()
        return unless list
        unless isMetaKey
          @addUnique(list)
        else
          @addRemove(list)
        list

      #prevents an update if model hasn't changed
      updateChangedAttributes: (atts) ->
        origAtts = @attributes()
        for key, value of atts
          unless origAtts[key] is value
            invalid = yes
            @[key] = value

        @save() if invalid
      

      #private
      
      addUnique: (list) ->
        list[0...list.length] = [@id]

      addRemove: (list) ->
        unless @id in list
          list.push @id
        else
          index = list.indexOf(@id)
          list.splice(index, 1) unless index is -1
        list

      remove: (list) ->
        index = list.indexOf(@id)
        list.splice(index, 1) unless index is -1
        list
 

    @extend Extend
    @include Include

    