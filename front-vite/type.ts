// Classes TypeScript (POO) pour l'application
class User {
  constructor(
    public id: number,
    public username: string,
    public name: string,
    public avatar: string
  ) {}
}

class Message {
  constructor(
    public id: number,
    public senderId: number,
    public content: string,
    public timestamp: Date,
    public read: boolean = false
  ) {}
}

class Conversation {
  public messages: Message[] = [];

  constructor(
    public id: number,
    public participants: number[],
    public lastMessage: string = "",
    public lastMessageTime: Date = new Date(),
    public unreadCount: number = 0
  ) {}

  addMessage(message: Message) {
    this.messages.push(message);
    this.lastMessage = message.content;
    this.lastMessageTime = message.timestamp;

    // Si le message n'est pas de l'utilisateur actuel, incrémenter le compteur de messages non lus
    if (message.senderId !== currentUser?.id) {
      this.unreadCount++;
    }
  }
}

class ChatApp {
  private users: User[] = [];
  private conversations: Conversation[] = [];
  private currentConversation: Conversation | null = null;

  constructor() {
    this.loadSampleData();
  }

  private loadSampleData() {
    // Création d'utilisateurs
    this.users = [
      new User(
        1,
        "john",
        "John Doe",
        "https://randomuser.me/api/portraits/men/1.jpg"
      ),
      new User(
        2,
        "jane",
        "Jane Smith",
        "https://randomuser.me/api/portraits/women/2.jpg"
      ),
      new User(
        3,
        "bob",
        "Bob Johnson",
        "https://randomuser.me/api/portraits/men/3.jpg"
      ),
      new User(
        4,
        "alice",
        "Alice Williams",
        "https://randomuser.me/api/portraits/women/4.jpg"
      ),
    ];

    // Création de conversations
    const conv1 = new Conversation(1, [1, 2]);
    conv1.addMessage(
      new Message(1, 1, "Salut, ça va ?", new Date(Date.now() - 3600000))
    );
    conv1.addMessage(
      new Message(2, 2, "Oui, et toi ?", new Date(Date.now() - 3500000))
    );
    conv1.addMessage(
      new Message(3, 1, "Très bien, merci !", new Date(Date.now() - 3400000))
    );

    const conv2 = new Conversation(2, [1, 3]);
    conv2.addMessage(
      new Message(
        1,
        3,
        "Bonjour, tu as vu le nouveau projet ?",
        new Date(Date.now() - 86400000)
      )
    );
    conv2.addMessage(
      new Message(2, 1, "Oui, il est génial !", new Date(Date.now() - 86300000))
    );

    const conv3 = new Conversation(3, [1, 4]);
    conv3.addMessage(
      new Message(1, 4, "Rappelle-moi demain", new Date(Date.now() - 172800000))
    );
    conv3.addMessage(
      new Message(
        2,
        1,
        "D'accord, pas de problème",
        new Date(Date.now() - 172700000)
      )
    );
    conv3.unreadCount = 2;

    this.conversations = [conv1, conv2, conv3];
  }

  getConversationsForUser(userId: number): Conversation[] {
    return this.conversations.filter((conv) =>
      conv.participants.includes(userId)
    );
  }

  getOtherParticipant(conversation: Conversation): User | undefined {
    if (!currentUser) return undefined;
    const otherId = conversation.participants.find(
      (id) => id !== currentUser.id
    );
    return this.users.find((u) => u.id === otherId);
  }

  setCurrentConversation(conversationId: number) {
    this.currentConversation =
      this.conversations.find((c) => c.id === conversationId) || null;
    if (this.currentConversation) {
      this.currentConversation.unreadCount = 0;
    }
    return this.currentConversation;
  }

  sendMessage(content: string) {
    if (!this.currentConversation || !currentUser) return;

    const newMessage = new Message(
      this.currentConversation.messages.length + 1,
      currentUser.id,
      content,
      new Date()
    );

    this.currentConversation.addMessage(newMessage);
    return newMessage;
  }
}

// Variables globales
let currentUser = null;
const chatApp = new ChatApp();

