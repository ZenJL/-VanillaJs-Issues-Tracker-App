// backend api user
const backendAPI = 'https://tony-json-server.herokuapp.com';

// get elements
const registerForm = document.getElementById('register-form');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('confirm-password');

const loading = document.getElementById('loadingSpinnerContainer');
const showError = document.getElementById('error-mess');
const successfulMess = document.getElementById('successful');

let usersList = [];

function getUsers() {
  loading.style.display = 'flex';

  fetch(`${backendAPI}/api/users`)
    .then((response) => response.json())
    .then((data) => {
      usersList = data.data;
      // console.log('usersList: ', usersList);

      setTimeout(() => {
        loading.style.display = 'none';
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}

getUsers();

// register form event
registerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  loading.style.display = 'flex';
  addUser();
});

// add new users
function addUser() {
  // get input value
  const userFirstName = firstName.value;
  const userLastName = lastName.value;
  const userEmail = email.value;
  const userPassword = password.value;
  const userPassConfirm = passwordConfirm.value;

  //   loading.style.display = 'none';
  //// check emtpy input
  if (
    userEmail === '' ||
    userFirstName === '' ||
    userLastName === '' ||
    userPassword === '' ||
    userPassConfirm === ''
  ) {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'block';
      showError.innerHTML = 'All fields cannot be empty.';
    }, 500);
    return;
  }

  //   check email type
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  if (!validateEmail(userEmail)) {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'block';
      showError.innerHTML = 'Uncorrect email format!';
    }, 500);
    return;
  }

  //// check match pass & pass2
  if (userPassword !== userPassConfirm) {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'block';
      showError.innerHTML = 'Password do not matched';
    }, 500);
    return;
  }

  const existUser = usersList.filter((user) => {
    return user.email === userEmail;
  });

  if (existUser && existUser.length > 0) {
    loading.style.display = 'none';

    showError.style.display = 'block';
    showError.innerHTML =
      'The email has been registered. Please choose another email.';
    return;
  }

  //// create data post to backend
  const userInfo = {
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    password: userPassword,
  };

  //   console.log(userInfo);

  postUser(userInfo);

  setTimeout(() => {
    window.location.href = '../../loginPage.html';
  }, 3000);
}

// post user to server
function postUser(postData) {
  fetch(`${backendAPI}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
    .then(() => {
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
      setTimeout(() => {
        successfulMess.style.display = 'flex';
      }, 500);
    })

    .catch((error) => {
      console.log(error);
      return;
    });
}
