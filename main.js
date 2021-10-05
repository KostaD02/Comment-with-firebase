const config = {
  apiKey: "AIzaSyBr75xAs47_qwCq2LRVx2oJCVNqfcChtjo",
  authDomain: "comment-63f5d.firebaseapp.com",
  databaseURL: "https://comment-63f5d-default-rtdb.firebaseio.com",
  projectId: "comment-63f5d",
  storageBucket: "comment-63f5d.appspot.com",
  messagingSenderId: "290037148842",
  appId: "1:290037148842:web:5814433fc40d3a240574d3",
  measurementId: "G-LVJHE78NF9",
};
const displayComments = document.getElementById("displayComments");
function randomID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function uploadComment(username, rate, comment) {
  return { name: username, rate: rate, comment: comment };
}
function generateFirebaseItem(ID, value) {
  return {
    userid: ID,
    data: value,
  };
}
firebase.initializeApp(config);
function createComment(username, rate, comment) {
  firebase
    .database()
    .ref("Comments/" + randomID())
    .set(uploadComment(username, rate, comment));
}
let commentsArray = [];
let ref = firebase
  .database()
  .ref("Comments")
  .on("value", (response) => {
    response.forEach((element) => {
      commentsArray.push(generateFirebaseItem(element.key, element.val()));
    });
  });
setTimeout(() => {
  document.getElementById("counter").innerHTML = commentsArray.length;
  commentsArray.forEach((element) => {
    displayComments.innerHTML += `
            <div class="mycard">
            <aside class="top">
                <div class="left">
                    <i class="fas fa-user"></i>
                </div>
                <div class="middle">
                    <span id="name">${element.data.name}</span>
                </div>
                <div class="rigth">
                    <p>Rate :
                        <span id="rate"> ${element.data.rate} </span>
                        <span> </span>
                        <i class="fas fa-star"></i>
                    </p>
                </div>
            </aside>
            <hr>
            <aside class="bottom">
                <p><i class="far fa-comment"></i> Comment :</p>
                <p id="text">
                    ${element.data.comment}
                </p>
            </aside>
        </div>
        `;
  });
}, 1000);
function checkCorrection() {
  let result = $("#number").val();
  if (result > 0 && result < 11) {
    let name = $("#Name").val();
    for (let i = 0; i < name.length; i++) {
      if (
        name[i] == "1" ||
        name[i] == "2" ||
        name[i] == "3" ||
        name[i] == "4" ||
        name[i] == "5" ||
        name[i] == "6" ||
        name[i] == "7" ||
        name[i] == "8" ||
        name[i] == "9" ||
        name[i] == "0" ||
        name[i] == "" ||
        name[i] == " "
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Don't use numbers on name",
        });
        $("#Name").val("");
        $("#number").val(1);
        $("#comment").val("");
        return false;
      } else {
        return true;
      }
    }
    return true;
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Rate must be 1-10 ",
    });
    $("#Name").val("");
    $("#number").val(1);
    $("#comment").val("");
    return false;
  }
}
function createcomment(option) {
  if (option == "1") {
    if (checkCorrection()) {
      let name = $("#Name").val();
      let rate = $("#number").val();
      let comment = $("#comment").val();
      createComment(name, rate, comment);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your comment uploaded!",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Comment has been deleted.",
            "success"
          );
          firebase.database().ref("Comments/").remove();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Comments are safe :)",
            "error"
          );
        }
      });
  }
}
