var ADD_TAG = 'add_tag';
var SHOW_DESCRIPTION = 'show_description';
var TAG_UPDATE = 'tag_update';

if (window.top == window) {
    safari.self.addEventListener('message', messageHandler, true);
    
    // Inject the script used to call the page's javascript methods
    var myScriptElement = document.createElement('script'); 
    myScriptElement.innerHTML =
      'window.addEventListener("message", function(e) {' +
      '  if (e.data.msg == "' + ADD_TAG + '") {' +
      '    insert_tag(e.data.tag_name);' +
      '  } else if (e.data.msg == "' + SHOW_DESCRIPTION + '") {' +
      '    var showDescriptionLink = document.getElementById("add_link_description");' +
      '    if (showDescriptionLink != null) {' +
      '      showDescriptionLink.getElementsByTagName("a")[0].onclick()' +
      '    }' +
      '  } else if (e.data.msg == "' + TAG_UPDATE + '") {' +
      '    tag_editor_update_form()' +
      '  };' +
      '}, false);'
    document.querySelector('head').appendChild(myScriptElement);
}

function updatePostWithNewText(updatedText) {
        var postTextArea = getPostTextArea();
        var selStart = postTextArea.selectionStart;
        var selEnd   = postTextArea.selectionEnd;
        
        postTextArea.value = updatedText;
        
        postTextArea.selectionStart = selStart;
        postTextArea.selectionEnd   = selEnd;
}

function messageHandler(event) {
    switch(event.name) {
        case 'defineLinksGetPost':
            safari.self.tab.dispatchMessage("defineLinksForPost", getPostTextArea().value);
            break;

        case 'markdownLinksToFootnote':
            safari.self.tab.dispatchMessage("makeLinksFootnotesForPost", getPostTextArea().value);
            break;

        case 'markdownLinksToInline':
            safari.self.tab.dispatchMessage("makeLinksInlineForPost", getPostTextArea().value);
            break;

        case 'updatePostWithDefinedLinks':
        case 'updatePostWithFootnoteLinks':
        case 'updatePostWithInlineLinks':
            updatePostWithNewText(event.message);
            break;

        case 'checkIfPageUsesMarkdown':
            safari.self.tab.dispatchMessage("pageUsesMarkdown", pageUsesMarkdown());
            break;

        case 'applyTemplate':
            applyTemplate(event.message);
            break;

        case 'getTemplateInfo':
            safari.self.tab.dispatchMessage("saveTemplateInfo", getTemplateData());
            break;
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
    for (i = 0; i < tagList.length; i++) {
        var tag = tagList[i];
        postMessage({msg: ADD_TAG, tag_name: tag}, '*');
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

function showDescription() {
    postMessage({msg: SHOW_DESCRIPTION}, '*');
}

function updateAfterAddTags() {
    postMessage({msg: TAG_UPDATE}, '*');
    
    var activeElement = document.activeElement;
    getTagField().focus();
    activeElement.focus();
}

function applyTemplate(template) {
    var titleField = getTitleInputField();
    
    if (titleField && template.title && template.title.trim() !== '') {
        titleField.value = template.title;
    }
    
    if (template.body && template.body.trim() !== '') {
        showDescription();
        getPostTextArea().value = template.body;
    }
    
    if (template.tags && template.tags.length > 0) {
        clearTags();
        addTags(template.tags);
        updateAfterAddTags();
    }
}

function getTemplateData() {
    var titleField = getTitleInputField();
    var title = titleField ? titleField.value : '';
    var body = getPostTextArea().value;
    var tags = getTags();
    
    return {
        'title': title,
        'body' : body,
        'tags' : tags
    };
}