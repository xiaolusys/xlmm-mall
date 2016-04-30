## API

### Switch

| 参数      | 说明                                     | 类型       |  可选值 |默认值 |
|-----------|------------------------------------------|------------|-------|--------|
| checked | 指定当前是否选中 | boolean  |   | false    |
| defaultChecked | 初始是否选中 | boolean |  | false |
| onChange | 变化时回调函数 | Function(checked:boolean) |  |  |
| checkedChildren | 选中时的内容 | React Node |  |  |
| unCheckedChildren | 非选中时的内容 | React Node |  |  |
| size | 开关大小 | string | 'default' or 'small' | 'default' |

### Demo

````jsx
onChange = () => {
  this.setState({ checked: !checked })  
}

<Switch defaultChecked={false} onChange={onChange} />
````