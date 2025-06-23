// Classes TypeScript (POO) pour l'application
var User = /** @class */ (function () {
    function User(id, username, name, avatar) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.avatar = avatar;
    }
    return User;
}());
var Message = /** @class */ (function () {
    function Message(id, senderId, content, timestamp, read) {
        if (read === void 0) { read = false; }
        this.id = id;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.read = read;
    }
    return Message;
}());
var Conversation = /** @class */ (function () {
    function Conversation(id, participants, lastMessage, lastMessageTime, unreadCount) {
        if (lastMessage === void 0) { lastMessage = ""; }
        if (lastMessageTime === void 0) { lastMessageTime = new Date(); }
        if (unreadCount === void 0) { unreadCount = 0; }
        this.id = id;
        this.participants = participants;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
        this.messages = [];
    }
    Conversation.prototype.addMessage = function (message) {
        this.messages.push(message);
        this.lastMessage = message.content;
        this.lastMessageTime = message.timestamp;
        // Si le message n'est pas de l'utilisateur actuel, incrémenter le compteur de messages non lus
        if (message.senderId !== (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)) {
            this.unreadCount++;
        }
    };
    return Conversation;
}());
var ChatApp = /** @class */ (function () {
    function ChatApp() {
        this.users = [];
        this.conversations = [];
        this.currentConversation = null;
        this.loadSampleData();
    }
    ChatApp.prototype.loadSampleData = function () {
        // Création d'utilisateurs
        this.users = [
            new User(1, "john", "John Doe", "https://randomuser.me/api/portraits/men/1.jpg"),
            new User(2, "jane", "Jane Smith", "https://randomuser.me/api/portraits/women/2.jpg"),
            new User(3, "bob", "Bob Johnson", "https://randomuser.me/api/portraits/men/3.jpg"),
            new User(4, "alice", "Alice Williams", "https://randomuser.me/api/portraits/women/4.jpg"),
        ];
        // Création de conversations
        var conv1 = new Conversation(1, [1, 2]);
        conv1.addMessage(new Message(1, 1, "Salut, ça va ?", new Date(Date.now() - 3600000)));
        conv1.addMessage(new Message(2, 2, "Oui, et toi ?", new Date(Date.now() - 3500000)));
        conv1.addMessage(new Message(3, 1, "Très bien, merci !", new Date(Date.now() - 3400000)));
        var conv2 = new Conversation(2, [1, 3]);
        conv2.addMessage(new Message(1, 3, "Bonjour, tu as vu le nouveau projet ?", new Date(Date.now() - 86400000)));
        conv2.addMessage(new Message(2, 1, "Oui, il est génial !", new Date(Date.now() - 86300000)));
        var conv3 = new Conversation(3, [1, 4]);
        conv3.addMessage(new Message(1, 4, "Rappelle-moi demain", new Date(Date.now() - 172800000)));
        conv3.addMessage(new Message(2, 1, "D'accord, pas de problème", new Date(Date.now() - 172700000)));
        conv3.unreadCount = 2;
        this.conversations = [conv1, conv2, conv3];
    };
    ChatApp.prototype.getConversationsForUser = function (userId) {
        return this.conversations.filter(function (conv) {
            return conv.participants.includes(userId);
        });
    };
    ChatApp.prototype.getOtherParticipant = function (conversation) {
        if (!currentUser)
            return undefined;
        var otherId = conversation.participants.find(function (id) { return id !== currentUser.id; });
        return this.users.find(function (u) { return u.id === otherId; });
    };
    ChatApp.prototype.setCurrentConversation = function (conversationId) {
        this.currentConversation =
            this.conversations.find(function (c) { return c.id === conversationId; }) || null;
        if (this.currentConversation) {
            this.currentConversation.unreadCount = 0;
        }
        return this.currentConversation;
    };
    ChatApp.prototype.sendMessage = function (content) {
        if (!this.currentConversation || !currentUser)
            return;
        var newMessage = new Message(this.currentConversation.messages.length + 1, currentUser.id, content, new Date());
        this.currentConversation.addMessage(newMessage);
        return newMessage;
    };
    return ChatApp;
}());
// Variables globales
var currentUser = null;
var chatApp = new ChatApp();
// DOM Elements
var loginScreen = document.getElementById("loginScreen");
var mainApp = document.getElementById("mainApp");
var loginForm = document.getElementById("loginForm");
var loginError = document.getElementById("loginError");
var conversationsList = document.getElementById("conversationsList");
var messagesContainer = document.getElementById("messagesContainer");
var currentChatName = document.getElementById("currentChatName");
var currentChatStatus = document.getElementById("currentChatStatus");
var messageInput = document.getElementById("messageInput");
var sendButton = document.getElementById("sendButton");
// Initialisation de l'application
document.addEventListener("DOMContentLoaded", function () {
    // Gestion de la connexion
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var usernameInput = document.getElementById("username");
        var passwordInput = document.getElementById("password");
        // Simulation de vérification des identifiants
        var validCredentials = usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "";
        if (validCredentials) {
            // Connexion réussie
            loginError.classList.add("hidden");
            // Créer l'utilisateur actuel (simulation)
            currentUser = new User(1, usernameInput.value.trim(), usernameInput.value.trim(), "https://ui-avatars.com/api/?name=".concat(usernameInput.value.trim(), "&background=128C7E&color=fff"));
            // Afficher l'application principale
            loginScreen.classList.add("hidden");
            mainApp.classList.remove("hidden");
            // Charger les conversations
            loadConversations();
        }
        else {
            // Afficher une erreur
            loginError.classList.remove("hidden");
        }
    });
    // Gestion de l'envoi de message
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
// Charger les conversations
function loadConversations() {
    if (!currentUser)
        return;
    var conversations = chatApp.getConversationsForUser(currentUser.id);
    conversationsList.innerHTML = "";
    conversations.forEach(function (conv) {
        var otherUser = chatApp.getOtherParticipant(conv);
        if (!otherUser)
            return;
        var lastMessageTime = new Date(conv.lastMessageTime);
        var timeString = lastMessageTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        var conversationItem = document.createElement("div");
        conversationItem.className = "p-3 flex items-center hover:bg-gray-50 cursor-pointer chat-list-item ".concat(conv.unreadCount > 0 ? "bg-blue-50" : "");
        conversationItem.dataset.conversationId = conv.id.toString();
        conversationItem.innerHTML = "\n                    <div class=\"relative flex-shrink-0\">\n                        <img src=\"".concat(otherUser.avatar, "\" class=\"w-12 h-12 rounded-full\">\n                        <span class=\"absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white\"></span>\n                    </div>\n                    <div class=\"ml-3 flex-1 min-w-0\">\n                        <div class=\"flex justify-between\">\n                            <h3 class=\"font-semibold text-gray-900 truncate\">").concat(otherUser.name, "</h3>\n                            <span class=\"text-xs text-gray-500\">").concat(timeString, "</span>\n                        </div>\n                        <div class=\"flex justify-between\">\n                            <p class=\"text-sm text-gray-500 truncate\">").concat(conv.lastMessage, "</p>\n                            ").concat(conv.unreadCount > 0
            ? "<span class=\"bg-whatsapp text-white text-xs w-5 h-5 rounded-full flex items-center justify-center\">".concat(conv.unreadCount, "</span>")
            : "", "\n                        </div>\n                    </div>\n                ");
        conversationItem.addEventListener("click", function () {
            // Supprimer la classe active de tous les éléments
            document.querySelectorAll(".chat-list-item").forEach(function (el) {
                el.classList.remove("active");
            });
            // Ajouter la classe active à l'élément cliqué
            conversationItem.classList.add("active");
            // Charger la conversation
            loadConversation(conv.id);
        });
        conversationsList.appendChild(conversationItem);
    });
}
// Charger une conversation spécifique
function loadConversation(conversationId) {
    var conversation = chatApp.setCurrentConversation(conversationId);
    if (!conversation || !currentUser)
        return;
    var otherUser = chatApp.getOtherParticipant(conversation);
    if (!otherUser)
        return;
    // Mettre à jour l'en-tête de la conversation
    currentChatName.textContent = otherUser.name;
    currentChatStatus.textContent = "En ligne";
    // Afficher les messages
    messagesContainer.innerHTML = "";
    conversation.messages.forEach(function (message) {
        var isSender = message.senderId === currentUser.id;
        var messageTime = new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        var messageElement = document.createElement("div");
        messageElement.className = "flex ".concat(isSender ? "justify-end" : "justify-start", " mb-2");
        messageElement.innerHTML = "\n                    <div class=\"max-w-xs lg:max-w-md\">\n                        <div class=\"".concat(isSender
            ? "bg-whatsapp-light text-white message-sent"
            : "bg-white text-gray-800 message-received", " p-3 rounded-lg shadow-sm\">\n                            <p>").concat(message.content, "</p>\n                        </div>\n                        <div class=\"text-xs text-gray-500 mt-1 ").concat(isSender ? "text-right" : "text-left", "\">").concat(messageTime, "</div>\n                    </div>\n                ");
        messagesContainer.appendChild(messageElement);
    });
    // Faire défiler vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// Envoyer un message
function sendMessage() {
    if (!messageInput.value.trim() || !currentUser)
        return;
    var content = messageInput.value.trim();
    // Créer et ajouter le message
    var newMessage = chatApp.sendMessage(content);
    if (!newMessage)
        return;
    // Effacer le champ de saisie
    messageInput.value = "";
    // Mettre à jour l'interface
    if (chatApp.setCurrentConversation) {
        loadConversation(chatApp.setCurrentConversation.id);
    }
}
