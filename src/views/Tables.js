import React, { useState, useEffect } from "react";
import { firebase } from "../services/firebase";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardTitle,
  Table,
  Row,
  Col,
  Alert,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Label,
  TabContent,
  DropdownToggle,
  DropdownMenu,
  InputGroupAddon,
  InputGroupText,
  DropdownItem,
  UncontrolledDropdown,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardText,
} from "reactstrap";
import classnames from "classnames";
import LoaderSpinner from "react-loader-spinner";
import TableComponent from "./TableComponent";
import BalanceSheet from "./BalanceSheet";
import { jsPDF } from "jspdf";
import logo from "../assets/img/allied.png";

function Tables() {
  const [loading, setLoading] = useState(false);
  const [showVoucherResult, setShowVoucherResult] = useState("");

  const [dateSearch, setDateSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentData, setStudentData] = useState("");
  const [studentSearchBoolean, setStudentSearchBoolean] = useState(false);

  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [name, setName] = useState(null);

  const [netAsset, setNetAsset] = useState(0);
  const [asset, setAsset] = useState(null);
  const [netLiabilities, setNetLiabilities] = useState(0);
  const [liabilities, setLiabilities] = useState(null);
  const [netIncome, setNetIncome] = useState(0);
  const [income, setIncome] = useState(null);
  const [netExpense, setNetExpense] = useState(0);
  const [expense, setExpense] = useState(null);
  const [netCapital, setNetCapital] = useState(0);
  const [capital, setCapital] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const [activeTab, setActiveTab] = useState("0");

  const voucherCollection = firebase.firestore().collection("Vouchers");

  //     useEffect(() => {
  // export_div()
  //   }, []);

  function export_div() {
    var doc = new jsPDF("p", "mm", "letter");

    //   doc.autoTable({
    //     // html: '#my-table',
    //     head: [
    //       ['ID', 'Name', 'Email', 'Country', 'IP-address'],
    //     ],
    //     body: [
    //       ['1', 'Donna', 'dmoore0@furl.net', 'China', '211.56.242.221'],
    //       ['2', 'Janice', 'jhenry1@theatlantic.com', 'Ukraine', '38.36.7.199'],
    //       ['3', 'Ruth', 'rwells2@constantcontact.com', 'Trinidad and Tobago', '19.162.133.184'],
    //       ['4', 'Jason', 'jray3@psu.edu', 'Brazil', '10.68.11.42'],
    //     ],
    //     theme: 'grid',
    //     tableWidth: 180,
    //     styles: {},
    //     columnStyles: {},
    //   });

    //   doc.save('table');
    // }

    doc.addFont("ArialMS", "Arial", "normal", "Times New Roman");
    doc.setFont("Times New Roman");
    // doc.ShadingPattern("axial")

    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text("ALLIED SCHOOLS", 90, 15);

    //     var img = new Image()
    // img.src = 'assets/img/allied.png'

    doc.addImage(logo, "png", 10, 10, 22, 25);
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("ALLIED SCHOOL, CHAKRI BRANCH RAWLAPINDI", 32, 23);
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text(
      "CB-85/23 Range Rd, Azam Colony, Rawalpindi, Punjab 46000",
      70,
      30
    );
    doc.text("Phone: (051) 5384065", 90, 37);

    doc.setFontSize(17);
    doc.setTextColor(40);
    doc.text("ADMISSION FORM", 82, 50);
    doc.setFontSize(13);
    doc.setTextColor(40);
    //  doc.text("Respected principal,", 10, 30);

    // doc.setFontSize(20);
    // doc.setTextColor(40);
    doc.setFontSize(18);
    doc.setTextColor(1);

    // var img = new Image();
    // img.src = studentData.photo;
    // pdf.addImage(img, 'png', 10, 78, 12, 15)

    //     var image = new Image();
    //     image.setAttribute('crossOrigin', 'anonymous');
    // image.src=studentData.photo;

    // doc.addImage(logo, "png", 160, 70, 30, 30);

    // gsutil cors set cors.json gs://accounts-a9.appspot.com
    doc.addImage(
      "https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Faccounts-a9.appspot.com%2Fo%2FstudentPics%252F1629668630378%3Falt%3Dmedia%26token%3D962788f0-ae1c-4948-83fd-f4d5fbcb103b",
      160,
      80,
      40,
      50
    );

    doc.text(`Student ID :- `, 10, 85);
    doc.text(`${studentData.reg} `, 60, 85);

    doc.text(`Reg Date :- `, 10, 100);
    doc.text(`${studentData.regDate} `, 60, 100);

    doc.text(`Full Name :- `, 10, 115);
    doc.text(`${studentData.studentName} `, 60, 115);

    doc.text(`DOB :- `, 10, 130);
    doc.text(`${studentData.dob} `, 60, 130);

    doc.text(`Gender :- `, 10, 145);
    doc.text(`${studentData.gender} `, 60, 145);

    doc.text(`CNIC :- `, 10, 160);
    doc.text(`${studentData.bformNumber} `, 60, 160);

    doc.text(`Religion :- `, 10, 175);
    doc.text(`${studentData.religion} `, 60, 175);

    doc.text(`Father's Name :- `, 10, 190);
    doc.text(`${studentData.fatherName} `, 60, 190);

    doc.text(`Father's CNIC :- `, 10, 205);
    doc.text(`${studentData.cnic} `, 60, 205);

    doc.text(`Father's Contact#  `, 10, 220);
    doc.text(`${studentData.contact} `, 60, 220);

    doc.text(`Address`, 10, 235);
    doc.text(`${studentData.address1} `, 60, 235);

    doc.text(`Class  `, 10, 250);
    doc.text(
      `${studentData.gradeYear} ` + ` ` + `${studentData.section}`,
      60,
      250
    );

    doc.save(`${studentData.reg}.pdf`);
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const onDismiss = () => {
    setVisible(false);
    setSearchResult(null);
    setStudentData(null);
    setLoading(false);
    setShowVoucherResult(null);
    setStudentSearchBoolean(false);
    setSearchWord(null);
  };

  const onDismiss2 = () => {
    setVisible(false);
    setVisible2(false);
  };

  useEffect(() => {
    const asset1 = [];
    const liabilities1 = [];
    const income1 = [];
    const expense1 = [];
    const capital1 = [];
    var netA1 = 0;
    var netA2 = 0;
    var netL1 = 0;
    var netL2 = 0;
    var netE1 = 0;
    var netE2 = 0;
    var netC1 = 0;
    var netC2 = 0;
    var netI1 = 0;
    var netI2 = 0;

    firebase
      .firestore()
      .collection("users")
      .doc(JSON.parse(localStorage.getItem("uid")))
      .get()
      .then((doc) => {
        setName(doc.data().name);
        firebase
          .firestore()
          .collection("Asset")
          .orderBy("voucher", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              asset1.push(docSnap.data());
              netA2 = docSnap.data().debit - docSnap.data().credit;
              netA1 = netA2 + netA1;
            });
            setNetAsset(netA1);
            setAsset(asset1);
          });
        firebase
          .firestore()
          .collection("Liabilities")
          .orderBy("voucher", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              liabilities1.push(docSnap.data());
              netL2 = docSnap.data().credit - docSnap.data().debit;
              netL1 = netL2 + netL1;
            });
            setNetLiabilities(netL1);
            setLiabilities(liabilities1);
          });
        firebase
          .firestore()
          .collection("Income")
          .orderBy("voucher", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              income1.push(docSnap.data());
              netI2 = docSnap.data().credit - docSnap.data().debit;
              netI1 = netI2 + netI1;
            });
            setNetIncome(netI1);
            setIncome(income1);
          });
        firebase
          .firestore()
          .collection("Expense")
          .orderBy("voucher", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              expense1.push(docSnap.data());
              netE2 = docSnap.data().debit - docSnap.data().credit;
              netE1 = netE2 + netE1;
            });
            setNetExpense(netE1);
            setExpense(expense1);
          });
        firebase
          .firestore()
          .collection("Capital")
          .orderBy("voucher", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              capital1.push(docSnap.data());
              netC2 = docSnap.data().credit - docSnap.data().debit;
              netC1 = netC2 + netC1;
            });
            setNetCapital(netC1);
            setCapital(capital1);
          });
      });
  }, []);

  // textInput = (word) => {
  //   setSearchWord(word);
  //   searchUser(word.target.value);
  // };

  // searchUser(word) {
  //   let userCollectionRef = firebase.firestore().collection("users");
  //   console.log(word);
  //   if (word.length > 2) this.setState({ userChecked: true });
  //   let usernames = [];
  //   let users = [];
  //   if (word.length > 2) {
  //     userCollectionRef
  //       .where("usernameKeywords", "array-contains-any", [
  //         word.toLowerCase(),
  //         word.toUpperCase(),
  //       ])
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((documentSnapshot) => {
  //           console.log(documentSnapshot.data());
  //           usernames.push(documentSnapshot);
  //           this.setState({
  //             foundUser: documentSnapshot.id,
  //             found: true,
  //             username: documentSnapshot.data().username,
  //             name: documentSnapshot.data().name,
  //             profilePic: documentSnapshot.data().profilePic
  //               ? documentSnapshot.data().profilePic
  //               : require("assets/img/icons/user/user1.png"),
  //           });
  //         });
  //         if (usernames.length == 0) {

  //           userCollectionRef
  //           .where("nameKeywords", "array-contains-any", [
  //             word.toLowerCase(),
  //             word.toUpperCase(),
  //           ])
  //           .get()
  //           .then((querySnapshot) => {
  //             querySnapshot.forEach((documentSnapshot) => {
  //               console.log(documentSnapshot.data());
  //               users.push(documentSnapshot);
  //               this.setState({
  //                 foundUser: documentSnapshot.id,
  //                 found: true,
  //                 username: documentSnapshot.data().username,
  //                 name: documentSnapshot.data().name,
  //                 profilePic: documentSnapshot.data().profilePic
  //                   ? documentSnapshot.data().profilePic
  //                   : require("assets/img/icons/user/user1.png"),
  //               });
  //             });
  //             if (users.length == 0) {
  //                 this.setState({
  //                 profilePic: require("assets/img/icons/user/user1.png"),
  //                 searchResults: [],
  //                 foundUser: "",
  //                 found: false,
  //               });
  //             } else {
  //               this.setState({
  //                 searchResults: users,
  //               });
  //             }
  //           });

  //         } else {
  //           this.setState({
  //             searchResults: usernames,
  //           });
  //         }
  //       });
  //   }
  // }

  const searchingVoucher = async () => {
    // console.log("CKICKKERD")

    let res = [];
    // let rez=null;
    const data = [];
    setLoading(true);

    voucherCollection
      .where("date", "==", dateSearch)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          data.push(doc.data());
          // rez = doc.data();
        });
        if (!querySnapshot.empty) {
          console.log(data); //results are in data
          // setShowVoucherResult(data)
          // setSearchResult(data);
          let land = [];
          data.map((dat, ind) => {
            land.push(dat.table1);
            if (dat.totalHeads > 1) {
              land.push(dat.table2);
            }
            if (dat.totalHeads > 2) {
              land.push(dat.table3);
            }
            if (dat.totalHeads > 3) {
              land.push(dat.table4);
            }
            if (dat.totalHeads > 4) {
              land.push(dat.table5);
            }
            if (dat.totalHeads > 5) {
              land.push(dat.table6);
            }
            if (dat.totalHeads > 6) {
              land.push(dat.table7);
            }
            if (dat.totalHeads > 7) {
              land.push(dat.table8);
            }
            if (dat.totalHeads > 8) {
              land.push(dat.table9);
            }
            if (dat.totalHeads > 9) {
              land.push(dat.table10);
            }
          });
          console.log(land);

          //removing duplicate items from the array
          let uniqueChars = [...new Set(land)];
          console.log(uniqueChars);
          setVisible(true);
          setLoading(false);

          uniqueChars.map((rez, index) => {
            firebase
              .firestore()
              .collection(rez)
              .where("date", "==", dateSearch)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  let article = {
                    head: rez,
                    credit: doc.data().credit,
                    date: doc.data().date,
                    debit: doc.data().debit,
                    description: doc.data().description,
                    voucher: doc.data().voucher,
                  };
                  res.push(article);
                  // setShowVoucherResult(res);
                });
              });
          });

          // data.map((rez, index) => {
          //   console.log(rez);
          //   console.log(index);
          //   console.log(data.length);

          //   if (rez.totalHeads === 1) {
          //     // const res = [];
          //     firebase
          //       .firestore()
          //       .collection(rez.table1.toString())
          //       // .doc()
          //       .where("date", "==", dateSearch)
          //       .get()
          //       .then((querySnapshot) => {
          //         querySnapshot.forEach((doc) => {
          //           let article = {
          //             head: rez.table1.toString(),
          //             credit: doc.data().credit,
          //             date: doc.data().date,
          //             debit: doc.data().debit,
          //             description: doc.data().description,
          //             voucher: doc.data().voucher,
          //           };
          //           res.push(article);
          //           // setShowVoucherResult(res);
          //         });
          //         console.log("totalheads 1");
          //       });
          //   } else if (rez.totalHeads === 2) {
          //     firebase
          //       .firestore()
          //       .collection(rez.table1.toString())
          //       // .doc()
          //       .where("date", "==", dateSearch)
          //       .get()
          //       .then((querySnapshot1) => {
          //         querySnapshot1.forEach((doc) => {
          //           let article = {
          //             head: rez.table1.toString(),
          //             credit: doc.data().credit,
          //             date: doc.data().date,
          //             debit: doc.data().debit,
          //             description: doc.data().description,
          //             voucher: doc.data().voucher,
          //           };
          //           res.push(article);
          //           console.log(article);
          //         });

          //         console.log("totalheads 2 part 1");
          //       });

          //     firebase
          //       .firestore()
          //       .collection(rez.table2.toString())
          //       // .doc()
          //       .where("date", "==", dateSearch)
          //       .get()
          //       .then((querySnapshot2) => {
          //         querySnapshot2.forEach((doc) => {
          //           let article2 = {
          //             head: rez.table2.toString(),
          //             credit: doc.data().credit,
          //             date: doc.data().date,
          //             debit: doc.data().debit,
          //             description: doc.data().description,
          //             voucher: doc.data().voucher,
          //           };
          //           res.push(article2);
          //           console.log(article2);
          //         });
          //         console.log("totalheads 2 part 2");
          //       });
          //   } else if (rez.totalHeads === 3) {
          //     // const res = [];
          //     firebase
          //       .firestore()
          //       .collection(rez.table1.toString())
          //       // .doc()
          //       .where("date", "==", dateSearch)
          //       .get()
          //       .then((querySnapshot) => {
          //         querySnapshot.forEach((doc) => {
          //           let article = {
          //             head: rez.table1.toString(),
          //             credit: doc.data().credit,
          //             date: doc.data().date,
          //             debit: doc.data().debit,
          //             description: doc.data().description,
          //             voucher: doc.data().voucher,
          //           };
          //           res.push(article);
          //         });
          //         firebase
          //           .firestore()
          //           .collection(rez.table2.toString())
          //           // .doc()
          //           .where("date", "==", dateSearch)
          //           .get()
          //           .then((querySnapshot) => {
          //             querySnapshot.forEach((doc) => {
          //               let article2 = {
          //                 head: rez.table2.toString(),
          //                 credit: doc.data().credit,
          //                 date: doc.data().date,
          //                 debit: doc.data().debit,
          //                 description: doc.data().description,
          //                 voucher: doc.data().voucher,
          //               };
          //               res.push(article2);
          //             });

          //             firebase
          //               .firestore()
          //               .collection(rez.table3.toString())
          //               // .doc()
          //               .where("date", "==", dateSearch)
          //               .get()
          //               .then((querySnapshot) => {
          //                 querySnapshot.forEach((doc) => {
          //                   let article3 = {
          //                     head: rez.table3.toString(),
          //                     credit: doc.data().credit,
          //                     date: doc.data().date,
          //                     debit: doc.data().debit,
          //                     description: doc.data().description,
          //                     voucher: doc.data().voucher,
          //                   };
          //                   res.push(article3);
          //                 });
          //               });
          //           });
          //       });
          //   } else if (rez.totalHeads === 4) {
          //     // const res = [];
          //     firebase
          //       .firestore()
          //       .collection(rez.table1.toString())
          //       // .doc()
          //       .where("date", "==", dateSearch)
          //       .get()
          //       .then((querySnapshot) => {
          //         querySnapshot.forEach((doc) => {
          //           let article = {
          //             head: rez.table1.toString(),
          //             credit: doc.data().credit,
          //             date: doc.data().date,
          //             debit: doc.data().debit,
          //             description: doc.data().description,
          //             voucher: doc.data().voucher,
          //           };
          //           res.push(article);
          //         });
          //         firebase
          //           .firestore()
          //           .collection(rez.table2.toString())
          //           // .doc()
          //           .where("date", "==", dateSearch)
          //           .get()
          //           .then((querySnapshot) => {
          //             querySnapshot.forEach((doc) => {
          //               let article2 = {
          //                 head: rez.table2.toString(),
          //                 credit: doc.data().credit,
          //                 date: doc.data().date,
          //                 debit: doc.data().debit,
          //                 description: doc.data().description,
          //                 voucher: doc.data().voucher,
          //               };
          //               res.push(article2);
          //             });

          //             firebase
          //               .firestore()
          //               .collection(rez.table3.toString())
          //               // .doc()
          //               .where("date", "==", dateSearch)
          //               .get()
          //               .then((querySnapshot) => {
          //                 querySnapshot.forEach((doc) => {
          //                   let article3 = {
          //                     head: rez.table3.toString(),
          //                     credit: doc.data().credit,
          //                     date: doc.data().date,
          //                     debit: doc.data().debit,
          //                     description: doc.data().description,
          //                     voucher: doc.data().voucher,
          //                   };
          //                   res.push(article3);
          //                 });
          //               });

          //             firebase
          //               .firestore()
          //               .collection(rez.table4.toString())
          //               // .doc()
          //               .where("date", "==", dateSearch)
          //               .get()
          //               .then((querySnapshot) => {
          //                 querySnapshot.forEach((doc) => {
          //                   let article4 = {
          //                     head: rez.table4.toString(),
          //                     credit: doc.data().credit,
          //                     date: doc.data().date,
          //                     debit: doc.data().debit,
          //                     description: doc.data().description,
          //                     voucher: doc.data().voucher,
          //                   };
          //                   res.push(article4);
          //                   // setShowVoucherResult(res);
          //                 });
          //               });
          //           });
          //       });
          //   }
          // });
          console.log(res);
          setShowVoucherResult(res);
          // return showingVouchersFromSeparateFunction();
          // console.log("2")

          // setSearchingTable(true);
        } else if (querySnapshot.empty) {
          console.log("empty response");
          // setSearchResult("none");
          // setSearchingTable(true);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    // voucherCollection
    //   .doc(searchWord.toString())
    //   .get()
    //   .then((doc) => {
    //     let rez = doc.data();
    //     bc.push(rez);
    //     if (doc.exists) {
    //       setVisible(true);
    //       setLoading(false);
    //       console.log(rez);

    //       console.log("1");

    //       if (rez.totalHeads === 1) {
    //         const res = [];
    //         firebase
    //           .firestore()
    //           .collection(rez.table1.toString())
    //           .doc(searchWord.toString())
    //           .get()
    //           .then((doc) => {
    //             let article = {
    //               head: rez.table1.toString(),
    //               credit: doc.data().credit,
    //               date: doc.data().date,
    //               debit: doc.data().debit,
    //               description: doc.data().description,
    //               voucher: doc.data().voucher,
    //             };
    //             res.push(article);
    //             setShowVoucherResult(res);
    //           });
    //       } else if (rez.totalHeads === 2) {
    //         const res = [];
    //         firebase
    //           .firestore()
    //           .collection(rez.table1.toString())
    //           .doc(searchWord.toString())
    //           .get()
    //           .then((doc) => {
    //             let article = {
    //               head: rez.table1.toString(),
    //               credit: doc.data().credit,
    //               date: doc.data().date,
    //               debit: doc.data().debit,
    //               description: doc.data().description,
    //               voucher: doc.data().voucher,
    //             };
    //             res.push(article);
    //           }) &&
    //           firebase
    //             .firestore()
    //             .collection(rez.table2.toString())
    //             .doc(searchWord.toString())
    //             .get()
    //             .then((doc) => {
    //               let article = {
    //                 head: rez.table2.toString(),
    //                 credit: doc.data().credit,
    //                 date: doc.data().date,
    //                 debit: doc.data().debit,
    //                 description: doc.data().description,
    //                 voucher: doc.data().voucher,
    //               };
    //               res.push(article);
    //               setShowVoucherResult(res);
    //             });
    //       } else if (rez.totalHeads === 3) {
    //         const res = [];
    //         firebase
    //           .firestore()
    //           .collection(rez.table1.toString())
    //           .doc(searchWord.toString())
    //           .get()
    //           .then((doc) => {
    //             let article = {
    //               head: rez.table1.toString(),
    //               credit: doc.data().credit,
    //               date: doc.data().date,
    //               debit: doc.data().debit,
    //               description: doc.data().description,
    //               voucher: doc.data().voucher,
    //             };
    //             res.push(article);
    //           }) &&
    //           firebase
    //             .firestore()
    //             .collection(rez.table2.toString())
    //             .doc(searchWord.toString())
    //             .get()
    //             .then((doc) => {
    //               let article = {
    //                 head: rez.table2.toString(),
    //                 credit: doc.data().credit,
    //                 date: doc.data().date,
    //                 debit: doc.data().debit,
    //                 description: doc.data().description,
    //                 voucher: doc.data().voucher,
    //               };
    //               res.push(article);
    //             }) &&
    //           firebase
    //             .firestore()
    //             .collection(rez.table3.toString())
    //             .doc(searchWord.toString())
    //             .get()
    //             .then((doc) => {
    //               let article = {
    //                 head: rez.table3.toString(),
    //                 credit: doc.data().credit,
    //                 date: doc.data().date,
    //                 debit: doc.data().debit,
    //                 description: doc.data().description,
    //                 voucher: doc.data().voucher,
    //               };
    //               res.push(article);
    //               setShowVoucherResult(res);
    //               // console.log(res);
    //               // alert("awaits")
    //             });
    //       } else if (rez.totalHeads === 4) {
    //         const res = [];
    //         firebase
    //           .firestore()
    //           .collection(rez.table1.toString())
    //           .doc(searchWord.toString())
    //           .get()
    //           .then((doc) => {
    //             let article = {
    //               head: rez.table1.toString(),
    //               credit: doc.data().credit,
    //               date: doc.data().date,
    //               debit: doc.data().debit,
    //               description: doc.data().description,
    //               voucher: doc.data().voucher,
    //             };
    //             res.push(article);
    //           }) &&
    //           firebase
    //             .firestore()
    //             .collection(rez.table2.toString())
    //             .doc(searchWord.toString())
    //             .get()
    //             .then((doc) => {
    //               let article = {
    //                 head: rez.table2.toString(),
    //                 credit: doc.data().credit,
    //                 date: doc.data().date,
    //                 debit: doc.data().debit,
    //                 description: doc.data().description,
    //                 voucher: doc.data().voucher,
    //               };
    //               res.push(article);
    //             }) &&
    //           firebase
    //             .firestore()
    //             .collection(rez.table3.toString())
    //             .doc(searchWord.toString())
    //             .get()
    //             .then((doc) => {
    //               let article = {
    //                 head: rez.table3.toString(),
    //                 credit: doc.data().credit,
    //                 date: doc.data().date,
    //                 debit: doc.data().debit,
    //                 description: doc.data().description,
    //                 voucher: doc.data().voucher,
    //               };
    //               res.push(article);
    //             }) &&
    //           firebase
    //             .firestore()
    //             .collection(rez.table4.toString())
    //             .doc(searchWord.toString())
    //             .get()
    //             .then((doc) => {
    //               let article = {
    //                 head: rez.table4.toString(),
    //                 credit: doc.data().credit,
    //                 date: doc.data().date,
    //                 debit: doc.data().debit,
    //                 description: doc.data().description,
    //                 voucher: doc.data().voucher,
    //               };
    //               res.push(article);
    //               setShowVoucherResult(res);
    //             });
    //       }

    //       // return showingVouchersFromSeparateFunction();
    //       // console.log("2")
    //     } else {
    //       setSearchResult(null);
    //       setLoading(false);
    //       setVisible(true);
    //       setVisible2(true);
    //       console.log("n/a");
    //     }
    //   });
    await setSearchResult(data);
  };

  const searchingStudent = async () => {
    let res = [];
    const data = [];
    setLoading(true);
    voucherCollection
      .where("studentId", "==", studentSearch)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        if (!querySnapshot.empty) {
          console.log(data); //results are in data
          let land = [];
          data.map((dat, ind) => {
            land.push(dat.table1);
            if (dat.totalHeads > 1) {
              land.push(dat.table2);
            }
            if (dat.totalHeads > 2) {
              land.push(dat.table3);
            }
            if (dat.totalHeads > 3) {
              land.push(dat.table4);
            }
            if (dat.totalHeads > 4) {
              land.push(dat.table5);
            }
            if (dat.totalHeads > 5) {
              land.push(dat.table6);
            }
            if (dat.totalHeads > 6) {
              land.push(dat.table7);
            }
            if (dat.totalHeads > 7) {
              land.push(dat.table8);
            }
            if (dat.totalHeads > 8) {
              land.push(dat.table9);
            }
            if (dat.totalHeads > 9) {
              land.push(dat.table10);
            }
          });
          console.log(land);
          //removing duplicate items from the array
          let uniqueChars = [...new Set(land)];
          console.log(uniqueChars);
          setVisible(true);
          setLoading(false);

          uniqueChars.map((rez, index) => {
            firebase
              .firestore()
              .collection(rez)
              .where("studentId", "==", studentSearch)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  let article = {
                    head: rez,
                    credit: doc.data().credit,
                    date: doc.data().date,
                    debit: doc.data().debit,
                    description: doc.data().description,
                    voucher: doc.data().voucher,
                  };
                  res.push(article);
                });
              });
          });
          console.log(res);
          setShowVoucherResult(res);
        } else if (querySnapshot.empty) {
          console.log("empty response");
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    firebase
      .firestore()
      .collection("studentRecord")
      .doc(studentSearch)
      .get()
      .then((doc) => {
        console.log(doc.data());
        setStudentSearchBoolean(true);
        setStudentData(doc.data());
      });
    setVisible(true);
    setLoading(false);

    await setSearchResult(data);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    style={{ color: "white" }}
                    className={classnames({ active: activeTab === "0" })}
                    onClick={() => {
                      toggle("0");
                    }}
                  >
                    SEARCH
                  </NavLink>
                </NavItem>

                {asset ? (
                  <NavItem>
                    <NavLink
                      style={{
                        color: asset && asset.length > 0 ? "#1d8cf8" : "",
                      }}
                      disabled={asset && asset.length > 0 ? false : true}
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      Assets
                    </NavLink>
                  </NavItem>
                ) : (
                  ""
                )}
                {liabilities ? (
                  <NavItem>
                    <NavLink
                      style={{
                        color:
                          liabilities && liabilities.length > 0
                            ? "#1d8cf8"
                            : "",
                      }}
                      disabled={
                        liabilities && liabilities.length ? false : true
                      }
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      Liabilites
                    </NavLink>
                  </NavItem>
                ) : (
                  ""
                )}

                {income ? (
                  <NavItem>
                    <NavLink
                      style={{
                        color: income && income.length > 0 ? "#1d8cf8" : "",
                      }}
                      disabled={income && income.length ? false : true}
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        toggle("3");
                      }}
                    >
                      Income
                    </NavLink>
                  </NavItem>
                ) : (
                  ""
                )}
                {expense ? (
                  <NavItem>
                    <NavLink
                      style={{
                        color: expense && expense.length > 0 ? "#1d8cf8" : "",
                      }}
                      disabled={expense && expense.length ? false : true}
                      className={classnames({ active: activeTab === "4" })}
                      onClick={() => {
                        toggle("4");
                      }}
                    >
                      Expense
                    </NavLink>
                  </NavItem>
                ) : (
                  ""
                )}
                {capital ? (
                  <NavItem>
                    <NavLink
                      style={{
                        color: capital && capital.length > 0 ? "#1d8cf8" : "",
                      }}
                      disabled={capital && capital.length ? false : true}
                      className={classnames({ active: activeTab === "5" })}
                      onClick={() => {
                        toggle("5");
                      }}
                    >
                      Capital
                    </NavLink>
                  </NavItem>
                ) : (
                  ""
                )}
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="0">
                  {loading ? (
                    <div style={{ margin: "100px", textAlign: "center" }}>
                      <LoaderSpinner
                        type="MutatingDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        // timeout={100000} //1 secs
                      />
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        {/* <CardTitle tag="h4">
                        View Records Relevant To Table Heads
                      </CardTitle> */}
                      </CardHeader>
                      {visible ? (
                        searchResult ? (
                          <CardBody>
                            <Alert
                              // color="success" //#00bf9a
                              style={
                                studentSearchBoolean
                                  ? { backgroundColor: "#1d5a96" }
                                  : { backgroundColor: "#00bf9a" }
                              }
                              isOpen={visible}
                              // toggle={onDismiss}
                            >
                              {/* <p>
                                Aww yeah, you successfully read this important
                                alert message. This example text is going to run
                                a bit longer so that you can see how spacing
                                within an alert works with this kind of content.
                              </p> */}

                              {studentSearchBoolean ? (
                                <>
                                  <div style={{ marginBottom: "60px" }}>
                                    <h4
                                      className="alert-heading"
                                      style={{ float: "left" }}
                                    >
                                      Student Data
                                    </h4>
                                    <Button
                                      style={{ float: "right" }}
                                      onClick={export_div}
                                      size="sm"
                                    >
                                      Save as PDF
                                    </Button>
                                  </div>

                                  <div
                                    style={{
                                      marginTop: "15px",
                                      marginBottom: "10px",
                                      marginTop: "15px",
                                      marginBottom: "10px",
                                      /* color: red; */
                                      /* background-color: lightseagreen; */
                                      borderRadius: "29px",
                                      /* margin: -9px; */
                                      padding: "20px",
                                      marginBottom: "25px",
                                      marginTop: "25px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                      }}
                                    >
                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          width: "23%",
                                          // , float: "left"
                                        }}
                                      >
                                        <Label for="voucher">Student ID</Label>

                                        <Input
                                          placeholder={studentData.reg}
                                          disabled
                                        />
                                      </FormGroup>
                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          width: "170px",
                                          paddingLeft: "30px",
                                          // display: "flow-root",
                                          marginLeft: "243px",
                                          // float: "left",
                                        }}
                                      >
                                        <Label>Date of Registration</Label>

                                        <Input
                                          placeholder={studentData.regDate}
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          width: "170px",
                                          paddingLeft: "20px",
                                          // display: "flow-root",
                                        }}
                                      >
                                        <Label>Date of birth</Label>
                                        <Input
                                          placeholder={studentData.dob}
                                          disabled
                                        />{" "}
                                      </FormGroup>
                                    </div>
                                    <div
                                      style={{
                                        display: "grid",
                                        marginBottom:"10px"
                                      }}
                                    >
                                      <Label for="stdPic">
                                        Student Picture
                                      </Label>

                                      <img
                                        src={studentData.photo}
                                        alt="Avatar"
                                        className="image-imgHover"
                                        style={{
                                          height: "150px",
                                          objectFit: "contain",

                                          // borderRadius: " 92px",
                                          // border: "#1d253b 4px solid",
                                          margin: "5px",
                                          // width: "165px",
                                        }}
                                      />
                                    </div>
                                      <div>
                                      <FormGroup
                                        className="mb-3"
                                        style={{ width: "43%", float: "left" }}
                                        >
                                        <Label for="voucher">
                                          Student Name
                                        </Label>
                                        <div
                                        style={{dispaly:"flex"}}
                                        >
                                          {/* <img
                                            src={studentData.photo}
                                            alt="Avatar"
                                            className="image-imgHover"
                                            style={{
                                              height: "75px",
                                              objectFit: "contain",
                                              
                                              borderRadius: " 92px",
                                              border: "#1d253b 4px solid",
                                              margin: "5px",
                                              // width: "165px",
                                            }}
                                            /> */}
                                        <Input
                                        style={{alignSelf:"center "}}
                                          placeholder={studentData.studentName}
                                          disabled
                                          />
                                          </div>
                                      </FormGroup>
                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          paddingLeft: "120px",
                                          display: "flow-root",
                                        }}
                                      >
                                        <Label>Father's Name</Label>
                                        <Input
                                          placeholder={studentData.fatherName}
                                          disabled
                                        />{" "}
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{ width: "43%", float: "left" }}
                                      >
                                        <Label for="class">
                                          Student's CNIC#
                                        </Label>
                                        <Input
                                          placeholder={
                                            studentData.bformNumber
                                              ? studentData.bformNumber
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          paddingLeft: "120px",
                                          display: "flow-root",
                                        }}
                                      >
                                        <Label for="section">
                                          Father's CNIC#
                                        </Label>
                                        <Input
                                          placeholder={
                                            studentData.cnic
                                              ? studentData.cnic
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{ width: "43%", float: "left" }}
                                      >
                                        <Label for="class">Gender</Label>
                                        <Input
                                          placeholder={studentData.gender}
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          paddingLeft: "120px",
                                          display: "flow-root",
                                        }}
                                      >
                                        <Label for="section">
                                          Father's Contact#
                                        </Label>
                                        <Input
                                          placeholder={
                                            studentData.contact
                                              ? studentData.contact
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{ width: "43%", float: "left" }}
                                      >
                                        <Label for="class">
                                          Student's email
                                        </Label>
                                        <Input
                                          placeholder={
                                            studentData.studentEmail
                                              ? studentData.studentEmail
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          paddingLeft: "120px",
                                          display: "flow-root",
                                        }}
                                      >
                                        <Label for="section">
                                          Father's Email#
                                        </Label>
                                        <Input
                                          placeholder={
                                            studentData.fatherEmail
                                              ? studentData.fatherEmail
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{ width: "43%", float: "left" }}
                                      >
                                        <Label for="class">Class</Label>
                                        <Input
                                          placeholder={studentData.gradeYear}
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          paddingLeft: "120px",
                                          display: "flow-root",
                                        }}
                                      >
                                        <Label for="section">Section</Label>
                                        <Input
                                          placeholder={
                                            studentData.section
                                              ? studentData.section
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>

                                      <FormGroup
                                        className="mb-3"
                                        style={{ width: "43%", float: "left" }}
                                      >
                                        <Label for="voucher">Landline</Label>
                                        <Input
                                          placeholder={
                                            studentData.landline
                                              ? studentData.landline
                                              : "n/a"
                                          }
                                          disabled
                                        />{" "}
                                      </FormGroup>
                                      <FormGroup
                                        className="mb-3"
                                        style={{
                                          paddingLeft: "120px",
                                          display: "flow-root",
                                        }}
                                      >
                                        <Label for="bfrom">Address</Label>
                                        <Input
                                          placeholder={
                                            studentData.address
                                              ? studentData.address
                                              : "n/a"
                                          }
                                          disabled
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </>
                              ) : null}

                              {showVoucherResult ? (
                                <>
                                  <h4 className="alert-heading">
                                    Voucher Found
                                  </h4>

                                  <Table className="tablesorter" responsive>
                                    <thead className="text-primary">
                                      <tr>
                                        <th className="text-center">
                                          Voucher #
                                        </th>
                                        <th className="text-center">
                                          Table Head
                                        </th>
                                        <th className="text-center">
                                          Description
                                        </th>
                                        {/* <th>Added by</th> */}
                                        <th className="text-center">Date</th>
                                        <th className="text-center">Credit</th>
                                        <th className="text-center">Debit</th>
                                        {/* <th>Description</th> */}
                                        {/* <th className="text-center">Credit</th>
                  <th className="text-center">Debit</th> */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {showVoucherResult.map((data, index) => {
                                        return (
                                          <tr key={index}>
                                            <td className="text-center">
                                              {data.voucher}
                                            </td>
                                            <td className="text-center">
                                              {data.head}
                                            </td>
                                            <td className="text-center">
                                              {data.description
                                                ? data.description
                                                : "null"}
                                            </td>
                                            <td className="text-center">
                                              {data.date}
                                            </td>
                                            <td className="text-center">
                                              {data.credit ? data.credit : "0"}
                                            </td>
                                            <td className="text-center">
                                              {data.debit ? data.debit : "0"}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                </>
                              ) : (
                                <h4 className="alert-heading">
                                  No Voucher Found
                                </h4>
                              )}
                              <hr />
                              {/* <p className="mb-0"> */}
                              {/* Whenever you need to, be sure to use margin
                                utilities to keep things nice and tidy. */}
                              <div style={{ textAlign: "center" }}>
                                <Button
                                  onClick={onDismiss}
                                  color="dark"
                                  style={{ zoom: "80%" }}
                                >
                                  Close
                                </Button>
                              </div>
                              {/* </p> */}
                            </Alert>
                          </CardBody>
                        ) : (
                          <CardBody>
                            <Alert
                              color="danger"
                              isOpen={visible2}
                              toggle={onDismiss2}
                            >
                              <h4 className="alert-heading">
                                Voucher Not Found
                              </h4>
                              {/* <p>
Aww yeah, you successfully read this important alert message. This example text is going
to run a bit longer so that you can see how spacing within an alert works with this kind
of content.
</p> */}
                              <hr />
                              <p className="mb-0">
                                Please check your search query again.
                              </p>
                            </Alert>
                          </CardBody>
                        )
                      ) : (
                        <CardBody>
                          {/* <p style={{ textDecorationLine: "underline" }}>Note:</p> */}
                          <div>
                            Coloured table head's names mean they are populated.
                          </div>

                          <div>
                            Disabled/Black'n'white table head's name shows that
                            they are empty.
                          </div>
                          <div
                            style={{ marginTop: "20px", marginBottom: "10px" }}
                          >
                            <Label>Search Vouchers by Date</Label>

                            <Input
                              id="dateSearch"
                              type="date"
                              autoComplete="off"
                              // onChange={(e) => handleChangeData(e, "dateSearch")}
                              onChange={(e) => setDateSearch(e.target.value)}
                            />

                            {/* <UncontrolledDropdown>
                          <DropdownToggle nav className="nav-link-icon"> */}
                            {/* <Input
                              placeholder="SEARCH VOUHCER #"
                              type="text"
                              id="searchWord"
                              // onChange={(e) => handleChangeData(e, "searchWord")}

                              onChange={(e) => setSearchWord(e.target.value)}
                              // onChange={(word) => textInput(word)}
                            /> */}
                            {/* </DropdownToggle>
                          <DropdownMenu
                            // style={{
                            //   zoom: "81%",
                            //   position: "absolute",
                            //   willChange: " transform",
                            //   top: "0px",
                            //   left: "0px",
                            //   transform: " translate3d(15px, 51px, 0px)",
                            //   minWidth: "210px",
                            // }}
                            aria-labelledby="navbar-success_dropdown_1"
                            left
                          >
                            <>
                              <DropdownItem>lol</DropdownItem>
                            </>
                          </DropdownMenu>
                        </UncontrolledDropdown> */}
                            {/* 
                        <UncontrolledDropdown
                        // nav
                        >
                          <DropdownToggle
                            // caret
                            color="secondary"
                            data-toggle="dropdown"
                            nav
                          >
                            <div className="notification d-none d-lg-block d-xl-block" />
                            <Input placeholder="LOL" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-navbar" left>
                            <NavLink>
                              <DropdownItem className="nav-item">
                                Mike John responded to your email
                              </DropdownItem>
                            </NavLink>
                          </DropdownMenu>
                        </UncontrolledDropdown> */}
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <Button
                              size="sm"
                              color="success"
                              type="number"
                              onClick={searchingVoucher}
                              // disabled={!searchWord}
                            >
                              Check
                            </Button>
                          </div>

                          <div
                            style={{ marginTop: "20px", marginBottom: "10px" }}
                          >
                            <Label>Search Student Data</Label>

                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ zoom: "80%" }}>
                                  S D -
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                id="stdid"
                                placeholder={"0"}
                                type="number"
                                onChange={(e) =>
                                  setStudentSearch("SD-" + e.target.value)
                                }
                                // onChange={(e) =>
                                //   handleChangeData(e, "studentId")
                                // }
                              />
                            </InputGroup>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <Button
                              size="sm"
                              color="success"
                              // type="number"
                              onClick={searchingStudent}
                              // disabled={!searchWord}
                            >
                              Seacrh
                            </Button>
                          </div>
                        </CardBody>
                      )}
                    </Card>
                  )}
                </TabPane>

                <TabPane tabId="1">{TableComponent("Asset", "debit")}</TabPane>

                <TabPane tabId="2">
                  {TableComponent("Liabilities", "credit")}
                </TabPane>

                <TabPane tabId="3">
                  {TableComponent("Income", "credit")}
                </TabPane>

                <TabPane tabId="4">
                  {TableComponent("Expense", "debit")}
                </TabPane>

                <TabPane tabId="5">
                  {TableComponent("Capital", "credit")}
                </TabPane>
              </TabContent>
            </div>
          </Col>
        </Row>

        {/* <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Table on Plain Background</CardTitle>
                <p className="category">Here is a subtitle for this table</p>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
     */}
      </div>
    </>
  );
}

export default Tables;
