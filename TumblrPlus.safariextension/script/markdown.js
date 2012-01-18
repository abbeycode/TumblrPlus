function defineLinks(post) {
    var usedLinkPattern = /\[[^\]]+\]\s*(\[[^\]]+\])/gm;
    var usedLinks = new Array();
    var match;
    
    while (match = usedLinkPattern.exec(post)) {
        usedLinks.push(match[1]);
    }
    
    var undefinedLinks = new Array();
    
    for (var i = 0; i < usedLinks.length; i++) {
        var usedLink = usedLinks[i];
        var regExLink = usedLink.replace('[', '\\[').replace(']', '\\]');
        
        var definedLinkPattern = new RegExp(regExLink + '\\s*:', 'gm');
        
        if (!definedLinkPattern.test(post)) {
            undefinedLinks.push(usedLink);
        }
    }
    
    var result = post;
    
    if (undefinedLinks.length > 0) {
        result += '\n\n';
    }
    
    for (var i = 0; i < undefinedLinks.length; i++) {
        var link = undefinedLinks[i];
        result += '\n' + link + ':';
    }
    
    return result;
}