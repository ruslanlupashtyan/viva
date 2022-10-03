//MOBILE MENU
function toggle_class(element, class_name) {
  if (element.classList.contains(class_name)) {
      element.classList.remove(class_name);
  }   else {
      element.classList.add(class_name);
  }
}
document.querySelector('#hamburger').addEventListener('click', function(){
  toggle_class(document.querySelector('.mobile-menu'), 'active');
  toggle_class(document.querySelector('body'), 'hidden');
});

// WORKS POPUP
let worksItems = document.querySelectorAll('.works__item');
// console.log(worksItems);
let popup = document.querySelector('.work-popup');
let imgBox = popup.querySelector('.work-popup__image');
worksItems.forEach(el => {
  el.addEventListener('click', function(){
    let pic = el.querySelectorAll('img');
    let source = pic[0].getAttribute('src');
    let image = document.createElement('img');
    image.src = source;
    imgBox.appendChild(image);
    toggle_class(popup.querySelector('.work-popup__wrapper'), 'active');
    toggle_class(document.querySelector('body'), 'hidden');
    popup.querySelector('.work-popup__inner').animate({opacity: 1}, 350);
    setTimeout(() => {
      popup.querySelector('.work-popup__inner').style.opacity = 1;
    }, 340);
  })
  document.querySelector('.work-popup__close').addEventListener('click', function(){
    popup.querySelector('.work-popup__inner').animate({opacity: 0}, 350);
    let img = imgBox.querySelectorAll('img');
    toggle_class(document.querySelector('body'), 'hidden');
    setTimeout(() => {
      toggle_class(document.querySelector('.work-popup__wrapper'), 'active');
      imgBox.removeChild(img[0]);
      popup.querySelector('.work-popup__inner').style.opacity = 0;
    }, 340);
  })
})