// DOM Elements
const loginScreen = document.getElementById("loginScreen");
const mainApp = document.getElementById("mainApp");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const conversationsList = document.getElementById("conversationsList");
const messagesContainer = document.getElementById("messagesContainer");
const currentChatName = document.getElementById("currentChatName");
const currentChatStatus = document.getElementById("currentChatStatus");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  // Gestion de la connexion
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // Simulation de vérification des identifiants
    const validCredentials =
      usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "";

    if (validCredentials) {
      // Connexion réussie
      loginError.classList.add("hidden");

      // Créer l'utilisateur actuel (simulation)
      currentUser = new User(
        1,
        usernameInput.value.trim(),
        usernameInput.value.trim(),
        `https://ui-avatars.com/api/?name=${usernameInput.value.trim()}&background=128C7E&color=fff`
      );

      // Afficher l'application principale
      loginScreen.classList.add("hidden");
      mainApp.classList.remove("hidden");

      // Charger les conversations
      loadConversations();
    } else {
      // Afficher une erreur
      loginError.classList.remove("hidden");
    }
  });

  // Gestion de l'envoi de message
  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});

// Charger les conversations
function loadConversations() {
  if (!currentUser) return;

  const conversations = chatApp.getConversationsForUser(currentUser.id);

  conversationsList.innerHTML = "";

  conversations.forEach((conv) => {
    const otherUser = chatApp.getOtherParticipant(conv);
    if (!otherUser) return;

    const lastMessageTime = new Date(conv.lastMessageTime);
    const timeString = lastMessageTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const conversationItem = document.createElement("div");
    conversationItem.className = `p-3 flex items-center hover:bg-gray-50 cursor-pointer chat-list-item ${
      conv.unreadCount > 0 ? "bg-blue-50" : ""
    }`;
    conversationItem.dataset.conversationId = conv.id.toString();
    conversationItem.innerHTML = `
                    <div class="relative flex-shrink-0">
                        <img src="${
                          otherUser.avatar
                        }" class="w-12 h-12 rounded-full">
                        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div class="ml-3 flex-1 min-w-0">
                        <div class="flex justify-between">
                            <h3 class="font-semibold text-gray-900 truncate">${
                              otherUser.name
                            }</h3>
                            <span class="text-xs text-gray-500">${timeString}</span>
                        </div>
                        <div class="flex justify-between">
                            <p class="text-sm text-gray-500 truncate">${
                              conv.lastMessage
                            }</p>
                            ${
                              conv.unreadCount > 0
                                ? `<span class="bg-whatsapp text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">${conv.unreadCount}</span>`
                                : ""
                            }
                        </div>
                    </div>
                `;

    conversationItem.addEventListener("click", () => {
      // Supprimer la classe active de tous les éléments
      document.querySelectorAll(".chat-list-item").forEach((el) => {
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
function loadConversation(conversationId: number) {
  const conversation = chatApp.setCurrentConversation(conversationId);
  if (!conversation || !currentUser) return;

  const otherUser = chatApp.getOtherParticipant(conversation);
  if (!otherUser) return;

  // Mettre à jour l'en-tête de la conversation
  currentChatName.textContent = otherUser.name;
  currentChatStatus.textContent = "En ligne";

  // Afficher les messages
  messagesContainer.innerHTML = "";

  conversation.messages.forEach((message) => {
    const isSender = message.senderId === currentUser.id;
    const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const messageElement = document.createElement("div");
    messageElement.className = `flex ${
      isSender ? "justify-end" : "justify-start"
    } mb-2`;
    messageElement.innerHTML = `
                    <div class="max-w-xs lg:max-w-md">
                        <div class="${
                          isSender
                            ? "bg-whatsapp-light text-white message-sent"
                            : "bg-white text-gray-800 message-received"
                        } p-3 rounded-lg shadow-sm">
                            <p>${message.content}</p>
                        </div>
                        <div class="text-xs text-gray-500 mt-1 ${
                          isSender ? "text-right" : "text-left"
                        }">${messageTime}</div>
                    </div>
                `;

    messagesContainer.appendChild(messageElement);
  });

  // Faire défiler vers le bas
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Envoyer un message
function sendMessage() {
  if (!messageInput.value.trim() || !currentUser) return;

  const content = messageInput.value.trim();

  // Créer et ajouter le message
  const newMessage = chatApp.sendMessage(content);
  if (!newMessage) return;

  // Effacer le champ de saisie
  messageInput.value = "";

  // Mettre à jour l'interface
  if (chatApp.setCurrentConversation) {
    loadConversation(chatApp.setCurrentConversation.id);
  }
}
