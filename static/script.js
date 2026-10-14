// ==========================================
// NOVAAI CHAT SYSTEM
// ==========================================

const input = document.getElementById("userInput");
const messages = document.getElementById("messages");
const chatList = document.getElementById("chatList");

// ==========================================
// IMAGE ELEMENTS
// ==========================================

const imageInput = document.getElementById("imageInput");
const attachBtn = document.getElementById("attachBtn");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");
const removeImageBtn = document.getElementById("removeImageBtn");

let selectedImage = null;


// ==========================================
// CHAT HISTORY
// ==========================================

let chatHistory = JSON.parse(
    localStorage.getItem("novaAI_chatHistory")
) || [];

let currentChatId = null;


// ==========================================
// CHAT SEARCH
// ==========================================

let chatSearchInput = null;


// ==========================================
// CREATE CHAT SEARCH BOX
// ==========================================

function createChatSearch() {

    if (!chatList) {
        return;
    }

    if (document.getElementById("chatSearchInput")) {
        chatSearchInput =
            document.getElementById("chatSearchInput");

        return;
    }

    chatSearchInput =
        document.createElement("input");

    chatSearchInput.id =
        "chatSearchInput";

    chatSearchInput.className =
        "chat-search-input";

    chatSearchInput.type =
        "text";

    chatSearchInput.placeholder =
        "🔍 Search chats...";

    chatSearchInput.autocomplete =
        "off";

    chatList.parentNode.insertBefore(
        chatSearchInput,
        chatList
    );

    chatSearchInput.addEventListener(
        "input",
        function () {

            displayChatHistory(
                chatSearchInput.value
            );

        }
    );
}


// ==========================================
// DISPLAY CHAT HISTORY
// ==========================================

function displayChatHistory(searchText = "") {

    if (!chatList) {
        return;
    }

    chatList.innerHTML = "";

    const search =
        searchText
            .trim()
            .toLowerCase();

    const filteredChats =
        chatHistory.filter(chat => {

            if (!search) {
                return true;
            }

            return (
                chat.title &&
                chat.title
                    .toLowerCase()
                    .includes(search)
            );

        });


    // ======================================
    // NO SEARCH RESULTS
    // ======================================

    if (
        filteredChats.length === 0 &&
        search
    ) {

        const noResult =
            document.createElement("div");

        noResult.className =
            "no-chat-results";

        noResult.textContent =
            "No chats found";

        chatList.appendChild(
            noResult
        );

        return;
    }


    // ======================================
    // DISPLAY CHATS
    // ======================================

    filteredChats.forEach(chat => {

        const chatItem =
            document.createElement("div");

        chatItem.className =
            "chat-history-item";

        if (
            chat.id === currentChatId
        ) {

            chatItem.classList.add(
                "active-chat"
            );

        }

        chatItem.textContent =
            chat.title || "New Chat";

        chatItem.title =
            chat.title || "New Chat";

        chatItem.onclick =
            function () {

                loadChat(chat.id);

            };

        chatList.appendChild(
            chatItem
        );

    });
}


// ==========================================
// SAVE CHAT HISTORY
// ==========================================

function saveChatHistory() {

    localStorage.setItem(
        "novaAI_chatHistory",
        JSON.stringify(chatHistory)
    );

    const currentSearch =
        chatSearchInput
            ? chatSearchInput.value
            : "";

    displayChatHistory(
        currentSearch
    );
}


// ==========================================
// CREATE NEW CHAT
// ==========================================

function createNewChat(title) {

    const chat = {

        id: Date.now(),

        title: title,

        messages: []

    };

    chatHistory.unshift(chat);

    currentChatId =
        chat.id;

    saveChatHistory();

    return chat;
}


// ==========================================
// GET CURRENT CHAT
// ==========================================

function getCurrentChat() {

    return chatHistory.find(
        chat =>
            chat.id === currentChatId
    );
}


// ==========================================
// GET CURRENT TIME
// ==========================================

