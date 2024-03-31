// import React, { Component } from "react";
// import { DragSource, DropTarget } from "react-dnd";

// // ドラッグされるSourceの動作を定義する
// const dragSource = DragSource(
//   "item",
//   {
//     beginDrag(props) {
//       return props;
//     },
//   },
//   (connect, monitor) => {
//     return {
//       connectDragSource: connect.dragSource(),
//       connectDragPreview: connect.dragPreview(),
//       isDragging: monitor.isDragging(),
//     };
//   }
// );

// // ドロップされるTargetの動作を定義する
// const dropTarget = DropTarget(
//   "item",
//   {
//     drop(dropProps, monitor) {
//       const dragProps = monitor.getItem();
//       if (dropProps.id !== dragProps.id) {
//         dragProps.onDrop(dragProps.id, dropProps.id);
//       }
//     },
//   },
//   (connect) => {
//     return {
//       connectDropTarget: connect.dropTarget(),
//     };
//   }
// );

// class DragItem extends Component {
//   constructor(props) {
//     super(props);
//   }

//   getItemStyles() {
//     const { isDragging } = this.props;

//     return {
//       opacity: isDragging ? 0.4 : 1,
//     };
//   }

//   render() {
//     return this.props.connectDragSource(
//       this.props.connectDropTarget(
//         <div style={this.getItemStyles()}>{this.props.name}</div>
//       )
//     );
//   }
// }

// export default dragSource(dropTarget(DragItem));
