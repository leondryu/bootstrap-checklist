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
Example

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
## Options

### List of Options


## Methods

### List of Methods


## Events

### List of Events