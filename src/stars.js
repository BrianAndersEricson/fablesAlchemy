function createStar() {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
  
    if (Math.random() < 0.30) {
      star.classList.add('blue'); // Add the 'blue' class to approximately 30% of the stars
    }

    if (Math.random() < 0.02) {
        star.classList.add('shooting'); // Add the 'shooting' class to approximately 10% of the stars
      }
  
      const minDuration = 8; // Minimum flicker duration (in seconds)
      const maxDuration = 10; // Maximum flicker duration (in seconds)
      const flickerDuration = Math.random() * (maxDuration - minDuration) + minDuration;
      star.style.animationDuration = `${flickerDuration}s`; // Set a random flicker duration for each star
    
    return star;
  }
  
  function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
  
    for (let i = 0; i < 300; i++) {
      const star = createStar();
      starsContainer.appendChild(star);
    }
  
    return starsContainer;
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.wrapper');
    const stars = createStars();
    wrapper.appendChild(stars);
  });
  