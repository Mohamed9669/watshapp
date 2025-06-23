import { User } from "../models/User";

export class UserService {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch("http://localhost:3001/users");
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des utilisateurs");
      const users = await response.json();
      this.users = users;
      return users;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  }

  async updateUserStatus(
    userId: string,
    status: User["status"]
  ): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour du statut");
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      return await response.json();
    } catch (error) {
      console.error("Erreur:", error);
      return null;
    }
  }
}
