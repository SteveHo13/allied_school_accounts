// import React, { useState, useEffect } from "react";
// import { firebase } from "../services/firebase";
// // reactstrap components
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   ListGroup,
//   ListGroupItem,
//   CardTitle,
//   Table,
//   Row,
//   Col,
//   Alert,
//   Button,
//   FormGroup,
//   Form,
//   Input,
//   InputGroup,
//   Label,
//   TabContent,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   UncontrolledDropdown,
//   TabPane,
//   Nav,
//   NavItem,
//   NavLink,
//   CardText,
// } from "reactstrap";

// import classnames from "classnames";
// import LoaderSpinner from "react-loader-spinner";

// function SubCategoryComponent(headName, nature) {
//   const [loading, setLoading] = useState(false);
//   const [name, setName] = useState(null);
//   const [netHead, setNetHead] = useState(0);
//   const [head, setHead] = useState(null);

//   useEffect(() => {
//     const head1 = [];
//     var netHead1 = 0;
//     var netHead2 = 0;
//     if(headName!==null){

    
//     firebase
//       .firestore()
//       .collection(headName) //          .collection("Asset")
//       .orderBy("voucher", "asc")
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((docSnap) => {
//           head1.push(docSnap.data());
//           if (nature === "debit") {
//             netHead2 = docSnap.data().debit - docSnap.data().credit;
//             netHead1 = netHead2 + netHead1;
//           } else if (nature === "credit") {
//             netHead2 = docSnap.data().credit - docSnap.data().debit;
//             netHead1 = netHead2 + netHead1;
//           }
//         });
//         setNetHead(netHead1);
//         setHead(head1);
//       });
//     }
//     else 
//     alert("Error")
//   }, []);

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle tag="h4">{headName}</CardTitle>

//           <h4
//             style={{
//               margin: "5px",
//               color: netHead > 0 ? "green" : "red",
//             }}
//           >
//             Net {headName} : {netHead}
//           </h4>
//         </CardHeader>
//         <CardBody>
//           <Table responsive>
//             <thead>
//               <tr>
//                 <th className="text-center">Voucher #</th>
//                 <th className="text-center">Description</th>
//                 <th className="text-center">Date (Y-M-D)</th>
//                 <th className="text-center">Credit</th>
//                 <th className="text-center">Debit</th>
//                 {/* <th className="text-right">Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {head &&
//                 head.map((data, index) => {
//                   return (
//                     <tr key={index}>
//                       <td className="text-center">{data.voucher}</td>
//                       <td className="text-center">
//                         {data.description ? data.description : "null"}
//                       </td>
//                       <td className="text-center">{data.date}</td>
//                       <td className="text-center">
//                         {data.credit ? data.credit : "0"}
//                       </td>
//                       <td className="text-center">
//                         {data.debit ? data.debit : "0"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </Table>
//         </CardBody>
//       </Card>
//     </>
//   );
// }

// export default SubCategoryComponent;
