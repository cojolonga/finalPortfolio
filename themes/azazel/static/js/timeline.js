document.addEventListener('DOMContentLoaded', function() {
  const timelines = document.querySelectorAll('.timeline-nav');

  timelines.forEach(nav => {
    const container = nav.parentElement;
    const viewer = container.querySelector('#timeline-viewer');
    const caption = container.querySelector('#timeline-caption');
    const buttons = nav.querySelectorAll('button');

    let activeStep = 0;

    function activateStep(index) {
      buttons.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === index);
        btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
      });

      const steps = viewer.querySelectorAll('.timeline-step');
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === index);
      });

      const activeStepEl = steps[index];
      if (activeStepEl) {
        const urlDiv = activeStepEl.querySelector('.timeline-url');
        if (urlDiv) {
          const url = urlDiv.getAttribute('data-url');
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const id = url.includes('youtube.com') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
            urlDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`;
          } else if (url.endsWith('.mp4')) {
            urlDiv.innerHTML = `<video controls><source src="${url}" type="video/mp4"></video>`;
          } else if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.webp')) {
            urlDiv.innerHTML = `<img src="${url}" alt="Paso">`;
          } else {
            urlDiv.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
          }
        }

        if (caption && activeStepEl.hasAttribute('data-caption')) {
          caption.innerHTML = activeStepEl.getAttribute('data-caption');
        }
      }

      activeStep = index;
    }

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        activateStep(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && activeStep > 0) {
        activateStep(activeStep - 1);
      } else if (e.key === 'ArrowRight' && activeStep < buttons.length - 1) {
        activateStep(activeStep + 1);
      }
    });

    // Initial
    activateStep(0);
  });
});
