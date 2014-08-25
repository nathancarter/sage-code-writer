
/*
 * This file just takes the Bootstrap modal dialog
 * and makes it handy to use for my own very specific purposes.
 * Nothing is very complicated, so this file contains fewer comments
 * than some of the other files in this project.
 * But there are at least some comments below at the top of each method.
 */

/*
 * ---------------------
 *
 * Dialog is a generic class you use like this:
 * var D = new Dialog( ... );
 * function someHandler () { D.show(); }
 * D.onHidden( function ( buttonText ) { ... } );
 *
 * Other individual functions are listed here and documented below.
 *   D.addButton ( data )
 *   D.setContent ( html )
 *   D.addHTML ( html )
 *   D.addList ( array )
 *   D.chosen ()
 *
 * ---------------------
 */

if ( globalDialogList )
    for ( k in globalDialogList )
        if ( globalDialogList.hasOwnProperty( k ) )
            $( globalDialogList[k].contentElement() ).remove();
var globalDialogList = {};

/*
 * new Dialog( 'title as string' )
 * or
 * new Dialog( {
 *     title : 'title as string',
 *     buttons : [
 *         'these can be strings or...',
 *         { text : 'button text',
 *           type : 'default' } // see button types below
 *     ],
 *     content : 'arbitrary HTML, perhaps even a huge string'
 * } )
 */
function Dialog ( data )
{
    this.id = 0;
    while ( $( this.selector( true ) ).length )
        this.id++;
    globalDialogList[this.id] = this;
    this.content = '';
    this.buttons = [];
    this.isInDOM = false;
    if ( typeof( data ) == 'string' ) {
        this.title = title;
        this.addButton( 'OK' );
    } else {
        this.title = data.title || 'Dialog';
        if ( data.buttons )
            for ( var i = 0 ; i < data.buttons.length ; i++ )
                this.addButton( data.buttons[i] );
        if ( data.content )
            this.content = data.content;
    }
}

/*
 * Return the CSS selector for this dialog box, as a DIV in the DOM.
 */
Dialog.prototype.selector = function ( withHash )
{
    return (withHash?'#':'')+'Dialog'+this.id;
}

/*
 * dialog.addButton( 'text' )
 * or
 * dialog.addButton( { text : 'text', type : 'default' } )
 * other button types are primary, success, info, warning, danger
 */
Dialog.prototype.addButton = function ( data )
{
    if ( typeof( data ) == 'string' )
        data = { text : data, type : 'default' };
    this.buttons.push( data );
}

/*
 * dialog.setContent( 'html here' )
 * can be used if you didn't specify the content at construction
 * time
 */
Dialog.prototype.setContent = function ( html )
{
    this.content = html;
}

/*
 * dialog.addHTML ( html )
 * can be used to append HTML to the existing content
 */
Dialog.prototype.addHTML = function ( html )
{
    $( this.contentElement() ).append( html );
}

/*
 * Gets the DOM object representing the dialog.
 * If there isn't one, because it hasn't yet been added to the DOM,
 * then this does that first.
 */
