---
title: "Master Git in 7 Minutes"
date: 2021-07-11T12:27:30Z
tags: [beginners, git, tutorial, webdev]
draft: false
dev_to: "https://dev.to/valeriavg/master-git-in-7-minutes-gai"
---

Essentially, Git keeps tabs on text changes, but the definition is a version control system. Chances are you've already used git one way or another: it is a de-facto standard for code versioning due to it's distributed nature, as opposed to centralised Apache Subversion (SVN).
<!--more-->
## Installing Git
To check if you have Git installed run in your terminal:
```sh
git version
# git version 2.30.1 (Apple Git-130)
```
If you don't have it, follow instructions on [https://git-scm.com/downloads](https://git-scm.com/downloads). Mac users can install it with brew: `brew install git`

## Configuring Git
There are just a few things we want to configure:
```sh
git config --global user.name "John Doe" && # your name
git config --global user.email johndoe@example.com && # your email
git config --global init.defaultbranch main # default branch name, to be compatible with GitHub
```

You can see current global configuration with:
```sh
git config --global --list
# Type ":q" to close
```

Git stores configuration in plain text and, if you prefer, you can edit global configuration directly in `~/.gitconfig` or `~/.config/git/config`.

As the command suggests, removing `--global` would make these commands scoped to the current folder. But to test that out we need a repository.

## Creating new repository
A repository is just a folder with all the stuff you want to track. To create one run:
```sh
mkdir gitexample && 
cd gitexample && 
git init
# gitexample git:(main)
```

This command creates a folder `.git` inside `gitexample` folder. That hidden `.git` folder is what makes a repository: all local configuration and changes are stored there.

## Making changes
Let's create something in the repository:
```sh
echo "Hello, Git" >> hello.txt
```

If we ran `git status`, we'll see the newly created untracked file:
```sh
git status
# On branch main
# 
# No commits yet
# 
# Untracked files:
#  (use "git add <file>..." to include in what will be committed)
#	hello.txt
#
# nothing added to commit but untracked files present (use "git add" to track)
```

As the output suggests, let add the file. It can be done directly with:
```sh
git add . # Or `git add hello.txt`, if we don't want all files
```

If you check on the repository status now, you'll see that the file is added (aka *staged*), but not yet committed:
```sh
git status
# On branch main
# 
# No commits yet
# 
# Changes to be committed:
#  (use "git rm --cached <file>..." to unstage)
#	new file:   hello.txt
```

To record the changes, let's commit them:
```sh
git commit -m "Add hello.txt"
# [main (root-commit) a07ee27] Adds hello.txt
# 1 file changed, 2 insertions(+)
# create mode 100644 hello.txt
```

Pro tip:  `git commit -m <MESSAGE>` is a short hand command, you can use `git commit` to open editor (mostly vim) and provide a detailed commit description instead.

Let's check the changes with:
```sh
git log
# type :q to close
```

It will show something like:
```sh
commit a07ee270d6bd0419a50d1936ad89b9de0332f375 (HEAD -> main)
Author: Your Name <your@email.address>
Date:   Sun Jul 11 11:47:16 2021 +0200

    Adds hello.txt
(END)
```

## Creating branches
Having a separate version of the initial code can be useful in a lot of situation: e.g. when testing out a feature you're unsure about or to avoid code conflicts when working together. That's exactly what a git branch is: it grows from a particular point in history.

To create a branch run `git branch NAME` and to switch branch run `git checkout NAME`. Or simply:
```sh
git checkout -b dev # switches to a new branch called "dev"
# Switched to a new branch 'dev'
# gitexample git:(dev)
```
Let's change something in the `hello.txt` file and commit the changes:
```sh
echo "\nHello, Git Branch" >> hello.txt &&
git commit -am "Change hello.txt"
```

Now let's switch back to main version:
```sh
git checkout main &&
cat hello.txt
# Switched to branch 'main'
# Hello, Git
```

As you can see, the file contents are still the same as they were. To compare branches we can run:
```sh
git diff dev
# diff --git a/hello.txt b/hello.txt
# index 360c923..b7aec52 100644
# --- a/hello.txt
# +++ b/hello.txt
# @@ -1,3 +1 @@
# Hello, Git
# -
# -Hello, Git Branch
# (END)
# type ":q" to close
```

Let's make changes in main branch as well:
```sh
echo "\nHi from Main Branch" >> hello.txt &&
git commit -am "Change hello.txt from main"
# [main 9b60c4b] Change hello.txt from main
# 1 file changed, 2 insertions(+)
```
Now let's try to combine the changes:
```sh
git merge dev
# Auto-merging hello.txt
# CONFLICT (content): Merge conflict in hello.txt
# Automatic merge failed; fix conflicts and then commit the result.
```

Because the file was changed in the same place twice we got a conflict. Look at the file:
```sh
cat hello.txt
<<<<<<< HEAD
Hello, Git

Hi from Main Branch
=======
Hello, Git
>>>>>>> dev
```

