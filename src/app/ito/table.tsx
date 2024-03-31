// import React, { Component } from "react";
// import { DragDropContext } from "react-dnd";
// import HTML5Backend from "react-dnd-html5-backend";
// import TouchBackend from "react-dnd-touch-backend";
// import DragItem from "./DragItem";
// import CustomDragLayer from "./CustomDragLayer";

// class SortableList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: [
//         { id: 1, name: "aaa" },
//         { id: 2, name: "bbb" },
//         { id: 3, name: "ccc" },
//       ],
//     };
//   }

//   onDrop = (toId, fromId) => {
//     const items = this.state.items.slice();
//     const toIndex = items.findIndex((i) => i.id === toId);
//     const fromIndex = items.findIndex((i) => i.id === fromId);
//     const toItem = items[toIndex];
//     const fromItem = items[fromIndex];
//     items[toIndex] = fromItem;
//     items[fromIndex] = toItem;
//     this.setState({ items });
//   };

//   render() {
//     return (
//       <div>
//         {(isAndroid() || isIOS()) && <CustomDragLayer />}
//         {this.state.items.map((item) => {
//           return (
//             <DragItem
//               key={item.id}
//               id={item.id}
//               onDrop={this.onDrop.bind(this)}
//               name={item.name}
//             />
//           );
//         })}
//       </div>
//     );
//   }
// }

// function isAndroid() {
//   return !!window.navigator.userAgent.match(/Android/);
// }

// function isIOS() {
//   return !!window.navigator.userAgent.match(/iPhone|iPad|iPod/);
// }

// export default DragDropContext(
//   isAndroid() || isIOS() ? TouchBackend : HTML5Backend
// )(SortableList);
