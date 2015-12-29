//config social shared

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
  this.render('navigation', {
    to:"navigation"
  });
  
});

Router.route('/details/:_id', function () {
  this.layout('DetailsLayout');
   
   this.render('navigation', {
    to:"navigation"
  });

  this.render('searchResult', {
    to:"searchResult"
  });
  this.render('web_details', {
    to: "main",
    data:function(){
      return Websites.findOne({_id: this.params._id});
    }
  });
});	
// End routers


/// accounts config
/*
Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});
*/
/// 


	// template helpers 
	/////
 	
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

//This line return all documents by default (when empty searchbox text is empty)
	
	/*Template.searchResult.rendered = function() {
  		itemSearch.search('');
	};*/
	//

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{upvote: -1}});
		}
	});

	Template.navigation.helpers({
	   currentUser:function(){
	   	return Meteor.user();
	   }
	});

	/////
	// template events 
	/////

	Template.searchBox.events({   
		  'keyup #search-box': _.throttle(function(e) {
		    var text = $(e.target).val().trim();
		    console.log(text);
		    itemSearch.search(text,{});	
		  }, 200)
		});


	Template.navigation.events({
    'click .js-logout': function(event){
        event.preventDefault();
        Meteor.logout();
    },
      'click .js-register': function(event){
      	$('#registerForm').modal('show') ;
      	return false;
    },
      'click .js-login': function(event){
            $('#login').modal('show') ;
      	return false;
    },
});		

	Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        /*var emailLogin = $('[name=emailLogin]').val();
        var passwordLogin = $('[name=passwordLogin]').val();
        console.log(emailLogin);
        console.log(passwordLogin);
     	  Meteor.loginWithPassword(emailLogin, passwordLogin, function(error){
   		  if(error){
          console.log(error.reason);
          console.log("login o password incorrecto");

        } else {
          console.log("login correcto");
          $('#login').modal('hide');
          return false;
            
    		}
        
          
            });       
        }*/                 
    }
});

  Template.register.events({
      'submit form': function(event){
        event.preventDefault();
        /*var user = $('[name=user]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        
        Accounts.createUser({
          username: user,
            email: email,
            password: password
        }, 
          function(error){
          if(error){
              console.log(error.reason); // Output error if registration fails
            } else{ 
               $('#registerForm').modal('hide');
             } 
          });*/
        
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
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});

// Login validation 

  Template.login.onCreated(function(){
          console.log("The 'login' template was just created.");  
          /*var email='';
          var password=''; */      
        });

  Template.login.onRendered(function(){
      $(' .login').validate({
        submitHandler: function(event){
            var email = $('[name=emailLogin]').val();
            var password = $('[name=passwordLogin]').val();
            //console.log(email);
            console.log(password);
            Meteor.loginWithPassword(email, password, function(error){
            if(error){
              console.log(error.reason);
              console.log("login o password incorrecto");

            } else {
              console.log("login correcto");
              $('#login').modal('hide');
              
              }   
            });      
          }
       }); // end validate function  
     });  //end main rendered function
        
  Template.login.onDestroyed(function(){
          console.log("The 'login' template was just destroyed.");
        });  
///

// Register validation

  Template.register.onCreated(function(){
          console.log("The 'register' template was just created.");         
        });

  Template.register.onRendered(function(){
         
         $(' .register').validate({
            submitHandler: function(event){
            var user = $('[name=user]').val();
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            console.log(email);
            console.log(password);
            Accounts.createUser({
              username: user,
              email: email,
              password: password
        }, 
            function(error){
          if(error){
              console.log(error.reason); // Output error if registration fails
            } else{ 
               $('#registerForm').modal('hide');
             } 
          }); 
          }
       }); // end validate function   
         /*var user = $('[name=user]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        
        Accounts.createUser({
          username: user,
            email: email,
            password: password
        }, 
          function(error){
          if(error){
              console.log(error.reason); // Output error if registration fails
            } else{ 
               $('#registerForm').modal('hide');
             } 
          });*/
        
      });

  Template.register.onDestroyed(function(){
          console.log("The 'register' template was just destroyed.");
      });  

/// end validation


	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			// put the code in here to add a vote to a website!	
				
				Websites.update({_id:website_id}, {$inc: {upvote: +1}});
				console.log("Up voting website with id "+website_id);	
				return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
	
			// put the code in here to remove a vote from a website!
			Websites.update({_id:website_id}, {$inc: {downvote: -1}});
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

			console.log("The url they entered is: "+url);
			
			//  put your website saving code in here!	
			if (Meteor.user()){
				Websites.insert({
    			title:title, 
    			url:url, 
    			description:description, 
    			upvote:0,
    			downvote:0,
    			createdOn:new Date()
    		});

    	 	$("#website_form").toggle('slow');
			return false;// stop the form submit from reloading the page      			
  		}
    		
	   }
	});