There is also a tool to see changes separately:
```sh
git diff --ours # :q to close 
git diff --theirs #:q to close
```

You can manually edit the file and commit the changes, but let's imagine we only want one of the versions. We'll start with aborting merge:
```sh
git merge --abort
```

And restarting merge with "theirs" strategy, meaning that in case of conflict we'll use whatever incoming branch insists on:
```sh
git merge -X theirs dev
# Auto-merging hello.txt
# Merge made by the 'recursive' strategy.
# hello.txt | 5 +----
# 1 file changed, 1 insertion(+), 4 deletions(-)
```

The opposite to this strategy is "ours". Merging both changes together will require manual editing (or use of `git mergetool`).

To see list of all branches run:
```sh
git branch # type :q to close
#  dev
# * main
```

Finally, to delete the branch run:
```sh
git branch -d dev
# Deleted branch dev (was 6259828).
```

## Rebasing branches

Branches "grow" from a particular point in git history, *rebase* allows to change that point. Let's create another branch and add some changes to hello.txt once more time:
```sh
git checkout -b story &&
echo "Once upon a time there was a file">>story.txt &&
git add story.txt &&
git commit -m "Add story.txt"
# Switched to a new branch 'story'
# [story eb996b8] Add story.txt
# 1 file changed, 1 insertion(+)
# create mode 100644 story.txt
```

Now, let's come back to the main branch and add changes there:
```sh
git checkout main &&
echo "Other changes" >> changes.txt &&
git add changes.txt &&
git commit -m "Add changes.txt"
```

To replay the changes we made in `main` to `story` branch run:
```sh
git checkout story &&
git rebase main
# Successfully rebased and updated refs/heads/story.
```

You can see new file created in `main` branch being added to `story` branch:
```sh
ls
# changes.txt hello.txt   story.txt
```

Word of caution: do not rebase branches that someone else might have used, e.g. the main branch. Also, keep in mind that every history manipulation on a remote repository will require forcing these changes to take effect.

## Remote repository
If you haven't yet, create a [GitHub](https://github.com/signup) account, login and create a [new empty repository](https://github.com/new) (private or public).

Assuming the repository name was "example" run the following command (change to your username):
```sh
git remote add origin git@github.com:USERNAME/example.git &&
git push -u origin main
```

You can refresh the page and see files in main branch. To push all local branches to remote repository run:
```sh
git push --all origin
```

Let's edit something on GitHub: just click any file and the pencil icon. Add a line with any text you want and press "Commit changes".

Now run this command locally to get the remote changes:
```sh
git checkout main &&
git pull
```

## Managing uncommitted changes 

If you want to save your local changes for later you can use `git stash`:
```sh
echo "Changes" >> hello.txt &&
git stash
```

Now you can use following command to check, apply or discard these changes:
```sh
git stash list
# stash@{0}: WIP on main: 92354c8 Update changes.txt
git stash pop # to apply changes
git stash drop # to drop changes
```

Pro tip: you can use stash number, i.e. `git stash pop 0` to apply a particular stash or `git stash drop 0` to drop it.

If you want to discard all local changes and simply restore repository to last committed changes run:
```sh
git restore .
```

## Managing committed changes

Once you create a commit, this change is saved in local git history. As mentioned before, all changes affecting remote history would require a `git push --force`. Keep it in mind for all following commands.

Let's start with editing the last commit message :
```sh
git commit --amend # type :wq to save and close
# Press "i" to edit, "Esc" to stop editing
```

How about we reset everything to the very beginning?
To find the ID of the very first commit run this command and scroll (with arrow down) to the very end:
```sh
git log --abbrev-commit
# commit a07ee27
# Author: Your Name <your@email.address>
Date:   Sun Jul 11 11:47:16 2021 +0200

    Adds hello.txt
(END)
# type ":q" to close
```
Now run this to reset the repository, but keep all changes unstaged:
```sh
git reset --soft COMMIT # e.g. a07ee27
```

As opposite to it, you can also make a hard reset and get rid of all the changes with `git reset --hard COMMIT`. There are several other types of reset that you can learn from [git documentation](https://git-scm.com/docs/git-reset)

## Aliases

Most of the times you'll be using just a handful of command (checkout, add ,commit, pull, push and merge mostly), but are some things you might want to have around for "just in case".

One way to store those are git aliases. To configure an alias just set it in a config. For example, one alias I use a lot is `git tree`, it prints a nice history log in a form of a tree:
```sh
git config --global alias.tree 'log --graph --decorate --pretty=oneline --abbrev-commit'
# Try it with `git tree`
```

Another useful alias deletes all merged branches:
```sh
git config --global alias.clbr '!git branch --merged | grep -v \* | xargs git branch -D' 
```

As you can see it's prefixed with "!", which allows us to use any command, not only git commands.

