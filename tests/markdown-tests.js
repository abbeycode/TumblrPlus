#!/bin/jsc

load('common.js');
load('../TumblrPlus.safariextension/script/markdown.js');

// Run all tests
testDefineReferencedLinks();
testReplaceInlineLinksWithFootnotes();
testReplaceFootnoteLinksWithInline();
testReplacementEndToEnd();

testFindFootnoteLinkReferences();
testFindUndefinedLinks();
testFindFootnoteLinks();
testFindInlineLinks();

function testDefineReferencedLinks() {
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
        var output = defineReferencedLinks(input[i]);
        assert(expecting == output, '\n  Expected:\n' + expecting + '\n  Got:\n' + output);
    }
    
    print('testDefineReferencedLinks passed');
}

function testReplaceInlineLinksWithFootnotes() {
    var input = new Array();
    var expected = new Array();
    
    input.push   ('This is an [inline link](http://example.com)\n\n\n');
    expected.push('This is an [inline link][inline-link]' +
                  '\n' +
                  '\n' +
                  '[inline-link]:http://example.com');

    // Empty link
    input.push   ('This is an [inline link]()\n\n\n');
    expected.push('This is an [inline link][inline-link]' +
                  '\n' +
                  '\n' +
                  '[inline-link]:');
    
    // Real example
    input.push   ('When I [first published](http://dovfrankel.com/post/16235468803/tumblr) [Tumblr+](http://dovfrankel.com/tagged/TumblrPlus), I decided to use GitHub\'s "Downloads" feature, used for distributing binaries of projects. You upload a file to them, and people can download it. I got it free with the free [GitHub account](https://github.com/abbeycode), and they provide unlimited downloads, and also a count of [how many downloads](http://dovfrankel.com/post/36233735511/2000-tumblr-downloads) each file gets (presently over 3600 - many thanks to those who have tried it out). Everything was running splendidly. And then, GitHub decided to [pull the plug](https://github.com/blog/1302-goodbye-uploads) on the Downloads feature.\n' +
                  '\n' +
                  'After thinking about what to do, where to move my hosting to, I decided on [Amazon S3](http://aws.amazon.com/s3/). Luckily, this change has been non-disruptive. The manifest file (which tells Safari when there are updates and the place from which to download them) was part of my checked-in source code, so I was able to push out an update to that. Everybody reading this who has updated their extension has already downloaded it from S3. Hooray for small victories. However, Apple\'s link still points to GitHub. I submitted an updated listing to Apple, but until they accept it, new users will come through GitHub and then be updated to S3. I hope Apple updates my listing before GitHub pulls the plug completely.\n' +
                  '\n' +
                  'In addition, Amazon S3 doesn\'t give you download stats (at least not in an easily digestible form), so I signed up for [S3stat](https://www.s3stat.com/), which promises to offer that service. I\'ll submit a post once I\'ve used that service long enough to report on it. Hopefully, the files are small enough (and still relatively obscure enough) that I can coast by on the free S3 plan for the next year, and maybe sign up for S3stat\'s hilariously named [Cheap Bastard Plan](https://www.s3stat.com/web-stats/cheap-bastard-plan.ashx), but this ultimately means the extension will start to cost me money at some point in the future, which sucks.\n' +
                  '\n' +
                  'On a _completely_ unrelated note, I\'ve added a small new link to my sidebar, which happens to make it fairly easy to donate money to support me and my work. If you use anything I\'ve put out there, between my [extension](http://dovfrankel.com/tagged/TumblrPlus), and the [various](http://dovfrankel.com/post/37269517618/using-handbrake-on-a-list-of-files) AppleScripts [I\'ve posted](http://dovfrankel.com/tagged/AppleScript), you can give a token donation to show your appreciation and help keep the lights on. Also, every link I\'ve ever [posted](http://dovfrankel.com/tagged/movie-thoughts) to an item on Amazon.com has an affiliate link attached, so that way we could each get something.\n' +
                  '\n' +
                  'I\'m not begging, nor do I plan to, but now if you feel the unavoidable urge to show your support, I\'ve given you a means of doing so. Also, I\'m starting to use GitHub\'s [issue tracker](https://github.com/abbeycode/TumblrPlus/issues), so if you have suggestions for Tumblr+, that\'s the best place to post them.');
    expected.push('When I [first published][first-published] [Tumblr+][tumblr], I decided to use GitHub\'s "Downloads" feature, used for distributing binaries of projects. You upload a file to them, and people can download it. I got it free with the free [GitHub account][github-account], and they provide unlimited downloads, and also a count of [how many downloads][how-many-downlo] each file gets (presently over 3600 - many thanks to those who have tried it out). Everything was running splendidly. And then, GitHub decided to [pull the plug][pull-the-plug] on the Downloads feature.\n' +
                  '\n' +
                  'After thinking about what to do, where to move my hosting to, I decided on [Amazon S3][amazon-s3]. Luckily, this change has been non-disruptive. The manifest file (which tells Safari when there are updates and the place from which to download them) was part of my checked-in source code, so I was able to push out an update to that. Everybody reading this who has updated their extension has already downloaded it from S3. Hooray for small victories. However, Apple\'s link still points to GitHub. I submitted an updated listing to Apple, but until they accept it, new users will come through GitHub and then be updated to S3. I hope Apple updates my listing before GitHub pulls the plug completely.\n' +
                  '\n' +
                  'In addition, Amazon S3 doesn\'t give you download stats (at least not in an easily digestible form), so I signed up for [S3stat][s3stat], which promises to offer that service. I\'ll submit a post once I\'ve used that service long enough to report on it. Hopefully, the files are small enough (and still relatively obscure enough) that I can coast by on the free S3 plan for the next year, and maybe sign up for S3stat\'s hilariously named [Cheap Bastard Plan][cheap-bastard-p], but this ultimately means the extension will start to cost me money at some point in the future, which sucks.\n' +
                  '\n' +
                  'On a _completely_ unrelated note, I\'ve added a small new link to my sidebar, which happens to make it fairly easy to donate money to support me and my work. If you use anything I\'ve put out there, between my [extension][tumblr], and the [various][various] AppleScripts [I\'ve posted][ive-posted], you can give a token donation to show your appreciation and help keep the lights on. Also, every link I\'ve ever [posted][posted] to an item on Amazon.com has an affiliate link attached, so that way we could each get something.\n' +
                  '\n' +
                  'I\'m not begging, nor do I plan to, but now if you feel the unavoidable urge to show your support, I\'ve given you a means of doing so. Also, I\'m starting to use GitHub\'s [issue tracker][issue-tracker], so if you have suggestions for Tumblr+, that\'s the best place to post them.' +
                  '\n' +
                  '\n[first-published]:http://dovfrankel.com/post/16235468803/tumblr' +
                  '\n[tumblr]:http://dovfrankel.com/tagged/TumblrPlus' +
                  '\n[github-account]:https://github.com/abbeycode' +
                  '\n[how-many-downlo]:http://dovfrankel.com/post/36233735511/2000-tumblr-downloads' +
                  '\n[pull-the-plug]:https://github.com/blog/1302-goodbye-uploads' +
                  '\n[amazon-s3]:http://aws.amazon.com/s3/' +
                  '\n[s3stat]:https://www.s3stat.com/' +
                  '\n[cheap-bastard-p]:https://www.s3stat.com/web-stats/cheap-bastard-plan.ashx' +
                  '\n[various]:http://dovfrankel.com/post/37269517618/using-handbrake-on-a-list-of-files' +
                  '\n[ive-posted]:http://dovfrankel.com/tagged/AppleScript' +
                  '\n[posted]:http://dovfrankel.com/tagged/movie-thoughts' +
                  '\n[issue-tracker]:https://github.com/abbeycode/TumblrPlus/issues');

    assert(input.length == expected.length, "Input and expected output counts don't match");
    
    for (var i = 0; i < input.length; i++) {
        var expecting = expected[i];
        var output = replaceInlineLinksWithFootnotes(input[i]);
        assert(expecting == output, '\n  Expected:\n' + expecting + '\n  Got:\n' + output);
    }
    
    print('testDefineLinks passed');
}

