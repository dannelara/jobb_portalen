// Show second confirm button when user wants to delete their accounts.
const btn = document.querySelector('#confirm-delete')
const secondBtn = document.querySelector('.second-cofirm-container')
if (btn) {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.currentTarget.style.display = 'none'
    secondBtn.style.display = 'block'
  })
}

// Toggle see/hide password.
const passWordBtn = document.querySelector('#togglePassword')
if (passWordBtn) {
  passWordBtn.addEventListener('click', (e) => {
    const passwordInput = document.querySelector('.password')
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
    passwordInput.setAttribute('type', type)
    e.currentTarget.classList.toggle('fa-eye-slash')
  })
}

// Preview the uploaded image.
const imageInput = document.querySelector('#file-ip-1')
if (imageInput) {
  imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      /**
       * When the file is loeaded the image preview will be shown.
       */
      reader.onload = () => {
        const preview = document.getElementById('file-ip-1-preview')
        const data = document.querySelector('#img-data')
        preview.src = reader.result
        data.value = reader.result
      }
    }
  })
}

// Styling the validation message box.
const alertLi = document.querySelector('.validation-list')
const validationContainer = document.querySelector('.validation-message-container')
if (alertLi) {
  alertLi.addEventListener('change', (e) => {
    console.log(e)
    validationContainer.style.display = 'block'
  })
}

// When the job expreinces container is shown, remove the box shadow of the last elementChild.
const jobsDiv = document.querySelectorAll('.profile-section')
if (jobsDiv) {
  jobsDiv.forEach((container) => {
    container.lastElementChild.style.boxShadow = '0px 0px 0px'
  })
}

// If the current job check box is pressed then we will hid the years of experience container.
const currentJobCheckBox = document.querySelector('#current-job')
if (currentJobCheckBox) {
  currentJobCheckBox.addEventListener('change', (e) => {
    const yearsContainer = document.querySelector('.add-new-form-sub-year')
    yearsContainer.classList.contains('hidden') === true ? yearsContainer.classList.remove('hidden') : yearsContainer.classList.add('hidden')
    console.log(e)
  })
}
const removeEducationBtn = document.querySelectorAll('.remove-education-btns')
if (removeEducationBtn) {
  removeEducationBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const mainContainer = document.querySelector('.main-container')
      const outerDiv = document.createElement('div')
      outerDiv.classList.add('form-outer-container')
      const formDiv = document.createElement('div')
      formDiv.classList.add('delete-experience-form')

      const newForm = document.createElement('form')
      newForm.method = 'POST'
      newForm.action = `./education/${e.currentTarget.value}`
      const infoDiv = document.createElement('div')
      infoDiv.classList.add('info-top')
      const infoSpan = document.createElement('span')
      infoSpan.textContent = 'Are you sure you want to delete this education?'

      const formInnerDiv = document.createElement('div')
      formInnerDiv.classList.add('form-mid')
      const closeFormBtn = document.createElement('input')
      closeFormBtn.type = 'button'
      closeFormBtn.value = '✖'
      closeFormBtn.classList.add('close-form-btn')
      const deleteBtn = document.createElement('button')
      deleteBtn.id = 'delete-btn'
      deleteBtn.textContent = 'Confirm'

      infoDiv.appendChild(infoSpan)
      infoDiv.appendChild(closeFormBtn)
      formInnerDiv.appendChild(deleteBtn)
      newForm.appendChild(infoDiv)
      newForm.appendChild(formInnerDiv)
      formDiv.appendChild(newForm)
      outerDiv.appendChild(formDiv)
      mainContainer.appendChild(outerDiv)
      closeFormBtn.addEventListener('click', (e) => {
        document.querySelector('.form-outer-container').remove()
      })
    })
  })
}

