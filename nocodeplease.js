
/*
 * This part of the file is very much a temporary hack, that is only here so that
 * anyone who loads this file will get the "No code, please." button on their Sage
 * cloud toolbar.  Someday, when this project is no longer a prototype, it will be
 * better if that button is simply part of the standard Sage cloud toolbar, thus
 * obviating the need for a hack like this.  Until then, this hack is how we do it.
 *
 * Note that JavaScript code pulled into a Sage worksheet through %load may be run
 * any number of times, not just once.  So we cannot just add a button to the toolbar.
 * Rather, we need to first delete any old instances of the button before adding a
 * new one back in.
 */
var link = $( 'a.no-code-please-link' ); // find any old links we created
if ( link.length ) link.remove(); // if any were found, destroy them
$( '<a href="javascript:void(0);" ' // now insert a new one
 + '   class="btn btn-default btn-small btn-info active no-code-please-link" '
 + '   role="button">No code, please.</a>' ).insertBefore( 'span.salvus-editor-codemirror-sync' );
link = $( 'a.no-code-please-link' ); // and find it and keep it in this global variable

/*
 * When the user clicks the link, use the following event handler.
 * This very long event handler function is documented interstitially.
 */
link.on( 'click.no_code_please', function ( event ) {
    // Execute some Sage code in the current worksheet and then call a JavaScript callback
    // when you're done.  The code we execute is elephant_report(), which prints a list of
    // every previously evaluated expression and its result, so they can be used for
    // populating the dialog box we're about to pop up.
    WEC( {
        code : 'elephant_report()', // code to run
        cb   : (function () {
            // This wrapper is just to make the following local variable,
            // using the JavaScript idiom (function(){var x; [code here]})().
            // (See way below, where the "})()" part of the code sits.)
            var list = [];
            // The following is the callback to which we pass the output of elephant_report().
            return function ( message ) {
                // The callback is called repeatedly, as output from elephant_report() comes in chunks.
                // Each chunk is a message object with a .stdout member, containing the text we desire,
                // and a .done member, a boolean indicating whether the output is now complete,
                // or whether there's still more to come.
                if ( message.hasOwnProperty( 'stdout' ) ) {
                    // We got one or more lines of data, so handle each as an object encoded in JSON format.
                    // Add it to the array in the local variable called "list," defined above.
                    message.stdout.split( '\n' ).map( function ( line ) {
                        if ( /\S/.test( line ) ) // ignore all-whitespace transmissions
                            list.push( JSON.parse( line ) );
                    } );
                }
                // If the output from elephant_report() is done, then we pop up the dialog box and let the
                // user interact with it.
                if ( message.done ) {
                    // First, we compute the id2idx object, a mapping such that
                    // id2idx[workbook id] = the index of that item in the "list" variable.
                    // This will be handy for lookups later.
                    var id2idx = { };
                    for ( var i = 0 ; i < list.length ; i++ )
                        id2idx[list[i].id] = i;
                    // Create the dialog that we will show the user.
                    // The Dialog prototype is defined in modal.js, in the same folder as this file.
                    // It does what you expect, and what the methods called in it below suggest, by their names.
                    // You can go and read its source code later if you want to.
                    var D = new Dialog( {
                        title : 'No code, please.',
                        buttons : [ 'Cancel', 'Do it!' ]
                    } );
                    D.addHTML( '<h2>What would you like to do?</h2>' );
                    // If the workspace is non-empty, then we want to prompt them to pick, from a list of checkboxes,
                    // any of the existing objects they might want to manipulate.  If there are no such objects,
                    // then don't prompt them.
                    if ( list.length > 0 )
                        D.addHTML( '<h3>Select some objects you want to work with:</h3>' );
                    D.addCheckBoxes( list.map( function ( obj ) {
                        // The items in the list come from elephant_report(), as called above.
                        // To see what that returns, look up its definition in nocodeplease.sage,
                        // a file in the same folder as this one.
                        var inp = obj.input.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
                        if ( inp.length > 25 ) inp = inp.substring( 0, 22 ) + '...';
                        var outp = obj.output.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
                        if ( outp.length > 25 ) outp = outp.substring( 0, 22 ) + '...';
                        return { value : obj.id, text : outp + ' (' + inp + ')' };
                    } ), 'dataCheckBoxes' );
                    // The following function will be called whenever the user changes which checkboxes
                    // they have checked.  I write it here, then set it up as a handler below, then call it once
                    // as the dialog box is initialized.
                    function updateActions () {
                        var types = [];
                        // Figure out which checkboxes the user has checked, and the types of the objects they represent:
                        D.getCheckBoxes( 'dataCheckBoxes' ).map( function ( checkbox ) {
                            if ( !checkbox.checked ) return;
                            var typestr = list[id2idx[checkbox.value]].type;
                            types.push( '"' + typestr.substring( 7, typestr.length - 2 ) + '"' );
                        } );
                        // Send to the Sage server for execution a call to codeless_actions(), a function defined in
                        // nocodeplease.sage, a file in the same folder as this file.  Pass as parameters the list of
                        // data types corresponding to what the user has checked in the dialog box, computed immediately above.
                        WEC( {
                            code : 'codeless_actions( [ ' + types.join( ', ' ) + ' ] )', // the code to send
                            cb   : (function () {
                                // This wrapper is just to make the following local variable,
                                // using the JavaScript idiom (function(){var x; [code here]})().
                                // (See way below, where the "})()" part of the code sits.)
                                var list2 = [];
                                // The following is the callback to which we pass the output of codeless_actions().
                                return function ( message ) {
                                    // The callback is called repeatedly, as output from codeless_actions() comes in chunks.
                                    // Each chunk is a message object with a .stdout member, containing the text we desire,
                                    // and a .done member, a boolean indicating whether the output is now complete,
                                    // or whether there's still more to come.
                                    if ( message.hasOwnProperty( 'stdout' ) ) {
                                        // We got one or more lines of data, so handle each as an object encoded in JSON format.
                                        // Add it to the array in the local variable called "list2," defined above.
                                        message.stdout.split( '\n' ).map( function ( line ) {
                                            if ( /\S/.test( line ) ) // ignore all-whitespace transmissions
                                                list2.push( JSON.parse( line ) );
                                        } );
                                    }
                                    // If the output from codeless_actions() is done, then we use the results to populate
                                    // the list of actions the user might choose to do with the dialog.
                                    if ( message.done ) {
                                        D.setList( list2.map( function( obj ) {
                                            // The following code just takes an item from list2 and converts it into an
                                            // option to be added to the dialog.  To see what kind of format each item will
                                            // have, note that each such item was printed by the function codeless_actions(),
                                            // defined in the file nocodeplease.sage, which resides in the same folder as
                                            // this file.
                                            if ( !obj.name ) obj.name = '[name missing!]';
                                            var inputs = [];
                                            D.getCheckBoxes( 'dataCheckBoxes' ).map( function ( checkbox ) {
                                                if ( checkbox.checked ) inputs.push( list[id2idx[checkbox.value]].input );
                                            } );
                                            for ( var i = 0 ; i < obj.parameters.length ; i++ )
                                                obj.name = obj.name.replace( RegExp( obj.parameters[i].name, 'g' ), inputs[i] );
                                            if ( !obj.code ) {
                                                obj.code = '# no code provided!';
                                                console.log( '[ ' + types.join( ', ' ) + ' ]' );
                                            }
                                            var result = { text : obj.name, value : obj.code };
                                            if ( obj.parameters ) {
                                                result.data = JSON.stringify( obj.parameters );
                                            } else {
                                                result.data = '';
                                            }
                                            return result;
                                        } ) );
                                    }
                                }
                            })()
                        } );
                    }
                    // Install the event handler just defined.  This means that every time the user checks or unchecks
                    // one of the checkboxes, the action list will be repopulated.
                    D.onCheckBoxChanged( updateActions );
                    // Only add this line of explanatory text if there actually are object checkboxes.
                    if ( list.length > 0 )
                        D.addHTML( '<h3>Choose what to do with those objects:</h3>' );
                    // Start with an empty list of actions, then populate it.
                    D.addList( [ ] );
                    updateActions();
                    // Show the dialog.
                    D.show();
                    // When the user closes the dialog, it will be hidden, which means the following handler will be run.
                    // I do not know if the dialog is ever actually destroyed...It may actually continue to live in the DOM
                    // forever...If that is the case, then there is a bug to fix: This handler should actually also do
                    // D.remove().  That is for you to figure out, dear reader!
                    D.onHidden( function ( button ) {
                        // Find out which action they chose, if any.
                        var item = D.chosen();
                        // Only handle their choice if there actually was one, and they did not cancel:
                        if ( ( button == 'Do it!' ) && item ) {
                            // Find how many blank lines there are at the end of the current worksheet.
                            var numBlanks = /\s*$/.exec(CME.getValue())[0].length;
                            // Find the index of the last line in the worksheet, as an insertion point.
                            var insertionPoint = CME.getDoc().indexFromPos( CodeMirror.Pos( CME.lastLine() ) );
                            // Walk backwards from that point by the number of blank lines minus one.
                            insertionPoint -= numBlanks - 1;
                            // Convert that back to a CodeMirror insertion point.
                            insertionPoint = CME.getDoc().posFromIndex( insertionPoint );
                            // We plan to insert the code for the chosen item, stored in its value:
                            var toInsert = item.value;
                            // But first we must replace all variable names in that code with the actual variables
                            // or expressions the user chose.  Note that this procedure right now is horribly broken,
                            // in that it matches up variable i with chosen Sage object i, which may be right, or
                            // may be quite wrong.  As mentioned in some of the comments in nocodeplease.sage,
                            // what should actually happen here is that an analysis of the valid permutations of the
                            // inputs that match up types correctly with the variables declared in the recipe should
                            // be done, and the appropriate permutation applied here.  That's a bug that needs fixing!
                            var inputs = [];
                            D.getCheckBoxes( 'dataCheckBoxes' ).map( function ( checkbox ) {
                                if ( checkbox.checked ) inputs.push( list[id2idx[checkbox.value]].input );
                            } );
                            var signature = JSON.parse( item.data );
                            for ( var i = 0 ; i < signature.length ; i++ )
                                toInsert = toInsert.replace( RegExp( signature[i].name, 'g' ), inputs[i] );
                            // Now toInsert is ready to be placed in the user's document.
                            // After inserting it, we do NOT execute the cell, because the user may wish to edit the
                            // code first before executing.  In fact, many of the code templates encourage them to do so.
                            CME.replaceRange( toInsert, insertionPoint );
                        }
                        // Clear out the list of objects in the workspace;
                        // we'll recompute it next time the user clicks the "No code, please." button.
                        list = [];
                    } );
                }
            };
        } )()
    } );
} );
