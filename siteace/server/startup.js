// start up function that creates entries in the Websites databases.
  //search function 


Meteor.startup(function () {
  
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

 process.env.MAIL_URL = 'smtp://postmaster@sandbox757c0ce5316a4945a22181bb9b4060e9.mailgun.org:d4ba89f36403b402f5717fc5e28cb769@smtp.mailgun.org:587';

    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
        upvote:0,
        downvote:0,
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
        upvote:0,
        downvote:0,
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
        upvote:0,
        downvote:0,
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
            upvote:0,
            downvote:0,
    		createdOn:new Date()
    	});
    }
  });

SearchSource.defineSource('items', function(searchText, options) {
  var options = {sort: {upvote: -1}, limit: 20};
  // var options = options || {};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    /*var selector = {title: regExp, description: regExp};*/
    var selector = {$or: [
      {title: regExp},
      {description: regExp}
    ]};
      return Websites.find(selector, options).fetch();
      } 
      // return blank array when length of text searched is zero
      else if (searchText.length===0){ 
        return [];
    } 
   else  {
      return Websites.find({}, options).fetch();
  }

});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}


