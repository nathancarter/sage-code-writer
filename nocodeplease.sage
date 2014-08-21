
# This file defines a function that replaces the standard cell evaluation method,
# with one that behaves exactly the same as the original one (salvus.execute),
# but with one change: The result of every evaluation is remembered for later lookup.
# That method is called "elephant," because elephants never forget.

# These first two imports are needed by elephant:
import parsing
import traceback
# The next import is needed for converting complex data structures to/from string representations,
# in communication with the javascript front-end:
import json
# And regular expressions are always useful:
import re

# The elephant's memory is a global variable, a python dictionary.
elephant_memory = dict()

# And now the elephant function:
# This gets as input a string of code that appears in a cell in the worksheet, and is to be executed.
# It may contain many separate lines of executable code, separated by newlines, etc.
# The structure of this function is basically a direct copy-and-paste of salvus.execute
# (the standard Sage cell evaluation routine) plus a feature that stores the result for later lookup.
# See the few comments among the code below.
def elephant(code):
    blocks = parsing.divide_into_blocks(code)
    # A cell may have many statements; this treats each separately:
    for start, stop, block in blocks:
        orig = block
        block = parsing.preparse_code(block)
        sys.stdout.reset(); sys.stderr.reset()
        try:
            if block.lstrip().endswith('?'):
                print parsing.introspect(block, namespace=salvus.namespace, preparse=False)['result']
                result = None # indicates that no result was computed, since this was just a help lookup
            else:
                try:
                    code = compile( block+'\n', '', 'eval' )
                    result = eval( code, salvus.namespace, None )
                    if result is not None:
                        print result # the evaluation returned a result, so print it for the user to see
                except:
                    code = compile( block+'\n', '', 'single' )
                    exec code in salvus.namespace, None
                    result = None # the statement could not be eval'd (e.g., "print 5") so no value resulted
            sys.stdout.flush()
            sys.stderr.flush()
        except:
            sys.stdout.flush()
            sys.stderr.write('Error in lines %s-%s\n'%(start+1, stop+1))
            traceback.print_exc()
            sys.stderr.flush()
            result = None # indicates that no result was computed, since this was an error
            break
    # If a result was produced, store it in the namespace as a record with two data,
    # the value computed (key = 'result') and the statement that yielded it (key = 'input').
    # Note that only the final statement in the cell matters, since we index here by cell id.
    # This could be changed in the future if needed.
    if result is not None:
        elephant_memory[salvus._id] = { 'input' : orig, 'result' : result }

# Make that function the default executor for worksheet cells.
default_mode( 'elephant' )

# This function dumps out a report of everything in memory.
# It can be used as a debugging tool to verify that elephant() is doing what it should,
# but that is not its primary purpose.  Its primary purpose is as follows:
# The client side (JavaScript UI) calls this function through a worksheet.execute() call;
# the protocol through which the client gets a response is that any text printed by this
# function is piled into a big string and sent to a JavaScript callback.  Therefore,
# interpret all the print statements in this function as assembling a giant return value.
# The JSON format is used so that each individual item printed out is a record with several key-value pairs.
def elephant_report ():
    '''Prints a list of all the stuff in the elephant's memory,
    in a dictionary-like format.'''
    for key in elephant_memory:
        line = { 'id' : key }
        line['input'] = elephant_memory[key]['input']
        line['output'] = str( elephant_memory[key]['result'] )
        line['type'] = str( type( elephant_memory[key]['result'] ) )
        print json.dumps( line )