const removeJobBtn = document.querySelectorAll('.remove-experience-btns')
if (removeJobBtn) {
  removeJobBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const mainContainer = document.querySelector('.main-container')
      const outerDiv = document.createElement('div')
      outerDiv.classList.add('form-outer-container')
      const formDiv = document.createElement('div')
      formDiv.classList.add('delete-experience-form')

      const newForm = document.createElement('form')
      newForm.method = 'POST'
      newForm.action = `./experience/${e.currentTarget.value}`
      const infoDiv = document.createElement('div')
      infoDiv.classList.add('info-top')
      const infoSpan = document.createElement('span')
      infoSpan.textContent = 'Are you sure you want to delete this job?'

      const formInnerDiv = document.createElement('div')
      formInnerDiv.classList.add('form-mid')
      const closeFormBtn = document.createElement('input')
      closeFormBtn.type = 'button'
      closeFormBtn.value = '✖'
      closeFormBtn.classList.add('close-form-btn')
      const deleteBtn = document.createElement('button')
      deleteBtn.id = 'delete-btn'
      deleteBtn.textContent = 'Confirm'

      infoDiv.appendChild(infoSpan)
      infoDiv.appendChild(closeFormBtn)
      formInnerDiv.appendChild(deleteBtn)
      newForm.appendChild(infoDiv)
      newForm.appendChild(formInnerDiv)
      formDiv.appendChild(newForm)
      outerDiv.appendChild(formDiv)
      mainContainer.appendChild(outerDiv)
      closeFormBtn.addEventListener('click', (e) => {
        document.querySelector('.form-outer-container').remove()
      })
    })
  })
}
const applyJobBtn = document.querySelector('#apply-job-btn')
if (applyJobBtn) {
  applyJobBtn.addEventListener('click', (e) => {
    console.log(e.currentTarget.value)
    const mainContainer = document.querySelector('.main-container')
    const outerDiv = document.createElement('div')
    outerDiv.classList.add('form-outer-container')
    const formDiv = document.createElement('div')
    formDiv.classList.add('delete-experience-form')

    const newForm = document.createElement('form')
    newForm.method = 'POST'
    newForm.action = `./jobs/${e.currentTarget.value}`
    const infoDiv = document.createElement('div')
    infoDiv.classList.add('info-div-form')
    infoDiv.classList.add('info-top')
    const infoSpan = document.createElement('span')
    infoSpan.textContent = 'Do you want to apply to this job? Confirm to apply'

    const formInnerDiv = document.createElement('div')
    formInnerDiv.classList.add('form-mid')
    const closeFormBtn = document.createElement('input')
    closeFormBtn.type = 'button'
    closeFormBtn.value = '✖'
    closeFormBtn.classList.add('close-form-btn')
    const deleteBtn = document.createElement('button')
    deleteBtn.id = 'delete-btn'
    deleteBtn.textContent = 'Confirm'

    infoDiv.appendChild(infoSpan)
    infoDiv.appendChild(closeFormBtn)
    formInnerDiv.appendChild(deleteBtn)
    newForm.appendChild(infoDiv)
    newForm.appendChild(formInnerDiv)
    formDiv.appendChild(newForm)
    outerDiv.appendChild(formDiv)
    mainContainer.appendChild(outerDiv)
    closeFormBtn.addEventListener('click', (e) => {
      document.querySelector('.form-outer-container').remove()
    })
  })
}

const removeApplicationBtn = document.querySelector('#remove-application-job-btn')
if (removeApplicationBtn) {
  removeApplicationBtn.addEventListener('click', (e) => {
    console.log(e.currentTarget.value)
    const mainContainer = document.querySelector('.main-container')
    const outerDiv = document.createElement('div')
    outerDiv.classList.add('form-outer-container')
    const formDiv = document.createElement('div')
    formDiv.classList.add('delete-experience-form')

    const newForm = document.createElement('form')
    newForm.method = 'POST'
    newForm.action = `./jobs/remove-application/${e.currentTarget.value}`
    const infoDiv = document.createElement('div')
    infoDiv.classList.add('info-top')
    const infoSpan = document.createElement('span')
    infoSpan.textContent = 'Confirm to remove application'

    const formInnerDiv = document.createElement('div')
    formInnerDiv.classList.add('form-mid')
    const closeFormBtn = document.createElement('input')
    closeFormBtn.type = 'button'
    closeFormBtn.value = '✖'
    closeFormBtn.classList.add('close-form-btn')
    const deleteBtn = document.createElement('button')
    deleteBtn.id = 'delete-btn'
    deleteBtn.textContent = 'Confirm'

    infoDiv.appendChild(infoSpan)
    infoDiv.appendChild(closeFormBtn)
    formInnerDiv.appendChild(deleteBtn)
    newForm.appendChild(infoDiv)
    newForm.appendChild(formInnerDiv)
    formDiv.appendChild(newForm)
    outerDiv.appendChild(formDiv)
    mainContainer.appendChild(outerDiv)
    closeFormBtn.addEventListener('click', (e) => {
      document.querySelector('.form-outer-container').remove()
    })
  })
}

