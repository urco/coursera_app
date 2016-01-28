// Methods 

Meteor.methods({
	insertSite: function(url, title, description) {
		if(!this.userId) {
			throw new Meteor.Error("not-authorized");
			
		}
		Websites.insert({
    			title:title, 
    			url:url, 
    			description:description, 
    			upvote:0,
    			downvote:0,
    			createdOn:new Date()
    		});
	},
	upvote: function(website_id) {
		Websites.update({_id:website_id}, {$inc: {upvote: +1}});	
	},
	downvote:function(website_id) { 
		Websites.update({_id:website_id}, {$inc: {downvote: -1}});
	} 
});