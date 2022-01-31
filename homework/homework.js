function dynamicModalShow(modalSelector){
  const modal = document.querySelector(modalSelector);
  if(modal){
    modal.classList.add('open');
    const modalCloseBtn = modal.querySelector('.modal-close')
    modalCloseBtn.addEventListener('click', () => {
      dynamicModalClose(modalSelector);
    });
  }
}

function dynamicModalClose(modalSelector) {
  const modal = document.querySelector(modalSelector);
  if(modal){
    modal.classList.remove('open');
  }
}
// TODO: ამის ქვემოთ არის ინსტრუქცია

const signupForm = document.querySelector('#user-signup-form');
const email = document.querySelector('#email');
const personal_number = document.querySelector('#personal_number');
const mobile_number = document.querySelector('#mobile_number');
const first_name = document.querySelector('#first_name');
const last_name = document.querySelector('#last_name');
const zip = document.querySelector('#zip');
const gender = document.querySelector('#gender');
const status = document.querySelector('#status');
const user_id = document.querySelector('#user_id');
const userTableBody = document.querySelector('#user-rows');
const newUserBtn = document.querySelector('.new-user-btn');
const userFormModalSelector = '#user-form-modal';

newUserBtn.addEventListener('click', () => {
  dynamicModalShow(userFormModalSelector);
});

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const userData = {
    id: user_id.value,
    first_name: first_name.value,
    last_name: last_name.value,
    zip: zip.value,
    mobile: mobile_number.value,
    pn: personal_number.value,
    gender: gender.value,
    email: email.value,
    status: status.value,
  };
  if(userData.id){
    updateUser(userData);
  } else {
    createUser(userData);
  }
  // createUser(userData); TODO: თუ user_id.value არის ცარიელი მაშინ უნდა შევქმნათ
  // updateUser(userData); TODO: თუ user_id.value არის მაშინ უნდა დავაედიტოთ
  console.log('Save user');
});

function fillForm(userData) {
  email.value = userData.email;
  personal_number.value = userData.pn;
  mobile_number.value = userData.mobile;
  first_name.value = userData.first_name;
  last_name.value = userData.last_name;
  zip.value = userData.zip;
  gender.value = userData.gender;
  status.value = userData.status;
  user_id.value = userData.id;
}

// TODO: დაასრულეთ შემდეგი ფუნქციები
// დაგჭირდებათ მოდალი სადაც ფორმი უნდა ჩასვათ
function renderUsers(usersArray) {
  // TODO: usersArray არის სერვერიდან დაბრუნებული ობიექტების მასივი
  // TODO: ამ მონაცმების მიხედვით html ში ჩასვით ცხრილი როგორც "ცხრილი.png" შია
  const userRows = usersArray.map(user => {
    return `<tr>
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.zip}</td>
            <td>${user.mobile}</td>
            <td>${user.pn}</td>
            <td>${user.gender}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>
                <button class="user-edit-btn" type="button" data-user-id="${user.id}">Edit</button>
                <button class="user-delete-btn" type="button" data-user-id="${user.id}">Delete</button>
            </td>
          </tr>`;
  });
  userTableBody.innerHTML = userRows.join('');
  userActions(); // ყოველ რენდერზე ახლიდან უნდა მივაბათ ივენთ ლისნერები
}

// TODO: დაასრულე
function userActions(){
  const userEditButtons = document.querySelectorAll('.user-edit-btn');
  const userDeleteButtons = document.querySelectorAll('.user-delete-btn');
  userEditButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const userId = btn.dataset.userId;
      const userData = await getUser(userId);
      fillForm(userData);
      dynamicModalShow(userFormModalSelector);
    });
  });
  userDeleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.dataset.userId;
      deleteUser(userId);
    });
  });
  // 1. ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
  // 2. იქნება 2 ღილაკი რედაქტირება და წაშლა როგორც "ცხრილი.png" ში ჩანს
  // 3. id შეინახეთ data-user-id ატრიბუტად ღილაკებზე
  // 4. წაშლა ღილაკზე დაჭერისას უნდა გაიგზავნოს წაშლის მოთხოვნა (deleteUser ფუნქციის მეშვეობით) სერვერზე და გადაეცეს id
  // 5. ეიდტის ღილაკზე უნდა გაიხსნას მოდალი სადაც ფორმი იქნება იმ მონაცემებით შევსებული რომელზეც მოხდა კლიკი
  // ეიდტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს და არა მასივს)
  // ეს დატა უნდა შეივსოს ფორმში
}

async function getUsers(){
  try {
    const response = await fetch('http://api.kesho.me/v1/user-test/index');
    const users = await response.json();
    renderUsers(users);
  } catch (e){
    console.log('Error - ', e);
  }
}
getUsers();
/**
 *
 * შეგიძლიათ await response.json() დააბრუნოთ და საიდანაც გამოიძახებთ ამ ფუნქციას,
 * ისიც async უნდა იყოს და იქაც await უნდა დაუწეროთ გამოძახების წინ რომ დატა დაგიბრუნოთ
 *
 * @param userId
 * @returns {Promise<void>}
 */
async function getUser(userId) {
  try {
    const response = await fetch(`http://api.kesho.me/v1/user-test/view?id=${userId}`);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (e) {
    console.log('Error - ', e);
  }
}
async function createUser(userData){
  try {
    const response = await fetch('http://api.kesho.me/v1/user-test/create', {
      method: 'post',
      body: JSON.stringify(userData),
      headers: {'Content-Type': 'application/json'}
    });
    await response.json();
    getUsers(); // TODO: შენახვის ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა
    signupForm.reset();
    dynamicModalClose(userFormModalSelector);
    user_id.value = '';
  }catch (e){
    console.log('Error - ', e);
  }
}
async function updateUser(userObject) {
  // TODO: დაასრულე
  // method POST http://api.kesho.me/v1/user-test/update?id=userObject.id
  try {
    const response = await fetch(`http://api.kesho.me/v1/user-test/update?id=${userObject.id}`, {
      method: 'post',
      body: JSON.stringify(userObject),
      headers: {'Content-Type': 'application/json'}
    });
    await response.json();
    getUsers();
    signupForm.reset();
    dynamicModalClose(userFormModalSelector);
    user_id.value = '';
  }catch (e){
    console.log('Error - ', e);
  }
}
async function deleteUser(userId) {
  // TODO დაასრულე
  // method DELETE `http://api.kesho.me/v1/user-test/delete?id=${userId}`
  try {
    const response = await fetch(`http://api.kesho.me/v1/user-test/delete?id=${userId}`, {
      method: 'DELETE'
    });
    // await response;
    getUsers();
  } catch (e) {
    console.log('Error - ', e);
  }
}
