
# Sage Code Writer

This project adds to the
[Sage Math Cloud](http://cloud.sagemath.org)
UI tools that write code for the user, in simple use cases.
This is just a proof-of-concept and is not yet beautiful or
especially useful.  The aim of creating it was to get people
interested enough to get involved, improving it steadily until it
becomes good enough to include in the Sage Math Cloud code itself.

For more information, you can watch
[this YouTube video](https://www.youtube.com/watch?v=JjnDNRqItq8),
but it is 26 minutes long.
But the nice thing about videos is that you
don't have to download or install anything to watch one!

## To try it out:

### Prepare a project

Before you can use this code, you must place it in a project in
your Sage Math Cloud account; it can only function there.
To do so, create a new project in your Sage Math Cloud account,
then do *one or the other* of the following two procedures.
 * *Either* manually upload into that project all the files in
   this repository,
 * *or* clone this repository into that account by issuing the
   following command at a terminal prompt in the project.
```
$ git clone https://github.com/nathancarter/sage-code-writer.git
```

### Try out the tool

From the Sage Math Cloud web interface for the project into
which you've uploaded these files, open `example.sagews` and
play with it, as the comments in that worksheet indicate.

### Look under the hood

1. Open `recipes.txt` and see the format for where it's getting the
   suggestions it presents to you.
1. Open `nocodeplease.sage` and read all the comments around the
   code.
1. Open `nocodeplease.js` and read all the comments in the code.
1. Optionally also open `modal.js`, but it's not really very
   important; it's just UI support code.

## Details

If you have any questions, contact
[Nathan Carter](ncarter@bentley.edu),
the author of the initial commits in this repository.

The file `all.tasks` was mostly for Nathan to use during
[Sage Education Days 6](http://wiki.sagemath.org/education6),
where most of this code was written.
The file `slide.sagews` was for me to use during a presentation
given at those same Sage Education Days, which appears in the
YouTube video mentioned at the top of this file.

I release this under the MIT license, but I don't really care much
about the specific open source license I use.  If you want me to
add another license with different freedoms, just ask.

