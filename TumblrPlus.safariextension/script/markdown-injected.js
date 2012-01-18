if (window.top == window) {
    safari.self.addEventListener('message', messageHandler, true);
}

function messageHandler(event) {
    if (event.name == 'defineLinksGetPost') {
        safari.self.tab.dispatchMessage("defineLinksForPost", getPostTextArea().value);
    }
    else if (event.name == 'updatePostWithDefinedLinks') {
        var postTextArea = getPostTextArea();
        var selStart = postTextArea.selectionStart;
        var selEnd   = postTextArea.selectionEnd;
        
        postTextArea.value = event.message;
        
        postTextArea.selectionStart = selStart;
        postTextArea.selectionEnd   = selEnd;
    }
    else if (event.name == 'checkIfPageUsesMarkdown') {
        safari.self.tab.dispatchMessage("pageUsesMarkdown", pageUsesMarkdown());
    }
}

function getPostTextArea() {
    var textAreas = document.getElementById('left_column').getElementsByTagName('textarea');
    
    for (var i = 0; i < textAreas.length; i++) {
        var textArea = textAreas[i];
        if (textArea.id != 'post_one') {
            return textArea;
        }
    }
    
    // Attempt at a graceful fallback on error condition
    return textAreas[0];
}

function pageUsesMarkdown() {
    var allLinks = document.getElementsByTagName('a');
    
    for (var i = 0; i < allLinks.length; i++) {
        if (allLinks[i].innerHTML == 'markdown') {
            return true;
        }
    }
    
    return false;
}