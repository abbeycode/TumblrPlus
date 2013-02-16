var ADD_TAG = 'add_tag';
var TAG_UPDATE = 'tag_update';
var ENABLE_SUBMIT = 'enable_submit';

if (window.top == window) {
    safari.self.addEventListener('message', messageHandler, true);
    
    // Inject the script used to call the page's javascript methods
    var myScriptElement = document.createElement('script'); 
    myScriptElement.innerHTML =
      'window.addEventListener("message", function(e) {' +
      '  if (e.data.msg == "' + ADD_TAG + '") {' +
      '    Tumblr.PostForms.view.tag_editor.update(e.data.tag_name);' +
      '  } else if (e.data.msg == "' + TAG_UPDATE + '") {' +
      '    Tumblr.PostForms.view.tag_editor.update_form();' +
      '  } else if (e.data.msg == "' + ENABLE_SUBMIT + '") {' +
      '    Tumblr.PostForms.view.enable_submit();' +
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
    var postOne = document.forms['post_form']['post_one'];
    
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
    return document.getElementsByClassName('editor_wrapper')[0];
}

function getTagsDiv() {
    return document.getElementsByClassName('tags')[0];
}

function clearTags() {
    var tagsDiv = document.getElementsByClassName('tags')[0];
    
    while (span = tagsDiv.getElementsByTagName('span')[0]) {
        tagsDiv.removeChild(span);
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
    
    var tags = getTagsDiv().getElementsByTagName('span');
    
    for (var i = 0; i < tags.length; i++) {
        var span = tags[i];
        result.push(span.innerHTML);
    }
    
    return result;
}

function updateAfterAddTags() {
    postMessage({msg: TAG_UPDATE}, '*');
}

function enableSubmit() {
    postMessage({msg: ENABLE_SUBMIT}, '*');
}

function applyTemplate(template) {
    var activeElement = document.activeElement;
    var titleField = getTitleInputField();
    
    if (titleField && template.title && template.title.trim() !== '') {
        titleField.value = template.title;
    }
    
    if (template.body && template.body.trim() !== '') {
        getPostTextArea().focus();
        getPostTextArea().value = template.body;
    }
    
    if (template.tags && template.tags.length > 0) {
        clearTags();
        addTags(template.tags);
        updateAfterAddTags();
    }
    
    enableSubmit();
    activeElement.focus();
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