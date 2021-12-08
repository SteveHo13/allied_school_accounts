import firebase from "firebase";





const db = firebase.firestore();
const auth = firebase.auth();

export const CreateUser = async (
  // username,
  name,
  email,
  password
) => {
  try {
    let nameKeywords = [];
    let temp2 = "";
    for (let i = 0; i < name.length; i++) {
      temp2 = temp2 + name.toLowerCase()[i];
      nameKeywords.push(temp2);
    }
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    db.collection("users").doc(cred.user.uid).set({
      name: name,
      email: email,
      password: password,
      nameKeywords: nameKeywords,
    });
    localStorage.setItem(
      "uid",
      JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
  } catch (err) {
    console.log(err);
  }
};

export const SigninUser = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password).then((cred) => {
    localStorage.setItem(
      "uid",
      JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
  });
};
export const logOutUser = () => {
  alert("Logging out")
  auth.signOut().then(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("uid");
    localStorage.removeItem("authUser");
    console.log("Signed Out");
  });
};


export const passwordReset= (email) => {
  return auth.sendPasswordResetEmail(email).then(() => {
    alert("Password link sent to registered email!")


  }) .catch((err) => {
    alert(err);
  });
};

export const isUserSignedIn = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User is logged in!");
    } else {
      console.log("User is not logged in!");
    }
  });
};
export const EditUser = (name) => {
  return firebase
    .auth()
    .currentUser.updateProfile({
      name: name,
    })
    .then((cred) => {
      let temp2 = "";
      let nameKeywords = [];
      for (let i = 0; i < name.length; i++) {
        temp2 = temp2 + name.toLowerCase()[i];
        nameKeywords.push(temp2);
      }
      db.collection("users").doc(auth.currentUser.uid).update({
        name: name,
        nameKeywords: nameKeywords,
      });
      alert("Profile Updated");
    })
    .catch((err) => {
      alert("Couldn't update!!!" + err);
    });
};
