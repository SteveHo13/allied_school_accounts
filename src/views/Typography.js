import React, { useState, useEffect } from "react";
import { firebase } from "../services/firebase";
import moment from "moment";
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
  InputGroup,
  Modal,
  Alert,
  Label,
} from "reactstrap";
// reactstrap components
import imageCompression from "browser-image-compression";
import showStudentRecord from "./showStudentRecord";

function Typography() {
  const [reg, setReg] = useState(null);
  const [regDate, setRegDate] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [dob, setDob] = useState(null);
  const [gradeYear, setGradeYear] = useState(null);
  const [section, setSection] = useState(null);

  const [studentEmail, setStudentEmail] = useState(null);
  const [gender, setGender] = useState(null);
  const [religion, setReligion] = useState(null);
  const [bformNumber, setBformNumber] = useState(null);

  const [fatherName, setFatherName] = useState(null);
  const [cnic, setCnic] = useState(null);
  const [contact, setContact] = useState(null);
  const [fatherEmail, setFatherEmail] = useState(null);
  const [landline, setLandline] = useState(null);
  const [fatherOccupation, setFatherOccupation] = useState(null);

  const [address1, setAddress1] = useState(null);
  const [address2, setAddress2] = useState(null);
  const [siblings, setSiblings] = useState(0);
  const [siblingsCheck, setSiblingsCheck] = useState(false);
  const [guardianRelation, setGuardianRelation  ] = useState(null);
  

  
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compressedFile, setCompressedFile] = useState(null);

  const [searchReg, setSearchReg] = useState(null);
  const [searchBFormNumber, setSearchBFormNumber] = useState(null);
  const [searchGrade, setSearchGrade] = useState(null);
  const [searchResult, setSearchResult] = useState([""]);
  const [searchingTable, setSearchingTable] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection("studentRecord")
      .get()
      .then((doc) => {
        setReg("SD-" + (doc.size + 1));
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (siblingsCheck) {
      var data = [];
      firebase
        .firestore()
        .collection("studentRecord")
        .where("cnic", "==", cnic)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            data.push(doc.data());
          });
          if (!querySnapshot.empty) {
            console.log("Number of siblings: " + data.length);
            setSiblings(data.length);
          } else if (querySnapshot.empty) {
            console.log("Number of siblings: " + data.length);
            setSiblings(data.length);
          }
        });
    }
  }, [siblingsCheck]);

  const handleChangeData = (e, type) => {
    if (type === "reg") {
      setReg(e.target.value);
    } else if (type === "regDate") {
      setRegDate(e.target.value);
    } else if (type === "studentName") {
      setStudentName(e.target.value.toUpperCase());
    } else if (type === "dob") {
      setDob(e.target.value);
    } else if (type === "gradeYear") {
      setGradeYear(e.target.value);
    } else if (type === "section") {
      setSection(e.target.value);
    } else if (type === "studentEmail") {
      setStudentEmail(e.target.value);
    } else if (type === "gender") {
      setGender(e.target.value);
    } else if (type === "religion") {
      setReligion(e.target.value.toUpperCase());
    } else if (type === "bFormNumber") {
      setBformNumber(e.target.value);
    } else if (type === "fatherName") {
      setFatherName(e.target.value.toUpperCase());
    } else if (type === "cnic") {
      setCnic(e.target.value);
    } else if (type === "contact") {
      setContact(e.target.value);
    } else if (type === "fatherEmail") {
      setFatherEmail(e.target.value);
    } else if (type === "landline") {
      setLandline(e.target.value);
    } else if (type === "address1") {
      setAddress1(e.target.value.toUpperCase());
    } else if (type === "address2") {
      setAddress2(e.target.value.toUpperCase());
    } else if (type === "siblingsCheck") {
      setSiblingsCheck(!siblingsCheck);
      // this.setState({ isChecked: !this.state.isChecked })
    } else if (type === "fatherOccupation") {
      setFatherOccupation(e.target.value.toUpperCase());
    } else if (type === "guardianRelation") {
      setGuardianRelation(e.target.value.toUpperCase());
    } else if (type === "searchReg") {
      setSearchReg(e.target.value);
      setSearchGrade(null);
      setSearchBFormNumber(null);
    } else if (type === "searchBFormNumber") {
      setSearchBFormNumber(e.target.value);
      setSearchGrade(null);
      setSearchReg(null);
    } else if (type === "searchGrade") {
      setSearchGrade(e.target.value);
      setSearchBFormNumber(null);
      setSearchReg(null);
    }
  };

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.03,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const theCompressedFile = await imageCompression(imageFile, options);
      setCompressedFile(theCompressedFile);
      console.log(
        "compressedFile instanceof Blob",
        theCompressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${theCompressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      // await this.uploadPhoto(theCompressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhoto = (file) => {
    if (file) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = firebase
        .storage()
        .ref()
        .child("studentPics/" + timestamp)
        .put(file);

      uploadTask.on(
        "state_changed",
        // null,
        (snapshot) => {
          const getProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(getProgress);
        },
        (err) => {
          setIsLoading(false);
          alert(err.message);
        },

        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setIsLoading(false);
            firebase
              .firestore()
              .collection("studentRecord")
              .doc(reg)
              .set({
                reg: reg,
                regDate: regDate,
                studentName: studentName,
                dob: dob,
                gradeYear: gradeYear,
                section: section,
                studentEmail: studentEmail,
                gender: gender,
                religion: religion,
                bformNumber: bformNumber,
                fatherName: fatherName,
                cnic: cnic,
                contact: contact,
                fatherEmail: fatherEmail,
                landline: landline,
                address1: address1,
                address2: address2,
                siblings: siblings,
                photo: downloadURL,
                guardianRelation:guardianRelation,
                // referenceNumber: referenceNumber,
                // addedBy: name,
                addedOn: moment().format("YYYY-MM-DD"),
              });
          });
        }
      );
    } else {
      setIsLoading(false);
      firebase
        .firestore()
        .collection("studentRecord")
        .doc(reg)
        .set({
          reg: reg,
          regDate: regDate,
          studentName: studentName,
          dob: dob,
          gradeYear: gradeYear,
          section: section,
          studentEmail: studentEmail,
          gender: gender,
          religion: religion,
          bformNumber: bformNumber,
          fatherName: fatherName,
          cnic: cnic,
          contact: contact,
          fatherEmail: fatherEmail,
          landline: landline,
          address1: address1,
          address2: address2,
          guardianRelation:guardianRelation,
          siblings: siblings,
          photo: null,
          // referenceNumber: referenceNumber,
          // addedBy: name,
          addedOn: moment().format("YYYY-MM-DD"),
        });

      alert("Record added");
      console.log("file is null");
    }
  };

  var getNextVoucherNumber = () => {
    firebase
      .firestore()
      .collection("studentRecord")
      .get()
      .then((doc) => {
        setReg("SD-" + (doc.size + 1));

        // console.log("voucher size: " + voucher);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addStudentData = async () => {
    if (
      !(
        (
          reg ||
          regDate ||
          studentName ||
          dob ||
          gradeYear ||
          // studentEmail ||
          gender ||
          // religion ||
          bformNumber
        )
        // ||
        // compressedFile
      )
    ) {
      console.log("student information is missing");
    } else if (
      !(
        (
          fatherName ||
          // fatherEmail ||
          contact ||
          // landline ||
          cnic ||
          address1
        )
        // ||
        // address2 ||
        // siblings ||
        // fatherOccupation
      )
    ) {
      console.log("guardian info is missing");
    } else {
      await getNextVoucherNumber();
      console.log("adding student record");

      uploadPhoto(compressedFile);
    }
  };

  const searchingStudent = () => {
    if (searchGrade !== null) {
      console.log("grade");
      console.log(searchBFormNumber, searchReg, searchGrade);
      getStudentDataByGrade(searchGrade);
    } else if (searchReg) {
      console.log("reggerereg");
      console.log(searchBFormNumber, searchReg, searchGrade);
      getStudentDataByReg(searchReg);
    } else if (searchBFormNumber) {
      console.log("BBBBform bibi");
      console.log(searchBFormNumber, searchReg, searchGrade);
      getStudentDataByBFormNumber(searchBFormNumber);
    } else {
      console.log("no data was entered");
      setSearchResult([""]);
    }
  };

  const getStudentDataByReg = (reg) => {
    //reg number returns only 1
    firebase
      .firestore()
      .collection("studentRecord")
      .doc(reg)
      // .where("bFormNumber", "==", bFormNumber)
      .get()
      .then((doc) => {
        var data = [];
        data.push(doc.data());
        // console.log(doc.data());
        if (doc.exists) {
          setSearchResult(data);
          setSearchingTable(true);
        } else if (!doc.exists) {
          setSearchResult("none");
          setSearchingTable(true);
        }
      });
  };

  const getStudentDataByGrade = (gradeYear) => {
    var data = [];
    firebase
      .firestore()
      .collection("studentRecord")
      .where("gradeYear", "==", gradeYear)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          data.push(doc.data());
        });
        if (!querySnapshot.empty) {
          setSearchResult(data);
          setSearchingTable(true);
        } else if (querySnapshot.empty) {
          setSearchResult("none");
          setSearchingTable(true);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const getStudentDataByBFormNumber = (bFormNumber) => {
    //b form number returns only 1
    var data = [];
    firebase
      .firestore()
      .collection("studentRecord")
      .where("bformNumber", "==", Number(bFormNumber))
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        if (!querySnapshot.empty) {
          setSearchResult(data);
          setSearchingTable(true);
        } else if (querySnapshot.empty) {
          setSearchResult("none");
          setSearchingTable(true);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const clickedOnCross = () => {
    setSearchingTable(false);
    setSearchGrade(null);
    setSearchBFormNumber(null);
    setSearchReg(null);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            {/* {!searchingTable ? (
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Search Student Data</CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ display: "table", width: "100%" }}>
                    <Form
                      id="searchStudentForm"
                      // role="form"
                      //  onSubmit={onLogin}
                    >
                      <FormGroup
                        className="mb-3"
                        style={{ width: "43%", float: "left" }}
                      >
                        <Label for="voucher">Registeration Number</Label>
                        <Input
                          // id="voucher"
                          placeholder="Reg. No."
                          type="text"
                          disabled={searchGrade || searchBFormNumber}
                          // min="0"
                          onChange={(e) => handleChangeData(e, "searchReg")}
                        />
                      </FormGroup>
                      <FormGroup
                        className="mb-3"
                        style={{ width: "43%", float: "right" }}
                      >
                        <Label for="voucher">B-Form Numer</Label>
                        <Input
                          // id="voucher"
                          placeholder="B-Form"
                          type="text"
                          disabled={searchReg || searchGrade}
                          // min="0"
                          onChange={(e) =>
                            handleChangeData(e, "searchBFormNumber")
                          }
                        />
                      </FormGroup>
                      <FormGroup
                        className="mb-3"
                        style={{ width: "43%", float: "left" }}
                      >
                        <Label for="voucher">Class</Label>
                        <Input
                          // id="voucher"
                          placeholder="Class/Grade"
                          type="select"
                          // min="0"
                          disabled={searchReg || searchBFormNumber}
                          onChange={(e) => handleChangeData(e, "searchGrade")}
                        >
                          <option value="">Choose...</option>
                          <option value="PG">Play Group</option>
                          <option value="Nursery">Nursery</option>
                          <option value="Prep">Prep</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </Input>
                      </FormGroup>
                    </Form>
                  </div>

                  <div className="text-center">
                    <Button
                      className="my-4"
                      onClick={() => searchingStudent()}
                      color="success"
                    >
                      {searchBFormNumber
                        ? "Search by B-From#"
                        : searchGrade
                        ? "Search by Class"
                        : searchReg
                        ? "Search by Reg#"
                        : "Search"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : null}
            {searchResult != "" && searchResult != "none" && searchingTable ? (
              <Card>
                <CardHeader>
                  <Button
                    onClick={clickedOnCross}
                    style={{ float: "right" }}
                    className="btn-icon"
                    color="danger"
                    size="sm"
                  >
                    <i className="fa fa-times" />
                  </Button>
                  <CardTitle tag="h4">Student Data</CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ marginTop: "15px", marginBottom: "10px" }}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th className="text-center">Reg. No.</th>
                          <th className="text-center">Name</th>
                          <th className="text-center">Gender</th>
                          <th className="text-center">B-Form No.</th>
                          <th className="text-center">Father Name</th>
                          <th className="text-center">Contact details</th>
                          <th className="text-center">Date of Admission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResult.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-center">{data.reg}</td>
                              <td className="text-center">
                                {data.studentName}
                              </td>
                              <td className="text-center">{data.gender}</td>
                              <td className="text-center">
                                {data.bformNumber}{" "}
                              </td>
                              <td className="text-center">
                                {data.fatherName}{" "}
                              </td>
                              <td className="text-center">{data.contact}</td>
                              <td className="text-center">{data.regDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            ) : searchResult == "none" ? (
              <Alert color="warning" isOpen={searchingTable}>
                <Button
                  onClick={clickedOnCross}
                  style={{ float: "right" }}
                  className="btn-icon"
                  color="danger"
                  size="sm"
                >
                  <i className="fa fa-times" />
                </Button>
                <h4 className="alert-heading">No relevant data found!</h4>
                <hr />
                <p className="mb-0">Please check your search query again.</p>
              </Alert>
            ) : null} */}

            <Card>
              <CardHeader>
                <CardTitle tag="h4">Student Form</CardTitle>
              </CardHeader>
              <CardBody>
                <Form
                  id="studentForm"
                  // role="form"
                  //  onSubmit={onLogin}
                >
                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label for="voucher">
                      Student ID
                      <span style={{ color: "red" }}> *</span>
                    </Label>

                    <Input
                      placeholder={reg ? reg : "REG#"}
                      disabled
                      id="voucher"
                      // placeholder="Reg. No."
                      type="text"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "reg")}
                    />
                  </FormGroup>
                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label>
                      Date of Registration
                      <span style={{ color: "red" }}> *</span>
                    </Label>

                    <Input
                      id="date"
                      placeholder={"text"}
                      type="date"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "regDate")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label for="voucher">
                      Student Name<span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      id="voucher"
                      placeholder="XYZ"
                      type="text"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "studentName")}
                    />
                  </FormGroup>
                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label>
                      Date of birth
                      <span style={{ color: "red" }}> *</span>
                    </Label>

                    <Input
                      id="date"
                      placeholder={"text"}
                      type="date"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "dob")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label for="class">
                      Class
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      id="class"
                      placeholder="Grade/Year"
                      type="select"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "gradeYear")}
                    >
                      <option value="">Choose...</option>
                      <option value="PG">Play Group</option>
                      <option value="Nursery">Nursery</option>
                      <option value="Prep">Prep</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </Input>
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="section">
                      Section
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      id="class"
                      placeholder="Section"
                      type="select"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "section")}
                    >
                      <option value="">Choose...</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </Input>
                  </FormGroup>

                  {/* <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label>Student's email</Label>

                    <Input
                      id="emailStd"
                      placeholder={"abc@example.com"}
                      type="email"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "studentEmail")}
                    />
                  </FormGroup> */}

                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label for="voucher">
                      Gender
                      <span style={{ color: "red" }}> *</span>
                    </Label>

                    <Input
                      id="voucher"
                      placeholder="Male/Female"
                      type="text"
                      // min="0"
                      type="select"
                      onChange={(e) => handleChangeData(e, "gender")}
                    >
                      <option value="">Choose...</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Input>
                  </FormGroup>
                  {/* <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label>Religion</Label>

                    <Input
                      id="date"
                      placeholder={"text"}
                      type="text"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "religion")}
                    />
                  </FormGroup> */}
                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="bfrom">
                      B-Form Number
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="12345-6789012-3"
                      type="number"
                      min="0"
                      max="13"
                      onChange={(e) => handleChangeData(e, "bformNumber")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    // style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label>
                      Upload Student's photo
                      {/* <span style={{ color: "red" }}> *</span> */}
                    </Label>
                  </FormGroup>
                  <input
                    // ref={(el) => {
                    //   this.refInput = el;
                    // }}
                    accept="image/*"
                    className="viewInputGallery"
                    type="file"
                    // onChange={this.onChoosePhoto}
                    onChange={(event) => handleImageUpload(event)}
                  />

                  <h3 style={{ marginTop: "20px" }}>
                    Father/Guardian's Details
                  </h3>

                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label for="voucher">
                      Father/Guardian's Name
                      <span style={{ color: "red" }}> *</span>
                    </Label>
                    <Input
                      id="voucher"
                      placeholder="XYZ XYZ"
                      type="text"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "fatherName")}
                    />
                  </FormGroup>
                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label>
                      Father/Guardian's CNIC
                      <span style={{ color: "red" }}> *</span>
                    </Label>

                    <Input
                      id="date"
                      placeholder={"text"}
                      type="number"
                      min="0"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "cnic")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label>
                      Father/Guardian's Contact
                      <span style={{ color: "red" }}> *</span>
                    </Label>

                    <Input
                      id="date"
                      placeholder="03xx-xxxxxxx"
                      type="number"
                      min="0"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "contact")}
                    />
                  </FormGroup>
                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="voucher">Email</Label>
                    <Input
                      id="voucher"
                      placeholder="abc@example.com"
                      type="email"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "fatherEmail")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    style={{ width: "43%", float: "left" }}
                  >
                    <Label>Father/Guardian's occupation</Label>

                    <Input
                      id="date"
                      placeholder="Occupation"
                      type="text"
                      autoComplete="off"
                      onChange={(e) => handleChangeData(e, "fatherOccupation")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="landline">Landline</Label>
                    <Input
                      id="landline"
                      placeholder="051-1234567"
                      type="number"
                      min="0"
                      onChange={(e) => handleChangeData(e, "landline")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    // style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="address">
                      Residential Address
                      {/* <span style={{ color: "red" }}> *</span> */}
                    </Label>
                    <Input
                      id="address"
                      placeholder="Address"
                      type="text"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "address1")}
                    />
                  </FormGroup>

                  <FormGroup
                    className="mb-3"
                    // style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="address">
                      In case of Guardian, actual relation with the guardian
                      {/* <span style={{ color: "red" }}> *</span> */}
                    </Label>
                    <Input
                      id="guardianRelation"
                      placeholder="Grandfather/Uncle/etc"
                      type="text"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "guardianRelation")}
                    />
                  </FormGroup>

                  {/* <FormGroup
                    className="mb-3"
                    // style={{ paddingLeft: "120px", display: "flow-root" }}
                  >
                    <Label for="address">
                      Mailing Address (Leave blank if same as above)
                    </Label>
                    <Input
                      id="address"
                      placeholder="Mailing Address"
                      type="text"
                      // min="0"
                      onChange={(e) => handleChangeData(e, "address2")}
                    />
                  </FormGroup> */}

                  <FormGroup check style={{ marginTop: "15px" }}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onChange={(e) => handleChangeData(e, "siblingsCheck")}
                        // onClick={() => console.log("sibling checkkk")}
                      />
                      Do you have any siblings in the same school?
                      {/* <span style={{ color: "red" }}> *</span> */}
                      <span className="form-check-sign">
                        <span className="check"></span>
                      </span>
                    </Label>
                  </FormGroup>
                  {siblings && siblingsCheck ? (
                    <FormGroup
                      style={{
                        marginTop: "15px",
                        marginBottom: "0px",
                        marginLeft: "21px",
                      }}
                    >
                      <p style={{ fontSize: "small", fontStyle: "italic" }}>
                        {"Total Siblings:  "}
                        {siblings}
                      </p>
                    </FormGroup>
                  ) : siblingsCheck ? (
                    <FormGroup
                      style={{
                        marginTop: "15px",
                        marginBottom: "0px",
                        marginLeft: "21px",
                      }}
                    >
                      <p
                        style={{
                          color: "red",
                          fontSize: "smaller",
                          fontStyle: "italic",
                        }}
                      >
                        {"No siblings were found!"}
                      </p>
                    </FormGroup>
                  ) : null}

                  {/* <div style={{ marginTop: "15px", marginBottom: "10px" }}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th className="text-center">Sr. No.</th>
                          <th className="text-center">Name</th>
                          <th className="text-center">Age</th>
                          <th className="text-center">B-Form No.</th>
                          <th className="text-center">Student ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">1</td>

                          <td className="text-center">
                            <Input placeholder="XYZ" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="12" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="0000-0000-000-0" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="FA21" />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center">2</td>

                          <td className="text-center">
                            <Input placeholder="XYZ" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="12" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="0000-0000-000-0" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="FA21" />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center">3</td>

                          <td className="text-center">
                            <Input placeholder="XYZ" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="12" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="0000-0000-000-0" />
                          </td>
                          <td className="text-center">
                            <Input placeholder="FA21" />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div> */}

                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="info"
                      onClick={addStudentData}
                    >
                      Add
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Typography;
