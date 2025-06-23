import { Message } from "./models/Message";
// Remove or create User model if needed
import { ChatService } from "./services/ChatService";
import { UserService } from "./services/UserService";

// Initialisation des services
const chatService = new ChatService();
const userService = new UserService();

// Point d'entrée de l'application
document.addEventListener("DOMContentLoaded", () => {
  // Initialisation de l'application
  console.log("Application WhatsApp démarrée");
});
