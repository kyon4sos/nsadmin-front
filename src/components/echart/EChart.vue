<template>
  <div class="echart-container" ref="echartContainer"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import * as echarts from "echarts";

export default defineComponent({
  name: "echart",
  setup() {
    const echartContainer = ref(null);
    onMounted(() => {
      let step = 100;
      // let data = [
      //   {
      //     name: "JS Heap",
      //     value: [0, 1563000480298, 1563000480298 + step],
      //     itemStyle: {
      //       normal: {
      //         color: "#7b9ce1",
      //       },
      //     },
      //   },
      //   {
      //     name: "Documents",
      //     value: [1, 1563000484450, 1563000484450 + step - 3000000],
      //     itemStyle: {
      //       normal: {
      //         color: "#bd6d6c",
      //       },
      //     },
      //   },
      //   {
      //     name: "Nodes",
      //     value: [2, 1563000493753, 1563000493753 + step - 5000000],
      //     itemStyle: {
      //       normal: {
      //         color: "#75d874",
      //       },
      //     },
      //   },
      //   {
      //     name: "Listeners",
      //     value: [3, 1563000503740, 1563000503740 + step],
      //     itemStyle: {
      //       normal: {
      //         color: "#e0bc78",
      //       },
      //     },
      //   },
      //   {
      //     name: "GPU Memory",
      //     value: [2, 1563000506369, 1563000506369 + step - 8000000],
      //     itemStyle: {
      //       normal: {
      //         color: "#e0bc78",
      //       },
      //     },
      //   },
      //   {
      //     name: "GPU",
      //     value: [3, 1563000513841, 1563000513841 + step - 12000000],
      //     itemStyle: {
      //       normal: {
      //         color: "#72b362",
      //       },
      //     },
      //   },
      // ];

      let myEchart = echarts.init(echartContainer.value);
      let option = {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {},
        yAxis: {},
        // dataset: {
        //   source: [
        //     ["product", "2012", "2013", "2014", "2015"],
        //     ["Matcha Latte", 41.1, 30.4, 65.1, 53.3],
        //     ["Milk Tea", 86.5, 92.1, 85.7, 83.1],
        //     ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4],
        //   ],
        //   // source: [
        //   //   {
        //   //     type: "rect",
        //   //     text: "老王",
        //   //     statu: "",
        //   //     nextNode: [
        //   //       {
        //   //         type: "rect",
        //   //         text: "老王儿子",
        //   //         statu: "",
        //   //       },
        //   //     ],
        //   //   },
        //   // ],
        // },

        series: [
          {
            type: "custom",
            renderItem: function (params, api){
              // 对于 data 中的每个 dataItem，都会调用这个 renderItem 函数。
              // （但是注意，并不一定是按照 data 的顺序调用）

              // 这里进行一些处理，例如，坐标转换。
              // 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              let index = params.dataIndex
              console.log(this.data);
              let name = this.data[params.dataIndex].name
              let x = 30*index;
              let y = 30*index;
 
              // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
              // var startPoint = api.coord([api.value(1), x]);
              // var endPoint = api.coord([api.value(2), x]);
              // 这里使用 api.size(...) 获得 Y 轴上数值范围为 1 的一段所对应的像素长度。
              // var height = api.size([0, 1])[1] * 0.6;

              // shape 属性描述了这个矩形的像素位置和大小。
              // 其中特殊得用到了 echarts.graphic.clipRectByRect，意思是，
              // 如果矩形超出了当前坐标系的包围盒，则剪裁这个矩形。
              // 如果矩形完全被剪掉，会返回 undefined.
              // var generate = echarts.graphic.clipRectByRect(
              //   {
              //     // 矩形的位置和大小。
              //     x: startPoint[0],
              //     y: startPoint[1] - height / 2,
              //     width: endPoint[0] - startPoint[0],
              //     height: height,
              //   },
              //   {
              //     // 当前坐标系的包围盒。
              //     x: params.coordSys.x,
              //     y: params.coordSys.y,
              //     width: params.coordSys.width,
              //     height: params.coordSys.height,
              //   }
              // );

              // 这里返回为这个 dataItem 构建的图形元素定义。
              return {
                // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                type: "rect",
                shape: {
                  x: x,
                  y: y,
                  width: 40,
                  height: 40,
                  r: 8,
                },
                style: {
                  fill: "#eded",
                  text: name,
                },
              };
            },
            data: [
                {value: 60, name: '访问'},
                {value: 40, name: '咨询'},
                {value: 20, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ],
            // data: [
            //   [
            //     {
            //       type: "rect",
            //       text: "老王",
            //       statu: "",
            //       nextNode: [
            //         {
            //           type: "rect",
            //           text: "老王儿子",
            //           statu: "",
            //         },
            //       ],
            //     },
            //     {
            //       type: "rect",
            //       text: "老王",
            //       statu: "",
            //       nextNode: [
            //         {
            //           type: "rect",
            //           text: "老王儿子",
            //           statu: "",
            //         },
            //       ],
            //     },
            //   ],
            //   [86.5, 92.1, 85.7, 83.1],
            //   [24.1, 67.2, 79.5, 86.4],
            // ],
          },
        ],
      };
      myEchart.setOption(option);
    });

    return {
      echartContainer,
    };
  },
});
</script>

<style >
.echart-container {
  height: 400px;
  width: 400px;
}
</style>