function testReplaceFootnoteLinksWithInline() {
    var input = new Array();
    var expected = new Array();
    
    input.push   ('This is an [inline link][inline-link]' +
                  '\n' +
                  '\n' +
                  '[inline-link]:http://example.com');
    expected.push('This is an [inline link](http://example.com)');
    
    // Empty link
    input.push   ('This is an [inline link][inline-link]' +
                  '\n' +
                  '\n' +
                  '[inline-link]:');
    expected.push('This is an [inline link]()');

    // Real example
    input.push   ('When I [first published][first-published] [Tumblr+][tumblr], I decided to use GitHub\'s "Downloads" feature, used for distributing binaries of projects. You upload a file to them, and people can download it. I got it free with the free [GitHub account][github-account], and they provide unlimited downloads, and also a count of [how many downloads][how-many-downlo] each file gets (presently over 3600 - many thanks to those who have tried it out). Everything was running splendidly. And then, GitHub decided to [pull the plug][pull-the-plug] on the Downloads feature.\n' +
                  '\n' +
                  'After thinking about what to do, where to move my hosting to, I decided on [Amazon S3][amazon-s3]. Luckily, this change has been non-disruptive. The manifest file (which tells Safari when there are updates and the place from which to download them) was part of my checked-in source code, so I was able to push out an update to that. Everybody reading this who has updated their extension has already downloaded it from S3. Hooray for small victories. However, Apple\'s link still points to GitHub. I submitted an updated listing to Apple, but until they accept it, new users will come through GitHub and then be updated to S3. I hope Apple updates my listing before GitHub pulls the plug completely.\n' +
                  '\n' +
                  'In addition, Amazon S3 doesn\'t give you download stats (at least not in an easily digestible form), so I signed up for [S3stat][s3stat], which promises to offer that service. I\'ll submit a post once I\'ve used that service long enough to report on it. Hopefully, the files are small enough (and still relatively obscure enough) that I can coast by on the free S3 plan for the next year, and maybe sign up for S3stat\'s hilariously named [Cheap Bastard Plan][cheap-bastard-p], but this ultimately means the extension will start to cost me money at some point in the future, which sucks.\n' +
                  '\n' +
                  'On a _completely_ unrelated note, I\'ve added a small new link to my sidebar, which happens to make it fairly easy to donate money to support me and my work. If you use anything I\'ve put out there, between my [extension][tumblr], and the [various][various] AppleScripts [I\'ve posted][ive-posted], you can give a token donation to show your appreciation and help keep the lights on. Also, every link I\'ve ever [posted][posted] to an item on Amazon.com has an affiliate link attached, so that way we could each get something.\n' +
                  '\n' +
                  'I\'m not begging, nor do I plan to, but now if you feel the unavoidable urge to show your support, I\'ve given you a means of doing so. Also, I\'m starting to use GitHub\'s [issue tracker][issue-tracker], so if you have suggestions for Tumblr+, that\'s the best place to post them.' +
                  '\n' +
                  '\n[first-published]:http://dovfrankel.com/post/16235468803/tumblr' +
                  '\n[tumblr]:http://dovfrankel.com/tagged/TumblrPlus' +
                  '\n[github-account]:https://github.com/abbeycode' +
                  '\n[how-many-downlo]:http://dovfrankel.com/post/36233735511/2000-tumblr-downloads' +
                  '\n[pull-the-plug]:https://github.com/blog/1302-goodbye-uploads' +
                  '\n[amazon-s3]:http://aws.amazon.com/s3/' +
                  '\n[s3stat]:https://www.s3stat.com/' +
                  '\n[cheap-bastard-p]:https://www.s3stat.com/web-stats/cheap-bastard-plan.ashx' +
                  '\n[various]:http://dovfrankel.com/post/37269517618/using-handbrake-on-a-list-of-files' +
                  '\n[ive-posted]:http://dovfrankel.com/tagged/AppleScript' +
                  '\n[posted]:http://dovfrankel.com/tagged/movie-thoughts' +
                  '\n[issue-tracker]:https://github.com/abbeycode/TumblrPlus/issues');
    expected.push('When I [first published](http://dovfrankel.com/post/16235468803/tumblr) [Tumblr+](http://dovfrankel.com/tagged/TumblrPlus), I decided to use GitHub\'s "Downloads" feature, used for distributing binaries of projects. You upload a file to them, and people can download it. I got it free with the free [GitHub account](https://github.com/abbeycode), and they provide unlimited downloads, and also a count of [how many downloads](http://dovfrankel.com/post/36233735511/2000-tumblr-downloads) each file gets (presently over 3600 - many thanks to those who have tried it out). Everything was running splendidly. And then, GitHub decided to [pull the plug](https://github.com/blog/1302-goodbye-uploads) on the Downloads feature.\n' +
                  '\n' +
                  'After thinking about what to do, where to move my hosting to, I decided on [Amazon S3](http://aws.amazon.com/s3/). Luckily, this change has been non-disruptive. The manifest file (which tells Safari when there are updates and the place from which to download them) was part of my checked-in source code, so I was able to push out an update to that. Everybody reading this who has updated their extension has already downloaded it from S3. Hooray for small victories. However, Apple\'s link still points to GitHub. I submitted an updated listing to Apple, but until they accept it, new users will come through GitHub and then be updated to S3. I hope Apple updates my listing before GitHub pulls the plug completely.\n' +
                  '\n' +
                  'In addition, Amazon S3 doesn\'t give you download stats (at least not in an easily digestible form), so I signed up for [S3stat](https://www.s3stat.com/), which promises to offer that service. I\'ll submit a post once I\'ve used that service long enough to report on it. Hopefully, the files are small enough (and still relatively obscure enough) that I can coast by on the free S3 plan for the next year, and maybe sign up for S3stat\'s hilariously named [Cheap Bastard Plan](https://www.s3stat.com/web-stats/cheap-bastard-plan.ashx), but this ultimately means the extension will start to cost me money at some point in the future, which sucks.\n' +
                  '\n' +
                  'On a _completely_ unrelated note, I\'ve added a small new link to my sidebar, which happens to make it fairly easy to donate money to support me and my work. If you use anything I\'ve put out there, between my [extension](http://dovfrankel.com/tagged/TumblrPlus), and the [various](http://dovfrankel.com/post/37269517618/using-handbrake-on-a-list-of-files) AppleScripts [I\'ve posted](http://dovfrankel.com/tagged/AppleScript), you can give a token donation to show your appreciation and help keep the lights on. Also, every link I\'ve ever [posted](http://dovfrankel.com/tagged/movie-thoughts) to an item on Amazon.com has an affiliate link attached, so that way we could each get something.\n' +
                  '\n' +
                  'I\'m not begging, nor do I plan to, but now if you feel the unavoidable urge to show your support, I\'ve given you a means of doing so. Also, I\'m starting to use GitHub\'s [issue tracker](https://github.com/abbeycode/TumblrPlus/issues), so if you have suggestions for Tumblr+, that\'s the best place to post them.');

    assert(input.length == expected.length, "Input and expected output counts don't match");
    
    for (var i = 0; i < input.length; i++) {
        var expecting = expected[i];
        var output = replaceFootnoteLinksWithInline(input[i]);
        assert(expecting == output, '\n  Expected:\n' + expecting + '\n  Got:\n' + output);
    }
    
    print('testDefineLinks passed');
}

