Title: MAAS Documentation

# MAAS Documentation 

This is the official documentation for [MAAS][maas]. It is written in GitHub
Flavored Markdown (GFM), generated into HTML, and published at
[https://docs.ubuntu.com/maas][maas-docs].

See [Contributing to documentation][maas-contributing] for instructions on
how to improve these pages.


## GitHub workflow

This is the Git/GitHub workflow to use with this documentation.

1. Make sure you have a GitHub account! [https://github.com/join](https://github.com/join)
2. Fork the [CanonicalLtd/maas-docs](https://github.com/CanonicalLtd/maas-docs) GitHub repository. This 
   creates your own version of the repository (which you can then find online at `https://github.com/{yourusername}/maas-docs`)
3. Create a local copy:

        git clone https://github.com/{yourusername}/maas-docs 
        cd maas-docs/en

4. Add a git `remote` to your local repository. This links it with the upstream 
   version of the documentation, which allows you to easily update your local
   branches and then your fork on GitHub:

        git remote add upstream https://github.com/CanonicalLtd/maas-docs

5. Create a branch that will contain your changes:

        git checkout -b {branchname}

6. Edit files and make changes in this branch. You can use the command:
       
        git status

   to check which files that you have added or edited. For each of these you
   will need to explicitly add the files to the repository:

        git add manage-ha.md
        git add ../media/add-zone.png
  
   To rename or delete files use the commands `git mv` and `git rm` respectively.

7. Make a commit to save your changes locally:

        git commit -m "my commit message which says something useful"

8. Check that the changes you have made make sense! You can build a local
   version of the docs (` make && make serve`) to check it renders
   properly.

9. Push the branch back to **your** fork on GitHub:

        git push origin {branchName}

   You may be prompted for your GitHub username/password. You can make things
   easier by any of:
    
    - [configuring git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup) properly
    - using an [authentication token](https://help.github.com/articles/creating-an-access-token-for-command-line-use)
    - caching your [password](https://help.github.com/articles/caching-your-github-password-in-git/)

10. Create a pull request (PR). This is done within GitHub:
   Navigate to your branch and hit the compare button - 
   this will allow you to compare across forks to the CanonicalLtd/maas-docs
   master branch, which is where your changes will hopefully end up. The
   comparison will show you a diff of the changes  - it is useful to look over
   this to avoid mistakes. Then click on the button to Create a pull request.  Add
   any useful info about the changes in the comments (e.g. if it fixes an issue
   you can refer to it by number to automatically link your pull request to the
   issue)

11. Wait. The documentation team will usually get to your pull request within a 
    day or two. Be prepared for suggested changes and comments. If there are 
    changes to be made:

    - make the changes in your local branch
    - use `git commit -m 'some message' ` to commit the new changes
    - push the branch to your fork again with `git push origin {branchname}`
    - there is no need to update the pull request, it will be updated automatically
 


Once the code has been landed you can remove your feature branch from both the
remote and your local fork. GitHub provides a button for this at the bottom of
the pull request, or you can use `git` to remove the branch. 

Before creating another feature branch, make sure you update your fork's code
by pulling from the original MAAS repository (see below).


## Keeping your fork in sync with MAAS docs upstream

You should now have both the upstream branch and your fork listed in git, 
`git remote -v` should return something like:

        upstream   	https://github.com/CanonicalLtd/maas-docs.git (fetch)
        upstream	https://github.com/CanonicalLtd/maas-docs.git (push)
        origin  	https://github.com/marksmith/maas-docs (fetch)
        origin  	https://github.com/marksmith/maas-docs (push)

To fetch and merge with the upstream branch:

        git checkout master
        git fetch upstream
        git merge --ff-only upstream/master
        git push origin master


## Additional resources

### Tools

[Git Remote Branch](https://github.com/webmat/git_remote_branch) - A tool to 
simplify working with remote branches (Detailed installation instructions are
in their README).

### Using git aliases

Git provides a mechanism for creating aliases for complex or multi-step
commands. These are located in your ``.gitconfig`` file under the
``[alias]`` section.

If you would like more details on Git aliases, You can find out more
information here: [How to add Git aliases](https://git.wiki.kernel.org/index.php/Aliases)

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


<!-- LINKS -->

[maas]: https://maas.io
[maas-docs]: https://docs.ubuntu.com/maas
[maas-contributing]: contributing.md
