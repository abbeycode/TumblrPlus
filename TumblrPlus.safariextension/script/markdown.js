function defineLinks(post) {
    // Get the list of undefined links
    var undefinedLinks = findUndefinedLinks(post);
    
    // Add link definitions to the end of the post
    var result = post;
    
    // Add a gap before the new links
    if (undefinedLinks.length > 0) {
        result += '\n\n';
    }
    
    // Add a definition for each link at the bottom
    for (i = 0; i < undefinedLinks.length; i++) {
        var link = undefinedLinks[i];
        result += '\n' + link + ':';
    }
    
    // Return the enhanced post
    return result;
}

function findUndefinedLinks(post) {
    // Define regexes used
    var usedLinkPattern = /\[[^\]]+\]\s*(\[[^\]]+\])/gm;
    var usedLinks = new Array();
    
    // Find all link names used in the post
    while ((match = usedLinkPattern.exec(post))) {
        // Add links not already discovered to the list
        if (usedLinks.indexOf(match[1]) == -1) {
            usedLinks.push(match[1]);
        }
    }
    
    var undefinedLinks = new Array();
    
    // Look to see if each one is defined somewhere else
    for (i = 0; i < usedLinks.length; i++) {
        var usedLink = usedLinks[i];
        var regExLink = usedLink.replace('[', '\\[').replace(']', '\\]');
        
        var definedLinkPattern = new RegExp(regExLink + '\\s*:', 'gm');
        
        // The link is not defined, save it
        if (!definedLinkPattern.test(post)) {
            undefinedLinks.push(usedLink);
        }
    }
    
    return undefinedLinks;
}