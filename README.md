# bootstrap-checklist
bootstrap-checklist is a jquery plug-in which provide a list with checkbox. There are serveral basic settings(e.g color,checkbox style) which you can replaced with your own ones. In the meanwhile, some methods and events (e.g getCheckedData, onCheck) can be accessed for easily use.

# Dependencies
- Bootstrap v3.3.6
- jQuery v2.2.1

### Usage
the DOM element
```
<ul id="someId" ></ul>
```
initialization

```
$('#someId').checklist({
    url:'/somepath/test.json'
});
```
## Data Structure

```
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
1. the data(id,name,checked,selected) were stored in <font color=red size=20 >li(DOM Element)</font> by jquery method data(),so you cant find the data in DOM structure, but you can retrieve it via data() method.

## Options
##### Example

```
$('#someId').checklist({
    url:'/somePath/someMethod.do',
    multiselect:false,
    settings:{
      color:'success'
    }
});
```
### List of Options
##### url
String. Checklist will use this url to retrieve the Data with jquery.ajax method.
##### multiselect
Boolean(Default false). Whether or not allow to select mutiple rows.
##### showCheckbox
Boolean(Default true). Just as what its name is.
##### syncCheck
Boolean(Default true). if it is setted to be true, checkbox will be checked when you select a row. No matter how you select a row, either click the row or use Checklist's setSelect method.
##### settings
Object. Be noticed this is a javascript Object, not a string. It contains 4 variables.
1. color:String. Determines what color will be displayed when row are selected. It is based on bootstrap style, you can input 'primary','success','info','warning','danger'.
2. style. String(Default 'list-group-item-'). 
3. on. String(Default 'glyphicon glyphicon-check'), checked box icon.
4. off. String(Default 'glyphicon glyphicon-unchecked'), uncheck box icon.

## Methods
Example
```
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

##### unSelectAll()
Unselects all li element.

##### unCheckAll()
Unchecks all li element.

##### getCheckedData()
Returns a Array containing the checked li element data, each data is a javascript object.

## Events
Example
```
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