# bootstrap-checklist
bootstrap-checklist is a jquery plug-in which provide a list with checkbox. There are serveral basic settings(e.g color,checkbox style) which you can replaced with your own ones. In the meanwhile, some methods and events (e.g getCheckedData, onCheck) can be accessed for easily use.

# Dependencies
- Bootstrap v3.3.6
- jQuery v2.2.1

### Demo
You can try the bootstrap-checklist on below page.
https://jsbin.com/sajezuv/edit?output
### Usage
the DOM element
```html
<ul id="someId" ></ul>
```
initialization

```javascript
$('#someId').checklist({
    url:'/somepath/test.json'
});
```
## Data Structure

```javascript
var testData = [
    {
        id:'id_1',
        name:'leon',
        checked:false,
        selected:true
    },
    {
        id:'id_2',
        name:'bruce',
        checked:true,
        selected:false
    }
]
```

1. each object in the Array is a li(DOM Element)'s data.
2. the data(id,name,checked,selected) were stored in li(DOM Element) by jquery method data(),so you cant find the data in DOM structure, but you can retrieve it via data() method.


## Options
##### Example

```javascript
$('#someId').checklist({
    url:'/somePath/someMethod.do',
    multiselect:false,
    settings:{
      color:'red',
	  backgroud_color:'#1234FF'
    }
});
```

### List of Options
##### data
Array. A javascript array containing the data to be displayed.
##### url
String. Checklist will use this url to retrieve the Data with jquery.ajax method. Be noticed that the url param will be ignored when the data param was given.
##### multiselect
Boolean(Default false). Whether or not allow to select mutiple rows.
##### showCheckbox
Boolean(Default true). Just as what its name is.
##### syncCheck
Boolean(Default true). if it is setted to be true, checkbox will be checked when you select a row. No matter how you select a row, either click the row or use Checklist's setSelect method.
##### settings
Object. Be noticed this is a javascript Object, not a string. It contains 4 variables.
1. color:String. Font color for those li element been selected. Hexadecimal value or color value are accepted, e.g.'#FFFFFF' or 'red'. (Default '#FFFFFF')
2. backgroud_color:String. Li element backgroud-color when they are selected. Hexadecimal value or color value are accepted, e.g.'#FFFFFF' or 'red'. (Default '#428BCA')
3. on. String(Default 'glyphicon glyphicon-check'), checked box icon.
4. off. String(Default 'glyphicon glyphicon-unchecked'), uncheck box icon.

## Methods
Example

```javascript
1,
var result = $('#someId').checklist('getCheckedData');
2,
$('#someId').checklist('methodName',parameter);
```

### List of Methods
##### setCheck(id,silent)
Checks a specific li element by its id.
- id. String, it's li's id.
- silent. Boolean, determine whether or not relative Event onCheck will be triggerd. Leaving it blank, the event will not be triggerd.

##### setUncheck(id,silent)
Unchecks a specific li element by its id.
- parameter is the same as setCheck.

##### setSelect(id,silent)
Selects a specific li element by its id.
- parameter is the same as setCheck.

##### setUnselect(id,silent)
Unselects a specific li element by its id.
- parameter is the same as setCheck.

##### unselectAll()
Unselects all li element.

##### uncheckAll()
Unchecks all li element.

##### getCheckedData()
Returns a Array containing the checked li element data, each data is a javascript object.

## Events
Example

```javascript
$('#someId').checklist({
    onSelect:function(event,li){
        //callback function body
    }
});
```

### List of Events
following events will be triggered when corresponding behavior occurred. Meanwhile, they can be triggered via each relative method on conditions that the method's silent param was setted to be true.

parameters:
- event, event object.
- li, the li **DOM** element.

##### onCheck(event,li)

##### onUncheck(event,li)

##### onSelect(event,li)

##### onUnselect(event,li)