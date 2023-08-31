<template>
    <div id="profile-view">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <!-- Navbar code from App.vue here -->
      </nav>
      <div class="container mt-5">
        <h2 class="mb-4">Edit Profile</h2>
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label for="name-input">Uredi korisničko ime</label>
            <input type="text" class="form-control" id="name-input" v-model="name" />
      </div>
          <div>
            <div v-for="photo in photos" :key="photo._id">
              <img :src="resolvedImageUrls[photo._id]" alt="User Photo" />
        <br>
      </div>
      </div>
       <!-- Input for adding new photos -->
    <input type="file" @change="handleFileChange" />
    <button @click="addNewEntry(selectedFile)" class="btn btn-primary">Add Photo</button>
    
          <div class="form-group">
            <label for="equipment-input">uredi svoju opremu</label>
            <textarea class="form-control" id="equipment-input" rows="3" v-model="equipment"></textarea>
          </div>
          <!-- pictures-->
          <div class="form-group" method="post" enctype = "multipart/form-data">
            <input type="file"  v-on:change="event => addNewEntry(event)">
          </div>
          <div class="form-group">
            <picture-input
              ref="pictureInput"
              @change="onChanged"
              @remove="onRemoved"
              :width="200"
              :removable="true"
              removeButtonClass="ui red button"
              :height="200"
              accept="image/jpeg, image/png, image/gif"
              buttonClass="ui button primary"
              :customStrings="{
              upload: '<h1>Upload it!</h1>',
              drag: 'Drag and drop your image here'}">
            </picture-input>
              </div>

            
          <br>

          <button type="submit" class="btn btn-primary">Save</button>
        </form>
        <button @click="addNewEntry($event)" class="btn btn">
            Save changes
          </button>
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import axios from 'axios';
  import store from '../store';
  import PostService from '@/PostService';
  import PictureInput from 'vue-picture-input';
  import FormDataPost from '../upload';
  import { Buffer } from 'buffer';
  
export default {
    name: 'ProfileView',

    components: {
      PictureInput,
    },
    props: {
      userId:String
    },
data() {
      return {
        store,
        name: store.login.name,
        id: store.login._id,
        equipment: localStorage.getItem('equipment') || store.login.equipment,
        photos: localStorage.getItem('photos') || store.login.photos,
        resolvedImageUrls: {},
        user: {},
        selectedFile: null,
        imageURL: '',

      };
    },
    async created() {
      
      this.name = store.login.name;
      this.id = store.login._id;
      this.equipment = store.login.equipment;
      this.photos = store.login.photos;
      authent();
    },

    async mounted() {
      console.log(store.login);
  try {
    console.log("User ID:", this.id);
    const userId = this.id;
    const res = await axios.get(
      `http://localhost:5000/api/posts/${userId}/photos`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Cache-Control': 'no-cache',
        },
      }
    );
    this.photos = res.data;
    console.log(this.photos);

    this.photos.forEach((photo) => {
      this.resolvedImageUrls[photo._id] = `http://localhost:5000/${photo.data}`;
    });
  } catch (err) {
    console.error(err);
  }
},

created() {
  this.user = store.login;
 
},

computed: {
  resolvedImageUrls() {
    const urls = {};
    for (const photo of this.photos) {
      this.getImageUrl(photo).then(url => {
        urls[photo._id] = url;
      });
    }
    return urls;
  }
},

methods: {



async handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      console.log(event.target.files[0]);
    },

    async getImageUrl(photo) {
  try {
   
    if (photo.data) {
      const buffer = Buffer.from(photo.data.data);
      const base64 = buffer.toString('base64');
      console.log(base64);
      return `data:image/png;base64,${base64}`; // Return the direct URL of the image
    }
  } catch (error) {
    console.error('Error fetching image:', error);
  }
  return ''; // Return a default image URL or an empty string
},


  getContentType(photo) {
      return photo.contentType;
    },

  
      //saving changes
async saveChanges() {
        const userId = this.id;
        const photos = this.photos;
        const newName = this.name;
        console.log(name);
      
        const newEquippment = this.equipment;
        //console.log(equipment);
        //console.log(photos);
        //console.log(userId);
        try {
          const res = await axios.patch(
            `http://localhost:5000/api/posts/${userId}`,
            {
              name: newName,
              equipment: newEquippment,
                
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
          );
          // Handle successful update here
          console.log(this.equipment);
        } catch (err) {
          console.error(err);
          // Handle error here
        }
        
        this.name = newName;
        store.login.name = newName;
        store.login.equipment = newEquippment;
        store.login.photos = this.photos;
        //console.log(store.login.equipment);
        localStorage.setItem('name', newName);
        localStorage.setItem('equipment', newEquippment);
        localStorage.setItem('photos', this.photos);

        //console.log(store.login.equipment);
        //console.log(store.login.photos);

      //await this.addNewEntry(userId);

      },

      //images
onChanged(photos) {
  console.log('New picture loaded');
  if (photos) {
    console.log('Picture loaded.', photos);

    localStorage.setItem('photos', photos);
    this.photos = photos;
    console.log(this.photos);

    // Call the addNewEntry method to send the new photo to the server
    this.addNewEntry(photos);
  } else {
    console.log('Old browser. No support for FileReader API');
  }
},

onRemoved() {
        this.photos = '';
      },
      async attemptUpload() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/posts/picture2',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.success) {
        console.log('Image uploaded successfully ✨');
      }
    } catch (err) {
      console.error(err);
    }
  }
},

async addNewEntry(event) {
  try {
    const userId = this.id;
    const file = event;
    console.log(event);

    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    const response = await axios.post(
      `http://localhost:5000/api/posts/add-entry/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      console.log('New entry added successfully');
      // Perform any other actions after adding the entry
    }
  } catch (error) {
    console.error('Error adding new entry:', error);
    // Handle error here
  }
}


    },
  };
</script>

  <style scoped>
  /* Add your styles here */
  </style>
  