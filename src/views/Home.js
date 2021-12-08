import React, { useRef, useState, useEffect } from "react";
import { firebase } from "../services/firebase";
import moment from "moment";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  Alert,
  Label,
} from "reactstrap";
import LoaderSpinner from "react-loader-spinner";
import BalanceSheet from "./BalanceSheet";

function Home() {
  const [fields, setFields] = useState([
    {
      option: null,
      credit: null,
      debit: null,
      description: null,
      number: 1,
      type: null,
    },
  ]);
  const [modalSearch, setmodalSearch] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [voucherType, setVouhcerType] = useState(null);
  const [compareCrAndDb, setCompareCrAndDb] = useState(null);
  const [totalCredit, setTotalCredit] = useState(null);
  const [totalDebit, setTotalDebit] = useState(null);

  const onDismiss = () => setAlert(false);

  const pdfExportComponent = useRef(null);

  const assetList = ["Cash", "Receivables", "Bank", "FurnitureAndFittings"];
  const liabilitiesList = ["Liabilities"];
  const incomeList = [
    "TutionFee",
    "AnnualFee",
    "AdmissionFee",
    "MiscellaneousIncome",
  ];
  const expenseList = [
    "SiblingsDiscount",
    "ArmyDiscount",
    "StaffFamilyDiscount",
    "AdvertisingExpense",
    "MiscellaneousExpense",
    "SalaryExpense",
    "BadDebt",
    "Rent",
    "Royalty",
    "Utilities",
    "Stationary",
    "RepairsAndMaintenance",
  ];
  const capitalList = [
    "Capital(M.Daud-25)",
    "RetainedEarnings",
    "Capital(IrfanKiyani-75)",
  ];

  const studentIdRequiredList = [
    "TutionFee",
    "AnnualFee",
    "AdmissionFee",
    "SiblingsDiscount",
    "ArmyDiscount",
    "BadDebt",
    "StaffFamilyDiscount",
  ];

  const [name, setName] = useState(null);
  const [voucher, setVoucher] = useState(undefined);
  const [number, setNumber] = useState(1);
  // const [amount, setAmount] = useState("");
  // const [credit1, setCredit1] = useState("");
  // const [debit1, setDebit1] = useState("");
  const [date, setDate] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [studentIdList, setStudentIdList] = useState(null);
  const [studentIdBoolean, setStudentIdBoolean] = useState(false);
  const [studentVoucherBoolean, setStudentVouhcerBoolean] = useState(false);

  const toggleModalSearch = () => {
    setmodalSearch(!modalSearch);
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(JSON.parse(localStorage.getItem("uid")))
      .get()
      .then((doc) => {
        setName(doc.data().name);
        firebase
          .firestore()
          .collection("Vouchers")
          .get()
          .then((doc) => {
            setVoucher(doc.size);
            // setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    getStudentIdList();
  }, [alert]);

  const getStudentIdList = () => {
    const list = [];

    firebase
      .firestore()
      .collection("studentRecord")
      .get()
      .then((doc) => {
        console.log(doc.size);
        doc.docs.map((data, index) => {
          // console.log(data.id)
          list.push(data.id);
        });
        setStudentIdList(list);
        console.log(studentIdList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleRemove() {
    const values = [...fields];

    values.pop();
    setNumber(number - 1);
    setFields(values);
  }

  function handleAdd() {
    const values = [...fields];
    // console.log(number - 1);
    // console.log(values);

    if (
      values[number - 1].option !== "" &&
      values[number - 1].option !== null &&
      values[number - 1].option
      // &&
      // (values[number - 1].credit || values[number - 1].debit) &&
      // (values[number - 1].credit !== null || values[number - 1].debit !== null)
    ) {
      if (number < 10) {
        values.push({ number: number + 1 });
        setNumber(number + 1);
        setFields(values);
      } else console.log("MAX LIMIT REACHED");
    }
  }

  // const handleVoucherType = (e) => {
  //   setVouhcerType(e.target.value);
  // };

  function handleChangeOption(i, event) {
    const values = [...fields];
    values[i].option = event.target.value;
    values[i].type = checkArrayIncludes(event.target.value);

    if (studentIdRequiredList.includes(event.target.value)) {
      setStudentVouhcerBoolean(true);
    }
    // else    setStudentVouhcerBoolean(false)  ;
   

    if (event.target.value !== "") {
      setFields(values);
      console.log(fields);
    }
    console.log(checkArrayIncludes(event.target.value));
  }

  function checkArrayIncludes(word) {
    if (assetList.includes(word)) return "Asset";
    if (incomeList.includes(word)) return "Income";
    if (liabilitiesList.includes(word)) return "Liabilities";
    if (expenseList.includes(word)) return "Expense";
    if (capitalList.includes(word)) return "Capital";
  }

  function handleChangeDescription(i, event) {
    const values = [...fields];
    values[i].description = event.target.value;
    setFields(values);
  }

  function handleChangeCredit(i, event) {
    const values = [...fields];
    values[i].credit = event.target.value;
    values[i].debit = null;
    setFields(values);
    compareCreditAndDebit();
  }
  function handleChangeDebit(i, event) {
    const values = [...fields];
    values[i].debit = event.target.value;
    values[i].credit = null;
    setFields(values);
    compareCreditAndDebit();
  }

  const handleChangeData = (e, type) => {
    if (type === "date") {
      setDate(e.target.value);
    } else if (type === "remarks") {
      setRemarks(e.target.value);
    } else if (type === "studentId") {
      console.log("SD-" + e.target.value);
      if (studentIdList.includes("SD-" + e.target.value)) {
        setStudentId("SD-" + e.target.value);
        setStudentIdBoolean(true);
      } else setStudentIdBoolean(false);
    }
  };

  var getNextVoucherNumber = () => {
    firebase
      .firestore()
      .collection("Vouchers")
      .get()
      .then((doc) => {
        setVoucher(doc.size);
        console.log("voucher size: " + voucher);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const compareCreditAndDebit = () => {
    var totalCredit = 0;
    var totalDebit = 0;

    fields.map((data, index) => {
      totalCredit += Number(fields[index].credit);
      totalDebit += Number(fields[index].debit);
    });

    setTotalCredit(totalCredit);
    setTotalDebit(totalDebit);

    if (totalCredit !== 0 && totalDebit !== 0 && totalCredit === totalDebit) {
      setCompareCrAndDb(true);
      // console.log("CRCR",totalCredit,totalDebit,compareCrAndDb)
    } else {
      setCompareCrAndDb(false);
      // console.log("CRCR",totalCredit,totalDebit,compareCrAndDb)
    }
  };

  const addEntry = async () => {
    compareCreditAndDebit();

    await getNextVoucherNumber();

    if (
      !(
        date == null ||
        date == "" ||
        fields[fields.length - 1].option == null ||
        // fields[fields.length - 1].credit === null ||
        // fields[fields.length - 1].debit === null ||
        (fields[fields.length - 1].credit === 0 &&
          fields[fields.length - 1].debit === null) ||
        (fields[fields.length - 1].credit === null &&
          fields[fields.length - 1].debit === 0)
      ) &&
      voucher !== null &&
      compareCrAndDb === true
    ) {
      toggleModalSearch();
    } else if (!compareCrAndDb) {
      console.log("Make sure the total of Credit and Debit is same");
    } else console.log("NULL");
  };

  const confirmAdditionOfEntry = async () => {
    let formatTwoDigits = (digit) => ("0" + digit).slice(-2);
    var tempDate = new Date();
    var referenceNumber = `${tempDate.getFullYear()}${formatTwoDigits(
      tempDate.getMonth() + 1
    )}${formatTwoDigits(tempDate.getDate())}${voucher + 1}(${voucherType})`;
    // console.log(date);


    
    setLoading(true);
    await getNextVoucherNumber();
    const docName = voucher + 1;

    if (
      !firebase
        .firestore()
        .collection("Vouchers")
        .doc(docName.toString())
        .isEqual() &&
      docName !== undefined
    ) {
      // const docName = voucher + 1;
      //if
      fields.length === 1
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 2
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 3
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 4
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 5
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              table5: fields[4].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 6
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              table5: fields[4].option,
              table6: fields[5].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 7
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              table5: fields[4].option,
              table6: fields[5].option,
              table7: fields[6].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 8
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              table5: fields[4].option,
              table6: fields[5].option,
              table7: fields[6].option,
              table8: fields[7].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 9
        ? firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              table5: fields[4].option,
              table6: fields[5].option,
              table7: fields[6].option,
              table8: fields[7].option,
              table9: fields[8].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
        : fields.length === 11
        ? console.log("Only 10 table heads are supported")
        : firebase
            .firestore()
            .collection("Vouchers")
            .doc(docName.toString())
            .set({
              remarks: remarks,
              studentId: studentId,
              voucher: voucher + 1,
              addedBy: name,
              date: date,
              totalHeads: fields.length,
              table1: fields[0].option,
              table2: fields[1].option,
              table3: fields[2].option,
              table4: fields[3].option,
              table5: fields[4].option,
              table6: fields[5].option,
              table7: fields[6].option,
              table8: fields[7].option,
              table9: fields[8].option,
              table10: fields[9].option,

              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            });

      firebase
        .firestore()
        .collection(fields[0].option)
        .doc()
        .set({
          description: fields[0].description ? fields[0].description : null,

          voucher: voucher + 1,
          date: date,
          remarks: remarks,
          studentId: studentId,
          credit: fields[0].credit ? fields[0].credit : null,
          debit: fields[0].debit ? fields[0].debit : null,
          type: fields[0].type,
          referenceNumber: referenceNumber,
          addedOn: moment().format("YYYY-MM-DD"),
        })
        .then(() => {
          firebase
            .firestore()
            .collection(fields[0].type)
            .doc(docName.toString())
            .set({
              voucher: voucher + 1,
              date: date,
              description: fields[0].description ? fields[0].description : null,

              remarks: remarks,
              studentId: studentId,
              credit: fields[0].credit ? fields[0].credit : null,
              debit: fields[0].debit ? fields[0].debit : null,
              subCategory: fields[0].option,
              referenceNumber: referenceNumber,
              addedOn: moment().format("YYYY-MM-DD"),
            })
            .then(() => {
              setAlert(true);
              setLoading(false);
              setVouhcerType(null);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      if (fields[1]) {
        firebase
          .firestore()
          .collection(fields[1].option)
          .doc()
          .set({
            description: fields[1].description ? fields[1].description : null,
            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[1].credit ? fields[1].credit : null,
            debit: fields[1].debit ? fields[1].debit : null,
            type: fields[1].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[1].type)
              .doc(docName.toString() + "v2")
              .set({
                description: fields[1].description
                  ? fields[1].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[1].credit ? fields[1].credit : null,
                debit: fields[1].debit ? fields[1].debit : null,
                subCategory: fields[1].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (fields[2]) {
        firebase
          .firestore()
          .collection(fields[2].option)
          .doc()
          .set({
            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            description: fields[2].description ? fields[2].description : null,
            credit: fields[2].credit ? fields[2].credit : null,
            debit: fields[2].debit ? fields[2].debit : null,
            type: fields[2].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[2].type)
              .doc(docName.toString() + "v3")
              .set({
                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                description: fields[2].description
                  ? fields[2].description
                  : null,
                credit: fields[2].credit ? fields[2].credit : null,
                debit: fields[2].debit ? fields[2].debit : null,
                subCategory: fields[2].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (fields[3]) {
        firebase
          .firestore()
          .collection(fields[3].option)
          .doc()
          .set({
            description: fields[3].description ? fields[3].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[3].credit ? fields[3].credit : null,
            debit: fields[3].debit ? fields[3].debit : null,
            type: fields[3].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[3].type)
              .doc(docName.toString() + "v4")
              .set({
                description: fields[3].description
                  ? fields[3].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[3].credit ? fields[3].credit : null,
                debit: fields[3].debit ? fields[3].debit : null,
                subCategory: fields[3].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (fields[4]) {
        firebase
          .firestore()
          .collection(fields[4].option)
          .doc()
          .set({
            description: fields[4].description ? fields[4].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[4].credit ? fields[4].credit : null,
            debit: fields[4].debit ? fields[4].debit : null,
            type: fields[4].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[4].type)
              .doc(docName.toString() + "v5")
              .set({
                description: fields[4].description
                  ? fields[4].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[4].credit ? fields[4].credit : null,
                debit: fields[4].debit ? fields[4].debit : null,
                subCategory: fields[4].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (fields[5]) {
        firebase
          .firestore()
          .collection(fields[5].option)
          .doc()
          .set({
            description: fields[5].description ? fields[5].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[5].credit ? fields[5].credit : null,
            debit: fields[5].debit ? fields[5].debit : null,
            type: fields[5].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[5].type)
              .doc(docName.toString() + "v6")
              .set({
                description: fields[5].description
                  ? fields[5].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[5].credit ? fields[5].credit : null,
                debit: fields[5].debit ? fields[5].debit : null,
                subCategory: fields[5].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (fields[6]) {
        firebase
          .firestore()
          .collection(fields[6].option)
          .doc()
          .set({
            description: fields[6].description ? fields[6].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[6].credit ? fields[6].credit : null,
            debit: fields[6].debit ? fields[6].debit : null,
            type: fields[6].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[6].type)
              .doc(docName.toString() + "v7")
              .set({
                description: fields[6].description
                  ? fields[6].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[6].credit ? fields[6].credit : null,
                debit: fields[6].debit ? fields[6].debit : null,
                subCategory: fields[6].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (fields[7]) {
        firebase
          .firestore()
          .collection(fields[7].option)
          .doc()
          .set({
            description: fields[7].description ? fields[7].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[7].credit ? fields[7].credit : null,
            debit: fields[7].debit ? fields[7].debit : null,
            type: fields[7].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[7].type)
              .doc(docName.toString() + "v8")
              .set({
                description: fields[7].description
                  ? fields[7].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[7].credit ? fields[7].credit : null,
                debit: fields[7].debit ? fields[7].debit : null,
                subCategory: fields[7].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (fields[8]) {
        firebase
          .firestore()
          .collection(fields[8].option)
          .doc()
          .set({
            description: fields[8].description ? fields[8].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[8].credit ? fields[8].credit : null,
            debit: fields[8].debit ? fields[8].debit : null,
            type: fields[8].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[8].type)
              .doc(docName.toString() + "v9")
              .set({
                description: fields[8].description
                  ? fields[8].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[8].credit ? fields[8].credit : null,
                debit: fields[8].debit ? fields[8].debit : null,
                subCategory: fields[8].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (fields[9]) {
        firebase
          .firestore()
          .collection(fields[9].option)
          .doc()
          .set({
            description: fields[9].description ? fields[9].description : null,

            voucher: voucher + 1,
            date: date,
            remarks: remarks,
            studentId: studentId,
            credit: fields[9].credit ? fields[9].credit : null,
            debit: fields[9].debit ? fields[9].debit : null,
            type: fields[9].type,
            referenceNumber: referenceNumber,
            addedOn: moment().format("YYYY-MM-DD"),
          })
          .then(() => {
            firebase
              .firestore()
              .collection(fields[9].type)
              .doc(docName.toString() + "v10")
              .set({
                description: fields[9].description
                  ? fields[9].description
                  : null,

                voucher: voucher + 1,
                date: date,
                remarks: remarks,
                studentId: studentId,
                credit: fields[9].credit ? fields[9].credit : null,
                debit: fields[9].debit ? fields[9].debit : null,
                subCategory: fields[9].option,
                referenceNumber: referenceNumber,
                addedOn: moment().format("YYYY-MM-DD"),
              })
              .then(() => {
                setAlert(true);
                setLoading(false);
                setVouhcerType(null);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      setmodalSearch(false);
      // setVoucher(undefined);
      // setAmount("");
      // setCredit1("");
      // setDebit1("");
      // setRemarks("");
      setTotalCredit(null);
      setTotalDebit(null);
      // setVouhcerType(null);
      setNumber(1);

      setFields([
        {
          number: 1,
          option: null,
          credit: null,
          debit: null,
          description: null,
          type: null,
        },
      ]);
    } else {
      alert("Voucher addition failed!");
      setmodalSearch(false);
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            {alert ? (
              <>
                <Alert color="success" isOpen={alert} toggle={onDismiss}>
                  Voucher added successfully
                </Alert>
              </>
            ) : null}
            <>
              {voucherType ? (
                <Card
                  style={{
                    border: "1px solid",
                    borderColor:
                      voucherType === "RV"
                        ? "crimson"
                        : voucherType === "PV"
                        ? "#11cdef"
                        : voucherType === "JV"
                        ? "rgb(73 44 255)"
                        : voucherType === "CD"
                        ? "orange"
                        : null,
                  }}
                >
                  <CardHeader
                    style={{
                      background:
                        voucherType === "RV"
                          ? "crimson"
                          : voucherType === "PV"
                          ? "#11cdef"
                          : voucherType === "JV"
                          ? "rgb(73 44 255)"
                          : voucherType === "CD"
                          ? "orange"
                          : null,
                    }}
                  >
                    <CardTitle tag="h4">
                      Add a voucher {"("} {voucherType} {")"}
                      <div style={{ float: "right", paddingBottom: "10px" }}>
                        <Input
                          type="select"
                          name="voucherType"
                          id="voucherType"
                          value={voucherType}
                          onChange={(e) => setVouhcerType(e.target.value)}
                        >
                          {/* <option value={null}>Voucher Type </option> */}
                          <option value="RV">Receipt</option>
                          <option value="PV">Payment</option>
                          <option value="JV">Journal</option>
                          <option value="CD">Cash deposit</option>
                          {/* RV-PV-JV-CD */}
                        </Input>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    {loading ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "50px",
                          marginBottom: "200px",
                          // zoom:"60%"

                          // mixBlendMode: "screen",
                        }}
                      >
                        <LoaderSpinner
                          type="MutatingDots"
                          color="#00BFFF"
                          height={100}
                          width={100}
                          // timeout={100000} //1 secs
                        />
                      </div>
                    ) : (
                      <Form
                        id="formLogin"
                        // role="form"
                        //  onSubmit={onLogin}
                      >
                        <FormGroup
                          className="mb-3"
                          style={{ width: "43%", float: "left" }}
                        >
                          <Label for="voucher">Voucher number</Label>
                          <Input
                            id="voucher"
                            placeholder={voucher ? "V#" + (voucher + 1) : "V#"}
                            type="number"
                            min="0"
                            // onChange={(e) => handleChangeData(e, "email")}
                            disabled
                          />
                        </FormGroup>

                        <FormGroup
                          className="mb-3"
                          style={{ paddingLeft: "120px", display: "flow-root" }}
                        >
                          <Label>Date</Label>

                          <Input
                            id="date"
                            // placeholder={"Date/Time"}
                            type="date"
                            autoComplete="off"
                            onChange={(e) => handleChangeData(e, "date")}
                          />
                        </FormGroup>
                        {studentVoucherBoolean ? (
                          <FormGroup className="mb-3" style={{ width: "20%" }}>
                            <Label for="stdid">Student ID</Label>
                            <InputGroup
                              style={
                                studentIdBoolean
                                  ? { outline: "dashed 2px green" }
                                  : { outline: "dashed 2px red" }
                              }
                            >
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
                                  handleChangeData(e, "studentId")
                                }
                              />
                            </InputGroup>{" "}
                          </FormGroup>
                        ) : null}
                        <FormGroup
                          className="mb-3"
                          // style={{
                          //   paddingLeft: "120px",
                          //    display: "flex" }}
                        >
                          <Label for="remarks">Remarks</Label>

                          <Input
                            id="remarks"
                            placeholder={"Voucher's remarks"}
                            type="text"
                            autoComplete="off"
                            onChange={(e) => handleChangeData(e, "remarks")}
                          />
                        </FormGroup>

                        {/* {studentVoucherBoolean ? (
                          <FormGroup
                            className="mb-3"
                            style={{
                              paddingLeft: "15px",
                            }}
                            // onClick={getStudentIdList}
                          >
                            <Label for="stdid">Student ID</Label>
                            <InputGroup
                              style={
                                studentIdBoolean
                                  ? { outline: "dashed 2px green" }
                                  : { outline: "dashed 2px red" }
                              }
                            >
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ zoom: "80%" }}>
                                  S D -
                                </InputGroupText>
                              </InputGroupAddon>

                              <Input
                                // disabled={
                                //   !(
                                //     fields[idx].option === "AnnualFee" ||
                                //     fields[idx].option === "AdmissionFee" ||
                                //     fields[idx].option ===
                                //       "SiblingsDiscount" ||
                                //     fields[idx].option === "ArmyDiscount" ||
                                //     fields[idx].option === "BadDebt" ||
                                //     fields[idx].option ===
                                //       "StaffFamilyDiscount"
                                //   )
                                // }
                                id="stdid"
                                placeholder={studentId ? studentId : "0"}
                                type="number"
                                // autoComplete="off"
                                // onChange={(e) =>
                                //   handleChangeDescription(idx, e)
                                // }
                                onChange={(e) =>
                                  handleChangeData(e, "studentId")
                                }
                                // disabled={studentIdBoolean}
                              />
                            </InputGroup>
                          </FormGroup>
                        ) : null} */}

                        {/* <FormGroup
                    className={
                      amount > 0
                        ? "mb-3 has-success"
                        : amount < 0
                        ? "mb-3 has-danger"
                        : "mb-3"
                    }
                    style={{ width: "43%", float: "left" }}
                  >
                    <Input
                      id="amount"
                      placeholder={"Amount (PKR)"}
                      type="number"
                      min="0"
                      // onInput={"validity.valid||(value='')"}
                      // onKeyPress={}
                      // pattern={(/[+-]?\d+(?:[.,]\d+)?]/)}
                      onChange={(e) => handleChangeData(e, "amount")}
                    />
                  </FormGroup> */}
                        {/* <div
                    style={{ display: "-webkit-box", webkitBoxAlign: "center" }}
                  >
                    <FormGroup
                      className="mb-3"
                      style={{ width: "43%", float: "left" }}
                    >
                      <Label for="accountHeads">Chart of Accounts#1</Label>
                      <Input type="select" name="accounts" id="accountHeads">
                        <option>Choose...</option>
                        <option>Asset</option>
                        <option>Liabilities</option>
                        <option>Income</option>
                        <option>Expense</option>
                        <option>Capital</option>
                      </Input>
                    </FormGroup>

                    <div style={{ float: "right", paddingLeft: "80px" }}>
                      <FormGroup
                        className={
                          amount > 0
                            ? "mb-3 has-success"
                            : amount < 0
                            ? "mb-3 has-danger"
                            : "mb-3"
                        }
                        style={{ width: "45%", float: "left" }}
                      >
                        <Label for="CR">Credit</Label>

                        <Input
                          id="credit1"
                          placeholder={"Amount (PKR)"}
                          type="number"
                          min="0"
                          onChange={(e) => handleChangeData(e, "credit1")}
                        />
                      </FormGroup>

                      <FormGroup
                        className="mb-3"
                        style={{ width: "45%", float: "right" }}
                      >
                        <Label for="DB">Debit</Label>

                        <Input
                          id="debit1"
                          placeholder={"Amount (PKR)"}
                          type="number"
                          min="0"
                          onChange={(e) => handleChangeData(e, "debit1")}
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div
                    style={{ display: "-webkit-box", webkitBoxAlign: "center" }}
                  >
                    <FormGroup
                      className="mb-3"
                      style={{ width: "43%", float: "left" }}
                    >
                      <Label for="accountHeads">Chart of Accounts#2</Label>
                      <Input type="select" name="accounts" id="accountHeads">
                        <option>Choose...</option>
                        <option>Asset</option>
                        <option>Liabilities</option>
                        <option>Income</option>
                        <option>Expense</option>
                        <option>Capital</option>
                      </Input>
                    </FormGroup>

                    <div style={{ float: "right", paddingLeft: "80px" }}>
                      <FormGroup
                        className={
                          amount > 0
                            ? "mb-3 has-success"
                            : amount < 0
                            ? "mb-3 has-danger"
                            : "mb-3"
                        }
                        style={{ width: "45%", float: "left" }}
                      >
                        <Label for="CR">Credit</Label>

                        <Input
                          id="credit2"
                          placeholder={"Amount (PKR)"}
                          type="number"
                          min="0"
                          onChange={(e) => handleChangeData(e, "credit2")}
                        />
                      </FormGroup>

                      <FormGroup
                        className="mb-3"
                        style={{ width: "45%", float: "right" }}
                      >
                        <Label for="DB">Debit</Label>

                        <Input
                          id="debit2"
                          placeholder={"Amount (PKR)"}
                          type="number"
                          min="0"
                          onChange={(e) => handleChangeData(e, "debit2")}
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div
                    style={{ display: "-webkit-box", webkitBoxAlign: "center" }}
                  >
                    <FormGroup
                      className="mb-3"
                      style={{ width: "43%", float: "left" }}
                    >
                      <Label for="accountHeads">Chart of Accounts#3</Label>
                      <Input type="select" name="accounts" id="accountHeads">
                        <option>Choose...</option>
                        <option>Asset</option>
                        <option>Liabilities</option>
                        <option>Income</option>
                        <option>Expense</option>
                        <option>Capital</option>
                      </Input>
                    </FormGroup>

                    <div style={{ float: "right", paddingLeft: "80px" }}>
                      <FormGroup
                        className={
                          amount > 0
                            ? "mb-3 has-success"
                            : amount < 0
                            ? "mb-3 has-danger"
                            : "mb-3"
                        }
                        style={{ width: "45%", float: "left" }}
                      >
                        <Label for="CR">Credit</Label>

                        <Input
                          id="credit3"
                          placeholder={"Amount (PKR)"}
                          type="number"
                          min="0"
                          onChange={(e) => handleChangeData(e, "credit3")}
                        />
                      </FormGroup>

                      <FormGroup
                        className="mb-3"
                        style={{ width: "45%", float: "right" }}
                      >
                        <Label for="DB">Debit</Label>

                        <Input
                          id="debit3"
                          placeholder={"Amount (PKR)"}
                          type="number"
                          min="0"
                          onChange={(e) => handleChangeData(e, "debit3")}
                        />
                      </FormGroup>
                    </div>
                  </div> */}

                        {fields.map((field, idx) => {
                          return (
                            <div
                              key={`${field}-${idx}`}
                              // style={{ display: "-webkit-box", webkitBoxAlign: "center" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  WebkitBoxAlign: "center",
                                }}
                              >
                                <FormGroup
                                  className="mb-3"
                                  style={{ width: "30%", float: "left" }}
                                >
                                  <Label for="accountHeads">
                                    Chart of Accounts
                                  </Label>
                                  <Input
                                    type="select"
                                    name="accounts"
                                    id="accountHeads"
                                    onChange={(e) => handleChangeOption(idx, e)}
                                  >
                                    <option value="">Choose...</option>
                                    {/* <option>Asset</option>
                                <option>Liabilities</option>
                                <option>Income</option>
                                <option>Expense</option>
                              <option>Capital</option> */}
                                    <option value="AdmissionFee">
                                      Admission Fee
                                    </option>
                                    <option value="AdvertisingExpense">
                                      Advertising Expense
                                    </option>
                                    <option value="AnnualFee">
                                      Annual Fee
                                    </option>
                                    <option value="ArmyDiscount">
                                      Army discount
                                    </option>
                                    <option value="BadDebt">Bad Debt</option>
                                    <option>Bank</option>
                                    <option>Capital(IrfanKiyani-75)</option>
                                    <option>Capital(M.Daud-25)</option>
                                    <option>Cash</option>
                                    <option value="FurnitureAndFittings">
                                      Furniture & fittings
                                    </option>
                                    <option>Liabilities</option>
                                    <option value="MiscellaneousExpense">
                                      Miscellaneous Expense
                                    </option>
                                    <option value="MiscellaneousIncome">
                                      Miscellaneous Income
                                    </option>
                                    <option>Receivables</option>
                                    <option>Rent</option>
                                    <option value="RepairsAndMaintenance">
                                      Repairs & Maintenance
                                    </option>
                                    <option>RetainedEarnings</option>
                                    <option>Royalty</option>
                                    <option value="SalaryExpense">
                                      Salary Expense
                                    </option>
                                    <option value="SiblingsDiscount">
                                      Siblings discount
                                    </option>
                                    <option value="StaffFamilyDiscount">
                                      Staff family discount
                                    </option>
                                    <option>Stationary</option>
                                    <option value="TutionFee">
                                      Tution Fee
                                    </option>
                                    <option>Utilities</option>
                                  </Input>
                                </FormGroup>

                                <FormGroup
                                  className="mb-3"
                                  style={{
                                    paddingLeft: "20px",
                                  }}
                                >
                                  <Label for="remarks">Description</Label>

                                  <Input
                                    id="remarks"
                                    placeholder={"Voucher's description"}
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) =>
                                      handleChangeDescription(idx, e)
                                    }
                                  />
                                </FormGroup>
                                {/* 
                                {fields[idx].option === "TutionFee" ||
                                fields[idx].option === "AnnualFee" ||
                                fields[idx].option === "AdmissionFee" ||
                                fields[idx].option === "SiblingsDiscount" ||
                                fields[idx].option === "ArmyDiscount" ||
                                fields[idx].option === "BadDebt" ||
                                fields[idx].option === "StaffFamilyDiscount" ? (

                                  <FormGroup
                                    className="mb-3"
                                    style={{
                                      paddingLeft: "15px",
                                    }}
                                    onClick={getStudentIdList}
                                  >
                                    <Label for="stdid">Student ID</Label>
                                    <InputGroup
                                      style={
                                        studentIdBoolean
                                          ? { outline: "dashed 2px green" }
                                          : { outline: "dashed 2px red" }
                                      }
                                    >
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ zoom: "80%" }}>
                                          S D -
                                        </InputGroupText>
                                      </InputGroupAddon>

                                      <Input
                                        id="stdid"
                                        placeholder={
                                          studentId ? studentId : "0"
                                        }
                                        type="number"
                                        onChange={(e) =>
                                          handleChangeData(e, "studentId")
                                        }
                                      />
                                    </InputGroup>
                                  </FormGroup>
                                ) : null} */}
                                <div
                                  style={{
                                    float: "right",
                                    paddingLeft: "80px",
                                  }}
                                >
                                  <FormGroup
                                    className="mb-3"
                                    style={{ width: "45%", float: "left" }}
                                  >
                                    <Label for="CR">Credit</Label>

                                    <Input
                                      id="credit1"
                                      placeholder={"Amount (PKR)"}
                                      type="number"
                                      min="0"
                                      disabled={
                                        (voucherType === "RV" &&
                                          (fields[idx].option === "Bank" ||
                                            fields[idx].option === "Cash")) ||
                                        (voucherType === "PV" &&
                                          fields[idx].type === "Expense") ||
                                        fields[idx].debit > 0
                                      }
                                      // onChange={(e) => handleChangeData(e, "credit1")}
                                      onChange={(e) =>
                                        handleChangeCredit(idx, e)
                                      }
                                    />
                                  </FormGroup>

                                  <FormGroup
                                    className="mb-3"
                                    style={{ width: "45%", float: "right" }}
                                  >
                                    <Label for="DB">Debit</Label>

                                    <Input
                                      id="debit1"
                                      placeholder={"Amount (PKR)"}
                                      type="number"
                                      min="0"
                                      disabled={
                                        (voucherType === "PV" &&
                                          (fields[idx].option === "Bank" ||
                                            fields[idx].option === "Cash")) ||
                                        fields[idx].credit > 0
                                      }
                                      // onChange={(e) => handleChangeData(e, "debit1")}
                                      onChange={(e) =>
                                        handleChangeDebit(idx, e)
                                      }
                                    />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {number < 10 ? (
                          <Button
                            size="sm"
                            // type="button"
                            onClick={() => handleAdd()}
                          >
                            Add a row +
                          </Button>
                        ) : (
                          ""
                        )}

                        {fields.length > 1 ? (
                          <Button
                            onClick={handleRemove}
                            style={{
                              float: "right",
                              margin: "2px",
                              zoom: "65%",
                              width: "200px",
                            }}
                            className="btn-icon"
                            color="danger"
                            // size="sm"
                          >
                            Remove latest head
                            {/* <i className="fa fa-times" /> */}
                          </Button>
                        ) : null}

                        <div className="text-center">
                          <Button
                            className="my-4"
                            color={compareCrAndDb ? "info" : "danger"}
                            disabled={!compareCrAndDb}
                            // type="submit"
                            onClick={addEntry}
                          >
                            {compareCrAndDb === false
                              ? "Total credit & debit is not equal"
                              : "View"}
                          </Button>
                        </div>
                        <div
                          // className="text-right"
                          style={{
                            display: "table-caption",
                            float: "right",
                            textAlign: "right",
                            // outline: "auto",
                          }}
                        >
                          {totalCredit || totalDebit ? (
                            <>
                              <p>Total Credit : {totalCredit}</p>
                              <p>Total Debit : {totalDebit}</p>
                            </>
                          ) : null}
                          {/* <Table
                            // responsive
                            style={{ margin: "0px" }}
                          >
                            <thead>
                              <tr>
                                <th className="text-center">Total Credit</th>
                                <th className="text-center">Total Debit</th>
                              </tr>
                            </thead>
                            <tbody>
                              <td className="text-center text-white">
                                {totalCredit}
                              </td>

                              <td className="text-center text-white">
                                {totalDebit}
                              </td>
                            </tbody>
                          </Table>{" "}
         */}
                        </div>
                      </Form>
                    )}
                  </CardBody>
                </Card>
              ) : (
                <FormGroup
                  className="mb-3"
                  style={{ width: "30%", float: "left" }}
                >
                  <h4>Select Voucher Type</h4>
                  <Input
                    type="select"
                    name="voucherType"
                    id="voucherType"
                    onChange={(e) => setVouhcerType(e.target.value)}
                  >
                    <option value={null}>...</option>
                    <option value="RV">Receipt</option>
                    <option value="PV">Payment</option>
                    <option value="JV">Journal</option>
                    <option value="CD">Cash deposit</option>
                  </Input>
                </FormGroup>
              )}
            </>
          </Col>
        </Row>
      </div>
      <Modal
        size="lg"
        modalClassName="modal-black"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >



        <div
          style={{
            padding: "9px 1px 0px 0px",
            borderRadius: " 5px",
          }}
        >
          <h2
            // className="text-dark"
            style={{
              textAlign: "center",
              textShadow: "0 0 black",
            }}
          >
            Confirmation of {voucherType} Voucher
          </h2>
          <Form
            id="formLogin"
            role="form"
            //  onSubmit={handleSubmit}
          >
            <p
              style={{
                fontSize: "16px",
                paddingLeft: "20px",
                paddingBottom: "10px",
              }}
            >

<Button

              onClick={() => pdfExportComponent.current.save()}
>
Save  
  </Button>
            </p>
            {/* <PDFExport
                ref={pdfExportComponent}
                fileName={"("+voucherType+")Voucher#"+(voucher+1)}
                // imageResolution={2000}
                //  paperSize="A4"
              > */}
            <p
              style={{
                fontSize: "16px",
                paddingLeft: "20px",
                paddingBottom: "10px",
              }}
            >
              Date : {date}
            </p>

            {remarks ? (
              <p
                style={{
                  fontSize: "16px",
                  paddingLeft: "20px",
                  paddingBottom: "10px",
                }}
              >
                Remarks : {remarks}
              </p>
            ) : null}

            <Table >
              <thead >
                <tr>
                  <th className="text-center">Voucher #</th>
                  {/* <th className="text-center">Date</th> */}
                  {/* <th className="text-center">Remarks</th> */}
                  {/* <th className="text-center">Reference #</th> */}
                  <th className="text-center">Description</th>
                  <th className="text-center">Table Head</th>
                  <th className="text-center">Credit</th>
                  <th className="text-center">Debit</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>{voucher + 1}</td>
                  <td>{date}</td>
                  <td>{remarks}</td>
                  <td className="text-center">{fields[0].option}</td>
                  <td className="text-center">{fields[0].credit?fields[0].credit:"0"}</td>
                  <td className="text-center">{fields[0].debit?fields[0].debit:"0"}</td>
                </tr> */}
                {fields.length > 0 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[0].description ? fields[0].description : "null"}
                    </td>

                    <td className="text-center">{fields[0].option}</td>
                    <td className="text-center">
                      {fields[0].credit ? fields[0].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[0].debit ? fields[0].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 1 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[1].description ? fields[1].description : "null"}
                    </td>
                    <td className="text-center">{fields[1].option}</td>
                    <td className="text-center">
                      {fields[1].credit ? fields[1].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[1].debit ? fields[1].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 2 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[2].description ? fields[2].description : "null"}
                    </td>
                    <td className="text-center">{fields[2].option}</td>
                    <td className="text-center">
                      {fields[2].credit ? fields[2].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[2].debit ? fields[2].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 3 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[3].description ? fields[3].description : "null"}
                    </td>
                    <td className="text-center">{fields[3].option}</td>
                    <td className="text-center">
                      {fields[3].credit ? fields[3].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[3].debit ? fields[3].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 4 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[4].description ? fields[4].description : "null"}
                    </td>
                    <td className="text-center">{fields[4].option}</td>
                    <td className="text-center">
                      {fields[4].credit ? fields[4].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[4].debit ? fields[4].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 5 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[5].description ? fields[5].description : "null"}
                    </td>
                    <td className="text-center">{fields[5].option}</td>
                    <td className="text-center">
                      {fields[5].credit ? fields[5].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[5].debit ? fields[5].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 6 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[6].description ? fields[6].description : "null"}
                    </td>
                    <td className="text-center">{fields[6].option}</td>
                    <td className="text-center">
                      {fields[6].credit ? fields[6].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[6].debit ? fields[6].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 7 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[7].description ? fields[7].description : "null"}
                    </td>
                    <td className="text-center">{fields[7].option}</td>
                    <td className="text-center">
                      {fields[7].credit ? fields[7].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[7].debit ? fields[7].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 8 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[8].description ? fields[8].description : "null"}
                    </td>
                    <td className="text-center">{fields[8].option}</td>
                    <td className="text-center">
                      {fields[8].credit ? fields[8].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[8].debit ? fields[8].debit : "0"}
                    </td>
                  </tr>
                ) : null}
                {fields.length > 9 ? (
                  <tr>
                    <td className="text-center">{voucher + 1}</td>
                    {/* <td className="text-center">{date}</td> */}
                    <td className="text-center">
                      {/* {remarks ? remarks : "null"} */}
                      {fields[9].description ? fields[9].description : "null"}
                    </td>
                    <td className="text-center">{fields[9].option}</td>
                    <td className="text-center">
                      {fields[9].credit ? fields[9].credit : "0"}
                    </td>
                    <td className="text-center">
                      {fields[9].debit ? fields[9].debit : "0"}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </Table>

            {/* 
            <Label for="voucher">Voucher number</Label>

            <Input
              disabled
              placeholder={voucher + 1}
              className="mb-3 input-group-alternative"
              // id="name"
              // type="name"
              // onChange={(e) => handleChangeData(e, "name")}
            />
            <Label for="voucher">Date</Label>
            <Input
              disabled
              placeholder={date}
              className="mb-3 input-group-alternative"
            />
            <Label for="voucher">Date</Label>
            <Input
              disabled
              placeholder={date}
              className="mb-3 input-group-alternative"
            /> */}

            <div className="text-center">
              <Button
                className="my-4"
                color="success"
                // type="submit"
                onClick={confirmAdditionOfEntry}
              >
                {"Confirm Voucher"}
              </Button>
            </div>
          {/* </PDFExport> */}
          </Form>
        </div>

      </Modal>
    </>
  );
}

export default Home;
