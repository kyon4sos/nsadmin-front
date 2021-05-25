<template>
  <div class="grap-tool__wrap">
    <a-button type="primary" size="small" @click="handeAdd">
      <template #icon><PlusOutlined /></template>新增节点
    </a-button>
    <a-button type="primary" size="small" @click="handeSave"> 保存 </a-button>
  </div>
  <div id="container" ref="graphContainer"></div>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  watch,
  onBeforeMount,
} from "vue";
import { Graph, Node, Platform, Dom } from "@antv/x6";
export default defineComponent({
  name: "Graph ",
  setup() {
    // const data = {
    //   // 节点
    //   nodes: [
    //     {
    //       id: "node1", // String，可选，节点的唯一标识
    //       x: 40, // Number，必选，节点位置的 x 值
    //       y: 40, // Number，必选，节点位置的 y 值
    //       width: 80, // Number，可选，节点大小的 width 值
    //       height: 40, // Number，可选，节点大小的 height 值
    //       label: "hello", // String，节点标签
    //     },
    //     {
    //       id: "node2", // String，节点的唯一标识
    //       x: 160, // Number，必选，节点位置的 x 值
    //       y: 180, // Number，必选，节点位置的 y 值
    //       width: 80, // Number，可选，节点大小的 width 值
    //       height: 40, // Number，可选，节点大小的 height 值
    //       label: "world", // String，节点标签
    //     },
    //   ],
    //   // 边
    //   edges: [
    //     {
    //       source: "node1", // String，必须，起始节点 id
    //       target: "node2", // String，必须，目标节点 id
    //     },
    //   ],
    // };
    const graphContainer = ref(null);
    const data = reactive({
      graph: null,
      graphData: {},
      // grapData: {
      //   // 节点
      //   nodes: [
      //     {
      //       id: "node1", // String，可选，节点的唯一标识
      //       x: 40, // Number，必选，节点位置的 x 值
      //       y: 40, // Number，必选，节点位置的 y 值
      //       width: 80, // Number，可选，节点大小的 width 值
      //       height: 40, // Number，可选，节点大小的 height 值
      //       label: "hello", // String，节点标签
      //     },
      //     {
      //       id: "node2", // String，节点的唯一标识
      //       x: 160, // Number，必选，节点位置的 x 值
      //       y: 180, // Number，必选，节点位置的 y 值
      //       width: 80, // Number，可选，节点大小的 width 值
      //       height: 40, // Number，可选，节点大小的 height 值
      //       label: "world", // String，节点标签
      //     },
      //   ],
      //   // 边
      //   edges: [
      //     {
      //       source: "node1", // String，必须，起始节点 id
      //       target: "node2", // String，必须，目标节点 id
      //     },
      //   ],
      // },
    });
    onMounted(() => {
      let offsetWidth = graphContainer.value.parentNode.offsetWidth;
      data.graph = new Graph({
        container: graphContainer.value,
        width: offsetWidth,
        height: 600,
        background: {
          color: "#eeee", // 设置画布背景颜色
        },
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
      });

      data.graph.on("node:added", ({ node, index, options }) => {
        console.log("node:added", node, index, options);
      });
      data.graph.on("node:moved", (param) => {
        let id = param.node.id;
        console.log(param);
        let index = data.grapData.nodes.findIndex((i) => i.id == id);
        console.log(data.grapData.nodes[index].x);
        console.log(data.grapData.nodes[index].y);
        console.log(param.x,param.y);
        data.grapData.nodes[index].x = param.x;
        data.grapData.nodes[index].y = param.y;
      });
      let grapData = JSON.parse(localStorage.getItem("nodes"));
      data.grapData = grapData
      data.graph.fromJSON(data.grapData);
    });

    const handeAdd = () => {
      let now = Date.now();
      data.grapData.nodes.push();
      data.graph.addNode({
        id: String(now), // String，可选，节点的唯一标识
        x: 50, // Number，必选，节点位置的 x 值
        y: 60, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: "hello", // String，节点标签
      });
    };
    const handeSave = () => {
      localStorage.setItem("nodes", JSON.stringify(data.grapData));
    };
    return { graphContainer, handeAdd, handeSave };
  },
});
</script>

<style lang="less" scoped>
.grap-tool__wrap {
  padding: 4px 8px;
  width: 100%;
  height: 48px;
  background-color: rgb(191, 203, 218);
  display: flex;
  align-items: center;
}
.ant-btn {
  margin-right: 8px;
}

.x6-node [magnet="true"] {
  cursor: crosshair;
  transition: none;
}

.x6-node [magnet="true"]:hover {
  opacity: 1;
}

.x6-node [magnet="true"][port-group="in"] {
  cursor: move;
}

.my-port {
  width: 100%;
  height: 100%;
  border: 1px solid #808080;
  border-radius: 100%;
  background: #eee;
}

.my-port.connected {
  width: 0;
  height: 0;
  margin-top: 5px;
  margin-left: 1px;
  border-width: 5px 4px 0;
  border-style: solid;
  border-color: #808080 transparent transparent;
  border-radius: 0;
  background-color: transparent;
}

.x6-port-body.available {
  overflow: visible;
}

.x6-port-body.available body {
  overflow: visible;
}

.x6-port-body.available body > div::before {
  content: " ";
  float: left;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-left: -5px;
  border-radius: 50%;
  background-color: rgba(57, 202, 116, 0.6);
  box-sizing: border-box;
}

.x6-port-body.available body > div::after {
  content: " ";
  float: left;
  clear: both;
  width: 10px;
  height: 10px;
  margin-top: -15px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #39ca74;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.x6-port-body.adsorbed {
  overflow: visible;
}

.x6-port-body.adsorbed body {
  overflow: visible;
}

.x6-port-body.adsorbed body > div::before {
  content: " ";
  float: left;
  width: 28px;
  height: 28px;
  margin-top: -9px;
  margin-left: -9px;
  border-radius: 50%;
  background-color: rgba(57, 202, 116, 0.6);
  box-sizing: border-box;
}

.x6-port-body.adsorbed body > div::after {
  content: " ";
  float: left;
  clear: both;
  width: 10px;
  height: 10px;
  margin-top: -19px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #39ca74;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}
</style>