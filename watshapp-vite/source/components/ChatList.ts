import { User } from "../models/User";
import { Message } from "../models/Message";

export class ChatList {
  private container: HTMLElement;
  private users: User[] = [];
  private lastMessages: Map<string, Message> = new Map();

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) throw new Error("Container not found");
    this.container = element;
  }

  public updateUsers(users: User[]): void {
    this.users = users;
    this.render();
  }

  public updateLastMessage(userId: string, message: Message): void {
    this.lastMessages.set(userId, message);
    this.render();
  }

  private render(): void {
    this.container.innerHTML = "";
    this.users.forEach((user) => {
      const lastMessage = this.lastMessages.get(user.id);
      const chatItem = document.createElement("div");
      chatItem.className = "chat-item";
      chatItem.innerHTML = `
                <div class="user-avatar">
                    <img src="${user.avatar || "default-avatar.png"}" alt="${
        user.username
      }">
                    <span class="status-${user.status}"></span>
                </div>
                <div class="chat-info">
                    <h3>${user.username}</h3>
                    <p>${lastMessage?.content || "Aucun message"}</p>
                </div>
                <div class="chat-meta">
                    <span class="time">${
                      lastMessage
                        ? new Date(lastMessage.timestamp).toLocaleTimeString()
                        : ""
                    }</span>
                </div>
            `;
      this.container.appendChild(chatItem);
    });
  }
}
