<template>
    <div class = "cardimage">
   
      <h1 class="textfont"> Latest Users </h1>
      <hr>
      
      <p class = "error" v-if= "error" > {{error}} </p>
      
     <div class = "posts-container">
      
       <div class = "cardborder"
       v-for="user in users" :key="user.id">
      <b-card-body>
      <b-card-title>{{ user.name }}</b-card-title>
      <hr>
      <b-card-text>
        Some quick example text to build on the card title and make up the bulk of the card's
        content.
      </b-card-text>
      <hr>
      {{ typeof user.equipment === 'string' ? user.equipment.replace(/[\[\]]/g, '') : user.equipment }}    </b-card-body>
      Contact: {{ user.email }}
      
      </div>
      <br>
      </div>
  </div>

   </template>
   <script>
   // @ is an alias to /src
   import PostService from '../PostService';
  
   import store from '../store';
   
   
   
   var query = new URLSearchParams();
   
   var url = "/challenges/"
   query.append("url", url);
   // eslint-disable-next-line
   url += query.toString();
   
   
   export default {
     name: 'HomeView',
     data() {
       return {
         users: [],
         error: '',
         text: '',
         image: "@/assets/logo.png",
        
         currentPhotoIndex: 0
       }



     },
     async created() {
       try {
        this.users = await PostService.getUsers();
         
       } catch (err) {
         this.error = err.message;
       }
     },

     computed: {
    currentPhoto() {
      return this.user.photos[this.currentPhotoIndex]
    }
  },

     methods: {
       
       async putsore(id) {
         store.post = id;
     },
     },

     previousPhoto() {
      if (this.currentPhotoIndex === 0) {
        this.currentPhotoIndex = this.user.photos.length - 1
      } else {
        this.currentPhotoIndex--
      }
    },
    nextPhoto() {
      if (this.currentPhotoIndex === this.user.photos.length - 1) {
        this.currentPhotoIndex = 0
      } else {
        this.currentPhotoIndex++
      }
    },

    components: {
  
    }
  }
   
   
   </script>
   <style>
     .cardimage {
    
     height: 80%;
    -webkit-background-size: cover;
     -moz-background-size: cover;
     -o-background-size: cover;
     background-size: cover;
     }
     .cardborder {
      border: 2px solid #808080;
     border-radius: 0px;
     outline: none;
     outline-offset: 9px;
     margin: 50px auto 50px auto;
     display:block;
     max-width: 50%;
         }
     .textfont {
       
   font-family: "Courier New", Courier, monospace;
   font-size: 16px;
   letter-spacing: 0px;
   word-spacing: 2px;
   color: #000000;
   font-weight: 700;
   
   font-style: normal;
   font-variant: normal;
   text-transform: none;
     }
     .card-header img {
   margin-right: 10px;
      }
      hr {
  border-color: #808080;
  border-width: 2px;
}
   </style>