function testReplacementEndToEnd() {
    var footnoteText ='This is an [inline link][inline-link]' +
                      '\n' +
                      '\n' +
                      '[inline-link]:http://example.com';
    var convertedFootnote = replaceInlineLinksWithFootnotes(replaceFootnoteLinksWithInline(footnoteText));
    assert(footnoteText == convertedFootnote, 'Footnote-linked post changed after converting to inline- and back');

    var inlineText = 'This is an [inline link](http://example.com)';
    var convertedInline = replaceFootnoteLinksWithInline(replaceInlineLinksWithFootnotes(inlineText));
    assert(inlineText == convertedInline, 'Inline-linked post changed after converting to footnote- and back');

    var emptyLinkText = 'This is an [inline link]()';
    var convertedEmpty = replaceFootnoteLinksWithInline(replaceInlineLinksWithFootnotes(emptyLinkText));
    assert(emptyLinkText == convertedEmpty, 'Empty-linked post changed after converting to footnote- and back');

    print('testReplacementEndToEnd passed');
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

function testFindFootnoteLinkReferences() {
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
    expected.push(['[link2]']);

    for (var i = 0; i < input.length; i++) {
        var expecting = expected[i];
        var output = findFootnoteLinkReferences(input[i]);
        
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
    
    print('testFindFootnoteLinkReferences passed');
}

function testFindFootnoteLinks() {
    var input = new Array();
    var expected = new Array();
    
    input.push   ('[link1]:http://url.com');
    expected.push([['[link1]','http://url.com']]);

    input.push   ('[link1]:  \t http://url.com  ');
    expected.push([['[link1]','http://url.com']]);

    input.push   ('[^1]: This is a footnote, not a link');
    expected.push([]);

    input.push   ('[link1]:http://url.com\n' +
                  '[link2]:http://url.com\n' +
                  '[link1]:different URL\n' +
                  '[link3]:http://differenturl.com');
    expected.push([['[link1]','http://url.com'],
                   ['[link2]','http://url.com'],
                   ['[link3]','http://differenturl.com']]);


    assert(input.length == expected.length, "Input and expected output counts don't match");
    
    for (var iTest = 0; iTest < input.length; iTest++) {
        var expectedResults = expected[iTest];
        var outputResults = findFootnoteLinks(input[iTest]);
        
        assert(expectedResults.length == outputResults.length, "Incorrect number of results returned");

        for (var iOutput = 0; iOutput < expectedResults.length; iOutput++) {
            var expectedLink = expectedResults[iOutput];
            var outputLink = outputResults[iOutput];

            assert(expectedLink[0] == outputLink[0], '\n  Expected link name:\n' + expectedLink[0] + '\n  Got link name:\n' + outputLink[0]);
            assert(expectedLink[1] == outputLink[1], '\n  Expected link url:\n' + expectedLink[1] + '\n  Got link url:\n' + outputLink[1]);
        }
    }
    
    print('testFindFootnoteLinks passed');
}

function testFindInlineLinks() {
    var input = new Array();
    var expected = new Array();
    
    input.push   ('This is a [link1](http://url.com)');
    expected.push([['link1','http://url.com']]);

    input.push   ('This is a [CRAZY\'LINK+too long](http://url.com)');
    expected.push([['crazylinktoo-lo','http://url.com']]);

    input.push   ('This is an [extraordinarily long link name](http://url.com)');
    expected.push([['extraordinarily','http://url.com']]);

    input.push   ('This is a [link1](http://url.com), followed by a [different name](http://url.com) for the same link');
    expected.push([['link1','http://url.com']]);

    input.push   ('This is a [link1](http://url.com), followed by another, [different link](http://other.com)');
    expected.push([['link1','http://url.com'],
                   ['different-link','http://other.com']]);

    input.push   ('This is a [link](http://url.com), followed by another [link](http://different.com) with the same name');
    expected.push([['link','http://url.com'],
                   ['link1','http://different.com']]);

    input.push   ('This is an [extraordinarily long link name](http://url.com)\n' + 
                  '\n' +
                  'Followed by a different [extraordinarily lengthy link name](http://different.com)');
    expected.push([['extraordinarily','http://url.com'],
                   ['extraordinarily1','http://different.com']]);


    assert(input.length == expected.length, "Input and expected output counts don't match");
    
    for (var iTest = 0; iTest < input.length; iTest++) {
        var expectedResults = expected[iTest];
        var outputResults = findInlineLinks(input[iTest]);
        
        assert(expectedResults.length == outputResults.length, "Incorrect number of results returned");

        for (var iOutput = 0; iOutput < expectedResults.length; iOutput++) {
            var expectedLink = expectedResults[iOutput];
            var outputLink = outputResults[iOutput];

            assert(expectedLink[0] == outputLink[0], '\n  Expected link name:\n' + expectedLink[0] + '\n  Got link name:\n' + outputLink[0]);
            assert(expectedLink[1] == outputLink[1], '\n  Expected link url:\n' + expectedLink[1] + '\n  Got link url:\n' + outputLink[1]);
        }
    }
    
    print('testFindInlineLinks passed');
}