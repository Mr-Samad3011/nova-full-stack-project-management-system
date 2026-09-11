import React from "react";

import Hero from "../Hero";
 import About from "../About"; 
 import Features from "../Features";
  import OurGoals from "../OurGoals"; 
  import Contact from "../Contact";

const Home = () => {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section id="home">
        <Hero />
      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section id="about">
        <About />
      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section id="features">
        <Features />
      </section>


      {/* =====================================================
          OUR GOALS
      ===================================================== */}

      <section id="goals">
        <OurGoals />
      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section id="contact">
        <Contact />
      </section>

    </main>
  );
};

export default Home;