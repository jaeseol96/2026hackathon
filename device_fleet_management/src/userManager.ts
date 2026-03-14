export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export class UserManager {
    private users: Map<string, User>;
    private count: number;

    constructor() {
        this.users = new Map<string,User>();
        this.count = 0;
    }

    addUser(user: User): void {
        if (!user || !user.id || user.id.trim() === '') {
            throw new Error("User must have an id");
        } else if (this.users.has(user.id)) {
            throw new Error(`User with id ${user.id} already exists`);
        }

        this.users.set(user.id, user);
        this.count ++;
    }

    removeUser(id: string): void {
        if (id.trim() === '') {
            throw new Error("User must have an id");

        } else if (!this.users.has(id)) {
            throw new Error(`User with id ${id} not found`);
        }

        this.users.delete(id);
        this.count --;
    }

    getUser(id: string): User | null {
      return this.users.get(id) ?? null;
    }

    getUsersByEmail(email: string): User[] | null {
        const matches = Array.from(this.users.values()).filter((u) => u.email === email);
        return matches.length ? matches : [];
    }

    getUsersByPhone(phone: string): User[] | null {
        const matches = Array.from(this.users.values()).filter((u) => u.phone === phone);
        return matches.length ? matches : [];
    }

    getAllUsers(): User[] {
        return [...this.users.values()];
    }

    getUserCount(): number {
        return this.count;
    }
}
