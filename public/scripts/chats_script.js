document.addEventListener("DOMContentLoaded", () => {
  // Элементы DOM
  const chatItems = document.querySelectorAll(".chat-item")
  const chatTitle = document.getElementById("chatTitle")
  const messagesContainer = document.getElementById("messagesContainer")
  const messageInput = document.getElementById("messageInput")
  const sendBtn = document.getElementById("sendBtn")
  const attachBtn = document.getElementById("attachBtn")
  const noChatSelected = document.getElementById("noChatSelected")
  const chatHeader = document.getElementById("chatHeader")
  const messagesArea = document.getElementById("messagesArea")
  const messageInputArea = document.getElementById("messageInputArea")
  const chatsSidebar = document.getElementById("chatsSidebar")
  const chatArea = document.getElementById("chatArea")
  const backToChats = document.getElementById("backToChats")
  const chatFilesBtn = document.getElementById("chatFilesBtn")

  // Модальное окно для файлов
  const attachModal = document.getElementById("attachModal")
  const fileInput = document.getElementById("fileInput")
  const fileUploadArea = document.getElementById("fileUploadArea")
  const selectedFilesContainer = document.getElementById("selectedFiles")
  const confirmAttachBtn = document.getElementById("confirmAttach")
  const cancelAttachBtn = document.getElementById("cancelAttach")
  const attachModalClose = document.getElementById("attachModalClose")

  // Модальное окно для просмотра файлов чата
  const filesModal = document.getElementById("filesModal")
  const chatFilesList = document.getElementById("chatFilesList")
  const filesModalClose = document.getElementById("filesModalClose")
  const closeFilesModalBtn = document.getElementById("closeFilesModal")

  // Состояние
  let currentChatId = null
  let selectedFiles = []
  let isMobile = window.innerWidth <= 768


  // Инициализация
  init()

  function init() {
    setupEventListeners()
    checkScreenSize()
    loadChat(currentChatId)
  }

  function setupEventListeners() {
    // Переключение чатов
    chatItems.forEach((item) => {
      item.addEventListener("click", () => {
        const chatId = item.dataset.chatId
        selectChat(chatId)
      })
    })

    // Кнопка возврата к списку чатов
    backToChats.addEventListener("click", showChatsList)

    // Отправка сообщения
    sendBtn.addEventListener("click", sendMessage)
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })

    // Прикрепление файлов
    attachBtn.addEventListener("click", () => {
      attachModal.classList.add("show")
    })

    // Кнопка просмотра файлов в заголовке чата
    if (chatFilesBtn) {
      chatFilesBtn.addEventListener("click", () => {
        showChatFiles(currentChatId)
      })
    }

    // Модальное окно файлов
    setupFileModal()

    // Модальное окно просмотра файлов чата
    setupFilesModal()

    // Отслеживание изменения размера экрана
    window.addEventListener("resize", checkScreenSize)
  }

  function checkScreenSize() {
    isMobile = window.innerWidth <= 768
    if (isMobile) {
      // На мобильных устройствах показываем только список чатов при загрузке
      chatsSidebar.classList.remove("hidden")
      chatArea.classList.remove("active")
    } else {
      // На десктопе показываем и список чатов, и область чата
      chatsSidebar.classList.remove("hidden")
      chatArea.classList.add("active")
    }
  }

  function setupFileModal() {
    // Закрытие модального окна
    attachModalClose.addEventListener("click", closeAttachModal)
    cancelAttachBtn.addEventListener("click", closeAttachModal)

    // Клик вне модального окна
    attachModal.addEventListener("click", (e) => {
      if (e.target === attachModal) {
        closeAttachModal()
      }
    })

    // Выбор файлов
    fileInput.addEventListener("change", handleFileSelect)

    // Drag & Drop
    fileUploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      fileUploadArea.classList.add("dragover")
    })

    fileUploadArea.addEventListener("dragleave", () => {
      fileUploadArea.classList.remove("dragover")
    })

    fileUploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      fileUploadArea.classList.remove("dragover")
      const files = Array.from(e.dataTransfer.files)
      addFilesToSelection(files)
    })

    // Подтверждение прикрепления
    confirmAttachBtn.addEventListener("click", confirmAttachment)
  }

  function setupFilesModal() {
    // Закрытие модального окна
    filesModalClose.addEventListener("click", closeFilesModal)
    closeFilesModalBtn.addEventListener("click", closeFilesModal)

    // Клик вне модального окна
    filesModal.addEventListener("click", (e) => {
      if (e.target === filesModal) {
        closeFilesModal()
      }
    })
  }

  // Назначаем обработчики на все элементы чатов
  chatItems.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.dataset.chatId
      selectChat(chatId)
    })
  })

  async function selectChat(chatId) {
    chatItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.chatId === chatId)
    })

    const selectedItem = document.querySelector(`[data-chat-id="${chatId}"]`)
    const notification = selectedItem.querySelector(".chat-notification")
    if (notification) notification.remove()

    currentChatId = chatId

    await loadChat(chatId)

    if (isMobile) {
      chatsSidebar.classList.add("hidden")
      chatArea.classList.add("active")
    }
  }

  function showChatsList() {
    if (isMobile) {
      chatsSidebar.classList.remove("hidden")
      chatArea.classList.remove("active")
    }
  }

  async function loadChat(chatId) {
    try {
      const res = await fetch(`/chats/${chatId}`)
      if (!res.ok) throw new Error("Ошибка при загрузке чата")

      const chatData = await res.json()

      if (!chatData || !chatData.messages) {
        showNoChatSelected()
        return
      }

      chatHeader.style.display = "flex"
      messagesArea.style.display = "block"
      messageInputArea.style.display = "block"
      noChatSelected.style.display = "none"

      chatTitle.textContent = chatData.title || 'Чат'

      loadMessages(chatData.messages)

    } catch (err) {
      console.error("Ошибка при загрузке чата:", err)
      showNoChatSelected()
    }
  }

  function showNoChatSelected() {
    chatHeader.style.display = "none"
    messagesArea.style.display = "none"
    messageInputArea.style.display = "none"
    noChatSelected.style.display = "flex"
  }

  function loadMessages(messages) {
    messagesContainer.innerHTML = ""

    messages.forEach((message) => {
      const messageElement = createMessageElement(message)
      messagesContainer.appendChild(messageElement)
    })

    scrollToBottom()
  }

  function createMessageElement(message) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${message.type}`

    const textDiv = document.createElement("div")
    textDiv.textContent = message.text
    messageDiv.appendChild(textDiv)

    const timeDiv = document.createElement("div")
    timeDiv.className = "message-time"
    timeDiv.textContent = message.time
    messageDiv.appendChild(timeDiv)

    if (message.files && message.files.length > 0) {
      message.files.forEach((file) => {
        const fileDiv = createFileElement(file)
        messageDiv.appendChild(fileDiv)
      })
    }

    return messageDiv
  }

  function createFileElement(file) {
    const fileDiv = document.createElement("div")
    fileDiv.className = "message-file"
    fileDiv.innerHTML = `
      <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
      </svg>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-size">${formatFileSize(file.size)}</div>
      </div>
    `
    fileDiv.addEventListener("click", () => {
      window.open(file.url, "_blank")
    })
    return fileDiv
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} Б`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} КБ`
    return `${(bytes / 1048576).toFixed(1)} МБ`
  }

  async function showChatFiles(chatId) {
    try {
      const response = await fetch(`/chats/${chatId}/files`)
      if (!response.ok) throw new Error("Ошибка при загрузке файлов")

      const files = await response.json()

      if (!files || files.length === 0) {
        alert("В этом чате нет прикрепленных файлов")
        return
      }

      // Очищаем и заполняем список файлов
      chatFilesList.innerHTML = ""

      files.forEach((file) => {
        const fileItem = document.createElement("div")
        fileItem.className = "chat-file-item"

        // Определяем иконку в зависимости от MIME-типа
        let fileIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
        </svg>
      `
        if (file.mimeType?.startsWith("image/")) {
          fileIcon = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        `
        }

        fileItem.innerHTML = `
        <div class="chat-file-icon">${fileIcon}</div>
        <div class="chat-file-info">
          <div class="chat-file-name">${file.name}</div>
          <div class="chat-file-meta">
            <div class="chat-file-size">${formatFileSize(file.size)}</div>
            <div class="chat-file-date">${file.date}</div>
          </div>
        </div>
        <div class="chat-file-download">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
      `

        fileItem.addEventListener("click", () => {
          window.open(file.path, "_blank") // загрузка файла
        })

        chatFilesList.appendChild(fileItem)
      })

      filesModal.classList.add("show")

    } catch (error) {
      console.error("Ошибка при получении файлов:", error)
      alert("Ошибка при загрузке файлов чата")
    }
  }


  function closeFilesModal() {
    filesModal.classList.remove("show")
  }

  async function sendMessage() {
    const text = messageInput.value.trim()
    if (!text && selectedFiles.length === 0) return

    const formData = new FormData()
    formData.append("text", text)

    const now = new Date()
    formData.append("date", now.toISOString()) // ISO-формат

    selectedFiles.forEach((file, index) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch(`/chats/${currentChatId}/message`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Ошибка при отправке сообщения")
      }

      const savedMessage = await response.json()

      const messageElement = createMessageElement({
        type: "user",
        text: savedMessage.text,
        time: new Date(savedMessage.date).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        files: savedMessage.files, // массив путей к файлам
      })

      messagesContainer.appendChild(messageElement)
      messageInput.value = ""
      selectedFiles = []
      scrollToBottom()

    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error)
      alert("Не удалось отправить сообщение")
    }
  }




  function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files)
    addFilesToSelection(files)
  }

  function addFilesToSelection(files) {
    files.forEach((file) => {
      if (selectedFiles.length < 5) {
        // Максимум 5 файлов
        selectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
        })
      }
    })

    console.log(selectedFiles)
    updateSelectedFilesDisplay()
  }

  function updateSelectedFilesDisplay() {
    selectedFilesContainer.innerHTML = ""

    selectedFiles.forEach((file, index) => {
      const fileDiv = document.createElement("div")
      fileDiv.className = "selected-file"

      fileDiv.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
        </svg>
        <div class="selected-file-info">
          <div class="selected-file-name">${file.name}</div>
          <div class="selected-file-size">${formatFileSize(file.size)}</div>
        </div>
        <button class="remove-selected-file" data-index="${index}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `

      const removeButton = fileDiv.querySelector(".remove-selected-file")
      removeButton.addEventListener("click", () => {
        removeFileFromSelection(index)
      })

      selectedFilesContainer.appendChild(fileDiv)
    })
  }

  function removeFileFromSelection(index) {
    selectedFiles.splice(index, 1)
    updateSelectedFilesDisplay()
  }
  async function confirmAttachment() {
    if (selectedFiles.length === 0 || !currentChatId) return

    const formData = new FormData()
    formData.append("id_chat", currentChatId)

    // Если хочешь отправить текстовое сообщение вместе с файлами:
    const messageText = messageInput.value.trim()
    formData.append("messege_content", messageText || "[Вложение]")

    selectedFiles.forEach((fileWrapper) => {
      formData.append("files", fileWrapper.file) // правильно достаём File из обёртки
    })

    console.log(selectedFiles)
    console.log(formData)

    try {
      const res = await fetch(`/chats/${currentChatId}/message`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Ошибка при загрузке файлов")

      const responseData = await res.json()
      console.log("Ответ сервера:", responseData)

      selectedFiles = []
      messageInput.value = ""
      closeAttachModal()

      // перезагружаем чат
      loadChat(currentChatId)
    } catch (err) {
      console.error("Ошибка отправки файлов:", err)
    }
  }


  function closeAttachModal() {
    attachModal.classList.remove("show")
    // Очищаем выбранные файлы
    selectedFiles = []
    updateSelectedFilesDisplay()
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
})
