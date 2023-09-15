//selecting buttons on form side
const submit = document.querySelector('.submit')
const update = document.querySelector('.update')
const reset = document.querySelector('.reset')

//defining global variable for edit
var currentKey

//listening submit
submit.addEventListener('click', (e) => {
  e.preventDefault()
  const data = getUserData()
  if (formValidator(data)) {
    addToLocalStorage(data)
    window.location.reload()
  }
})

//listening reset
reset.addEventListener('click', () => {
  resetForm()
  submit.classList.remove('hidden')
  update.classList.add('hidden')
})

//listening update
update.addEventListener('click', () => {
  const updatedData = getUserData()
  if (formValidator(updatedData)) {
    localStorage.setItem(`${currentKey}`, JSON.stringify(updatedData))
    var userData = getFromLocalStorage()
    showUserDetails(userData)
    resetForm()
    submit.classList.remove('hidden')
    update.classList.add('hidden')
    window.location.reload()
  }
})

//function to reset form
const resetForm = () => {
  document.getElementById('username').value = ''
  document.getElementById('email').value = ''
  document.getElementById('contact').value = ''
  var radioButtons = document.querySelectorAll('input[name="gender"]')
  for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].checked = false
  }
  var checkboxes = document.querySelectorAll('input[name="course"]')
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false
  }
  document.getElementById('age').selectedIndex = 0
  document.getElementById('address').value = ''
}

//function to get data from the form
const getUserData = () => {
  const username = document.getElementById('username').value
  const email = document.getElementById('email').value
  const contact = document.getElementById('contact').value
  var gender = document.querySelector('input[name="gender"]:checked').value
  var courses = document.querySelectorAll('input[name="course"]:checked')
  var selectedCourses = []
  courses.forEach((course) => {
    selectedCourses.push(course.value)
  })
  const age = document.getElementById('age')
  const selectedAge = age.options[age.selectedIndex].value
  const address = document.getElementById('address').value

  return {
    username,
    email,
    contact,
    gender,
    selectedCourses,
    selectedAge,
    address,
  }
}

//function to validate data
const formValidator = (data) => {
  const { username, email, contact, address } = data
  //username validation
  usernamePattern = /^[a-zA-Z0-9_-]{5,20}$/
  if (!usernamePattern.test(username)) {
    alert('username invalid')
    return false
  }
  //email validation
  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  if (!emailPattern.test(email)) {
    alert('email invalid')
    return false
  }
  //contact
  if (contact.length != 10) {
    alert('phone number invalid')
    return false
  }
  //address
  if (address.trim() === '') {
    alert('address should not be empty')
    return false
  }
  return true
}

//function to add data to local storage
const addToLocalStorage = (details) => {
  var currDate = new Date()
  localStorage.setItem(`user${currDate.getTime()}`, JSON.stringify(details))
}

//function to get all data from local storage
const getFromLocalStorage = () => {
  var allUsers = []
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i)
    var user = localStorage.getItem(key)
    allUsers[key] = user
  }

  return allUsers
}

//function to show all user details from local storage
const showUserDetails = (userData) => {
  const container = document.querySelector('.details-container')
  container.innerHTML = `<div class="header-row row">
          <div>Username</div>
          <div>Email</div>
          <div>Contact No.</div>
          <div>Course</div>
        </div>`
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i)
    addUserDataRow(userData[key], key)
  }
}

//function to add a single row of user detail
const addUserDataRow = (user, key) => {
  const {
    username,
    email,
    contact,
    gender,
    selectedCourses,
    selectedAge,
    address,
  } = JSON.parse(user)

  var childElement = document.createElement('div')
  childElement.classList.add('row')

  childElement.innerHTML = `<div class="username">${username}</div>
          <div class="email">${email}</div>
          <div class="contact">${contact}</div>
          <div class="course">${selectedCourses}</div>
          <div>
          <span class="edit ${key}" ><i class="fas fa-edit" style="cursor: pointer;"></i></span>
          <span class="delete ${key}"><i class="fas fa-trash-alt" style="cursor: pointer;"></i></span>
          </div>`

  const container = document.querySelector('.details-container')
  container.appendChild(childElement)
}

//calling the function to show data on detail side
var userData = getFromLocalStorage()
showUserDetails(userData)

//selecting buttons on detail side
const edit = document.querySelectorAll('.edit')
const remove = document.querySelectorAll('.delete')

//listening for all edit buttons
edit.forEach((user) => {
  user.addEventListener('click', () => {
    resetForm()

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i)
      if (user.classList.value.includes(key)) {
        var currDataString = localStorage.getItem(`${key}`)
        var currData = JSON.parse(currDataString)
        currentKey = key
        updateData(currData)
      }
    }
  })
})

//listening for all delete buttons
remove.forEach((user) => {
  user.addEventListener('click', () => {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i)
      if (user.classList.value.includes(key)) {
        localStorage.removeItem(`${key}`)
        window.location.reload()
      }
    }
  })
})

//function to update data on form side for editing
const updateData = (data) => {
  const {
    username,
    email,
    contact,
    gender,
    selectedCourses,
    selectedAge,
    address,
  } = data
  document.getElementById('username').value = username
  document.getElementById('email').value = email
  document.getElementById('contact').value = contact
  document.getElementById(`${gender}`).checked = true
  for (var i = 0; i < selectedCourses.length; i++) {
    document.getElementById(`${selectedCourses[i]}`).checked = true
  }

  document.getElementById('age').selectedIndex = selectedAge - 26
  document.getElementById('address').value = address

  submit.classList.add('hidden')
  update.classList.remove('hidden')
}
