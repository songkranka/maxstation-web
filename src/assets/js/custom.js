$(document).ready(function(){

    // //Get the button
    // var mybutton = document.getElementById("myBtn");
    // // When the user scrolls down 20px from the top of the document, show the button
    // window.onscroll = function()
    // {
    //     fixNavigator();
    //     scrollFunction();
    // };

    // //display button go to top page
    // function scrollFunction() {
    //     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    //         mybutton.style.display = "block";
    //     } else {
    //         mybutton.style.display = "none";
    //     }
    // }

    function fixNavigator() {
        var header = document.getElementById("navigator-page");
        if(header != null){
          if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
          {
              header.classList.add("sticky");
          } else {
              header.classList.remove("sticky");
          }
        }
    }


    //js active sub menu
    $(".pt-sidenav .sidenav-menu-detail ul li").each(function(index){

        $(this).on("click", "a", function () {
            var currentActive = $(".pt-sidenav").find(".sidenav-menu-detail ul li a.active");
            currentActive.removeClass("active");
             $(this).addClass("active");
          });

          var currentActiveHeadermenu = $(".pt-sidenav").find(".sidenav-menu-detail a.active");
          currentActiveHeadermenu.removeClass("active");
    });

    //js active main menu
    $(".pt-sidenav .sidenav-menu-detail").each(function(index){
        $(this).on("click", "a", function () {
            var currentActiveHeadermenu = $(".pt-sidenav").find(".sidenav-menu-detail a.active");
            currentActiveHeadermenu.removeClass("active");
            $(this).addClass("active");
        });
    });


});

