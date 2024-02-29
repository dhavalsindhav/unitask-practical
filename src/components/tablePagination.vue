<template>
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" v-if="totalResults!=0">
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{  startIndex  }}</span>
            to
            <span class="font-medium">{{ endIndex }}</span>
            of
            <span class="font-medium">{{ totalResults }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a
              href="#"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              @click="previousPage"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              v-for="page in totalPages"
              :key="page"
              href="#"
              :class="[
                'relative', 'z-10', 'inline-flex', 'items-center', 'px-4', 'py-2', 'text-sm', 'font-semibold', 'text-gray-900', 'ring-1', 'ring-inset', 'ring-gray-300', 'hover:bg-gray-50', 'focus:z-20', 'focus:outline-offset-0',
                { 'bg-indigo-600': page === currentPage }
              ]"
              @click="goToPage(page)"
            >
              {{ page }}
            </a>
            <a
              href="#"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              @click="nextPage"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref, computed } from 'vue';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';
  const props = defineProps<{
    totalResults: number;
    currentPage: number;
    pageSize: number;
  }>();

    const emit = defineEmits(['pageChanged']);
  
  const startIndex = computed(() => (props.currentPage - 1) * props.pageSize + 1);
  const endIndex = computed(() => Math.min(props.currentPage * props.pageSize, props.totalResults));
  const totalPages = computed(() => Math.ceil(props.totalResults / props.pageSize));
  
  function previousPage() {
    if (props.currentPage > 1) {
      emitPageChanged(props.currentPage - 1);
    }
  }
  
  function nextPage() {
    if (props.currentPage < totalPages.value) {
      emitPageChanged(props.currentPage + 1);
    }
  }
  
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      emitPageChanged(page);
    }
  }
  
  function emitPageChanged(page: number) {
    emit("pageChanged", page);
  }
  </script>
  