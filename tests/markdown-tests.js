#!/bin/jsc

load('common.js');
load('../TumblrPlus.safariextension/script/markdown.js');

// Run all tests
testLinkCollection();

function testLinkCollection() {
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
    
    print('testLinkCollection passed');
}