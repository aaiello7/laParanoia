$(document).ready(function() {
  // On-click dropdown menu display
  $(".mobile-menu").on("click", function() {
    console.log("Hey!");
    var currentNavHeight = $("nav > ul").height();
    console.log(currentNavHeight);
    if (currentNavHeight < 5) {
      var newNavHeight = $("nav > ul").height() + 150;
      console.log(newNavHeight);
      $("nav > ul").animate({
          "height": newNavHeight + "px"
        },
        750);
    } else {
      $("nav > ul").animate({
          "height": "0px"
        },
        750,
        function() {
          $(this).removeAttr("style");
        });
    }
  });

  // Image preview on upload
  bsCustomFileInput.init();

  // get file and preview image
  $("#inputGroupFile").on('change', function() {
    let input = $(this)[0];
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function(e) {
        const logoURL = e.target.result;
        $('#preview').attr('src', logoURL).fadeIn('slow');
      };
      reader.readAsDataURL(input.files[0]);
    };
  });


});