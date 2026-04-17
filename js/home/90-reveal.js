const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.section-header').forEach((element) => {
  element.classList.add('fade-up');
  fadeObserver.observe(element);
});
document.querySelectorAll('.v-card').forEach((element) => fadeObserver.observe(element));
document.querySelectorAll('.news-card').forEach((element) => {
  element.classList.add('fade-up');
  fadeObserver.observe(element);
});
