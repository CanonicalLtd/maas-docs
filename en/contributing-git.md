Title: Working with Git and GitHub
TODO:  Review commented out section: "Additional resources"
       bug tracking: https://github.com/canonical-webteam/documentation-builder/issues/83
table_of_contents: True


# Working with Git and GitHub

This page provides the essentials for working with Git and GitHub with the goal
of contributing specifically to MAAS documentation. See the upstream projects
for definitive documentation: [Git docs][git-docs] and
[GitHub docs][github-docs].

Related documents:

- [Writing guide][contributing-writing]
- [Building the docs][contributing-build]


## Initial setup

Several actions are required before you can begin. These only need to be done
once.

- GitHub account
- User environment
- Fork the MAAS docs repository on GitHub
- Clone your MAAS docs fork locally
- Add the upstream remote

### GitHub account

A [GitHub account][github-account] will be required.

Verify your email address by responding to the email notification you will
receive.

The remainder of this page will refer to your GitHub username as
**$GH_USERNAME** (e.g. 'johnsmith').

### User environment

Configure some user environment essentials.

Set your user name and email address:

```bash
git config --global user.name "$FIRST_NAME $LAST_NAME"
git config --global user.email "$EMAIL_ADDRESS"
```

Pre-empt a later [warning][stackoverflow-git-push-warning] about how "pushes"
should work:

```bash
git config --global push.default simple
```

When you send changes to GitHub you will need to authenticate. By default, your
GitHub login credentials are used. Consider setting a credentials cache time
limit beyond the default (15 min). Below it is set at 60 min:

```bash
git config --global credential.helper 'cache --timeout=3600'
```

To authenticate via SSH keys click on 'Settings' in the top-right corner,
choose 'SSH and GPG keys' in the left menu, and add your public key.

### Fork the MAAS docs repository on GitHub

A copy of the main (upstream) MAAS docs repository will be needed. This will
become your working area. All your changes will be put there and then merged
into the upstream repo. *Branches* of proposed changes are never created in
the upstream repository directly. This copy is known as a *fork*.

Go to the [MAAS docs repository][github-maas-docs] now and fork it by pressing
the Fork button in the top-right area:

![fork maas-docs][img__github-maas-docs-fork]

The URL of your fork will become:

`https://github.com/$GH_USERNAME/maas-docs`

### Clone your MAAS docs fork locally

A clone is a local copy of a repository, including all metadata and history
(commits, merges, etc). Since you cannot make changes in GitHub itself (where
your fork currently resides) a copy of your fork will be needed on your local
computer. Clone your fork now:

```bash
git clone https://github.com/$GH_USERNAME/maas-docs $GH_USERNAME-maas-docs
```

Alternatively, if you will be using SSH for authentication, clone in this way:

```bash
git clone git@github.com:$GH_USERNAME/maas-docs $GH_USERNAME-maas-docs
```

A directory called `$GH_USERNAME-maas-docs` will be created. This is the clone
directory.

### Add the upstream remote

Add a *remote* to your local repository. This links it with the upstream
version of the documentation, making it easy to keep your local branches in
sync with upstream:

```bash
cd $GH_USERNAME-maas-docs
git remote add upstream https://github.com/CanonicalLtd/maas-docs
```

## Add and track upstream series branches locally

If you're a serious contributor you should add the upstream series branches
and *track* them. This will enable you to target specific series.

Get all data for the upstream repository using the *fetch* command. The first
time you do this the upstream series branches will be exposed:

```bash
git fetch upstream
```

Example output:

```no-highlight
From https://github.com/CanonicalLtd/maas-docs
 * [new branch]      2.0        -> upstream/2.0
 * [new branch]      2.1        -> upstream/2.1
 * [new branch]      2.2        -> upstream/2.2
 * [new branch]      devel      -> upstream/devel
 * [new branch]      master     -> upstream/master
```

Based on the above example output, branches '2.0', '2.1', '2.2', and 'devel'
need to be tracked (this is done for 'master' by default):

```bash
git branch 2.0 upstream/2.0
git branch 2.1 upstream/2.1
git branch 2.2 upstream/2.2
git branch devel upstream/devel
```

Your GitHub fork inherited these tracking branches when it was created. This
can be confirmed here:

`https://github.com/$GH_USERNAME/maas-docs/branches`

Finally, we need to change the remote for these newly tracked branches as they
are currently using 'upstream':

```bash
git branch -vv
```

Example output:

```no-highlight
  2.0    bb0fb27 [upstream/2.0] Merge pull request #394 from pmatulis/cherrypick-pr383+384-to-2.0
  2.1    78e3ebb [upstream/2.1] Merge pull request #428 from pmatulis/cherrypick-pr426-to-2.1
  2.2    55527e1 [upstream/2.2] Merge pull request #433 from pmatulis/cherrypick-pr432-to-2.2
  devel  030cae8 [upstream/devel] Merge pull request #410 from pmatulis/backport-master-to-devel
* master df32fa1 [origin/master] Merge pull request #432 from * pmatulis/clarify-reserved-ip-ranges
```

This is not ideal. Change their remotes to 'origin':

```bash
git branch -u origin/2.0 2.0
git branch -u origin/2.1 2.1
git branch -u origin/2.2 2.2
git branch -u origin/devel devel
```

A less verbose command is typically used to list branches:

```bash
git branch
```

Example output:

```no-highlight
  2.0
  2.1
  2.2
  devel
* master
```

