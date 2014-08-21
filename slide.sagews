︠4b0912bb-7641-4f65-9eac-80f0c4c246f1i︠
%md

# Introduction

### Imagine...

 - You're a freshman in a calculus course.
 - Your professor wants you to use Sage to do math, but code confuses you.
 - You're willing to learn, but only to a point; if it takes forever to even get started, you'll give up.

### Opportunity...

 - What you (and your professor) really care about is your ability to solve problems; your being good at Sage itself is not the goal.
 - Knowing how to write code for a simple mathematical procedure is something that can be known and stored in a database.
 - Maybe Sage could even write code for us, if we just had a UI by which to ask it to do so...

### Solution

 - Any such a UI would need to be able to remember every computation done in a worksheet, so you could build on what you'd done.
    - This wasn't possible before, because the old Sage notebook interface did not keep track of these things.
    - It is possible now, because `%default_mode` lets me override how Sage processes *everything* you execute.
 - Any such a UI would need to be able to communicate with the server, so it can ask what options the user has, given objects in the workspace.
    - This wasn't possible before...I don't think.
    - It is possible now, with the JavaScript function `worksheet.execute_code`, which runs server-side Sage code and takes a JavaScript callback.
 - Any such UI can't look like crap.
    - This would have been a pain before.
    - Now Sage comes with bootstrap built in, so this is much less of a hassle.

Let's see what we've got!

︡23514c1b-0518-4ab7-91ae-ad60bcaf5269︡{"html":"<h1>Introduction</h1>\n\n<h3>Imagine&#8230;</h3>\n\n<ul>\n<li>You&#8217;re a freshman in a calculus course.</li>\n<li>Your professor wants you to use Sage to do math, but code confuses you.</li>\n<li>You&#8217;re willing to learn, but only to a point; if it takes forever to even get started, you&#8217;ll give up.</li>\n</ul>\n\n<h3>Opportunity&#8230;</h3>\n\n<ul>\n<li>What you (and your professor) really care about is your ability to solve problems; your being good at Sage itself is not the goal.</li>\n<li>Knowing how to write code for a simple mathematical procedure is something that can be known and stored in a database.</li>\n<li>Maybe Sage could even write code for us, if we just had a UI by which to ask it to do so&#8230;</li>\n</ul>\n\n<h3>Solution</h3>\n\n<ul>\n<li>Any such a UI would need to be able to remember every computation done in a worksheet, so you could build on what you&#8217;d done.\n<ul>\n<li>This wasn&#8217;t possible before, because the old Sage notebook interface did not keep track of these things.</li>\n<li>It is possible now, because <code>%default_mode</code> lets me override how Sage processes <em>everything</em> you execute.</li>\n</ul></li>\n<li>Any such a UI would need to be able to communicate with the server, so it can ask what options the user has, given objects in the workspace.\n<ul>\n<li>This wasn&#8217;t possible before&#8230;I don&#8217;t think.</li>\n<li>It is possible now, with the JavaScript function <code>worksheet.execute_code</code>, which runs server-side Sage code and takes a JavaScript callback.</li>\n</ul></li>\n<li>Any such UI can&#8217;t look like crap.\n<ul>\n<li>This would have been a pain before.</li>\n<li>Now Sage comes with bootstrap built in, so this is much less of a hassle.</li>\n</ul></li>\n</ul>\n\n<p>Let&#8217;s see what we&#8217;ve got!</p>\n"}︡
︠61103d47-e06a-4dc9-b0f5-a37307fdd5fai︠
%md

# Demo here

︡e479b5df-ce0b-47f0-b49c-b089d36261ec︡{"html":"<h1>Demo here</h1>\n"}︡
︠d8aaaa3e-4660-43c6-b7be-74d69ddf0ee3i︠
%md

# Future Possibilities

### Abstraction

Imagine you have a cell containing this code.

    x=var('x')
    f(x)=5*sin(x)/x
    plot(f,(x,1,10))


Sage reads this code, notes all constants, and creates a function abstracting them away, then using the function as an example:

    def Example ( A, B, C ):
        x=var('x')
        f(x)=A*sin(x)/x
        plot(f,(x,B,C))

    Example(5,1,10)

### Interactivity

Sage takes any function definition, such as the one given above, and converts it into an `@interact`.  It might even be smart enough to notice the example use of the function that followed it, and take the cue of default values from there.

    @interact
    def Example ( A=5, B=1, C=10 ):
        x=var('x')
        f(x)=A*sin(x)/x
        print plot(f,(x,B,C))


### Topics

Rather than have a single, monolithic file full of recipes, split it into topics, and permit users to enable/disable topics with a simple dialog full of check boxes.
︡50b0dc5a-c5fe-437b-91f1-d60c2f4145a4︡{"html":"<h1>Future Possibilities</h1>\n\n<h3>Abstraction</h3>\n\n<p>Imagine you have a cell containing this code.</p>\n\n<pre><code>x=var('x')\nf(x)=5*sin(x)/x\nplot(f,(x,1,10))\n</code></pre>\n\n<p>Sage reads this code, notes all constants, and creates a function abstracting them away, then using the function as an example:</p>\n\n<pre><code>def Example ( A, B, C ):\n    x=var('x')\n    f(x)=A*sin(x)/x\n    plot(f,(x,B,C))\n\nExample(5,1,10)\n</code></pre>\n\n<h3>Interactivity</h3>\n\n<p>Sage takes any function definition, such as the one given above, and converts it into an <code>@interact</code>.  It might even be smart enough to notice the example use of the function that followed it, and take the cue of default values from there.</p>\n\n<pre><code>@interact\ndef Example ( A=5, B=1, C=10 ):\n    x=var('x')\n    f(x)=A*sin(x)/x\n    print plot(f,(x,B,C))\n</code></pre>\n\n<h3>Topics</h3>\n\n<p>Rather than have a single, monolithic file full of recipes, split it into topics, and permit users to enable/disable topics with a simple dialog full of check boxes.</p>\n"}︡
︠88d78113-30a1-41b7-9911-dcc40bc79a88i︠
%md

# The Bad News

I work on a different FOSS project ([Lurch](http://lurch.sf.net)) and thus if I'm coding, I should probably be coding there most of the time.

*Not* my goal: Come here and get sucked into an enormous, unending project that gets awesomer and awesomer forever.

My real goal: Turn my idea into a prototype, so that its purpose was more clear and less nebulous.

Secret goal: Get someone else, who sees that, interested enough to take over from here and make it awesomer and awesomer forever.
︡4cd946b2-6e19-4698-ae31-8d7fcc13fe57︡{"html":"<h1>The Bad News</h1>\n\n<p>I work on a different FOSS project (<a href=\"http://lurch.sf.net\">Lurch</a>) and thus if I&#8217;m coding, I should probably be coding there most of the time.</p>\n\n<p><em>Not</em> my goal: Come here and get sucked into an enormous, unending project that gets awesomer and awesomer forever.</p>\n\n<p>My real goal: Turn my idea into a prototype, so that its purpose was more clear and less nebulous.</p>\n\n<p>Secret goal: Get someone else, who sees that, interested enough to take over from here and make it awesomer and awesomer forever.</p>\n"}︡
︠73387d14-2f4c-48c4-a259-89fa2a8e4df8︠









