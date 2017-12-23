/* =========================================================
 * bootstrap-checklist.js v1.0.0
 * =========================================================
 * Copyright 2017 leon zhang
 * ========================================================= 
 * 一、设计
 *  1、setCheck,setUncheck,setSelect,setUnselect，将silent的决定放入参数中
       以便外部调用时，灵活决定是否触发事件，如果参数为空或false，不触发。
    2、公有，私有函数，都设计成Prototype，以便获取私有属性
    3、check和select分开
    4、私有属性的设置，极大的方便了插件的多实例。

 */


(function($) {

  var pluginName = 'checklist';

  var _options = {
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
    //私有变量
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
      unSelectAll:$.proxy(this.unSelectAll, this),
      unCheckAll:$.proxy(this.unCheckAll, this)
    }
  }

  //——————————————————————————————————————————————————private method
  Checklist.prototype.init = function(options){
    // private field 'options'; deep copy and don't modify the original _options
    this.options = $.extend(true,{},_options, options);
    var _this = this;

    _this.$element.addClass('list-group checklist');

    $.ajax({
      async:false,
      url:this.options.url,
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

    _this.$element.find('.list-group-item').each(function () {
      var $li = $(this);
      $li.css('cursor', 'pointer');

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
    //判断是否启用checkbox
    if(!this.options.showCheckbox) return;
    var li = this.convertIdentifier(param);
    //check没有单选或多选一说，按常规，必然多选。
    //判断状态
    var isChecked = li.data('checked');
    if(isChecked) return;
    //修改状态
    li.data('checked',true);
    //修改样式
    li.find('.state-icon')
        .removeClass()
        .addClass('state-icon '+this.options.settings['on']);
    //触发事件
    if(silent!=undefined && silent){
      this.$element.trigger('onCheck',li);
    }
  }

  Checklist.prototype.setUncheck = function(param,silent){
    //判断是否启用checkbox
    if(!this.options.showCheckbox) return;
    var li = this.convertIdentifier(param);
    //判断状态
    var isChecked = li.data('checked');
    if(!isChecked) return;
    //修改状态
    li.data('checked',false);
    //修改样式
    li.find('.state-icon')
        .removeClass()
        .addClass('state-icon '+this.options.settings['off']);
    //触发事件
    if(silent!=undefined && silent){
      this.$element.trigger('onUncheck',li);
    }
  }
  Checklist.prototype.setSelect = function(param,silent){
    var li = this.convertIdentifier(param);
    //是否单选
    if(!this.options.multiselect){
      this.unSelectAll();
    }
    //判断状态
    var isSelected = li.data('selected');
    if(isSelected) return;
    //同步checkbox
    if(this.options.syncCheck){
      this.setCheck(li);
    }
    //修改状态
    li.data('selected',true);
    //修改class
    li.addClass(this.options.settings.style + this.options.settings.color);/*remove the 'active' class to avoid bootstrap default change color behavior.' active'*/
    //触发事件
    if(silent!=undefined && silent){
      this.$element.trigger('onSelect',li);
    }
  }
  Checklist.prototype.setUnselect = function(param,silent){
    var li = this.convertIdentifier(param);
    //判断状态
    var isSelected = li.data('selected');
    if(!isSelected) return;
    //同步checkbox
    if(this.options.syncCheck){
      this.setUncheck(li);
    }
    //修改状态
    li.data('selected',false);
    //修改class
    li.removeClass(this.options.settings.style + this.options.settings.color);/*remove the 'active' class to avoid bootstrap default change color behavior.' active'*/
    //触发事件
    if(silent!=undefined && silent){
      this.$element.trigger('onUnselect',li);
    }
  }
  Checklist.prototype.unCheckAll = function(){
    var _this = this;
    $.each(this.$element.find('li'),function(){
      if($(this).data('checked')){
        _this.setUncheck($(this));
      }
    });
  }
  Checklist.prototype.unSelectAll = function(){
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