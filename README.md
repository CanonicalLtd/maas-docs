# Documentation for MAAS

The documentation is written in Markdown, and then generated into HTML.

The latest version of these docs live at:

- [github.com/CanonicalLtd/maas-docs](https://github.com/CanonicalLtd/maas-docs)
- [maas.ubuntu.com/docs/](http://maas.ubuntu.com/docs/) - Rendered docs.

For advice on contributing to the docs (please!), see
the [contributing.html](http://maas.ubuntu.com/docs/contributing.html) page in 
this project. This has important information on style, the use of Markdown and
other useful tips.

## Docs structure

For editing actual documentation, you will find the Markdown format source 
files in the `src/en` directory. At some point we hope to offer multilingual 
versions of the docs, whereupon these will live in similarly titled directories 
(e.g. 'fr', 'de', etc.).

There are two other files in the `src` directory:

**navigation.tpl** - This is used to build the navigation for the website. You 
won't need to change this unless you are adding a new page (and even then, 
please ask about where it should go).

**base.tpl** - this is the HTML template local docs use. This is as far as 
possible a simulation of how the docs appear online, but changes to this file 
do not alter the online appearance of the docs.

The `htmldocs` directory is where local builds of the docs are made, and 
contains some support files (CSS, JavaScript). If you need to add graphics,
place them in the '/media' folder.  

**NOTE!** Please don't _replace_ graphics unless you know what you are doing. 
These image files are used by all versions of the docs, so usually you will want
to add files rather than change existing ones, unless the changes apply to all 
versions of MAAS (e.g. website images).

The `tools` directory is reserved for build tools and support files.

The `versions` file contains a list of Github branches which represent the 
current supported versions of documentation. Many tools rely on this list, it 
should not be changed by anyone but the docs team!

The `Makefile` is used to build local versions of the docs, and other useful 
things. Some of the make targets are:
 
 - **sysdeps** Run this first! It makes sure you have the required packages to 
    build the docs.
 - **build** Uses the `tools/mdtool.py` program to build a local version of the 
    docs in the htmldocs directory
 - **clean** Removes temp files and generated docs
 - **serve** Runs a simple Python HTTP server on port 8000, which points at the
    htmldocs directory - essential for testing!
 - **todo** Scans the source files for metadata 'TODO' items, and dumps them in a 
    file called 'TODO.txt'



## Typical Github workflow

Github, and git, allow you to use many different styles of workflow, but it is 
tricky to get your head around initially, so here is an example of how to use it
easily for our documentation.

1. Make sure you have a Github account! [https://github.com/join](https://github.com/join)
2. Fork the [CanonicalLtd/maas-docs](https://github.com/CanonicalLtd/maas-docs) Github repository. This 
 creates your own version of the repository (which you can then find online at
 `https://github.com/{yourusername}/maas-docs`)
3. Create a local copy:

        git clone https://github.com/{yourusername}/maas-docs 
        cd maas-docs

4. Add a git `remote` to your local repository. This links it with the 'upstream' 
   version of the documentation, which makes it easier to update your fork and 
   local version of the docs:

        git remote add upstream https://github.com/CanonicalLtd/maas-docs

5. Create a 'feature branch' to add your content/changes

        git checkout -b {branchname}

6. Edit files and make changes in this branch. You can use the command:
       
        git status

   to check which files you have added or edited. For each of these you will
   need to explicitly add the files to the repository. For example:

        git add src/en/about-maas.md
        git add media/about-maas.jpg
  
  If you wish to move or rename files you need to use the `git mv` command, and 
  the `git rm` command to delete them 


7. To 'save' your changes locally, you should make a commit:

        git commit -m 'my commit message which says something useful'

7. Check that the changes you have made make sense! You can build a local
   version of the docs (` make && make serve`) to check it renders
   properly.

8. Push the branch back to **your** fork on Github

        git push origin {branchName}

   Do not be alarmed if you are asked for your username/password, it is part of
   the authentication, though you can make things easier by any of:
    
    - [configuring git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup) properly
    - using an [authentication token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
    - caching your [password] (https://help.github.com/articles/caching-your-github-password-in-git/)

9. Create a pull request. This is easily done in the web interface of Github:
   navigate to your branch on the web interface and hit the compare button - 
   this will allow you to compare across forks to the CanonicalLtd/maas-docs
   master branch, which is where your changes will hopefully end up. The
   comparison will show you a diff of the changes  - it is useful to look over
   this to avoid mistakes. Then click on the button to Create a pull request.  Add
   any useful info about the changes in the comments (e.g. if it fixes an issue
   you can refer to it by number to automatically link your pull request to the
   issue)

10. Wait. The documentation team will usually get to your pull request within a 
   day or two. Be prepared for suggested changes and comments. If there are 
   changes to be made:

   - make the changes in your local branch
   - use `git commit -m 'some message' ` to commit the new changes
   - push the branch to your fork again with `git push origin {branchname}`
   - there is no need to update the pull request, it will be updated automatically
 


Once the code has been landed you can remove your feature branch from both the
remote and your local fork. Github provides a button for this at the bottom of
the pull request, or you can use `git` to remove the branch. 

Before creating another feature branch, make sure you update your fork's code
by pulling from the original MAAS repository (see below).


## Keeping your fork in sync with MAAS docs upstream

You should now have both the upstream branch and your fork listed in git, 
`git remote -v` should return something like:

        upstream   	https://github.com/CanonicalLtd/maas-docs.git (fetch)
        upstream	https://github.com/CanonicalLtd/maas-docs.git (push)
        origin  	https://github.com/castrojo/maas-docs (fetch)
        origin  	https://github.com/castrojo/maas-docs (push)

To fetch and merge with the upstream branch:

        git checkout master
        git fetch upstream
        git merge --ff-only upstream/master
        git push origin master



## Additional resources

### Tools


[Git Remote Branch](https://github.com/webmat/git_remote_branch>) - A tool to 
simplify working with remote branches (Detailed installation instructions are
in their README).


### Using git aliases

Git provides a mechanism for creating aliases for complex or multi-step
commands. These are located in your ``.gitconfig`` file under the
``[alias]`` section.

If you would like more details on Git aliases, You can find out more
information here: [How to add Git aliases](https://git.wiki.kernel.org/index.php/Aliases>)

Below are a few helpful aliases that have been suggested:


    # Bring down the pull request number from the remote specified.
    # Note, the remote that the pull request is merging into may not be your
    # origin (your github fork).
    fetch-pr = "!f() { git fetch $1 refs/pull/$2/head:refs/remotes/pr/$2; }; f"

    # Make a branch that merges a pull request into the most recent version of the
    # trunk (the "maas-docs" remote's develop branch). To do this, it also updates your
    # local develop branch with the newest code from trunk.
    # In the example below, "maas-docs" is the name of your remote, "6" is the pull
    # request number, and "qa-sticky-headers" is whatever branch name you want
    # for the pull request.
    # git qa-pr maas-docs 6 qa-sticky-headers
    qa-pr = "!sh -c 'git checkout develop; git pull $0 develop; git checkout -b $2; git fetch-pr $0 $1; git merge pr/$1'"
