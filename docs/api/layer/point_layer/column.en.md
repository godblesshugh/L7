---
title: 3D Column
order: 5
---
3D柱图地理区域上方会显示不同高度的柱体，主题的高度与其在数据集中的数值会成正比。

## 使用

3D柱图通过 PointLayer对象实例化，将shape设置成不同的3Dshape
### shape

3D Shape 支持

- cylinder 
- triangleColumn
- hexagonColumn
- squareColumn

### size

  3D柱图size 需要设置三个维度 [w, l, z]
  - w 宽
  - l 长
  - z 高度

size设置成常量

```
 layer.size([2,2,3])
 ```
size 回调函数设置

```
 layer.size('unit_price', h => {
        return [ 6, 6, h / 500 ];
    })
```



```javascript

const column = new PointLayer({})
      .source(data)
      .shape('name', [
        'cylinder',
        'triangleColumn',
        'hexagonColumn',
        'squareColumn'
      ])
      .size('unit_price', h => {
        return [ 6, 6, h / 500 ];
      })
      .color('name', [ '#5B8FF9', '#70E3B5', '#FFD458', '#FF7C6A' ])
      .style({
        opacity: 1.0
      });
```