# In order to know how to suggest to users a set of possible actions they may wish to take
# on a selected set of objects, we need a database of such actions that we can search, and
# from it select appropriate ones.  For now, that is done in a rudimentary way, by just
# reading one big text file in a simple format, and treating its contents as the database.
# The following code opens and reads the file recipes.txt in the same project folder as
# this .sage file, and populates a global dictionary called "recipes."
# That text file should be a sequence of recipes separated by one or more blank lines,
# and each of the following form:
#
# A one-line title for the recipe goes here
# parameterName1 : parameterType1
# ...
# parameterNameN : parameterTypeN
# then here any number of lines of code that do the thing,
# and which may contain instances of parameterNamei, for various i in 1...N
#
# Here is an example, for adding two integers.  This is a terrible example, not only because
# it is so simple that no one would actually make such a silly little recipe, but also because
# Sage doesn't actually compute plain Python ints unless you explicitly ask it to...anyway...
#
# Add two integers (useless example)
# A : int
# B : int
# # Just use a plus, man!  It's that easy:
# A+B
#
# For further examples, see the current recipes.txt file, which has lots of entries.
recipes = {}
recipesf = open( 'recipes.txt', 'r' )
next_recipe = { 'name' : '', 'parameters' : [], 'code' : '' }
for line in recipesf.readlines():
    # If a line starts with //, just ignore it.
    # This is useful for commenting out broken recipes temporarily.
    if line[:2] == '//':
        continue
    # A line length of one means just the newline, which means the line is blank,
    # which means we've hit the end of the last recipe, and should therefore treat it as
    # done, which means add it to the global "recipes" dictionary.
    # (Unless next_recipe is blank, in which case we're still at the top of the file.)
    if len(line) == 1:
        if len(next_recipe['parameters']) > 0 or len(next_recipe['code']) > 0:
            signature = ', '.join( sorted( [ p['type'] for p in next_recipe['parameters'] ] ) )
            if signature not in recipes:
                recipes[signature] = []
            recipes[signature] += [ next_recipe ]
        next_recipe = { 'name' : '', 'parameters' : [], 'code' : '' }
        continue
    # It's a non-blank line, so see if it's of the form identifier : bunch.of.identifiers,
    # which would mean that it's a part of the recipe's "signature."
    mobj = re.match( r'^([a-zA-Z_][a-zA-Z_0-9]*)\s*:\s*([a-zA-Z_][a-zA-Z_0-9.]*)\s*$', line[:-1] )
    if mobj:
        # Yes, it was a variable declaration, so add it to the list of parameters.
        next_recipe['parameters'] += [ { 'name' : mobj.groups()[0], 'type' : mobj.groups()[1] } ]
    elif next_recipe['name'] == '':
        # No, and the recipe has no title, so this must be its title.
        next_recipe['name'] = line[:-1]
    else:
        # No, and the recipe has a title, so this must be a line in its body.
        next_recipe['code'] += line
# Now that we hit the file's end, if we were amidst a recipe, then process it
# (i.e., add it to the global recipe dictionary).
if len(next_recipe['parameters']) > 0 or len(next_recipe['code']) > 0:
    signature = ', '.join( sorted( [ p['type'] for p in next_recipe['parameters'] ] ) )
    if signature not in recipes:
        recipes[signature] = []
    recipes[signature] += [ next_recipe ]
recipesf.close()

# Given a set of items of the given types, what can we do with them?
# This function looks them up in the global recipes data structure and returns the results.
# Because this function is to be called from the JavaScript UI by way of worksheet.execute,
# "returning" a value in this case means printing the values, and all printed output will be
# sent as a big string back to the callback function provided by the JavaScript UI.
#
# This function is fundamentally broken, for the a few reasons.  It treats the set of
# data types as the key in the recipes dictionary, without worrying about whether various
# permutations of the given types match a recipe in more than one way.  This sometimes yields
# incomplete results, and sometimes erroneous results, especially when coupled with the way
# the JavaScript UI callback function handles the results from this function.  This is an
# important thing that needs to be fixed in this prototype, but has not yet been addressed.
# Another problem is that if you have an object of type X, and the recipe is for objects of
# type Y, then as long as X is a subtype of Y, it should still work.  Right now, however,
# it requires exact matching, X == Y, which is more restrictive than need be.
#
# Again, JSON is used as the output format, because the front end that will receive this output
# is written in JavaScript, so JSON is a handy interchange format to send complex data around
# as strings, and be able to [de]hydrate it on either end.
def codeless_actions ( typelist = [] ):
    key = ', '.join( sorted( typelist ) )
    results = []
    if key in recipes:
        results = recipes[key]
    if len( results ) > 0:
        for r in results:
            print json.dumps( r )
    else:
        print json.dumps( { "name" : "[no actions available]" } )