const newMessageBtn = document.querySelector('#send-message-btn')

if (newMessageBtn) {
  newMessageBtn.addEventListener('click', (e) => {
    const mainContainer = document.querySelector('.main-container')

    const outerDiv = document.createElement('div')
    const innerDiv = document.createElement('div')
    innerDiv.classList.add('message-inner-container')
    outerDiv.classList.add('form-outer-container')

    const formDiv = document.createElement('div')

    formDiv.classList.add('new-message-form')

    const newForm = document.createElement('form')
    newForm.method = 'POST'
    newForm.action = `./private-chat/${e.currentTarget.value}?refUrl=${window.location.href}`
    const closeFormBtn = document.createElement('input')
    closeFormBtn.type = 'button'
    closeFormBtn.value = '✖'
    closeFormBtn.classList.add('close-form-btn-messages')
    const headerDiv = document.createElement('div')
    headerDiv.classList.add('new-message-header')
    headerDiv.appendChild(closeFormBtn)
    const bodyDivSpan = document.createElement('span')
    bodyDivSpan.appendChild(document.createTextNode('Write a message'))

    const uperSubDiv = document.createElement('div')
    uperSubDiv.classList.add('uper-sub-div')
    uperSubDiv.appendChild(bodyDivSpan)
    const bodyDiv = document.createElement('div')

    bodyDiv.classList.add('new-message-body')

    const textContainer = document.createElement('div')
    textContainer.classList.add('text-container')
    const texstElement = document.createElement('textarea')
    texstElement.classList.add('message-text-area')
    texstElement.name = 'message'
    texstElement.setAttribute('autofocus', 'autofocus')
    const sendMessageDiv = document.createElement('div')
    sendMessageDiv.classList.add('send-message-container')
    const sendMessageBtn = document.createElement('button')
    sendMessageBtn.appendChild(document.createElement('span').appendChild(document.createTextNode('Send')))
    sendMessageDiv.appendChild(sendMessageBtn)

    textContainer.appendChild(texstElement)
    bodyDiv.appendChild(uperSubDiv)
    bodyDiv.appendChild(textContainer)

    innerDiv.appendChild(headerDiv)
    innerDiv.appendChild(bodyDiv)
    innerDiv.appendChild(sendMessageDiv)
    newForm.appendChild(innerDiv)
    formDiv.appendChild(newForm)
    outerDiv.appendChild(formDiv)
    mainContainer.appendChild(outerDiv)
    closeFormBtn.addEventListener('click', (e) => {
      document.querySelector('.form-outer-container').remove()
    })
  })
}

const removeConversationBtn = document.querySelectorAll('.delet-conversation-btn')
if (removeConversationBtn) {
  removeConversationBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const mainContainer = document.querySelector('.main-container')
      const outerDiv = document.createElement('div')
      outerDiv.classList.add('form-outer-container')
      const formDiv = document.createElement('div')
      formDiv.classList.add('delete-experience-form')

      const newForm = document.createElement('form')
      newForm.method = 'POST'
      newForm.action = `./delete-coversation/${e.currentTarget.value}`
      const infoDiv = document.createElement('div')
      infoDiv.classList.add('info-top')
      const infoSpan = document.createElement('span')
      infoSpan.textContent = 'Are you sure you want to delete this conversation?'

      const formInnerDiv = document.createElement('div')
      formInnerDiv.classList.add('form-mid')
      const closeFormBtn = document.createElement('input')
      closeFormBtn.type = 'button'
      closeFormBtn.value = '✖'
      closeFormBtn.classList.add('close-form-btn')
      const deleteBtn = document.createElement('button')
      deleteBtn.id = 'delete-btn'
      deleteBtn.textContent = 'Confirm'

      infoDiv.appendChild(infoSpan)
      infoDiv.appendChild(closeFormBtn)
      formInnerDiv.appendChild(deleteBtn)
      newForm.appendChild(infoDiv)
      newForm.appendChild(formInnerDiv)
      formDiv.appendChild(newForm)
      outerDiv.appendChild(formDiv)
      mainContainer.appendChild(outerDiv)
      closeFormBtn.addEventListener('click', (e) => {
        document.querySelector('.form-outer-container').remove()
      })
    })
  })
}