Over time, contribution branches will come and go but the ones above should be
regarded as permanent.

### Tracking a new branch

You will need to track a series branch as they become available upstream
(approximately every 6 months). Continuing with the example above, we will
demonstrate using the 2.3 series branch:

```bash
git fetch upstream
git branch 2.3 upstream/2.3
```

However, because your GitHub fork will not contain the new branch you cannot
instruct Git to use the origin (fork) branch as the remote. You will first need
to push the new branch to your fork and then change it. This can be done with
one command:

```bash
git push -u origin 2.3
```

## Syncing fork series branches with upstream

You should now have remotes for both the upstream repository and your fork
(known as *origin* to git): 

```bash
git remote -v
```

The output should look like:

```no-highlight
origin  	https://github.com/$GH_USERNAME/maas-docs (fetch)
origin  	https://github.com/$GH_USERNAME/maas-docs (push)
upstream   	https://github.com/CanonicalLtd/maas-docs (fetch)
upstream	https://github.com/CanonicalLtd/maas-docs (push)
```

To sync one of your fork's series branches (both locally and on GitHub), call
it **$SERIES_BRANCH**, with the corresponding upstream branch:

```bash
git fetch upstream                           # Get all current data on the upstream repository
git checkout $SERIES_BRANCH                  # Move in to your local branch
git merge --ff-only upstream/$SERIES_BRANCH  # Sync your local branch with the upstream branch
git push origin $SERIES_BRANCH               # Sync your GitHub branch with your now-updated local branch
```


## General workflow

1. Decide which series branch you want to target (make an improvement to).
   Choose the most recent one that applies (often 'master' but not
   necessarily). The changes, if they're deemed important enough, will be
   backported to earlier series for you by the Doc team. Let this branch be
   called **$TARGET_SERIES_BRANCH**.

1. Enter the clone directory and sync $TARGET_SERIES_BRANCH with upstream as
   previously described.

1. Create a branch that will contain your changes (replace **$NEW_BRANCH** with
   your arbitrarily-named branch):

	`git checkout -b $NEW_BRANCH $TARGET_SERIES_BRANCH`

1. Edit some files with your favourite editor. See the
   [Writing guide][contributing-writing].

1. Verify the HTML by building the docs locally. See
   [Building the docs][contributing-build].

1. Check which files have been added or modified:

	`git status`

1. *Add* those files to the repository. For example:

	`git add en/manage-ha.md`

	`git add media/add-zone.png`

1. Make a *commit* to save your changes locally:

	`git commit -m "a message which describes the change"`

1. *Push* the branch to your fork on GitHub:

	`git push origin $NEW_BRANCH`

	You can push your changes to GitHub at any time (i.e. you do not need
	to have finished your intended work). Indeed, doing so can be a form of
	off-disk backup.

1. Create a PR. In GitHub, your branches are listed here:

     `https://github.com/$GH_USERNAME/maas-docs/branches`
     
     Find $NEW_BRANCH and press the 'New pull request' button. You should see the
     following:
     
     ![maas-docs new pull request][img__github-maas-docs-new-pull-request]
     
     - base fork: `CanonicalLtd/maas-docs` - This is what you want, **always**.
     - base: `master` - This is the $TARGET_SERIES_BRANCH.
     - head fork: `pmatulis/maas-docs` - This is the fork belonging to $GH_USERNAME
       of 'pmatulis'.
     - compare: `readme-link-issue-423` - This is $NEW_BRANCH.

         All the changes will be shown lower down. The red and green backgrounds
       represent removed and added content respectively. Look over this carefully.
       
         When you're ready, click on the green 'Create pull request' button. A
       new window will appear where you can edit the PR title and add a comment
       summarizing the changes. Also, if the PR fixes a filed issue , say #423,
       include a line in the comment: `Fixes #423` (when the PR is merged the issue
       will be automatically closed).

         Press the 'Create pull request' button to finalize.

1. Wait for the Doc team to review your PR. Some changes may be asked of you.
   If so, don't panic, just repeat the process:

     1. Edit within $NEW_BRANCH
     1. Add the modified files
     1. Commit (with an appropriate message)
     1. Push $NEW_BRANCH

          There is no need to update the PR; GitHub will do this for you.

          Once the PR is merged, branch $NEW_BRANCH should be removed from both your
        GitHub fork and your local fork. There are various places to do the former
        in GitHub and both can be done via `git` itself.


<!-- TURN THIS OFF FOR NOW. CONTENT IS DUBIOUS AND A REVIEW IS REQUIRED.
     MAYBE ADD THIS AS A SEPARATE 'ADVANCED' PAGE, POSSIBLY INCLUDE
     BACKPORTING.

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

-->


<!-- LINKS -->

[github-docs]: https://help.github.com
[git-docs]: https://git-scm.com/doc
[github-account]: https://github.com/join
[github-maas-docs]: http://github.com/CanonicalLtd/maas-docs
[contributing-writing]: contributing-writing.md
[contributing-build]: contributing-build.md
[stackoverflow-git-push-warning]: http://stackoverflow.com/questions/13148066/warning-push-default-is-unset-its-implicit-value-is-changing-in-git-2-0

[img__github-maas-docs-fork]: ../media/contributing-git__github-maas-docs-fork.png
[img__github-maas-docs-new-pull-request]: ../media/contributing-git__github-maas-docs-new-pull-request.png
