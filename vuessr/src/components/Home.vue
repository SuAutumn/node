<template>
  <div>Welcome to Vue SSR
    <div>{{time}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      time: new Date()
    }
  }
}
</script>

