<template>
  <div>
    <Table
      v-if="showTable"
      :data="users"
      :columns="['name', 'email','phone_no']"
      @editUser="editUser"
      @deleteUser="deleteUser"
      @createUser="createUser"
    />
    <div
      v-if="openPopUp"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 create_user">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? "Edit User" : "Create User" }}
        </h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4 text-left">
            <label for="name" class="block font-bold mb-1">Name:</label>
            <input
              v-model="user.name"
              type="text"
              id="name"
              class="border border-gray-300 rounded-md px-4 py-2 w-full"
              :class="{ 'is-invalid': error.name }"
            />
            <div v-if="error.name" class="invalid-feedback">
              {{ error.name }}
            </div>
          </div>
          <div class="mb-4 text-left">
            <label for="email" class="block font-bold mb-1">Email:</label>
            <input
              v-model="user.email"
              type="email"
              id="email"
              class="border border-gray-300 rounded-md px-4 py-2 w-full"
              :class="{ 'is-invalid': error.email }"
            />
            <div v-if="error.email" class="invalid-feedback">
              {{ error.email }}
            </div>
          </div>
          <div class="mb-4 text-left">
            <label for="password" class="block font-bold mb-1">Phone No:</label>
            <input
              v-model="user.phone_no"
              type="text"
              id="phone_no"
              class="border border-gray-300 rounded-md px-4 py-2 w-full"
              :class="{ 'is-invalid': error.phone_no }"
            />
            <div v-if="error.phone_no" class="invalid-feedback">
              {{ error.phone_no }}
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="cancelUser"
              class="mr-2 px-4 py-2 text-white bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              {{ isEditing ? "Save" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/users";
import { ref, reactive, defineAsyncComponent, onMounted, computed } from "vue";
const Table = defineAsyncComponent(
  () => import("../../components/commanTable.vue")
);

interface User {
  id?: number;
  name: string;
  email: string;
  phone_no: string;
}
const store = useUserStore();
const users = computed(() => store.getUsers);
const userToEdit:any = computed(() => store.getEditUser);
const currentId = ref(store.users ? store.users.length + 1 : 1);
const showTable = ref(true);

const refresh = () => {
  showTable.value = false;
  setTimeout(() => {
    showTable.value = true;
  }, 0);
};


const deleteUser = (id: number) => {
  store.deleteUser(id);
  refresh();
};

const openPopUp = ref(false);
const isEditing = ref(false);
const userId = ref<Number>(0);
const user = ref<User>({
  name: "",
  email: "",
  phone_no: "",
});

const error = reactive({
  name: "",
  email: "",
  phone_no: "",
});

const createUser = () => {
  openPopUp.value = true;
  isEditing.value = false;
};

const editUser = (id: number) => {
  openPopUp.value = true;
  isEditing.value = true;
  store.getUserById(id);
  userId.value = userToEdit.value.id;
 user.value = {
    name: userToEdit.value.name,
    email: userToEdit.value.email,
    phone_no: userToEdit.value.phone_no,
  };
};

const saveUser = () => {
  if (!user.value.name) {
    error.name = "Name is required";
  } else {
    error.name = "";
  }
  if (!user.value.email) {
    error.email = "Email is required";
  } else if (!isValidEmail(user.value.email)) {
    error.email = "Invalid email format";
  } else {
    error.email = "";
  }
  if (!user.value.phone_no) {
    error.phone_no = "Phone No is required";
  } else {
    error.phone_no = "";
  }
  if (!Object.values(error).some((err) => err !== "")) {
    if (isEditing.value) {
      const editUser: User = {
        id: userId.value as number,
        name: user.value.name,
        email: user.value.email,
        phone_no: user.value.phone_no,
      };
      store.updateUser(userId.value as number, editUser);
    } else {
      const newUser: User = {
        id: currentId.value++,
        name: user.value.name,
        email: user.value.email,
        phone_no: user.value.phone_no,
      };
      store.createUser(newUser);
    
    }
    refresh();
    openPopUp.value = false;
  }
  user.value = {
    name: "",
    email: "",
    phone_no: "",
  };
  userId.value = 0;
};

const cancelUser = () => {
  openPopUp.value = false;
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

onMounted(async () => {
  store.fetchUsers();
});
</script>

<style>
.text-left {
  text-align: left;
}
.create_user{
  width: 580px;
}
.fixed {
  position: fixed;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.z-50 {
  z-index: 50;
}
.bg-white {
  background-color: #fff;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.p-6 {
  padding: 1.5rem;
}
.text-xl {
  font-size: 1.25rem;
}
.font-bold {
  font-weight: 700;
}
.mb-4 {
  margin-bottom: 1rem;
}
.block {
  display: block;
}
.border {
  border-width: 1px;
}
.border-gray-300 {
  border-color: #d1d5db;
}
.rounded-md {
  border-radius: 0.375rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.w-full {
  width: 100%;
}
.flex {
  display: flex;
}
.justify-end {
  justify-content: flex-end;
}
.mr-2 {
  margin-right: 0.5rem;
}
.bg-gray-500 {
  background-color: #6b7280;
}
.text-white {
  color: #fff;
}
.bg-blue-500 {
  background-color: #3b82f6;
}

.is-invalid{
  border-color: red;
}

.invalid-feedback{
  color: red;
}
</style>
