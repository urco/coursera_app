    // Suscribe 

Meteor.subscribe('websites');
Meteor.subscribe('userData');
Meteor.subscribe('comments');

//config reset password
if (Accounts._resetPasswordToken) {
  Session.set('resetPasswordToken', Accounts._resetPasswordToken);
}

//config social share

ShareIt.init({
    siteOrder: ['facebook','twitter'],
    sites: {
        'facebook': {
        'appId': '1533956880254163',
        'version': 'v2.3',
        'buttonText': 'Share on facebook'
      }
    },
    iconOnly: false,
    applyColors: true
  });
//end social share  

//config comment box

Comments.ui.config({
   template: 'bootstrap', // or ionic, semantic-ui
   limit: 20, // default 10
   loadMoreCount: 20, // default 20
   template: 'bootstrap', // default 'semantic-ui'
   defaultAvatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/73.jpg' // default
});
// end config comment UI

//config search function

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};

var fields = ['title','description'];

itemSearch = new SearchSource('items', fields, options);
//end search function

// Routers 

//Router Home

Router.route('/', function () {
  this.layout('MainLayout');

   this.render('navigation', {
    to:"navigation"
  });

   this.render('searchResult', {
    to:"searchResult"
  });

  this.render('website_form', {
    to:"website_form"
  });
  
  this.render('website_list', {
    to:"main"
  });

});

// Router Details

Router.route('/details/:_id', function () {
  this.layout('DetailsLayout');
   
   this.render('navigation', {
    to:"navigation"
  });
/*
  this.render('searchResult', {
    to:"searchResult"
  });*/

  this.render('web_details', {
    to: "main",
    data:function(){
      return Websites.findOne({_id: this.params._id});
    }
  });
});	

//Router reset password

  Router.route('/reset-password/:token', function () {
    Session.set('resetPasswordToken', this.params.token);
    this.layout('ResetLayout');

    this.render('ResetPassword', {
    to:"ResetPassword"
    });
});

//end routers

	// template helpers 
	/////

//Reset Passwordl helper 

