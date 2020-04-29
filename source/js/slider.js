let catBeforeImage = document.querySelector(".before-after__image--before");
let catAfterImage = document.querySelector(".before-after__image--after");
let catBeforeButton = document.querySelector(".buttons-list__button--before");
let catAfterButton = document.querySelector(".buttons-list__button--after");

if(catBeforeImage) {
  catBeforeButton.addEventListener("click", function() {
    catAfterImage.classList.add("before-after__image--show");
    catBeforeImage.classList.remove("before-after__image--show");
  });

  catAfterButton.addEventListener("click", function() {
    catBeforeImage.classList.add("before-after__image--show");
    catAfterImage.classList.remove("before-after__image--show");
  });
}
