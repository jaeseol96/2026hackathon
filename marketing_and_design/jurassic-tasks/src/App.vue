<template>
  <div id="app">
    <header class="site-header">
      <div class="logo">
        <img src="/icons.svg" alt="Jurassic Tasks logo" class="logo-icon" />
      </div>
    </header>

    <main class="main">
      <section class="hero" id="home">
        <div class="hero-inner">
          <h1>Projects that roar into action.</h1>
          <p>
            Jurassic Tasks helps track task progression in a fun and engaging
            way.
          </p>
        </div>
      </section>

      <section class="features" id="features">
        <h2>Why teams love Jurassic Tasks</h2>
        <div class="feature-grid">
          <div class="feature">
            <h3>Real Incentive</h3>
            <p>
              Just like tamagotchi, your pet dinosaurs grow and thrive as you
              complete tasks. If you miss to many deadlines, they might go
              extinct!
            </p>
          </div>
          <div class="feature">
            <h3>Anyone can use it</h3>
            <p>
              Whether you are a one person startup or a large enterprise,
              Jurassic Tasks has a plan that fits all your needs.
            </p>
          </div>
          <div class="feature">
            <h3>Built for humans</h3>
            <p>
              Simple, delightful UI that keeps you moving and reduces noise.
            </p>
          </div>
        </div>
      </section>

      <section class="how-it-works" id="how-it-works">
        <h2>How it works</h2>
        <p>
          Jurassic Task is a productivity app with a very simple idea: each
          member of your team gets a pet dinosaur that grows as they complete
          tasks. The more tasks you complete, the bigger and happier your
          dinosaur gets and the more cosmetics you unock. If you miss too many
          deadlines, your dinosaur might go extinct!
        </p>
      </section>
    </main>

    <footer class="site-footer" id="contact">
      <p>
        © {{ new Date().getFullYear() }} Jurassic Tasks · Built for Taiv
        Hackathon
      </p>
    </footer>
  </div>
</template>
