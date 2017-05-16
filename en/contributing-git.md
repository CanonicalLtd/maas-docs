Title: Working with Git and GitHub
table_of_contents: True


# Working with Git and GitHub

This page will attempt to provide a complete guide to working with Git and
GitHub with the goal of effectively contributing to MAAS documentation.


## Initial setup

Several actions are required before you can begin. These only need to be done
once.

### GitHub account

A [GitHub account][github-account] will be required. Sign up now.

### Fork the repository on GitHub

A copy of the main (upstream) MAAS doc repository will be needed. This will
become your working area. All your changes will be put there and then merged
into the upstream repo. *Branches* of proposed changes are never created in
the upstream repository directly. This copy is known as a *fork*.

So, within GitHub, [fork][github-help-fork] the
[MAAS documentation repository][github-maas-docs] now. This fork will become
visible in your GitHub account: `https://github.com/{yourusername}/maas-docs`

### Clone your fork locally

A clone is a copy of a repository, including all metadata and history (commits,
merges, etc). Since you cannot make changes in GitHub itself (where your fork
currently resides) a copy of your fork will be needed on your local computer.

Clone your fork now and move into the main doc directory:

```bash
git clone https://github.com/{yourusername}/maas-docs {yourusername}-maas-docs
```

### Add the upstream remote

Add a *remote* to your local repository. This links it with the upstream 
version of the documentation, making it easy to keep your local
branches in sync with upstream:

```bash
git remote add upstream https://github.com/CanonicalLtd/maas-docs
```


## General workflow

1. Enter the clone directory and create a branch that will contain your
   changes:

```bash
cd {yourusername}-maas-docs/en
git checkout -b {branchname}
```

2. Make your changes with your favourite editor. See the [Writing guide][contributing-writing].

3. Check which files that have been added or modified:

```bash
git status
```

4. *Add* those files to the repository. For example:

```bash
git add manage-ha.md
git add ../media/add-zone.png
```

To rename or delete files use the commands `git mv` and `git rm` respectively.

5. Make a *commit* to save your changes locally:

```bash
git commit -m "my commit message which says something useful"
```

6. Check that the changes you have made make sense! You can build a local
   version of the docs (` make && make serve`) to check it renders
   properly.

7. *Push* the branch to your fork on GitHub:

```bash
git push origin {branchname}
```

You may be prompted for your GitHub username/password. You can make things
easier by any of:
 
 - [configuring git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup) properly
 - using an [authentication token](https://help.github.com/articles/creating-an-access-token-for-command-line-use)
 - caching your [password](https://help.github.com/articles/caching-your-github-password-in-git/)

You can push your changes to GitHub at any time (i.e. you do not need to be
finished your intended work). Doing so can be seen as a form of off-disk
backup.

8. [Create a Pull Request][github-help-pr] (PR). This is done within GitHub:
Navigate to your branch and hit the compare button - 
this will allow you to compare across forks to the CanonicalLtd/maas-docs
master branch, which is where your changes will hopefully end up. The
comparison will show you a diff of the changes  - it is useful to look over
this to avoid mistakes. Then click on the button to Create a pull request.  Add
any useful info about the changes in the comments (e.g. if it fixes an issue
you can refer to it by number to automatically link your pull request to the
issue)

9. Wait. The documentation team will usually get to your pull request within a 
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

# A Title That Is Capitalized

This is explained in [SSH keys][user-accounts-ssh-keys].

This is an ordered list:

1. DHCP server is contacted
1. cloud-init triggers deployment process
    1. curtin installation script is run
    1. Squashfs image (same as above) is placed on disk

!!! Note:
    This is an admonishment that refers to a file. See
    `/etc/maas/preseed` directory.


## A second level header that isn't capitalized

[Juju][about-juju] is the recommended deploy agent.

This is an unordered list:

- review the [Kernel boot options][kernel-boot-options].
- ensure any SSH keys are imported (see [SSH keys][user-accounts-ssh-keys]).


### A third level header that isn't capitalized

To deploy directly from MAAS simply press the 'Deploy' button:

![deploy][img__2.1_deploy-nodes]

Don't forget to install a second rack controller. See
[Rack controller][install-rackd] for details.


<!-- LINKS -->

[github-account]: https://github.com/join](https://github.com/join
[github-help-pr]: https://help.github.com/articles/creating-a-pull-request
[github-maas-docs]: http://github.com/CanonicalLtd/maas-docs
[github-help-fork]: https://help.github.com/articles/fork-a-repo
[contributing-writing]: contributing-writing.md
[user-accounts-ssh-keys]: manage-account.md#ssh-keys
[about-juju]: https://jujucharms.com/docs/stable/about-juju
[kernel-boot-options]: installconfig-nodes-kernel-boot-options.md
[install-rackd]: installconfig-rack.md#install-a-rack-controller

[img__2.1_deploy-nodes]: ../media/installconfig-nodes-deploy-nodes__2.1_deploy.png
