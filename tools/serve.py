#!/usr/bin/env python2

import os
import sys
import SimpleHTTPServer
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    pass


def main():
    if len(sys.argv) < 2:
        sys.exit("Please supply a directory to serve")
    os.chdir(sys.argv[1])

    # Remove the directory from argv so the HTTP port can still be
    # specified after the directory (read by SimpleHTTPServer.test)
    del sys.argv[1]

    SimpleHTTPServer.test(ServerClass=ThreadingHTTPServer)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
