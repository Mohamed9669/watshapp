import { Message } from "../models/Message";

export class ChatService {
  private messages: Message[] = [];

  async sendMessage(message: Message): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (!response.ok) throw new Error("Erreur lors de l'envoi du message");
      this.messages.push(message);
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  }

  async getMessages(userId: string): Promise<Message[]> {
    try {
      const response = await fetch(
        `http://localhost:3001/messages?receiverId=${userId}`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des messages");
      const messages = await response.json();
      this.messages = messages;
      return messages;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  }

  async updateMessageStatus(
    messageId: string,
    status: Message["status"]
  ): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:3001/messages/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour du statut");
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  }
}
