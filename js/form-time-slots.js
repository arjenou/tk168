window.TK168FormTimeSlots = (() => {
  const START_MINUTES = 9 * 60 + 30;
  const END_MINUTES = 18 * 60 + 30;
  const STEP_MINUTES = 30;
  const DEFAULT_TIME = '13:00';

  function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  function getSlots() {
    const slots = [];
    for (let minutes = START_MINUTES; minutes <= END_MINUTES; minutes += STEP_MINUTES) {
      slots.push(formatMinutes(minutes));
    }
    return slots;
  }

  const SLOTS = getSlots();

  function populateSelect(select, { preserveValue = true } = {}) {
    if (!select) return;

    const placeholder = select.querySelector('option[value=""]');
    const placeholderMarkup = placeholder ? placeholder.outerHTML : '<option value=""></option>';
    const currentValue = preserveValue ? select.value : '';

    select.innerHTML = placeholderMarkup;
    SLOTS.forEach((slot) => {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      select.appendChild(option);
    });

    if (currentValue && SLOTS.includes(currentValue)) {
      select.value = currentValue;
    }
  }

  function populateAll(root = document) {
    root.querySelectorAll('[data-time-slot-select]').forEach((select) => {
      populateSelect(select);
    });
  }

  function bootstrap() {
    populateAll();
  }

  bootstrap();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  }

  return {
    SLOTS,
    DEFAULT_TIME,
    populateSelect,
    populateAll
  };
})();
