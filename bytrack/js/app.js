$( document ).ready(function() {

  $("#home").hide();
  $("#stop").hide();
  $("#records").hide();
  $("#robos").hide();
  $("#talleres").hide();
  $("#perfil").hide();
  $("#totalContent").hide();

    // Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("UtDb7QGd5wlgEvu8RTeeUuNSrLLAVWulvinjljos", "v2AECOioRW6rWh5vTnMWJyf5nlXZpZufc73xTwqW");

    var appWindow;

    window.fbAsyncInit = function() {
      Parse.FacebookUtils.init({
        appId      : '1676484905928792',
        status     : true,  // check Facebook Login status
        cookie     : true,  // enable cookies to allow Parse to access the session
        xfbml      : true,
        version    : 'v2.5'
      });

      $('#face').on('click', function(){
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            if (!user.existed()) {
              alert("User signed up and logged in through Facebook!");
            } else {
              alert("User logged in through Facebook!");
            }
          },
          error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
          }
        });
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    function clearAllAnimations() {
      $(".animated").removeClass("shake slideInDown slideOutUp slideOutDown bounceIn bounceOut zoomOut zoomIn slideOutRight slideOutLeft slideInLeft slideInUp slideInRight");
    }

    $('#log').on('submit', function(e){
      clearAllAnimations();

      // Prevent Default Submit Event
      e.preventDefault();

      // Get data from the form and put them into variables
      username = $("#loginUsername").val(),
      password = $("#loginPassword").val();

      // Call Parse Login function with those variables
      Parse.User.logIn(username, password, {
          // If the username and password matches
          success: function(user) {
            //$("#loginAlert").fadeOut();
            $("#totalContent").show();
            $("#landing").addClass("slideOutLeft").fadeOut();
            $("#home").addClass("slideInRight").show();
            appWindow = '#home';
          },
          // If there is an error
          error: function(user, error) {
            $("#loginAlert").addClass("slideInDown").fadeIn();
            setTimeout("$('#loginAlert').addClass('slideOutUp').fadeOut();", 10000);
            $("#groupEmailLog").addClass("shake");
            $("#groupPasswordLog").addClass("shake");
          }
      });
    });

    $('#logOut').on('click', function (e) {
      clearAllAnimations();

       // Prevent Default Submit Event
       e.preventDefault();

       //logout current user
       if ( Parse.User.current() ) {
           Parse.User.logOut();

           // check if really logged out
           if (Parse.User.current())
               console.log("Failed to log out!");
       }

       $("#totalContent").addClass("slideOutLeft").fadeOut();
       $("#landing").addClass("slideInRight").show();
   });

   $('#talleresMenu').on('click', function(){
     if(appWindow == "#talleres")
     {
       clearAllAnimations();
     }
     else
     {
       clearAllAnimations();

       $(appWindow).addClass('slideOutLeft').fadeOut();

       appWindow = '#talleres';

        $('#talleres').addClass('slideInRight').show();
     }
   });

   $('#perfilMenu').on('click', function(){
     if(appWindow == "#perfil")
     {
       clearAllAnimations();
     }
     else
     {
       clearAllAnimations();

       $(appWindow).addClass('slideOutLeft').fadeOut();

       appWindow = '#perfil';

        $('#perfil').addClass('slideInRight').show();
     }
   });

   $('#recordsMenu').on('click', function(){
     if(appWindow == "#records")
     {
       clearAllAnimations();
     }
     else
     {
       clearAllAnimations();

       $(appWindow).addClass('slideOutLeft').fadeOut();

       appWindow = '#records';

        $('#records').addClass('slideInRight').show();
     }
   });

   $('#robosMenu').on('click', function(){
     if(appWindow == "#robos")
     {
       clearAllAnimations();
     }
     else
     {
       clearAllAnimations();

       $(appWindow).addClass('slideOutLeft').fadeOut();

       appWindow = '#robos';

        $('#robos').addClass('slideInRight').show();
     }
   });

   $('#inicioMenu').on('click', function(){
     if(appWindow == "#home")
     {
       clearAllAnimations();
     }
     else
     {
       clearAllAnimations();

       $(appWindow).addClass('slideOutLeft').fadeOut();

       appWindow = '#home';

        $('#home').addClass('slideInRight').show();
     }
   });

   $('#rutasMenu').on('click', function(){
     if(appWindow == "#rutas")
     {
       clearAllAnimations();
     }
     else
     {
       clearAllAnimations();

       $(appWindow).addClass('slideOutLeft').fadeOut();

       appWindow = '#rutas';

        $('#rutas').addClass('slideInRight').show();
     }
   });

    $('#registrar').on('click', function(){
      clearAllAnimations();
      $("#credentialsLogIn").addClass("zoomOut").fadeOut();
      $("#credentialsSignUp").delay(1000).fadeIn().addClass("bounceIn");
    });

    $('#cancelar').on('click', function(){
      clearAllAnimations();
      $("#loginPassword").val("");
      $("#credentialsSignUp").addClass("bounceOut").delay(1000).fadeOut();
      $("#credentialsLogIn").delay(1406).fadeIn().addClass("zoomIn");
      setTimeout("$('#regEmail').val(''); $('#regPassword').val('');", 1500);
    });

    $('#sign').on('submit', function(e){
      clearAllAnimations();

      // Prevent Default Submit Event
      e.preventDefault();

      // Get data from the form and put them into variables
      username = $("#regEmail").val(),
      email = username,
      password = $("#regPassword").val();

      // Call Parse Login function with those variables
      Parse.User.signUp(username, password, { email }, {
          // If the username and password matches
          success: function(user) {
            $("#loginHome").addClass("slideOutRight").fadeOut();
            setTimeout("$('#userLanding').addClass('slideInLeft').fadeIn().css({'width': '100%', 'display': 'table-cell', 'vertical-align': 'middle'});", 1000);
            setTimeout("$('#header').addClass('slideInDown').fadeIn(); $('#footer').addClass('slideInUp').fadeIn();", 2000);
            if(user.get('monedas') == undefined && user.get('productos') == undefined)
            {
              user.save(null,{
                success: function(user) {
                  user.set('monedas', 0);
                  user.set('productos', 0);
                  $("#mCounter").text("X 0");
                  $("#pCounter").text("X 0");
                  user.save();
                }
              });
            }
            else
            {
              $("#mCounter").text("X " + user.get("monedas"));
              $("#pCounter").text("X " + user.get("productos"));
            }
            $("#credentialsSignUp").fadeOut();
            $("#credentialsLogIn").delay(1000).fadeIn();
            $("#regEmail").val("");
            $("#regPassword").val("");
          },
          // If there is an error
          error: function(user, error) {
            $("#groupEmailReg").addClass("shake");
            $("#groupPasswordReg").addClass("shake");
          }
      });
    });

    $('#logOut').on('click', function (e) {
      clearAllAnimations();

       // Prevent Default Submit Event
       e.preventDefault();

       //logout current user
       if ( Parse.User.current() ) {
           Parse.User.logOut();

           // check if really logged out
           if (Parse.User.current())
               console.log("Failed to log out!");
       }

       setTimeout("$('#header').addClass('slideOutUp').delay(1000).fadeOut(); $('#footer').addClass('slideOutDown').delay(1000).fadeOut();", 100);
       setTimeout("$('#userLanding').addClass('slideOutRight').fadeOut();", 1000);
       setTimeout("$('#loginHome').addClass('slideInLeft').fadeIn();", 1500);
       $("#loginPassword").val("");
   });

   $('#nav-button').click( function(){
     $(this).toggleClass('width');
     $(this).parent().toggleClass('show');
     $(this).children().toggleClass( 'fa-navicon').toggleClass( 'fa-close');
     $('#nav-list').toggleClass('nav-show'); $('#cover').toggleClass('display');
   });

   $('#play').click( function(){
     if($("#destino").val() == "")
     {
       $('#destinoDef').modal('toggle');
       $('#buttonPref').click( function(){
         $('#destinoDef').modal('toggle');
         $("#play").hide();
         $("#stop").show();
         $("#destino").prop('disabled', true);
       });
     }
     else{
       $("#play").hide();
       $("#stop").show();
      $("#destino").prop('disabled', true);
     }
   });

   $('#stop').click( function(){
     $("#stop").hide();
     $("#play").show();
      $("#destino").prop('disabled', false);
   });

   setInterval(function() {
     $("#card3").addClass('flipOutX');
     setTimeout("$('#card3').remove();", 1000);
     $("#colNews").append('<div class="card animated" id="card1"><p class="textCard"><b>Zona de riesgo</b></p></div>');
   }, 10000);

   setInterval(function() {
     $("#card1").addClass('flipOutX');
     setTimeout("$('#card1').remove();", 1000);
     $("#colNews").append('<div class="card animated" id="card2"><p class="textCard"><b>Zona segura</b></p></div>');
   }, 11000);

   setInterval(function() {
     $("#card2").addClass('flipOutX');
     setTimeout("$('#card2').remove();", 1000);
     $("#colNews").append('<div class="card animated" id="card3"><p class="textCard"><b>Zona de percances</b></p></div>');
   }, 12000);

   $('#co, #dollar, #fire, #clock').click( function(){
     $("#imgSel").attr("src","img/bar.png");
   });

});