Dialog.prototype.DOMObject = function ()
{
    if ( !this.isInDOM ) {
        var that = this;
        var html =
            '<div class="modal fade" id="'+this.selector()+'"\n'
          + '     tabindex="-1" role="dialog"\n'
          + '     aria-labelledby="'+this.selector()+'Label"\n'
          + '     aria-hidden="true">\n'
          + '  <div class="modal-dialog">\n'
          + '    <div class="modal-content">\n'
          + '      <div class="modal-header">\n'
          + '        <button type="button" class="close"\n'
          + '                data-dismiss="modal"\n'
          + '                area-hidden="true">&times;</button>\n'
          + '        <h4 class="modal-title"\n'
          + '            id="'+this.selector()+'Label">'
                        +this.title+'</h4>\n'
          + '      </div>\n'
          + '      <div class="modal-body">\n'
          + '        <form role="form">\n'
          + '          '+this.content+'\n'
          + '        </form>\n'
          + '      </div>\n'
          + '      <div class="modal-footer">\n'
          + this.buttons.map( function ( data ) {
                var str = "'" + data.text.replace( /\\/g, "\\\\" )
                    .replace( /'/g, "\\'" )
                    .replace( /"/g, "'+String.fromCharCode(34)+'" )
                    + "'";
                return '        <button type="button"\n'
                     + '                data-dismiss="modal"\n'
                     + '                onclick="dialogButton('
                                       +that.id+','+str+');"\n'
                     + '                class="btn btn-'
                                       +data.type+'">'
                     + data.text+'</button>\n';
            } ).join( '' )
          + '      </div>\n'
          + '    </div>\n'
          + '  </div>\n'
          + '</div>';
        $( document.body ).append( html );
        this.isInDOM = true;
    }
    return $( this.selector( true ) );
}

/*
 * Handles button clicks in dialogs
 */
function dialogButton ( id, text )
{
    globalDialogList[id].hideButtonText = text;
}

/*
 * Shows the dialog
 */
Dialog.prototype.show = function ()
{
    this.hideButtonText = null;
    this.DOMObject().modal( 'show' );
}

/*
 * Hides the dialog
 */
Dialog.prototype.hide = function ()
{
    this.hideButtonText = null;
    this.DOMObject().modal( 'hide' );
}

/*
 * Gets the content DIV inside the dialog, so that you can find
 * anything you want to look up within it.
 */
Dialog.prototype.contentElement = function ( id )
{
    var result = this.DOMObject().find( 'div.modal-body' );
    if ( id )
        result = result.find( id );
    return result[0];
}

/*
 * Attach handler to dialog hide event.
 * Handler gets called with text of button clicked to hide.
 * If this.hide() were used, or the close button, then null.
 */
Dialog.prototype.onHidden = function ( callback )
{
    var that = this;
    this.DOMObject().on( 'hide.bs.modal', function () {
        callback( that.hideButtonText );
    } );
}

/*
 * Attach handler to checkbox click event.
 * Handler gets called with name of item toggled.
 */
Dialog.prototype.onCheckBoxChanged = function ( callback )
{
    this.checkBoxChangeCallback = callback;
}

/*
 * Add a selection list with the given id to this dialog's content
 */
Dialog.prototype.addList = function ( items, id )
{
    if ( !id )
        id = this.selector() + 'Select';
    var that = this;
    var html =
        '<select size=5 id="' + id + '" width=100%>\n'
      + items.map( function ( item ) {
            if ( typeof( item ) == 'string' )
                item = { text : item, value : item };
            item.text = item.text.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
            item.value = item.value.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
            return '  <option value="' + item.value + '">' + item.text + '</option>\n';
        } ).join( '' )
      + '</select>';
    html = html.replace( /<option /, '<option selected="selected" ' );
    this.addHTML( html );
}

/*
 * Change the pre-existing list of options to the new list given here
 */
Dialog.prototype.setList = function ( items, id )
{
    var inside = items.map( function ( item ) {
        if ( typeof( item ) == 'string' )
            item = { text : item, value : item };
        item.text = item.text.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
        item.value = item.value.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
        item.params = item.data.replace( /</g, '&lt;' ).replace( /"/g, '&quot;' );
        var result = '  <option value="' + item.value + '" data-user="' + item.params + '">' + item.text + '</option>\n';
        return result;
    } ).join( '' );
    inside = inside.replace( /<option /, '<option selected="selected" ' );
    this.contentElement( id || ( '#' + this.selector() + 'Select' ) ).innerHTML = inside;
}

/*
 * Add a list of checkboxes to this dialog's content
 */
Dialog.prototype.addCheckBoxes = function ( items, id )
{
    if ( !id )
        id = this.selector() + 'CheckBox';
    var that = this;
    var html = '';
    for ( var i = 0 ; i < items.length ; i++ ) {
        if ( typeof( items[i] ) == 'string' )
            items[i] = { value : items[i], text : items[i] };
        var value = items[i].value.replace( /</g, '&lt;' ).replace( /'/g, '&apos;' );
        var text = items[i].text.replace( /</g, '&lt;' );
        html += '<p><code><input type="checkbox" name="' + id + i + '" id="' + id + i + '" value="' + value + '"> ' + text + '</code></p>\n';
    }
    this.addHTML( html );
    for ( var i = 0 ; i < items.length ; i++ ) {
        var that = this;
        $( this.contentElement( '#' + id + i ) ).on( 'change', function ( event ) {
            if ( that.checkBoxChangeCallback )
                that.checkBoxChangeCallback( event );
        } );
    }
}

/*
 * Find all checkboxes with a given id
 */
Dialog.prototype.getCheckBoxes = function ( id )
{
    if ( !id )
        id = this.selector() + 'CheckBox';
    var result = [];
    for ( var i = 0 ; ; i++ ) {
        var maybeMore = this.DOMObject().find( '#' + id + i );
        if ( maybeMore.length == 0 ) break;
        for ( var j = 0 ; j < maybeMore.length ; j++ ) result.push( maybeMore.get( j ) );
    }
    return result;
}

/*
 * Return the data about the item chosen in the <select> section of the dialog, if any.
 * Return null if no item was chosen.
 */
Dialog.prototype.chosen = function ( id )
{
    if ( !id )
        id = this.selector() + 'Select';
    var list = this.contentElement( '#' + id );
    var choice = ( list && list.options ) ? list.options[list.selectedIndex] : null;
    return choice ? { value : choice.value, text : choice.text, data : choice.dataset ? choice.dataset.user : null } : null;
}