function getMessageTime() {

    const now =
        new Date();

    return now.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// IMAGE UPLOAD
// ==========================================

if (attachBtn && imageInput) {

    attachBtn.addEventListener(
        "click",
        function () {

            imageInput.click();

        }
    );
}


if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select a valid image file."
                );

                imageInput.value =
                    "";

                return;
            }


            const maxSize =
                10 * 1024 * 1024;

            if (file.size > maxSize) {

                alert(
                    "Image size must be less than 10 MB."
                );

                imageInput.value =
                    "";

                return;
            }


            selectedImage =
                file;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    if (previewImage) {

                        previewImage.src =
                            event.target.result;

                    }


                    if (imagePreview) {

                        imagePreview.style.display =
                            "block";

                    }

                };


            reader.readAsDataURL(file);

        }
    );
}


// ==========================================
// REMOVE IMAGE
// ==========================================

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        function () {

            clearSelectedImage();

        }
    );
}


// ==========================================
// CLEAR IMAGE
// ==========================================

function clearSelectedImage() {

    selectedImage =
        null;


    if (imageInput) {

        imageInput.value =
            "";

    }


    if (previewImage) {

        previewImage.src =
            "";

    }


    if (imagePreview) {

        imagePreview.style.display =
            "none";

    }
}


// ==========================================
// CREATE USER MESSAGE UI
// ==========================================

function createUserMessageUI(
    content,
    imageURL = null,
    time = null
) {

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "message user";


    let userContent =
        "";


    if (content) {

        userContent += `

            <div class="message-content">

                ${escapeHTML(content)}

                ${
                    time
                    ? `
                        <div class="message-time">
                            ${escapeHTML(time)}
                        </div>
                    `
                    : ""
                }

            </div>

        `;

    }


    if (imageURL) {

        userContent += `

            <div class="uploaded-image">

                <img
                    src="${imageURL}"
                    alt="Uploaded image"
                >

            </div>

        `;

    }


    userMessage.innerHTML =
        userContent;


    return userMessage;
}


// ==========================================
// CREATE AI MESSAGE UI
// ==========================================

