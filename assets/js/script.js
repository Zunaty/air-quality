
   // Hamburger menu functionality
   document.addEventListener('DOMContentLoaded', () => {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
      $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
  });



// hide cat facts modal
$( ".delete" ).click(function() {
   $( "#cat-modal" ).addClass( "is-hidden" );
});



$( "#search" ).click(function() {
    $( "#data-display" ).removeClass( "is-hidden" );
 });
