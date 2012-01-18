#!/bin/jsc

function assert( outcome, description ) {
    if (outcome) {
        return true;
    } else {
        print('FAIL: ' + description);
        quit();
    }
}