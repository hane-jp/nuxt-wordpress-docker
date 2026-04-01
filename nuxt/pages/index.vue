
<template>
  <main class="home">
    <div class="container">
      <p class="eyebrow">Nuxt + WordPress + Docker</p>
      <h1>Headless CMS Starter</h1>

      <p class="lead">
        A simple starter template for building a Nuxt frontend with a WordPress backend using Docker.
      </p>

      <ul class="links">
        <li>
          <a href="http://localhost:3000" target="_blank" rel="noreferrer">
            Open Nuxt App
          </a>
        </li>
        <li>
          <a href="http://localhost:8080" target="_blank" rel="noreferrer">
            Open WordPress Admin
          </a>
        </li>
        <li>
          <a href="http://localhost:8080/wp-json" target="_blank" rel="noreferrer">
            WordPress REST API
          </a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 20px;
}

.container {
  max-width: 720px;
  width: 100%;
}

.eyebrow {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 12px 0 16px;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.lead {
  font-size: 1.125rem;
  line-height: 1.7;
}

.links {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.links a {
  text-decoration: none;
  font-weight: 600;
}
</style>