Template.ResetPassword.helpers({
 resetPassword: function(){
    return Session.get('resetPasswordToken');
  }
});

 	// Search helper

	Template.searchResult.helpers({
	   getItems: function() {
	    return itemSearch.getData({
	   	 	transform: function(matchText, regExp) {
	       		return matchText.replace(regExp, "$&")
	      		},
	      sort: {upvote: -1}
	    });
	  },
	  isLoading: function() {
	    return itemSearch.getStatus().loading;
	  	}
	});

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{upvote: -1}});
		}
	});

	Template.navigation.helpers({
	   currentUser:function(){
	   	return Meteor.user();
	   },
     userPicHelper: function() {
    if (Meteor.user().services.facebook) {
        return 'http://graph.facebook.com/' + Meteor.user().services.facebook.id + '/picture?type=square&height=160&width=160';
      }
    else {
        return 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/73.jpg'
      }
    }
	});

	///
	// template events 

	Template.searchBox.events({   
		  'keyup #search-box': _.throttle(function(e) {
		    var text = $(e.target).val().trim();
		    console.log(text);
		    itemSearch.search(text,{});	
		  }, 200)
		});


	Template.navigation.events({
    'click .js-logout': function(event){
        /*event.preventDefault();*/
        Meteor.logout();
    },
      'click .js-register': function(event){
        /*event.preventDefault();*/
        $('.register').trigger("reset");
      	$('#registerForm').modal('show') ;    	
    },
      'click .js-login': function(event){
            /*event.preventDefault();*/
            $('.login').trigger("reset");
            $('#login').modal('show') ;
      	
    },
});		

  Template.login.events({
    'click .facebook-login': function(event) {
        Meteor.loginWithFacebook({loginStyle:"redirect"}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
       $('#login').modal('hide') ; 
    },
    'click .js-register': function(event){
        $('.register').trigger("reset");
        $('#login').modal('hide');
        $('#registerForm').modal('show');
    },
    'click .js-close': function(event){
        $(' .error').html('');
        $(' .error').removeClass('error');
    },
    'click .js-recover-password': function(event){
        $('.ForgotPasswordForm').trigger("reset");
        $('#login').modal('hide');
        $('#ForgotPassword').modal('show');
    }
}); 

  Template.register.events({
      'click .facebook-login': function(event) {
        Meteor.loginWithFacebook({loginStyle:"redirect"}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
       $('#registerForm').modal('hide'); 
    },
     'click .js-login': function(event){
        $('.login').trigger("reset");
        $('#registerForm').modal('hide');
        $('#login').modal('show');          
    },
    'click .js-close': function(event){
        $(' .error').html('');
        $(' .error').removeClass('error');
    }
});     

  Template.ForgotPassword.events({
     'click .js-register': function(event){
        $('#ForgotPassword').modal('hide');
        $('#registerForm').modal('show');          
    },
    'click .js-close': function(event){ 
     $(' .error').html('');
     $(' .error').removeClass('error');
    }
}); 
///

// Validation Login and Register functions

$.validator.setDefaults({
    
    rules: {
        emailLogin: {
            required: true,
            email: true
        },
        passwordLogin: {
            required: true,
            minlength: 4
        },
        user: {
            required: true,
        }, 
        email: {
            required: true,
            email: true
        },
        password: {
          required: true,
          minlength: 4
        },
        emailRecover: {
            required: false,
            email: true
        }
    },
    messages: {
        emailLogin: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        passwordLogin: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        },
        user: {
           required: "You must enter your username",
        },
        email: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        emailRecover: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});

///

// Login validation process

  Template.login.onCreated(function(){
          console.log("The 'login' template was just created."); 

        });

  Template.login.onRendered(function(){
      var validator = $(' .login').validate({
        submitHandler: function(event){

            var email = $('[name=emailLogin]').val();
            var password = $('[name=passwordLogin]').val();    
            Meteor.loginWithPassword(email, password, function(error){
            
            if(error){
              if(error.reason == "User not found") {
                validator.showErrors({
                  emailLogin: "email not found"   
                });
              } 
              if(error.reason == "Incorrect password") {
                validator.showErrors({
                  passwordLogin: "password incorrect"    
                });
               } 
              
             } else {
                $('#login').modal('hide');
              }//end if error
          });      
         }
       }); // end validate function  
     });  //end main rendered function
        
  Template.login.onDestroyed(function(){
          console.log("The 'login' template was just destroyed.");

        });  
///

// Register validation process

  Template.register.onCreated(function(){   
          console.log("The 'register' template was just created.");     
        });

  Template.register.onRendered(function(){
          var validator = $(' .register').validate({
          submitHandler: function(event){
            var user = $('[name=user]').val();
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            console.log(user);
            console.log(email);
            console.log(password);
            Accounts.createUser({
              username: user,
              email: email,
              password: password
          }, 
            function(error){
            if(error) {
              if(error.reason == "Email already exists."){
               validator.showErrors({
               email: error.reason
                  });
                }
               if(error.reason == "Username already exists."){
               validator.showErrors({
               user: error.reason
                  });
                }
                console.log(error.reason); // Output error if registration fails
              } else { 
                 $('#registerForm').modal('hide');
               } 
            }); 
          }
      }); // end validate function          
  });

  Template.register.onDestroyed(function(){
          console.log("The 'register' template was just destroyed.");
      });  


// ForgotPassword template

  Template.ForgotPassword.onCreated(function(){
          console.log("The 'ForgotPassword' template was just created.");   

        });

  Template.ForgotPassword.onRendered(function(){
      var validator = $(' .ForgotPasswordForm').validate({
        submitHandler: function(event){      
             var email = $('[name=emailRecover]').val();
             console.log(email);
              
              Accounts.forgotPassword({email:email}, function(error) {
                if (error) {
                   console.log(error.reason);
                    if (error.reason == 'User not found') {
                          console.log('This email does not exist.');
                          validator.showErrors({
                            emailRecover: "email not found"
                          });  
                          
                      } 
                }else {
                    console.log('Email Sent. Check your mailbox.');
                    console.log(email);
                }
              /*$('#ForgotPassword').modal('hide');*/
            });
         }//end if error 

      }); 
    });  
        
  Template.ForgotPassword.onDestroyed(function(){
          console.log("The 'ForgotPassword' template was just destroyed.");
        });  


/// 

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
				
				Meteor.call('upvote',website_id);
				console.log("Up voting website with id "+website_id);	
				return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;

      Meteor.call('downvote',website_id);
			console.log("Down voting website with id "+website_id);	
			return false;// prevent the button from reloading the page
		},
			"click .js-description":function(event){
				var website_id = this._id;
				Router.go('/details/'+ website_id);
				console.log(website_id);
				return false;

	}});


	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){
			// here is an example of how to get the url out of the form:
			var url, title, description;

			url = event.target.url.value;
			title = event.target.title.value;
			description = event.target.description.value;
			
      Meteor.call('insertSite',url, title, description);

    	 	$("#website_form").toggle('slow');
			return false;// stop the form submit from reloading the page      					
	   }
	});


Template.ResetPassword.events({
  'submit .resetPasswordForm': function(e, t) {
    e.preventDefault();
    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();
        Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(err) {
        if (err) {
          console.log('We are sorry but something went wrong.');
        } else {
          console.log('Your password has been changed. Welcome back!');
          Session.set('resetPassword', null);
          Router.go('/');
        }
      });
    return false;
  }
});















