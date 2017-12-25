/* =========================================================
 * bootstrap-checklist.js v1.0.0
 * =========================================================
 * Copyright 2017 leon zhang
 * ========================================================= 
 */


(function($) {

  var pluginName = 'checklist';

  var _options = {
    data:null,
    multiselect:false,
    silent:false,
    syncCheck:true,
    showCheckbox:true,
    settings:{
      color:'primary',
      style:'list-group-item-',
      on:'glyphicon glyphicon-check',
      off:'glyphicon glyphicon-unchecked'
    }
  };

  //——————————————————————————————————————————————————Constructor
  var Checklist = function(element,options){
    this.$element = $(element);
    this.elementId = element.id;

    this.init(options);
    return {
      options: this.options,
      getCheckedData: $.proxy(this.getCheckedData, this),
      setCheck: $.proxy(this.setCheck, this),
      setUncheck: $.proxy(this.setUncheck, this),
      setSelect: $.proxy(this.setSelect, this),
      setUnselect: $.proxy(this.setUnselect, this),
      unselectAll:$.proxy(this.unselectAll, this),
      uncheckAll:$.proxy(this.uncheckAll, this)
    }
  }

  //——————————————————————————————————————————————————private method
  Checklist.prototype.init = function(options){
    // private field 'options'; deep copy and don't modify the original _options
    this.options = $.extend(true,{},_options, options);
    var _this = this;

    _this.$element.addClass('list-group checklist');

    if(null==_this.options.data){
      $.ajax({
        async:false,
        url:_this.options.url,
        dataType:'json',
        success:function(response){
          $.each(response,function(idx,elem){
            var li=$('<li></li>');
            li.data('id',elem.id).data('checked',elem.checked==true?true:false)
              .data('selected',elem.selected==true?true:false)
              .text(elem.name).addClass('list-group-item').css('cursor','pointer');
            //anthoer way to store data,
            //var li='<li data-id="'+elem.id+'" class="list-group-item" style="cursor: pointer;" data-checked="'+elem.checked+'" >'+elem.name+'</li>';
            _this.$element.append(li);
          });
        }
      });
    }else{
      $.each(_this.options.data,function(idx,elem){
        var li=$('<li></li>');
        li.data('id',elem.id).data('checked',elem.checked==true?true:false)
          .data('selected',elem.selected==true?true:false)
          .text(elem.name).addClass('list-group-item').css('cursor','pointer');
        _this.$element.append(li);
      });
    }

    _this.$element.find('.list-group-item').each(function () {
      var $li = $(this);
      $li.css('cursor', 'pointer');

      if($li.data('selected')){
        $li.addClass(_this.options.settings.style + _this.options.settings.color);
      }

      if($li.find('.state-icon').length == 0 && _this.options.showCheckbox) {
        $li.prepend('<span class="state-icon ' + _this.options.settings[$li.data('checked')==true?'on':'off'] + '"></span>');
      }
    });
    this.subscribeEvents();
  }
  Checklist.prototype.unsubscribeEvents = function () {
    this.$element.off('click');
    this.$element.off('onCheck');
    this.$element.off('onUncheck');
    this.$element.off('onSelect');
    this.$element.off('onUnselect');
  }

  Checklist.prototype.subscribeEvents = function () {
    this.unsubscribeEvents();
    this.$element.on('click', $.proxy(this.clickHandler, this));
    if (typeof (this.options.onCheck) === 'function') {
      this.$element.on('onCheck', this.options.onCheck);
    }
    if (typeof (this.options.onUncheck) === 'function') {
      this.$element.on('onUncheck', this.options.onUncheck);
    }
    if (typeof (this.options.onSelect) === 'function') {
      this.$element.on('onSelect', this.options.onSelect);
    }
    if (typeof (this.options.onUnselect) === 'function') {
      this.$element.on('onUnselect', this.options.onUnselect);
    }
  }

  Checklist.prototype.clickHandler = function (event) {
    var target = $(event.target);
    var li = target.closest('li');
    if (!li) return;
    if(target.hasClass('state-icon')){
      var isChecked = li.data('checked');
      if(!isChecked){
        this.setCheck(li,true);
      }else{
        this.setUncheck(li,true);
      }
    }else{
      var isSelected = li.data('selected');
      if(!isSelected){
        this.setSelect(li,true);
      }else{
        this.setUnselect(li,true);
      }
    }
  }

  Checklist.prototype.convertIdentifier = function(identifier) {
    if(((typeof identifier) === 'string')){
      return this.getLiById(identifier);
    }else{
      return identifier;
    }
  }

  //——————————————————————————————————————————————————public method
  Checklist.prototype.getCheckedData = function(){
    var result = [];
    this.$element.find('li').each(function(){
      if($(this).data('checked')){
        var o = {};
        o.id = $(this).data('id');
        o.name = $(this).text();
        result.push(o);
      }
    });
    return result;
  }

  Checklist.prototype.setCheck = function(param,silent){
    
    if(!this.options.showCheckbox) return;
    var li = this.convertIdentifier(param);

    var isChecked = li.data('checked');
    if(isChecked) return;
    
    li.data('checked',true);
    
    li.find('.state-icon')
        .removeClass()
        .addClass('state-icon '+this.options.settings['on']);
    
    if(silent!=undefined && silent){
      this.$element.trigger('onCheck',li);
    }
  }

  Checklist.prototype.setUncheck = function(param,silent){
    
    if(!this.options.showCheckbox) return;
    var li = this.convertIdentifier(param);
    
    var isChecked = li.data('checked');
    if(!isChecked) return;
    
    li.data('checked',false);
    
    li.find('.state-icon')
        .removeClass()
        .addClass('state-icon '+this.options.settings['off']);
    
    if(silent!=undefined && silent){
      this.$element.trigger('onUncheck',li);
    }
  }
  Checklist.prototype.setSelect = function(param,silent){
    var li = this.convertIdentifier(param);
    
    if(!this.options.multiselect){
      this.unselectAll();
    }
    
    var isSelected = li.data('selected');
    if(isSelected) return;
    
    if(this.options.syncCheck){
      this.setCheck(li);
    }
    
    li.data('selected',true);
    
    li.addClass(this.options.settings.style + this.options.settings.color);/*remove the 'active' class to avoid bootstrap default change color behavior.' active'*/
    
    if(silent!=undefined && silent){
      this.$element.trigger('onSelect',li);
    }
  }
  Checklist.prototype.setUnselect = function(param,silent){
    var li = this.convertIdentifier(param);
    
    var isSelected = li.data('selected');
    if(!isSelected) return;
    
    if(this.options.syncCheck){
      this.setUncheck(li);
    }
    
    li.data('selected',false);
    
    li.removeClass(this.options.settings.style + this.options.settings.color);/*remove the 'active' class to avoid bootstrap default change color behavior.' active'*/
    
    if(silent!=undefined && silent){
      this.$element.trigger('onUnselect',li);
    }
  }
  Checklist.prototype.uncheckAll = function(){
    var _this = this;
    $.each(this.$element.find('li'),function(){
      if($(this).data('checked')){
        _this.setUncheck($(this));
      }
    });
  }
  Checklist.prototype.unselectAll = function(){
    var _this = this;
    $.each(this.$element.find('li'),function(){
      if($(this).data('selected')){
        _this.setUnselect($(this));
      }
    });
  }
  Checklist.prototype.toggleSelectedState = function(li){
    var isChecked = li.find('input').is(':checked');
    isChecked = !isChecked;
    if (isChecked) {
      li.addClass(this.options.settings.style + this.options.settings.color + ' active');
    } else {
      li.removeClass(this.options.settings.style + this.options.settings.color + ' active');
    }
  }
  Checklist.prototype.toggleCheckedState = function(li){
    if(!this.options.multiselect){
      $.each(this.$element.find('li'),function(){
        if($(this).data('state')=='on'){
          console.log('found')
        }
      })
    }
    isChecked = !isChecked;
    li.data('state', (isChecked) ? "on" : "off");
    li.find('.state-icon')
        .removeClass()
        .addClass('state-icon '+this.options.settings[li.data('state')]);
  }

  Checklist.prototype.findLi = function (target) {

  };

  Checklist.prototype.getLiById = function(id){
    var li;
    this.$element.find('li').each(function(idx,elem){
      if(id==$(this).data('id')){
        li = $(this);
      }
    });
    return li;
  }

  var logError = function (message) {
    if (window.console) {
      window.console.error(message);
    }
  };

  
  $.fn[pluginName] = function (options, args) {
    var result;
    this.each(function () {
      var _this = $.data(this, pluginName);
      if (typeof options === 'string') {
        if (!_this) {
          logError('Not initialized, can not call method : ' + options);
        }
        else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
          logError('No such method : ' + options);
        }
        else {
          if (!(args instanceof Array)) {
            args = [ args ];
          }
          result = _this[options].apply(_this, args);
        }
      }else {
        $.data(this, pluginName, new Checklist(this, $.extend(true, {}, options)));
      }
    });
    return result || this;
  };

})(jQuery);