<template>
  <div>
    <div class="text-h3">{{ keywords }}下的{{ type }}</div>
  </div>
</template>

<script>
export default {
  name: 'SearchDetail',
  props: ['keywords', 'type'],
}
</script>
