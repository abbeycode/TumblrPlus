function defineReferencedLinks(post) {
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

function replaceInlineLinksWithFootnotes(post) {
    var result = post;
    
    var inlineLinks = findInlineLinks(post);
    
    // If there are no inline links, return the original post
    if (inlineLinks.length == 0) return post;
    
    // Trim all trailing spaces to be a single return
    result = result.replace(/\s+$/,'') + '\n';
    
    // Loop through each link
    for (i = 0; i < inlineLinks.length; i++) {
        var link = inlineLinks[i];
        var linkName = link[0];
        var linkURL = link[1];
        
        // Replace the inline URL with a footnote reference
        var urlReplacementPattern = new RegExp('\\(' + linkURL + '\\)', 'g');
        result = result.replace(urlReplacementPattern, '[' + linkName + ']');
        
        // Add a definition for each link at the bottom
        result += '\n[' + linkName + ']:' + linkURL;
    }
    
    return result;
}

function replaceFootnoteLinksWithInline(post) {
    var result = post;
    
    var footnoteLinks = findFootnoteLinks(post);
    
    // If there are no footnote links, return the original post
    if (footnoteLinks.length == 0) return post;
    
    // Loop through each link
    for (i = 0; i < footnoteLinks.length; i++) {
        var link = footnoteLinks[i];
        var linkName = link[0];
        var linkURL = link[1];
        
        // Remove the footnote link
        var regExLinkName = linkName.replace('[', '\\[').replace(']', '\\]');
        var footnotePattern = new RegExp(regExLinkName + '\\s*:.+', 'g');
        result = result.replace(footnotePattern, '');
        
        // Replace the footnote reference with an inline URL
        var refReplacementPattern = new RegExp('(\\[[^\\]]+\\])\\s*(' + regExLinkName + ')', 'g');
        result = result.replace(refReplacementPattern, '$1(' + linkURL + ')');
    }
      
    // Trim all trailing spaces
    result = result.replace(/\s+$/,'');
  
    return result;
}

function findUndefinedLinks(post) {
    var linkReferences = findFootnoteLinkReferences(post);
    var undefinedLinks = new Array();
    
    // Look to see if each one is defined somewhere else
    for (i = 0; i < linkReferences.length; i++) {
        var linkReference = linkReferences[i];
        var regExLink = linkReference.replace('[', '\\[').replace(']', '\\]');
        
        var definedLinkPattern = new RegExp(regExLink + '\\s*:', 'g');
        
        // The link is not defined, save it
        if (!definedLinkPattern.test(post)) {
            undefinedLinks.push(linkReference);
        }
    }
    
    return undefinedLinks;
}

function findInlineLinks(post) {
    // Define regexes used
    var inlineLinkPattern = /\[([^\]]+)\]\s*\(([^)]+)\)/gm;
    var inlineLinks = new Array();
    
    // Find all link names used in the post
    while ((match = inlineLinkPattern.exec(post))) {
        var linkName = match[1];
        var linkURL = match[2];
        
        var previousURLs = inlineLinks.map(
            function(element) { return element[1]; }
        );
        
        // Skip over links already discovered
        if (previousURLs.indexOf(linkURL) != -1)
            continue;

        var previousNames = inlineLinks.map(
            function(element) { return element[0]; }
        );

        // Link should have dashes instead of spaces, no symbols, and relatively short
        linkName = linkName.replace(/[ ]/g,'-').replace(/[^\w-]+/g,'').substring(0,15).toLowerCase();

        var x = 0;
        var uniqueLinkName = linkName;
        
        do {
            if (x++ > 0)
                uniqueLinkName = linkName + (x-1);
        } while (previousNames.indexOf(uniqueLinkName) != -1);
        
        inlineLinks.push([uniqueLinkName, linkURL]);
    }
    
    return inlineLinks;
}

function findFootnoteLinkReferences(post) {
    var footnoteRefPattern = /\[[^\]]+\]\s*(\[[^\]]+\])/gm;
    var footnoteRefs = new Array();
    
    // Find all link names used in the post
    while ((match = footnoteRefPattern.exec(post))) {
        // Add links not already discovered to the list
        if (footnoteRefs.indexOf(match[1]) == -1) {
            footnoteRefs.push(match[1]);
        }
    }
    
    return footnoteRefs;
}

function findFootnoteLinks(post) {
    var footnoteLinkPattern = /(\[[^\]\^]+\])\s*:\s*(\S*)\s*/gm;
    var footnoteLinks = new Array();
    
    // Find all link names used in the post
    while ((match = footnoteLinkPattern.exec(post))) {
        var linkName = match[1];
        var linkURL = match[2];
        
        var previousNames = footnoteLinks.map(
            function(element) { return element[0]; }
        );

        // Skip over duplicate definitions
        if (previousNames.indexOf(linkName) == -1) {
            // Add links with names not already defined to the list
            footnoteLinks.push([linkName, linkURL]);
        }
    }

    return footnoteLinks;
}