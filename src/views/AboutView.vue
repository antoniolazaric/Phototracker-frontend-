<template>
  <body>
    <div class="container">
      <div class="row">
        <div class="col">
          <img class="slika" src="@/assets/about.png" alt="" />
        </div>
        <div class="text">Nađite fotografa <br />za svaku priliku</div>
      </div>
      <a href="/">
        <button href="/" class="centered-button">Započni potragu</button></a
      >
    </div>
  </body>
</template>
<style>
.container {
}

img {
  max-width: 100%;
  height: auto;
}

.button-container {
  display: flex;
  align-items: center;
}

.slika {
  padding-top: 100px;
  width: 500px;
}

.text {
  padding-top: 185px;
  padding-right: 50px;
  font-size: 40px;
  text-align: center;
  font-family: fantasy;
}
.centered-button {
  margin-inline: 475px;
  margin-top: 50px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: orange;
  border-width: 0;
  border-radius: 55px;
}
</style>
