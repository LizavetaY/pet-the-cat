document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle');
  const switcher = document.getElementById('switcher');
  const contentMain = document.getElementById('content-main');

  let timerIdToggleSwitcher;
  let timerIdCheckIfToggleActive = null;
  let timerIdRevertToggle = null;

  let isDragging = false;
  let isActive = false;

  const switcherTranslateXPadding = 4;
  let switcherTranslateXValue = 100 - switcherTranslateXPadding;
  let switcherFallSpeed = 0;

  toggle.addEventListener('mousedown', () => {
    isDragging = true;
    resetRevertToggleTimer();

    toggle.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    resetRevertToggleTimer();

    const { deltaY, clampedAngle } = getToggleCoordinatedData(event);

    switcherFallSpeed = Math.abs(clampedAngle) / 90;

    toggle.style.transform = `rotate(${clampedAngle}deg)`;

    if (deltaY > 0 && !isActive) {
      isActive = true;
      clearInterval(timerIdToggleSwitcher);

      timerIdToggleSwitcher = setInterval(increaseSwitcher, 100);
    } else if (deltaY < 0 && isActive) {
      isActive = false;
      clearInterval(timerIdToggleSwitcher);

      timerIdToggleSwitcher = setInterval(decreaseSwitcher, 100);
    }
  });

  document.addEventListener('mouseup', (event) => {
    isDragging = false;
    toggle.style.cursor = 'grab';

    let { deltaY, clampedAngle } = getToggleCoordinatedData(event);

    if (deltaY > 0 && isActive) {
      if (!timerIdCheckIfToggleActive) {
        timerIdCheckIfToggleActive = setInterval(() => {
          if (switcherTranslateXValue > 5 || timerIdRevertToggle) return;

          timerIdRevertToggle = setTimeout(() => revertToggle(clampedAngle), 5000);
        }, 1000);
      }
    }
  });

  function getToggleCoordinatedData(event) {
    const toggleBorders = toggle.getBoundingClientRect();
    const toggleCenterX = toggleBorders.left + toggleBorders.width / 2;
    const toggleCenterY = toggleBorders.top + toggleBorders.height / 2;

    const toggleDeltaX = event.clientX - toggleCenterX;
    const toggleDeltaY = event.clientY - toggleCenterY;
    const toggleAngle = Math.atan2(toggleDeltaY, toggleDeltaX) * (180 / Math.PI);

    const clampedToggleAngle = Math.max(-90, Math.min(90, toggleAngle));

    return {
      deltaY: toggleDeltaY,
      clampedAngle: clampedToggleAngle,
    };
  }

  function increaseSwitcher() {
    if (switcherTranslateXValue <= switcherTranslateXPadding) {
      clearInterval(timerIdToggleSwitcher);
      return;
    }

    switcherTranslateXValue -= (1 + switcherFallSpeed);

    switcher.style.right = `${switcherTranslateXValue}%`;
    switcher.style.transform = `translate(${switcherTranslateXValue}%, -50%)`;

    if (switcherTranslateXValue <= 5) {
      switcher.classList.add('active');
      contentMain.classList.remove('hidden');
    }
  }

  function decreaseSwitcher() {
    if (switcherTranslateXValue >= (100 - switcherTranslateXPadding)) {
      clearInterval(timerIdToggleSwitcher);
      return;
    }

    switcherTranslateXValue += (1 + switcherFallSpeed);

    switcher.style.right = `${switcherTranslateXValue}%`;
    switcher.style.transform = `translate(${switcherTranslateXValue}%, -50%)`;

    if (switcherTranslateXValue > 5) {
      switcher.classList.remove('active');
      contentMain.classList.add('hidden');
    }
  }

  function revertToggle(clampedAngle) {
    clearInterval(timerIdCheckIfToggleActive);
    timerIdCheckIfToggleActive = null;

    if (!switcher.classList.contains('active')) return;

    isActive = false;

    timerIdToggleSwitcher = setInterval(() => {
      if (switcherTranslateXValue >= (100 - switcherTranslateXPadding) && clampedAngle <= -90) {
        clearInterval(timerIdToggleSwitcher);
        resetRevertToggleTimer();
        return;
      }

      switcherFallSpeed = Math.abs(clampedAngle) / 90;

      if (clampedAngle <= 0 && switcherTranslateXValue < (100 - switcherTranslateXPadding)) {
        switcherTranslateXValue += (1 + switcherFallSpeed);

        switcher.style.right = `${switcherTranslateXValue}%`;
        switcher.style.transform = `translate(${switcherTranslateXValue}%, -50%)`;
      }

      if (clampedAngle > -90) {
        clampedAngle -= 1;

        toggle.style.transform = `rotate(${clampedAngle}deg)`;
      }

      if (switcherTranslateXValue > 5) {
        switcher.classList.remove('active');
        contentMain.classList.add('hidden');
      }
    }, 100);
  }

  function resetRevertToggleTimer() {
    if (!timerIdRevertToggle) return;

    clearTimeout(timerIdRevertToggle);
    timerIdRevertToggle = null;
  }
});