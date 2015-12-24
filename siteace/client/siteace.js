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

//Config comment box

Comments.ui.config({
   template: 'bootstrap', // or ionic, semantic-ui
   limit: 20, // default 10
   loadMoreCount: 20, // default 20
   template: 'bootstrap', // default 'semantic-ui'
   defaultAvatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/73.jpg' // default
});
// end config comment UI

//search function

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};

var fields = ['title','description'];

itemSearch = new SearchSource('items', fields, options);

//end search function


// Routers 

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('website_form', {
    to:"website_form"
  });
  this.render('website_list', {
    to:"main"
  });
  this.render('searchResult', {
    to:"searchResult"
  });
});


Router.route('/details/:_id', function () {
  this.render('web_details', {
    to: "main",
    data:function(){
      return Websites.findOne({_id: this.params._id});
    }
  });
});	
// End routers


/// accounts config

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});

/// 
	// template helpers 
	/////
 	// helper function

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
	
	Template.searchResult.rendered = function() {
  		itemSearch.search('');
	};
	//

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{upvote: -1}});
		}
	});

	/*Template.web_details.helpers({
		data:function() {
      	return Websites.findOne({_id:this.params._id});
  		}
	});*/

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
