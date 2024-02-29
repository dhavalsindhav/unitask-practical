import { defineStore } from "pinia";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : [],
    editUser: [],
  }),
  getters: {
    getUsers(): any[] {
      return this.users;
    },
    getEditUser(): any[] {
      return this.editUser;
    },
  },

  actions: {
    async fetchUsers() {
      const users = localStorage.getItem("user");
      if (users) {
        this.users = JSON.parse(users);
      }
    },
    async createUser(data: any) {
      this.users.push(data);
      localStorage.setItem("user", JSON.stringify(this.users));
    },
    async getUserById(id: number) {
      this.editUser = this.users.find((user: any) => user.id === id);
    },
    async updateUser(id: number, data: any) {
      const userIndex: number = this.users.findIndex(
        (user: any) => user.id === id
      );
      this.users[userIndex] = data;
      localStorage.setItem("user", JSON.stringify(this.users));
    },
    async deleteUser(id: number) {
      console.log("delete user", id);
      let promise = new Promise((resolve, reject) => {
        let index = this.users.findIndex((user: any) => user.id === id);
        this.users.splice(index, 1);
        if (this.users.length === 0) {
          localStorage.removeItem("user");
          const error = new Error("No user found");
          reject(error);
        }
        resolve(this.users);
      });
      promise
        .then((value) => {
          localStorage.setItem("user", JSON.stringify(value));
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
