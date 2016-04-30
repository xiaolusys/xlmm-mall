## API

### Checkbox

| 参数      | 说明                                     | 类型       |  可选值 |默认值 |
|-----------|------------------------------------------|------------|-------|--------|
| checked | 指定当前是否选中 | boolean  |   | false    |
| defaultChecked | 初始是否选中 | boolean |  | false |
| onChange | 变化时回调函数 | Function(e:Event) |  |  | |

### Demo

````jsx
onChange = () => {
  this.setState({ checked: !checked })  
}

<Checkbox defaultChecked={false} onChange={onChange}>Checkbox</Checkbox>
````