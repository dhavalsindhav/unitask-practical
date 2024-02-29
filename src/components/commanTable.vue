<template>
  <div>
    <div class="w-full mt-4 table_topbar">
      <div>
        <input
          v-model="searchQuery"
          placeholder="Search users"
          class="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <button
          @click="$emit('createUser')"
          class="px-4 py-2 ml-2 text-white bg-blue-500 rounded-md"
        >
          Create User
        </button>
      </div>
    </div>

    <table class="w-full mt-4 bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="px-4 py-2 bg-gray-800 text-white">Sr.</th>
          <th v-for="column in columns" :key="column" class="px-4 py-2 bg-gray-800 text-white">
            {{ column.toUpperCase() }}
          </th>
          <th class="px-4 py-2 bg-gray-800 text-white">Actions</th>
        </tr>
      </thead>
      <tbody v-if="(searchQuery ? filteredData : data).length != 0">
        <tr v-for="(row, index) in paginatedData" :key="index" :class="index % 2 === 0 ? 'bg-gray-100' : ''">
          <td class="px-4 py-2 border-b">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td v-for="column in columns" :key="column" class="px-4 py-2 border-b">{{ row[column] }}</td>
          <td class="px-4 py-2 border-b">
            <button class="px-4 py-2 ml-2 edit-btn bg-green-500 text-white" @click="$emit('editUser', row.id)">
              Edit
            </button>
            <button class="px-4 py-2 ml-2 delete-btn bg-red-500 text-white" @click="$emit('deleteUser', row.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="px-4 py-2 border-b" :colspan="columns.length + 2">No data found</td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :totalResults="(searchQuery ? filteredData : data).length"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @pageChanged="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
import Pagination from './tablePagination.vue';
interface RowData {
  id: number;
  name: string;
  email: string;
  phone_no: string;
}

const props = defineProps<{
  data: RowData[];
  columns: (keyof RowData)[];
}>();

const data = computed<RowData[]>(() => props.data);

const searchQuery = ref('');
const filteredData = ref<RowData[]>([]);
const currentPage = ref(1);
const pageSize = 2;

const onSearch = () => {
  currentPage.value = 1;
  filteredData.value = data.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};
watch(searchQuery, onSearch);


const paginatedData = ref<RowData[]>([]);
const paginateData = () => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = currentPage.value * pageSize;
  paginatedData.value = filteredData.value.slice(startIndex, endIndex);
};
watch(currentPage, paginateData);
watch(filteredData, paginateData);

const changePage = (newPage: number) => {
  currentPage.value = newPage;
};

onSearch();
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}
table {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}
th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background-color: #333;
  color: #fff;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
tr:hover {
  background-color: #ddd;
}

.edit-btn,
.delete-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
.delete-btn {
  background-color: #f44336;
}

.table_topbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 0;
}
</style>
