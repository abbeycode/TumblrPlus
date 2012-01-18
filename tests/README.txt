==========================================================================================
                                       Unit Testing
==========================================================================================

These tests primarily use JavaScript, with a thin Python wrapper that can execute all of
the tests at once.

==========================================================================================
                                  JavaScript Unit Tests
==========================================================================================

On Mac OS X, this requires JavaScriptCore. It's included as part of the standard install,
but it's not exposed. To create an alias to it, run the following command from a terminal
prompt:

sudo ln /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Resources/jsc /bin/jsc

It's possible to run the scripts in Windows as well, using Windows Scripting Host. I don't
use Windows and haven't verified this or tried to get it to work. The following link might
by helpful (it's where I got my information on JavaScriptCore):

http://www.phpied.com/javascript-shell-scripting/

==========================================================================================
                                      Python Wrapper
==========================================================================================

The Python wrapper targets Python 3, which is not installed on Mac OS X by default. The
most recent version can be downloaded from the following URL. I recommend the installer.

http://www.python.org/download/