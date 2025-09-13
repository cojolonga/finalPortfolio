document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.slider-container');

  sliders.forEach(container => {
    const slider = container.querySelector('.slider');
    const beforeImg = slider.querySelector('.before');
    const afterImg = slider.querySelector('.after');
    const handle = container.querySelector('.slider-handle');

    let isDragging = false;

    function updateClip(percent) {
      afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
    }

    function getPercent(e) {
      const rect = slider.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const percent = (x / rect.width) * 100;
      return Math.max(0, Math.min(100, percent));
    }

    handle.addEventListener('mousedown', () => {
      isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateClip(getPercent(e));
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        updateClip(getPercent(e));
      }
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Initial position
    updateClip(50);
  });
});
