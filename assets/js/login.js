const backendAPI = 'https://tony-json-server.herokuapp.com';

// get elements
const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
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

form.addEventListener('submit', function (event) {
  event.preventDefault();
  loading.style.display = 'flex';
  checkLogin();
});

function checkLogin() {
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  //// validation empty input
  if (emailValue === '' || passwordValue === '') {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'block';
      showError.innerHTML =
        'Email, password can not be empty. Please check again';
    }, 1000);
    return;
  }

  //   check email type
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  if (!validateEmail(emailValue)) {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'block';
      showError.innerHTML = 'Uncorrect email format!';
    }, 500);
    return;
  }

  const existUser = usersList.filter((user) => {
    return user.email === emailValue;
  });

  // Validate email user
  if (existUser.length === 0) {
    setTimeout(() => {
      loading.style.display = 'none';

      emailInput.style.border = '1px solid red';
      showError.style.display = 'flex';
      showError.innerHTML =
        "The email hasn't been registered yet. Please check your email and try again.";
    }, 1000);
    setTimeout(() => {
      emailInput.style.border = 'none';
    }, 3000);
    return;
  }

  if (existUser.length > 0) {
    if (existUser[0].password === passwordValue) {
      loading.style.display = 'none';
      localStorage.setItem('user', existUser[0].email);
      if (localStorage.getItem('user') !== null) {
        setTimeout(() => {
          successfulMess.style.display = 'flex';
        }, 500);
        setTimeout(() => {
          window.location.href = '../../index.html';
        }, 1500);
      }
    }

    if (existUser[0].password !== passwordValue) {
      setTimeout(() => {
        loading.style.display = 'none';

        showError.style.display = 'block';
        showError.innerHTML = 'Email / password incorrect. Please check again.';
      }, 1000);
      return;
    }
  }
}
