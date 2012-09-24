#!/bin/jsc

load('common.js');
load('../TumblrPlus.safariextension/script/markdown.js');

// Run all tests
testDefineLinks();
testFindUndefinedLinks();

function testDefineLinks() {
    var input = new Array();
    var expected = new Array();
    
    input.push   ('This is a [link1][link2]');
    expected.push('This is a [link1][link2]\n' +
                  '\n' +
                  '\n' +
                  '[link2]:');
    
    input.push   ('These are [two][link] links to the [same][link] thing');
    expected.push('These are [two][link] links to the [same][link] thing\n' +
                  '\n' +
                  '\n' +
                  '[link]:');
    
    input.push   ('No links here');
    expected.push('No links here');
    
    input.push   ('Line contains a backslash `C:\\dos.bat`');
    expected.push('Line contains a backslash `C:\\dos.bat`');
    
    input.push   ('Line contains a backslash `C:\\dos.bat` [and a link][link-name]');
    expected.push('Line contains a backslash `C:\\dos.bat` [and a link][link-name]\n' +
                  '\n' +
                  '\n' +
                  '[link-name]:');
    
    input.push   ('This is a [link1] [link2]');
    expected.push('This is a [link1] [link2]\n' +
                  '\n' +
                  '\n' +
                  '[link2]:');
    
    input.push   ('This is a defined [link1][link2]\n' +
                  '[link2]:');
    expected.push('This is a defined [link1][link2]\n' +
                  '[link2]:');
    
    input.push   ('This is a defined [link1][link2]\n' +
                  '[link2] :');
    expected.push('This is a defined [link1][link2]\n' +
                  '[link2] :');
    
    input.push   ('This is a defined [link1][link2] and some more with a [link][link3]\n' +
                  '\n' +
                  '[link2]:');
    expected.push('This is a defined [link1][link2] and some more with a [link][link3]\n' +
                  '\n' +
                  '[link2]:\n' +
                  '\n' +
                  '\n' +
                  '[link3]:');

    assert(input.length == expected.length, "Input and expected output counts don't match");
    
    for (var i = 0; i < input.length; i++) {
        var expecting = expected[i];
        var output = defineLinks(input[i]);
        assert(expecting == output, '\n  Expected:\n' + expecting + '\n  Got:\n' + output);
    }
    
    print('testDefineLinks passed');
}

function testFindUndefinedLinks() {
    var input = new Array();
    var expected = new Array();
    
    input.push   ('This is a [link1][link2]');
    expected.push(['[link2]']);
    
    input.push   ('These are [two][link] links to the [same][link] thing');
    expected.push(['[link]']);
    
    input.push   ('No links here');
    expected.push([]);
    
    input.push   ('Line contains a backslash `C:\\dos.bat`');
    expected.push([]);
    
    input.push   ('Line contains a backslash `C:\\dos.bat` [and a link][link-name]');
    expected.push(['[link-name]']);
    
    input.push   ('This is a [link1] [link2]');
    expected.push(['[link2]']);
    
    input.push   ('This is a defined [link1][link2]\n' +
                  '[link2]:');
    expected.push([]);
    
    input.push   ('This is a defined [link1][link2]\n' +
                  '[link2] :');
    expected.push([]);
    
    input.push   ('This is a defined [link1][link2] and some more with a [link][link3]\n' +
                  '\n' +
                  '[link2]:');
    expected.push(['[link3]']);
    
    // Bug reproduced, then fixed
    input.push   ('This is a defined [link1][link2] and a different [link][link3]\n' +
                  '\n' +
                  'Followed by the first [link4][link2] repeated, with a different [link][link5] after' +
                  '\n' +
                  '[link2]:');
    expected.push(['[link3]',
                   '[link5]']);

    for (var i = 0; i < input.length; i++) {
        var expecting = expected[i];
        var output = findUndefinedLinks(input[i]);
        
        var passed = true;

        if (expecting.length != output.length) {
            passed = false;
        } else {
            for (var x = 0; x < expecting.length; x++) {
                if (expecting[x] != output[x]) {
                    passed = false;
                    break;
                }
            }
        }

        assert(passed, '\n  Expected:\n' + expecting + '\n  Got:\n' + output);
    }
    
    print('testFindUndefinedLinks passed');
}