#!/usr/bin/env python3

from fnmatch import fnmatch
import os
import subprocess
import sys

if __name__ == '__main__':
    tests_dir = os.path.dirname(sys.argv[0])
    
    for dirpath, dirnames, filenames in os.walk(tests_dir):
        for filename in filenames:
            if fnmatch(filename, '*test*.js'):
                full_path = os.path.join(dirpath, filename)
                subprocess.call(['/bin/jsc', full_path])