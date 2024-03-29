<template>
  <div id="profile-view">
    <div class="container mt-5">
      <h2 class="mb-4">Edit Profile</h2>
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label for="name-input">Uredi korisničko ime</label>
          <input
            type="text"
            class="form-control"
            id="name-input"
            v-model="name"
          />
        </div>

        <div class="photo-gallery">
          <div v-for="photo in photos" :key="photo._id" class="photo-item">
            <img
              :src="`data:image/jpeg;base64,${toBase64(photo.url.data)}`"
              width="300"
            />
            <button @click="deleteImage(photo._id)" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>

        <!-- Input for adding new photos -->
        <input type="file" @change="handleFileChange" />
        <button @click="addNewEntry(selectedFile)" class="btn btn-primary">
          Add Photo
        </button>

        <div class="form-group">
          <label for="equipment-input">uredi svoju opremu</label>
          <textarea
            class="form-control"
            id="equipment-input"
            rows="3"
            v-model="equipment"
          ></textarea>
        </div>
        <!-- pictures-->

        <br />

        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import store from "../store";
import PostService from "@/PostService";
import PictureInput from "vue-picture-input";
import FormDataPost from "../upload";
import { Buffer } from "buffer";

export default {
  name: "ProfileView",

  components: {
    PictureInput,
  },
  props: {
    userId: String,
  },

  data() {
    return {
      store,
      name: localStorage.getItem("name") || store.login.name,
      id: store.login._id,
      equipment: localStorage.getItem("equipment") || store.login.equipment,
      photos: localStorage.getItem("photos") || store.login.photos,
      resolvedImageUrls: {},
      user: {},
      selectedFile: null,
      imageURL: "",
      data: [],
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
    try {
      console.log("User ID:", this.id);
      const userId = this.id;
      const res = await axios.get(
        `https://phototracker-backend.onrender.com/api/posts/${userId}/photos`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      this.photos = res.data;
      console.log(this.photos);

      this.photos.forEach((photo) => {
        this.resolvedImageUrls[
          photo._id
        ] = `https://phototracker-backend.onrender.com/${photo.data}`;
      });
    } catch (err) {
      console.error(err);
    }
  },

  created() {
    this.user = store.login;
  },

  computed: {},

  methods: {
    toBase64(arr) {
      return btoa(String.fromCharCode(...new Uint8Array(arr)));
    },

    async handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      console.log(event.target.files[0]);
    },

    async getImageUrl(photo) {
      console.log(photo);
      try {
        if (photo.data) {
          const buffer = Buffer.from(photo.data);
          const base64 = buffer.toString("base64");
          console.log(base64);
          return `data:image/png;base64,${base64}`; // Return the direct URL of the image
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
      return ""; // Return a default image URL or an empty string
    },

    getContentType(photo) {
      return photo.contentType;
    },

    //saving changes
    async saveChanges() {
      const userId = this.id;
      const photos = this.photos;
      const newName = this.name;

      const newEquippment = this.equipment;
      try {
        const res = await axios.patch(
          `https://phototracker-backend.onrender.com/api/posts/${userId}`,
          {
            name: newName,
            equipment: newEquippment,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );

        console.log("Success");
      } catch (err) {
        console.error(err);
        // Handle error here
      }

      this.name = newName;
      store.login.name = newName;
      store.login.equipment = newEquippment;
      store.login.photos = this.photos;
      localStorage.setItem("name", newName);
      localStorage.setItem("equipment", newEquippment);
      localStorage.setItem("photos", this.photos);
    },

    //images
    onChanged(photos) {
      console.log("New picture loaded");
      if (photos) {
        console.log("Picture loaded.", photos);

        localStorage.setItem("photos", photos);
        this.photos = photos;
        console.log(this.photos);

        // Call the addNewEntry method to send the new photo to the server
        this.addNewEntry(photos);
      } else {
        console.log("Old browser. No support for FileReader API");
      }
    },

    onRemoved() {
      this.photos = "";
    },
    async attemptUpload() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append("image", this.selectedFile);
        try {
          const res = await axios.post(
            "https://phototracker-backend.onrender.com/api/posts/picture2",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (res.data.success) {
            console.log("Image uploaded successfully ✨");
          }
        } catch (err) {
          console.error(err);
        }
      }
    },

    //DELETE
    async deleteImage(imageId) {
      try {
        const userId = this.id;
        const response = await axios.delete(
          `https://phototracker-backend.onrender.com/api/posts/${userId}/photos/${imageId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );

        if (response.data.success) {
          // If the image deletion was successful, update the local state to remove the deleted image
          this.photos = this.photos.filter((photo) => photo._id !== imageId);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        // Handle error here
      }
    },

    async addNewEntry(event) {
      try {
        const userId = this.id;
        const file = event;
        console.log(event);

        if (!file) {
          console.log("No file selected");
          return;
        }

        const formData = new FormData();
        formData.append("image", this.selectedFile);

        const response = await axios.post(
          `https://phototracker-backend.onrender.com/api/posts/add-entry/${userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          console.log("New entry added successfully");
          // Perform any other actions after adding the entry
        }
      } catch (error) {
        console.error("Error adding new entry:", error);
        // Handle error here
      }
    },
  },
};
</script>

<style>
.photo-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #f0f0f0; /* Set your desired backdrop color */
  padding: 10px;
  border-radius: 5px;
}

.photo-item {
  flex: 0 0 calc(33.33% - 10px); /* Adjust the width of each image item as per your layout */
  max-width: calc(33.33% - 10px);
}

.photo-item img {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
}
/* Add your styles here */
</style>
