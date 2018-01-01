<template>
  <div>
    home image
    <img :src="src" alt="pic">
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return { src: ''}
  },
  created () {
    console.log('creted')
    this.getSrc()
  },
  methods: {
    getSrc () {
      axios.get('http://localhost:3000/api/v1/image')
        .then(res => {
          this.src = res.data.src
        })
        .catch(err => {
          console.log(JSON.stringify(err))
        })
    }
  }
}
</script>

