<template>
  <div class="cardimage">
    <h1 style="padding-top: 10px" class="textfont">Najnoviji korisnici</h1>
    <hr />

    <p class="error" v-if="error">{{ error }}</p>

    <div class="posts-container">
      <div class="cardborder" v-for="user in users" :key="user.id">
        <b-card-body style="padding-bottom: 5px">
          <div>Korisnik:</div>
          <b-card-title> {{ user.name }} </b-card-title>
          <hr />

          <div>Oprema:</div>
          <b-card-title> {{ user.equipment }} </b-card-title>
          <hr />
        </b-card-body>

        <div v-if="user.photos && user.photos.length > 0">
          <div v-for="photo in user.photos" :key="photo._id" class="photo-item">
            <img
              class="slike"
              v-if="photo.url && photo.url.data"
              :src="getPhotoUrl(photo.url)"
              width="450"
            />
          </div>
        </div>
        <p v-else>Korisnik još nije dodao svoje fotografije</p>
        <div class="kontakt">
          <hr />
          Kontakt: {{ user.email }}
        </div>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import PostService from "../PostService";

import store from "../store";

var query = new URLSearchParams();

var url = "/challenges/";
query.append("url", url);
// eslint-disable-next-line
url += query.toString();

export const HomeView = {
  name: "HomeView",
};

export default {
  name: "HomeView",
  data() {
    return {
      users: [],
      error: "",
      text: "",
      image: "@/assets/logo.png",
      photos: [],
      currentPhotoIndex: 0,
    };
  },
  async created() {
    try {
      this.users = await PostService.getUsers();
      //console.log("Received users data:", this.users);
    } catch (err) {
      this.error = err.message;
    }
  },

  computed: {
    currentPhoto() {
      return this.user.photos[this.currentPhotoIndex];
    },
  },

  methods: {
    getPhotoUrl(photoUrl) {
      if (photoUrl && photoUrl.data) {
        return `data:${photoUrl.type};base64,${this.toBase64(photoUrl.data)}`;
      } else {
        return ""; // Return an empty string if the data is not available
      }
    },

    toBase64(arr) {
      try {
        return btoa(String.fromCharCode(...new Uint8Array(arr)));
      } catch (error) {
        console.error("Error converting to base64:", error);
        return ""; // Return an empty string in case of an error
      }
    },

    async putsore(id) {
      store.post = id;
    },
  },

  previousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    }
  },
  nextPhoto() {
    if (this.currentPhotoIndex < this.users.length - 1) {
      this.currentPhotoIndex++;
    }
  },

  components: {},
};
</script>
<style scoped>
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
  display: block;
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
.photo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.photo-item {
  position: relative;
  text-align: center;
}
.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.arrow-button:hover {
  background-color: #0056b3;
}

.kontakt {
  text-align: center;
  padding-inline: 30px;
  height: 50px;
}
</style>
