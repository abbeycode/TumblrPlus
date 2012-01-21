// Keep track of templates, instead of retrieving from storage every time
var _templateArray = null;

function PostTemplate(name, title, body, tags) {
    this.name = name;
    this.title = title;
    this.body = body;
    this.uid = guidGenerator();
    
    // Store the tags as a list, even if a string is passed in
    this.tags = typeof(tags) == 'string' ? tags.split(',') : tags;
    
    if (this.toString == Object.prototype.toString) {
        PostTemplate.prototype.toString = function() {
            return 'PostTemplate: <\n' +
                   '  Name: ' + this.name + '\n' +
                   ' Title: ' + this.title + '\n' +
                   ' Body:-------\n' +
                                this.body + (this.body ? '\n' : '') +
                   '      -------\n' +
                   ' Tags: ' + this.tags +
                   '\n>';
        }
    }
}

PostTemplate.fromObject = function(object) {
    return new PostTemplate(object.name, object.title, object.body, object.tags);
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function getTemplateList() {
    if (_templateArray != null) {
        return _templateArray;
    }

    _templateArray = new Object();

    if (localStorage.templates) {
        var storedTemplates = JSON.parse(localStorage.templates);
        
        for (i = 0; i < storedTemplates.length; i++) {
            var stored = storedTemplates[i];
            var template = PostTemplate.fromObject(stored);
            template.uid = stored.uid;
            _templateArray[template.name] = template;
        }
    }
    
    return _templateArray;
}

function sortedTemplateList() {
    var templateList = getTemplateList();
    var sortedTemplates = new Array();
    
    for (templateName in templateList) {
        sortedTemplates.push(templateList[templateName]);
    }
    
    sortedTemplates.sort(sortByName);
    return sortedTemplates;
}

// loadTestData();
function loadTestData() {
    var storeTemplate = function storeTemplate(newTemplate) {
        getTemplateList()[newTemplate.name] = newTemplate;
        storeTemplates();
    };

    storeTemplate(new PostTemplate('Template A', 'Cool Template',
        'Some template text', 'tag 1, tag 2'));
    storeTemplate(new PostTemplate('Template B', 'Cooler Template',
        'Some more template text', 'tag 3, tag 2'));
    storeTemplate(new PostTemplate('No Body One Tag', 'Stupid Template',
        '   ', 'tag 4'));
    storeTemplate(new PostTemplate('No Tags', 'Stupid Tags',
        '   ', ''));
}

function sortByName(a,b) {
    return a.name < b.name ? -1 : 1;
}

function storeTemplates() {
    localStorage.templates = JSON.stringify(sortedTemplateList());
}

function saveTemplate(template, defaultTemplateName) {
    var newTemplate = PostTemplate.fromObject(template);
    newTemplate.name = prompt("What would you like to call the template?", defaultTemplateName);
    
    // If user cancelled, we're done
    if (!newTemplate.name) {
        return;
    }
    
    var templateList = getTemplateList();
    
    if (newTemplate.name in templateList) {
        var replaceTemplate = confirm('A template named "' + newTemplate.name + '" already exists. Would you like to replace it?');
        
        // If user cancelled, we're done
        if (!replaceTemplate) {
            return;
        }
        
        newTemplate.uid = templateList[newTemplate.name].uid;
    }
    
    getTemplateList()[newTemplate.name] = newTemplate;
    storeTemplates();
}

function deleteTemplate(template) {
    var userConfirmed = confirm('Delete template named "' + template.name + '"?');

    if (userConfirmed) {
        delete getTemplateList()[template.name];
        storeTemplates();
    }
}