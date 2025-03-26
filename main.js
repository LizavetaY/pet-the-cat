document.addEventListener('DOMContentLoaded', function() {
  const content = document.getElementById('content');
  const catContainer = document.getElementById('cat_for_pet');

  const catsImages = ['cat_happy_1', 'cat_happy_2', 'cat_sad_1', 'cat_sad_2', 'cat_sleep_1', 'cat_sleep_2'];
  
  let timer = 100;
  let timerIdApp = null;
  let timerIdCatPetting = null;

  let chosenImageIndex = 0;
  let updateCatImage = 2;

  let isDraggingCatContainer = false;
  let offsetX, offsetY;

  let clientXLast = null;
  let clientYLast = null;
  let clientXNew = null;
  let clientYNew = null;

  timerIdApp = setInterval(() => {
    if (timer <= 0) {
      return clearInterval(timerIdApp);
    }

    updateCatImage -= 1;
    
    if (updateCatImage < 0 && timer > 80) {
      chosenImageIndex = chosenImageIndex === 0 ? 1 : 0;
      catContainer.style.backgroundImage = `url(img/${catsImages[chosenImageIndex]}.png)`;
      content.style.opacity = '1';
      content.style.display = 'flex';
      
      updateCatImage = 2;
    } else if (updateCatImage < 0 && timer > 60) {
      chosenImageIndex = chosenImageIndex < 2 ? 2 : chosenImageIndex;
      chosenImageIndex = chosenImageIndex === 2 ? 3 : 2;
      catContainer.style.backgroundImage = `url(img/${catsImages[chosenImageIndex]}.png)`;
      content.style.opacity = `${(timer - 40) / 40}`;
      content.style.display = 'flex';

      updateCatImage = 2;
    } else if (updateCatImage < 0 && timer > 40) {
      chosenImageIndex =  4;
      catContainer.style.backgroundImage = `url(img/${catsImages[chosenImageIndex]}.png)`;
      content.style.opacity = `${(timer - 40) / 40}`;
      content.style.display = 'flex';

      updateCatImage = 2;
    } else if (updateCatImage < 0 && timer > 20) {
      chosenImageIndex = 5;
      catContainer.style.backgroundImage = `url(img/${catsImages[chosenImageIndex]}.png)`;
      content.style.opacity = '0';
      content.style.display = 'none';

      updateCatImage = 2;
    }
    
    timer -= 1;
  }, 1000);

  catContainer.addEventListener('mousedown', function(e) {
    isDraggingCatContainer = true;

    offsetX = e.clientX - catContainer.getBoundingClientRect().left;
    offsetY = e.clientY - catContainer.getBoundingClientRect().top;
    
    catContainer.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (isDraggingCatContainer) {
      catContainer.style.left = `${e.clientX - offsetX}px`;
      catContainer.style.top = `${e.clientY - offsetY}px`;
    } else {
      const catContainerBorders = catContainer.getBoundingClientRect();
      const isCursorOnCatContainer = e.clientX >= catContainerBorders.left && e.clientX <= catContainerBorders.right && e.clientY >= catContainerBorders.top && e.clientY <= catContainerBorders.bottom;

      if (!clientXLast || !clientYLast) {
        clientXLast = e.clientX;
        clientYLast = e.clientY;
      }

      clientXNew = e.clientX;
      clientYNew = e.clientY;
      
      if (isCursorOnCatContainer) {
        if (!timerIdCatPetting) {
          timerIdCatPetting = setInterval(() => {
            const isCursorMoved = clientXLast !== clientXNew && clientYLast !== clientYNew;

            if (timer >= 100 || !isCursorMoved) {
              return resetCatPetting();
            }
            
            timer += 10;
            clientXLast = clientXNew;
            clientYLast = clientYNew;
          }, 1000);
        }
      } else {
        resetCatPetting();
      }
    }
  });

  document.addEventListener('mouseup', function() {
    isDraggingCatContainer = false;

    catContainer.style.cursor = 'grab';
  });

  function resetCatPetting() {
    clearInterval(timerIdCatPetting);
    timerIdCatPetting = null;

    clientXLast = null;
    clientYLast = null;
    clientXNew = null;
    clientYNew = null;
  }
});