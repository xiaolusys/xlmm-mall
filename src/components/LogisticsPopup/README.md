## API

### LogisticsPopup

| 参数      | 说明                                     | 类型       |  可选值 |默认值 |
|-----------|------------------------------------------|------------|-------|--------|
| active | 是否显示 | boolean  | true/false  | false    |
| companies | 物流公司 | array |  |  |
| onItemClick | 物流公司变化时回调函数 | Function(e:Event) |  |  | |
| onColsePopupClick | 关闭popup回调函数 | Function(e:Event) |  |  |
### Demo

````jsx
onChange = () => {
  this.setState({ checked: !checked })  
}

<LogisticsPopup active={xxx} companies={xxx} onItemClick={xxx} onColsePopupClick={xxx}/>
````