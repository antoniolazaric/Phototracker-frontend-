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
     
      <div v-if="user.photos && user.photos.length > 0">
          <div v-for="photo in user.photos" :key="photo._id" class="photo-item">
            <!-- Check if the photo.url is defined before attempting to display it -->
            <img v-if="photo.url" :src="`data:image/jpeg;base64,${toBase64(photo.url.data)}`" width="300" height="300" />
          </div>
        </div>
        
        <!-- Display error message if there are no photos or if there's an error -->
        <p v-else>Photos not available or an error occurred.</p>
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
         photos:[],
         currentPhotoIndex: 0
       }



     },
     async created() {
       try {
        this.users = await PostService.getUsers();
         // Process the user data to ensure photos are in the desired format
      this.users = this.users.map(user => {
        // Check if user.photos is an array and has photos
        if (Array.isArray(user.photos) && user.photos.length > 0) {
          // Map each photo to the desired format
          const photos = user.photos.map(photo => ({
            url: {
              data: photo.data, // Assuming the image data is in a property named 'data'
              type: photo.type, // Assuming the image type is in a property named 'type'
            },
            _id: photo._id, // Include other properties if needed
          }));

          // Return the user object with the updated photos array
          return {
            ...user,
            photos,
          };
        } else {
          // If no photos are available or the format is different, return the user object as is
          return user;
        }
      });
        console.log(this.users);
        
         
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
      

      getPhotoUrl(photoUrl) {
      return `data:${photoUrl.type};base64,${this.toBase64(photoUrl.data)}`;
    },

      toBase64(arr) {
      return btoa(String.fromCharCode(...new Uint8Array(arr)));
    },
       
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