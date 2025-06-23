import { Message } from "../models/Message";

export class MessageBox {
  private container: HTMLElement;
  private messages: Message[] = [];
  private currentUserId: string;

  constructor(containerId: string, currentUserId: string) {
    const element = document.getElementById(containerId);
    if (!element) throw new Error("Container not found");
    this.container = element;
    this.currentUserId = currentUserId;
  }

  public updateMessages(messages: Message[]): void {
    this.messages = messages;
    this.render();
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
    this.render();
    this.scrollToBottom();
  }

  private render(): void {
    this.container.innerHTML = "";
    this.messages.forEach((message) => {
      const messageElement = document.createElement("div");
      const isOwnMessage = message.senderId === this.currentUserId;
      messageElement.className = `message ${
        isOwnMessage ? "message-own" : "message-other"
      }`;

      messageElement.innerHTML = `
                <div class="message-content">
                    <p>${message.content}</p>
                    <span class="message-time">${new Date(
                      message.timestamp
                    ).toLocaleTimeString()}</span>
                    ${
                      isOwnMessage
                        ? `<span class="message-status status-${message.status}"></span>`
                        : ""
                    }
                </div>
            `;
      this.container.appendChild(messageElement);
    });
  }

  private scrollToBottom(): void {
    this.container.scrollTop = this.container.scrollHeight;
  }

  public setupMessageInput(
    inputId: string,
    onSend: (content: string) => void
  ): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) throw new Error("Input element not found");

    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && !event.shiftKey && input.value.trim()) {
        event.preventDefault();
        onSend(input.value.trim());
        input.value = "";
      }
    });
  }
}
