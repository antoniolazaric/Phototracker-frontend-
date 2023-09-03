<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-title">
        <a class = "nav-link" href = "/home" >Phototracker </a>
      </div>
      <div class="nav-links">
        <a class = "nav-link" href = "/"> Home </a>
        <a v-if = "isLoggedIn ===false" class = "nav-link" v-on:click= "authent" href = "/login" >Log In </a>
        <a v-if = "isLoggedIn ===false" class = "nav-link" href = "/register" > SignUp </a>
        <a v-if = "isLoggedIn ===false" class = "nav-link" href = "/profile" > Profile </a>
         
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
/* eslint-disable */
import { HomeView } from '@/views/HomeView.vue';
import axios from 'axios';
import store from '../src/store';
import PostService from '@/PostService';


export default {
  name: 'App',
  components: {
    HomeView,
  },

data() {
  return{
    login: [],
    isLoggedIn: false,
    isAdmin: false
}},

methods: {

  async authent() {
  try {
    let res = await axios.get('https://localhost:5000//user/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    });

    let data = res.data;
    this.login = data;

    localStorage.setItem('isAdmin', data.isAdmin);

    store.login = res.data;
    this.isLoggedIn = true; // Set isLoggedIn to true if the user is authenticated
  } catch (err) {
    console.error(err);
    this.isLoggedIn = false; // Set isLoggedIn to false if there is an error
  }
},

async check() {
  if (authent() == true){ isLoggedIn = "true"
  console.log("logged in!")}
  else{ isLoggedIn = "false";
  console.log("notloggedin");}
},
async checkIfLoggedIn() {
  try {
   
    this.isLoggedIn = toLowerCase(localStorage.getItem("isLoggedIn"));
  } catch (error) {
    
  }

},
},
mounted() {
//this.check();
PostService.authent();
this.authent;
this.checkIfLoggedIn();
},
};



</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo img {
  max-width: 100px; /* Adjust the size as needed */
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: black;
  font-weight: bold;
  transition: color 0.3s;
}

.nav-title {
  text-align: left; /* This will take up the available space and push other items to the right */
}

.phototracker {
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 18px; /* Adjust the size as needed */
}

.nav-links a:hover {
  color: #333; /* Darken the color on hover */
}
</style>
