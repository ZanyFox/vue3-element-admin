<template>
   <div>
      <i-frame v-model:src="url"></i-frame>
   </div>
</template>

<script setup>
import iFrame from '@/components/IFrame/IFrame.vue'

import { ref } from 'vue';

const url = ref(import.meta.env.VITE_APP_BASE_API + '/druid/login.html');
</script>
