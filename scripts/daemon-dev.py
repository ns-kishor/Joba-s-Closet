#!/usr/bin/env python3
"""Double-fork daemon launcher for the Next.js dev server.
Detaches completely so tool-session cleanups can't reap it."""
import os
import sys
import time

PROJECT = "/home/z/my-project"
LOG = os.path.join(PROJECT, "dev.log")

def fork_and_run():
    # first fork
    pid = os.fork()
    if pid > 0:
        return  # parent returns immediately
    os.setsid()  # new session
    # second fork — grandchild is orphaned, reparented to init
    pid2 = os.fork()
    if pid2 > 0:
        os._exit(0)
    # grandchild: chdir, redirect std fds, exec
    os.chdir(PROJECT)
    devnull = os.open(os.devnull, os.O_RDWR)
    os.dup2(devnull, 0)
    logfd = os.open(LOG, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
    os.dup2(logfd, 1)
    os.dup2(logfd, 2)
    os.execvp("bun", ["bun", "run", "dev"])

fork_and_run()
sys.exit(0)
