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
    else if (event.name == 'applyTemplate') {
        applyTemplate(event.message);
    }
    else if (event.name == 'getTemplateInfo') {
        safari.self.tab.dispatchMessage("saveTemplateInfo", getTemplateData());
    }
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

function getTitleInputField() {
    var postOne = document.forms['edit_post']['post_one'];
    
    if (postOne && postOne.nodeName == 'INPUT') {
        return postOne;
    }
    
    return null;
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

function getTagField() {
    return document.forms['edit_post']['tag_editor_input'];
}

function clearTags() {
    var tokensSpan = document.getElementById('tokens');
    
    while (div = tokensSpan.getElementsByTagName('div')[0]) {
        tokensSpan.removeChild(div);
    }
}

function addTags(tagList) {
    var existingTags = getTags();
    var tagField = getTagField();
    
    for (i = 0; i < tagList.length; i++) {
        var tag = tagList[i];
        if (existingTags.indexOf(tag) == -1) {
            tagField.focus();
            tagField.value = tagList[i];
            getPostTextArea().focus();
        }
    }
}

function getTags() {
    var result = new Array();
    
    var tags = document.getElementById('tokens').getElementsByTagName('a');
    
    for (var i = 0; i < tags.length; i++) {
        var span = tags[i].parentNode.getElementsByTagName('span')[0];
        result.push(span.innerHTML);
    }
    
    return result;
}

function applyTemplate(template) {
    var titleField = getTitleInputField();
    
    if (titleField && template.title && template.title.trim() !== '') {
        console.log( 'assigning title');
        titleField.value = template.title;
    }
    
    if (template.body && template.body.trim() !== '') {
        console.log( 'assigning body');
        getPostTextArea().value = template.body;
    }
    
    if (template.tags && template.tags.length > 0) {
        console.log( 'assigning tags');
        clearTags();
        addTags(template.tags);
    }
}

function getTemplateData() {
    var titleField = getTitleInputField();
    var title = titleField ? titleField.value : '';
    var body = getPostTextArea().value;
    var tags = getTags();
    
    console.log('body: "' + body + '"');
    
    return {
        'title': title,
        'body' : body,
        'tags' : tags
    };
}