function createAIMessageUI(
    content,
    messageIndex = null,
    time = null
) {

    const aiMessage =
        document.createElement("div");

    aiMessage.className =
        "message bot";


    aiMessage.innerHTML = `

        <div class="nova-icon">
            ✦
        </div>

        <div class="ai-message-wrapper">

            <div class="message-content">

                ${escapeHTML(content)}

                ${
                    time
                    ? `
                        <div class="message-time">
                            ${escapeHTML(time)}
                        </div>
                    `
                    : ""
                }

            </div>

            <div class="message-actions">

                <button
                    class="message-action copy-action"
                    type="button"
                    title="Copy"
                    onclick="copyAIMessage(this)"
                >
                    📋
                </button>

                <button
                    class="message-action regenerate-action"
                    type="button"
                    title="Regenerate"
                    onclick="regenerateMessage(this)"
                >
                    🔄
                </button>

                <button
                    class="message-action delete-action"
                    type="button"
                    title="Delete"
                    onclick="deleteMessage(this)"
                >
                    🗑️
                </button>

            </div>

        </div>

    `;


    if (messageIndex !== null) {

        aiMessage.dataset.messageIndex =
            messageIndex;

    }


    return aiMessage;
}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    if (!input) {
        return;
    }

    const message =
        input.value.trim();

    const imageToSend =
        selectedImage;


    if (!message && !imageToSend) {
        return;
    }


    const welcome =
        document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }


    if (!currentChatId) {

        let title =
            message
                ? message.substring(0, 30)
                : "Image Chat";


        if (message.length > 30) {
            title += "...";
        }


        createNewChat(title);

    }


    const currentChat =
        getCurrentChat();


    const messageTime =
        getMessageTime();


    let imageURL =
        null;


    if (imageToSend) {

        imageURL =
            URL.createObjectURL(
                imageToSend
            );

    }


    const userMessage =
        createUserMessageUI(
            message,
            imageURL,
            messageTime
        );


    if (messages) {

        messages.appendChild(
            userMessage
        );

    }


    if (currentChat) {

        let historyContent =
            message;


        if (imageToSend) {

            if (historyContent) {

                historyContent +=
                    " [Image uploaded]";

            } else {

                historyContent =
                    "[Image uploaded]";

            }

        }


        currentChat.messages.push({

            role:
                "user",

            content:
                historyContent,

            time:
                messageTime

        });


        saveChatHistory();

    }


    input.value =
        "";

    clearSelectedImage();


    // ======================================
    // AI LOADING
    // ======================================

    const aiMessage =
        document.createElement("div");

    aiMessage.className =
        "message bot";


    aiMessage.innerHTML = `

        <div class="nova-icon">
            ✦
        </div>

        <div class="ai-message-wrapper">

            <div class="message-content nova-loading">

                <span>
                    NovaAI is thinking
                </span>

                <span class="typing-dots">

                    <span>●</span>
                    <span>●</span>
                    <span>●</span>

                </span>

            </div>

        </div>

    `;


    if (messages) {

        messages.appendChild(
            aiMessage
        );

        messages.scrollTop =
            messages.scrollHeight;

    }


    try {

        const formData =
            new FormData();


        formData.append(
            "message",
            message
        );


        if (imageToSend) {

            formData.append(
                "image",
                imageToSend
            );

        }


        if (currentChat) {

            const contextMessages =
                currentChat.messages.slice(
                    -20
                );


            formData.append(
                "history",
                JSON.stringify(
                    contextMessages
                )
            );

        }


        const response =
            await fetch(
                "/chat",
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Server error";


            try {

                const errorData =
                    await response.json();


                errorMessage =
                    errorData.reply ||
                    errorData.message ||
                    errorMessage;

            } catch (e) {

                errorMessage =
                    "Server returned an error.";

            }


            throw new Error(
                errorMessage
            );

        }


        const data =
            await response.json();


        const aiReply =
            data.reply ||
            "No response received.";


        const aiTime =
            getMessageTime();


        const newAIMessage =
            createAIMessageUI(
                aiReply,
                currentChat
                    ? currentChat.messages.length
                    : null,
                aiTime
            );


        aiMessage.replaceWith(
            newAIMessage
        );


        if (currentChat) {

            currentChat.messages.push({

                role:
                    "assistant",

                content:
                    aiReply,

                time:
                    aiTime

            });


            saveChatHistory();

        }


    } catch (error) {

        console.error(
            "NovaAI Error:",
            error
        );


        const errorText =
            error.message ||
            "Sorry, something went wrong.";


        aiMessage.innerHTML = `

            <div class="nova-icon">
                ✦
            </div>

            <div class="ai-message-wrapper">

                <div class="message-content">

                    ${escapeHTML(errorText)}

                </div>

                <div class="message-actions">

                    <button
                        class="message-action delete-action"
                        type="button"
                        title="Delete"
                        onclick="deleteMessage(this)"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    }


    if (messages) {

        messages.scrollTop =
            messages.scrollHeight;

    }
}


// ==========================================
// COPY AI MESSAGE
// ==========================================

async function copyAIMessage(button) {

    const wrapper =
        button.closest(
            ".ai-message-wrapper"
        );


    if (!wrapper) {
        return;
    }


    const contentElement =
        wrapper.querySelector(
            ".message-content"
        );


    if (!contentElement) {
        return;
    }


    const clonedContent =
        contentElement.cloneNode(true);


    const timeElement =
        clonedContent.querySelector(
            ".message-time"
        );


    if (timeElement) {
        timeElement.remove();
    }


    const text =
        clonedContent.textContent.trim();


    try {

        await navigator.clipboard.writeText(
            text
        );


        const oldText =
            button.textContent;


        button.textContent =
            "✓";

        button.title =
            "Copied";


        setTimeout(
            function () {

                button.textContent =
                    oldText;

                button.title =
                    "Copy";

            },
            1500
        );


    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );

        alert(
            "Unable to copy this message."
        );

    }
}


// ==========================================
// DELETE MESSAGE
// ==========================================

function deleteMessage(button) {

    const messageElement =
        button.closest(
            ".message"
        );


    if (!messageElement) {
        return;
    }


    const currentChat =
        getCurrentChat();


    if (!currentChat) {

        messageElement.remove();

        return;

    }


    const botElements =
        Array.from(
            messages.querySelectorAll(
                ".message.bot"
            )
        );


    const botPosition =
        botElements.indexOf(
            messageElement
        );


    if (
        messageElement.classList.contains(
            "bot"
        ) &&
        botPosition !== -1
    ) {

        const assistantMessages =
            currentChat.messages.filter(
                item =>
                    item.role === "assistant"
            );


        const targetAssistant =
            assistantMessages[
                botPosition
            ];


        if (targetAssistant) {

            const historyIndex =
                currentChat.messages.indexOf(
                    targetAssistant
                );


            if (historyIndex !== -1) {

                currentChat.messages.splice(
                    historyIndex,
                    1
                );

            }

        }

    }


    messageElement.remove();

    saveChatHistory();
}


// ==========================================
// REGENERATE AI MESSAGE
// ==========================================
// ==========================================
// REGENERATE AI MESSAGE
// ==========================================

async function regenerateMessage(button) {

    const aiMessageElement =
        button.closest(
            ".message.bot"
        );


    if (!aiMessageElement) {
        return;
    }


    const currentChat =
        getCurrentChat();


    if (!currentChat) {
        return;
    }


    const botElements =
        Array.from(
            messages.querySelectorAll(
                ".message.bot"
            )
        );


    const botPosition =
        botElements.indexOf(
            aiMessageElement
        );


    const assistantMessages =
        currentChat.messages.filter(
            item =>
                item.role === "assistant"
        );


    const oldAssistantMessage =
        assistantMessages[
            botPosition
        ];


    if (!oldAssistantMessage) {
        return;
    }


    const assistantHistoryIndex =
        currentChat.messages.indexOf(
            oldAssistantMessage
        );


    if (
        assistantHistoryIndex === -1
    ) {
        return;
    }


    let userMessage =
        null;


    for (
        let i =
            assistantHistoryIndex - 1;
        i >= 0;
        i--
    ) {

        if (
            currentChat.messages[i].role ===
            "user"
        ) {

            userMessage =
                currentChat.messages[i];

            break;

        }

    }


    if (!userMessage) {

        alert(
            "Original user message not found."
        );

        return;

    }


    // ======================================
    // EXTRACT USER MESSAGE
    // ======================================

    let messageText =
        userMessage.content;


    messageText =
        messageText
            .replace(
                " [Image uploaded]",
                ""
            )
            .replace(
                "[Image uploaded]",
                ""
            )
            .trim();


    // ======================================
    // SHOW REGENERATING
    // ======================================

    const wrapper =
        aiMessageElement.querySelector(
            ".ai-message-wrapper"
        );


    if (wrapper) {

        wrapper.innerHTML = `

            <div class="message-content nova-loading">

                <span>
                    NovaAI is regenerating
                </span>

                <span class="typing-dots">

                    <span>●</span>
                    <span>●</span>
                    <span>●</span>

                </span>

            </div>

        `;

    }


    // ======================================
    // DISABLE BUTTON
    // ======================================

    button.disabled =
        true;


    try {

        const formData =
            new FormData();


        formData.append(
            "message",
            messageText
        );


        // ==================================
        // OLD RESPONSE REMOVE FROM CONTEXT
        // ==================================

        const historyBeforeAnswer =
            currentChat.messages.slice(
                0,
                assistantHistoryIndex
            );


        formData.append(
            "history",
            JSON.stringify(
                historyBeforeAnswer.slice(-20)
            )
        );


        // ==================================
        // SEND REQUEST TO FLASK
        // ==================================

        const response =
            await fetch(
                "/chat",
                {
                    method: "POST",
                    body: formData
                }
            );


        // ==================================
        // CHECK RESPONSE
        // ==================================

        if (!response.ok) {

            let errorMessage =
                "Unable to regenerate response.";


            try {

                const errorData =
                    await response.json();


                errorMessage =
                    errorData.reply ||
                    errorData.message ||
                    errorMessage;

            } catch (e) {

                // Default error remains

            }


            throw new Error(
                errorMessage
            );

        }


        // ==================================
        // GET NEW RESPONSE
        // ==================================

        const data =
            await response.json();


        const newReply =
            data.reply ||
            "No response received.";


        const newTime =
            getMessageTime();


        // ==================================
        // UPDATE CHAT HISTORY
        // ==================================

        currentChat.messages[
            assistantHistoryIndex
        ] = {

            role:
                "assistant",

            content:
                newReply,

            time:
                newTime

        };


        saveChatHistory();


        // ==================================
        // CREATE NEW AI MESSAGE
        // ==================================

        const newAIMessage =
            createAIMessageUI(
                newReply,
                assistantHistoryIndex,
                newTime
            );


        // ==================================
        // REPLACE OLD MESSAGE
        // ==================================

        aiMessageElement.replaceWith(
            newAIMessage
        );


    } catch (error) {

        console.error(
            "Regenerate Error:",
            error
        );


        // ==================================
        // SHOW ERROR
        // ==================================

        if (wrapper) {

            wrapper.innerHTML = `

                <div class="message-content">

                    ${escapeHTML(
                        error.message ||
                        "Unable to regenerate response."
                    )}

                </div>


                <div class="message-actions">

                    <button
                        class="message-action regenerate-action"
                        type="button"
                        title="Regenerate"
                        onclick="regenerateMessage(this)"
                    >
                        🔄
                    </button>


                    <button
                        class="message-action delete-action"
                        type="button"
                        title="Delete"
                        onclick="deleteMessage(this)"
                    >
                        🗑️
                    </button>

                </div>

            `;

        }

    }


    // ======================================
    // SCROLL
    // ======================================

    if (messages) {

        messages.scrollTop =
            messages.scrollHeight;

    }
}


// ==========================================
// LOAD OLD CHAT
// ==========================================

function loadChat(chatId) {

    const chat =
        chatHistory.find(
            item =>
                item.id === chatId
        );


    if (!chat) {
        return;
    }


    currentChatId =
        chatId;


    messages.innerHTML =
        "";


    // ======================================
    // LOAD SAVED MESSAGES
    // ======================================

    chat.messages.forEach(
        (message, index) => {

            const messageTime =
                message.time ||
                "";


            // ==================================
            // USER MESSAGE
            // ==================================

            if (
                message.role ===
                "user"
            ) {

                const userMessage =
                    createUserMessageUI(
                        message.content,
                        null,
                        messageTime
                    );


                messages.appendChild(
                    userMessage
                );

            }


            // ==================================
            // AI MESSAGE
            // ==================================

            else {

                const aiMessage =
                    createAIMessageUI(
                        message.content,
                        index,
                        messageTime
                    );


                messages.appendChild(
                    aiMessage
                );

            }

        }
    );


    // ======================================
    // REFRESH CHAT LIST
    // ======================================

    displayChatHistory(
        chatSearchInput
            ? chatSearchInput.value
            : ""
    );


    messages.scrollTop =
        messages.scrollHeight;
}


// ==========================================
// NEW CHAT
// ==========================================

function newChat() {

    currentChatId =
        null;


    messages.innerHTML = `

        <div class="welcome">

            <div class="nova-icon">
                ✦
            </div>


            <h1>
                How can I help you today?
            </h1>


            <p>
                Ask NovaAI anything.
                You can start a conversation below.
            </p>


            <div class="suggestions">

                <button
                    onclick="useSuggestion('Explain Java in simple words')"
                >
                    Explain Java
                </button>


                <button
                    onclick="useSuggestion('Give me a Python project idea')"
                >
                    Python Project
                </button>


                <button
                    onclick="useSuggestion('Help me learn DSA')"
                >
                    Learn DSA
                </button>

            </div>

        </div>

    `;


    input.value =
        "";


    input.focus();


    clearSelectedImage();


    displayChatHistory(
        chatSearchInput
            ? chatSearchInput.value
            : ""
    );
}


// ==========================================
// SUGGESTION
// ==========================================

function useSuggestion(text) {

    input.value =
        text;


    input.focus();


    sendMessage();
}


// ==========================================
// ENTER KEY
// ==========================================

function handleKey(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;
}


// ==========================================
// INITIALIZE
// ==========================================

createChatSearch();

displayChatHistory();
