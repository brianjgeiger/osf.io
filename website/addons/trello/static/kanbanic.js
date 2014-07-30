// A note for people who come along and want to use this code: The pattern I used where I have a successful JSON return
// but check for an error flag in it is not something to do in your code. It was a hack because
// I couldn't get past the exception reporting mechanism on the front end otherwise. There are better ways to do this,
// and if I had the time, I would go back and fix it. So don't copy that pattern.

// Helper Functions

function reportError(errorText){ // Light wrapper in case we need to change our error reporting mechanism
    alertify.error(errorText);
}

// This useful function found on StackOverflow http://stackoverflow.com/a/7385673
// Used to hide the detail card when you click outside of it onto its containing div
$(document).click(function (e) {
    var container = $(".trello_card_detail_card");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $(".trello_card_detail").remove();
    }
});


function replaceURLWithHTMLLinks(text) { // Light wrapper in case we need to change our html linking mechanism
    return Autolinker.link( text, {truncate: 50, newWindow: true } );
}

//
// Test function placeholders
// Used by asynchronous unit tests to verify that callbacks do what they're supposed to.
// See ajax_tests.js to see how they're used. The tests run concurrently, so I don't think
// I can reduce these down to just a few reusable functions. Could be refactored to a class
// to make tests have their own namespace, but for now, this will do.

var testDetailCardSuccess = function() {};
var testDetailCardError = function() {};
var testDetailCardException = function() {};
var testErrorListCards = function() {};
var testExceptionListCards = function() {};
var testSuccessListCards = function() {};
var testErrorBoard = function() {};
var testExceptionBoard = function() {};
var testSuccessBoard = function() {};
var testReloadCardSuccess = function() {};
var testReloadCardError = function() {};
var testReloadCardException = function() {};
var testAddCardError = function() {};
var testAddCardException = function() {};
var testAddCardSuccess= function() {};
var testAddChecklistError = function() {};
var testAddChecklistException = function() {};
var testAddChecklistSuccess= function() {};
var testAddCheckitemError = function() {};
var testAddCheckitemException = function() {};
var testAddCheckitemSuccess= function() {};
var testEditCardNameError = function() {};
var testEditCardNameException = function() {};
var testEditCardNameSuccess= function() {};
var testEditCardDescriptionError = function() {};
var testEditCardDescriptionException = function() {};
var testEditCardDescriptionSuccess= function() {};
var testEditChecklistNameError = function() {};
var testEditChecklistNameException = function() {};
var testEditChecklistNameSuccess= function() {};
var testEditCheckitemError = function() {};
var testEditCheckitemException = function() {};
var testEditCheckitemSuccess= function() {};
var testCheckCheckitemError = function() {};
var testCheckCheckitemException = function() {};
var testCheckCheckitemSuccess= function() {};
var testCardDetailsWithoutAttachment = function() {};
var testGetAttachmentSuccess = function() {};
var testGetAttachmentError = function() {};
var testGetAttachmentException = function() {};
var testDeleteCheckitemError = function() {};
var testDeleteCheckitemException = function() {};
var testDeleteCheckitemSuccess= function() {};
var testDeleteChecklistError = function() {};
var testDeleteChecklistException = function() {};
var testDeleteChecklistSuccess= function() {};
var testArchiveCardError = function() {};
var testArchiveCardException = function() {};
var testArchiveCardSuccess= function() {};





//
//  List loading
//

function loadListCards(listID) {
    var cardTemplate = Handlebars.compile($("#kanbanCardTemplate").html());
    var the_url = nodeURL+"trello/list/" + listID +"/";
    $.getJSON( the_url, function(data){
        if(data.error) //Error reporting code for problems caught in the Model
        {
            reportError(data.errorInfo+". " +data.HTTPError );
            testErrorListCards();

        }else {

            $.each(data.trello_cards, function() { //Actual code - update the div
                var newDiv = cardTemplate($(this)[0]);
                 $("#cl-" + listID).append(newDiv);
            });
            makeCardListsSortable();
            testSuccessListCards();
        }
    }).fail(function( jqxhr, textStatus, error ) { //Report uncaught exception
        var err = textStatus + ", " + error;
        reportError( "Could not load the cards: " + err );
        testExceptionListCards();
    });
}


function loadBoard() {
    var cardTemplate = Handlebars.compile($("#kanban-board-template").html());
    var the_url = nodeURL+"trello/lists/";
    var jqxhr = $.getJSON( the_url, function(data){
        if(data && data.error) //Caught an error in the model, so it needs to be reported
        {
            reportError(data.errorInfo+". " +data.HTTPError );
            testErrorBoard();
        }else {
            // Actual code. Updates the div with the card data.
            var newDiv = cardTemplate(data);
            $("#KanbanBoard").append(newDiv);
            $(".TrelloListBlock").each(function() {
                var listID = $(this).attr('listID');
                loadListCards(listID);
                activateAddThingLinks("atc",listID);
                activateAddCardSubmit(listID);
                testSuccessBoard();
            });
        }
    }).fail(function( jqxhr, textStatus, error ) { //uncaught exception needs reporting
        var err = textStatus + ", " + error;
        reportError( "Could not load the Trello board: " + err );
        testExceptionBoard();
    });
}

//
// Card reloading
//

function reloadCardFromTrello(cardID) {
    var cardTemplate = Handlebars.compile($("#kanbanCardTemplate").html());
    var the_url = nodeURL+"trello/card/"+cardID+"/";
    var jqxhr = $.getJSON( the_url, function(data){
        if(data.error) //Caught an error in the model, so it needs to be reported
        {
            reportError(data.errorInfo+". " +data.HTTPError );
        }else {
            // Actual code. Updates the div with the card data.
            var newDiv = cardTemplate(data.trello_card);
            $("#tc-"+cardID).replaceWith(newDiv);
            testReloadCardSuccess();
        }
    })
        .fail(function( jqxhr, textStatus, error ) { //uncaught exception needs reporting
            var err = textStatus + ", " + error;
            reportError( "Request Failed: " + err );

        });
}

//
// Card Sorting
//

function makeCardListsSortable() {
    $( ".CardList" ).sortable({
      helper: 'clone',
      connectWith: ".CardList",
      stop: function(ui, event){
        //        Gather card data
        var cardID = event.item.attr('cardID');
        var cardDivID = event.item.attr('id');
        var cardPos = event.item.attr('cardPos');
        var oldList = ui.target;
        var oldListDivID = oldList.getAttribute('id');
        var newList = event.item[0].parentElement;
        var newListID = newList.getAttribute('listID');

        var movedCard = null;
        var prevCard = null;
        var nextCard = null;
        movedCard = $("div#cl-"+newListID).find("div#tc-"+cardID);
        prevCard = movedCard.prev();
        nextCard = movedCard.next();
        var newCardPos = "";
        //          New card should be either at the top of the list, at the bottom, or halfway between existing cards
        if(movedCard[0] && movedCard[0].getAttribute("cardPos") ){
          if(prevCard && prevCard.length > 0 && prevCard[0].getAttribute("cardPos") && prevCard[0].getAttribute("cardPos") != null ){
            var prevCardPos = parseInt(prevCard[0].getAttribute("cardPos"));
            if(nextCard && nextCard.length > 0 && nextCard[0].getAttribute("cardPos") && nextCard[0].getAttribute("cardPos") != null ){
        //                There are cards on both sides, so get the positions, and divide by two
              var nextCardPos = parseInt(nextCard[0].getAttribute("cardPos"));
              newCardPos = (prevCardPos + nextCardPos)/2;
            } else {
        //                There's no next card
                nextCardPos = null;
                newCardPos= "bottom";
            }
         } else {
            //    There's no previous card (and may or may not be a next card, but whatever)
            prevCardPos = null;
            newCardPos = "top";
          }
        }
        if(newCardPos != ""){
            $.ajax({
                type: 'PUT',
                url: nodeURL+'trello/card/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    listid: newListID,
                    cardid: cardID,
                    cardpos: newCardPos
                })
            }).done(function(data) {
                if(data && data.error){
                    restoreCardPosition(oldListDivID,cardDivID,oldList);
                    reportError(data.errorInfo+". " +data.HTTPError );
                }

            }).fail(function(xhr) {
                reportError("Update failed. " + xhr.statusText + ".");
                restoreCardPosition(oldListDivID,cardDivID,oldList);
            });
        }
      }
    }).disableSelection();
  }

function restoreCardPosition(oldListDivID,cardDivID,oldList) {
    var prevCard = null;
    $("#"+oldListDivID).find(".TrelloCard").each(function(){
        var oldCardPos = parseFloat($("#"+cardDivID).attr('cardPos'));
        var iterationCardPos = parseFloat($(this).attr('cardPos'));

        if(oldCardPos > iterationCardPos){
            prevCard=$(this);
        }
    });
    if(prevCard) {
        prevCard.after($("#"+cardDivID));
    } else {
        $("#"+cardDivID).prependTo(oldList);
    }
}
//
//  Card details
//

var cardBeingDisplayed = false;
function displayCard(event,cardID) {
    if(!cardBeingDisplayed){
//        Doubleclick catcher
        cardBeingDisplayed = true;
        var domElement =$(event.target);
        var callerValue = domElement[0].attributes[0].value;
    //    This makes sure the detail card doesn't show when clicking on the "open in trello" link
        if(callerValue != "/static/addons/trello/to_trello_16.png"){
            var jqxhr = getCardDetailInformation(cardID);
        }
    }
}

function getCardDetailInformation(cardID){
    var the_url = nodeURL+"trello/card/" + cardID +"/";
    $.getJSON( the_url, function(data){
                if(data && data.error) //Caught an error in the model, so it needs to be reported
                {
                    cardBeingDisplayed = false;
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testDetailCardError(data);
                }else {
                    // Actual code. Updates the div with the card data.
                    buildDetailCard(data);
                    testDetailCardSuccess(data);
                }
            }).fail(function( jqxhr, textStatus, error ) { //uncaught exception needs reporting
                cardBeingDisplayed = false;
                var err = textStatus + ", " + error;
                reportError( "Could not display the card details: " + err );
                testDetailCardException(textStatus,error);
            });
}

var box_contents = "";


function buildDetailCard(data) {

    Handlebars.registerHelper('markdown', function(text) {
         if(text && text != ""){
            var converter = new Showdown.converter();
            var converted = new Handlebars.SafeString(converter.makeHtml(replaceURLWithHTMLLinks(text)));
            return converted;
        }
        return "";
    });

    Handlebars.registerHelper('noBlankDescriptionMarkdown', function(text) {
        var converter = new Showdown.converter();
        var converted = new Handlebars.SafeString(converter.makeHtml(replaceURLWithHTMLLinks("*Edit description…*")));
        if(text && text != ""){
            converted = new Handlebars.SafeString(converter.makeHtml(replaceURLWithHTMLLinks(text)));
        }
        return converted;
    });

    Handlebars.registerHelper('localTime', function(date) {
        var theDate = new Date(date);
        var dateString = theDate.toLocaleDateString() + " " + theDate.toLocaleTimeString();
        return dateString;
    });

    var cardTemplate = Handlebars.compile($("#kanban-card-detail-template").html());

    box_contents = cardTemplate(data);

    $("#KanbanBoard").append(box_contents);

    cardBeingDisplayed = false;
    // Add all of the editing events to the items in the detail card if the user has access.
    if(data.user_can_edit){
        //    edit card name and archive card
        activateEditThingLinks("tcden",data.trello_card_id);
        activateEditCardNameSubmit(data.trello_card_id);
        activateArchiveCardSubmit(data.trello_card_id);
        //    edit card description
        activateEditThingLinks("tcded",data.trello_card_id);
        activateEditCardDescriptionSubmit(data.trello_card_id);
        //    Add checklist
        activateAddThingLinks("tcdacl",data.trello_card_id);
        activateAddChecklistSubmit(data.trello_card_id);
        $(".trello_card_detail_checklist").each(function() { //On every checklist in the detail card
            var checkListID = $(this).attr("checklistID");
            //        add checkitems
            activateAddThingLinks("tcdaci",checkListID);
            activateAddCheckItemSubmit(checkListID);
            //        edit checklist names
            activateEditThingLinks("tcdec",checkListID);
            activateEditChecklistNameSubmit(checkListID);
            activateDeleteChecklistSubmit(checkListID);
        });
        $(".trello_card_detail_checklist_checkitem").each(function() { //On every checkitem in the detail card
            var checkItemID = $(this).attr("checkitemid");
            //        edit checkitems
            activateEditThingLinks("tcdeci",checkItemID);
            activateEditCheckItemSubmit(checkItemID);
            activateDeleteCheckItemSubmit(checkItemID);
        });
    }

    if(data.trello_card.badges.attachments>0){
        getAttachmentJSON(data.trello_card_id);
    } else {
        testCardDetailsWithoutAttachment(data);
    }
}

function getAttachmentJSON(cardID){
    var the_url = nodeURL+"trello/attachments/" + cardID+"/";
    var jqxhr = $.getJSON( the_url, function(data){
        if(data && data.error) //Caught an error in the model, so it needs to be reported
        {
            reportError(data.errorInfo+". " +data.HTTPError );
            testGetAttachmentError(data);
        }
        else
        {
            addAttachmentInfo(data);
        }
    }).fail(function( jqxhr, textStatus, error ) { //uncaught exception needs reporting
        var err = textStatus + ", " + error;
        reportError( "Could not load the attachments: " + err );
        testGetAttachmentException(error);
    });
}

function addAttachmentInfo(data){
    var cardTemplate = Handlebars.compile($("#kanban-card-detail-attachments-template").html());
    $(".trello_card_detail_card").append(cardTemplate(data));
    testGetAttachmentSuccess(data);
}

//
// Add a card
//

function activateAddCardSubmit(listID){
    $("#atcb-"+listID).click(addCardSubmit);

    function addCardSubmit()
    { // Make sure the box isn't empty, then send the contents and the list to the create new card method
        var checklistName = $("#atcn-" + listID).val();
        if (checklistName.trim() != ""){
            // Send the card name and list id to trello
            $.ajax({
                    type: 'POST',
                    url: nodeURL+'trello/card/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        listid: listID,
                        cardname: checklistName
                    })
            })
            .done(addedNewCard)
            .fail(addedNewCardException);
        }
    }

    function addedNewCard(data){
        if(data && data.error) //Error reporting code for problems caught in the Model
        { // if it fails, report the error
            reportError(data.errorInfo+". " +data.HTTPError );
            testAddCardError(data);
        }else { // Actual code
            // Add a card div to the bottom of the list
              var cardTemplate = Handlebars.compile($("#kanbanCardTemplate").html());
              var newDiv = cardTemplate(data);
            $("#cl-" + listID).append(newDiv);
            // Clear out the contents of the textarea, hide the name input div,
            // and show the add card div (i.e. click the cancel button)
            $("#atcc-"+listID).click();
            testAddCardSuccess(data);
        }
    }

    function addedNewCardException(jqxhr, textStatus, error)
    { // if it fails, report uncaught exception
        var err = textStatus + ", " + error;
        reportError( "Could not add the card: " + err );
        testAddCardException(textStatus, error);
    }
}

function activateAddChecklistSubmit(cardID){
    $("#tcdaclb-"+cardID).click(function() {
        var theCardID=cardID;
        var checklistName = $("#tcdacln-" + theCardID).val();
        if (checklistName.trim() != ""){
            $.ajax({
                    type: 'POST',
                    url: nodeURL+'trello/checklist/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        cardid: theCardID,
                        checklistname: checklistName
                    })
            }).done(function(data) {
                if(data && data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testAddChecklistError(data);
                }else { // Actual code
                    //            Add a checklist div to the bottom of the list
                    data.cardid=theCardID;
                    var cardTemplate = Handlebars.compile($("#kanban-card-detail-checklist-template").html());
                    var newDiv = cardTemplate(data);
                    $(".trello_card_detail_checklist_list").append(newDiv);
                    //        add checkitems
                    activateAddThingLinks("tcdaci",data.id);
                    activateAddCheckItemSubmit(data.id);
                    //        edit checklist names
                    activateEditThingLinks("tcdec",data.id);
                    activateEditChecklistNameSubmit(data.id)
                    activateDeleteChecklistSubmit(data.id);
                    //          Clear out the contents of the textarea, hide the name input div,
                    //          and show the add card div (i.e. click the cancel button)
                    $("#tcdaclc-"+theCardID).click();
                    reloadCardFromTrello(theCardID);
                    testAddChecklistSuccess(data);
                }
            }).fail(function( jqxhr, textStatus, error ) {
                // if it fails, report uncaught exception
                var err = textStatus + ", " + error;
                reportError( "Could not add the checklist: " + err );
                testAddChecklistException(textStatus, error);
            });
        }
    });
}


function activateAddCheckItemSubmit(checklistID){
    $("#tcdacib-"+checklistID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method
    //listID = $(this).attr("listID");
        var checkItemName = $("#tcdacin-" + checklistID).val();
        var cardID = $("#tcdacin-" + checklistID).attr("cardid");

        if (checkItemName.trim() != ""){
        //          Send the card name and list id to trello
            $.ajax({
                    type: 'POST',
                    url: nodeURL+'trello/checkitem/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        checklistid: checklistID,
                        checkitemname: checkItemName
                    })
            }).done(function(data) {
                if(data && data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testAddCheckitemError(data);
                }else { // Actual code
                    //            Add a card div to the bottom of the list
                    //            Also, not at all happy about needing to re-write the contents. Really should be templated (or done all in JS rather than
                    //            writing html by hand. Still a bit duplicate-y).
                    var cardTemplate = Handlebars.compile($("#kanban-card-detail-checkitem-template").html());
                    data.checklistid = checklistID;
                    data.cardid = cardID;
                    var newDiv = cardTemplate(data);
                    $("#tcdccl-" + checklistID).append(newDiv);
                    activateEditThingLinks("tcdeci",data.id);
                    activateEditCheckItemSubmit(data.id);
                    activateDeleteCheckItemSubmit(data.id);

                    //          Clear out the contents of the textarea, hide the name input div,
                    //          and show the add card div (i.e. click the cancel button)

                    $("#tcdacic-"+checklistID).click();

                    reloadCardFromTrello(cardID);
                    testAddCheckitemSuccess(data);
                }
            }).fail(function( jqxhr, textStatus, error ) {
                // if it fails, report uncaught exception
                var err = textStatus + ", " + error;
                reportError( "Could not add the checklist item: " + err );
                testAddCheckitemException(textStatus, error);
            });
        }
    });
}


function activateEditCheckItemSubmit(checkitemID){
    $("#tcdecib-"+checkitemID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method
        var checkItemName = $("#tcdecin-" + checkitemID).val();
        var theCheckItemID = checkitemID;
        var checklistID = $("#tcdecin-" + checkitemID).attr("checklistid");
        var cardID = $("#tcdecin-" + checkitemID).attr("cardid");

        if (checkItemName.trim() != ""){
            $.ajax({
                    type: 'PUT',
                    url: nodeURL+'trello/checkitem/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        checklistid: checklistID,
                        name: checkItemName,
                        cardid: cardID,
                        checkitemid: theCheckItemID
                    })
                }).done(function(data) {
                if(data && data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, revert
                    $("#tcdecic-"+theCheckItemID).click();
                    // report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testEditCheckitemError(data);
                }else { // Actual code
                    $("#tcdecio-"+theCheckItemID).text(checkItemName);
                    $("#tcdecic-"+theCheckItemID).click();
                    reloadCardFromTrello(cardID);
                    testEditCheckitemSuccess(data);
                }
            }).fail(function( jqxhr, textStatus, error ) {
                // if it fails, revert
                $("#tcdecic-"+theCheckItemID).click();
                //Report uncaught exception
                var err = textStatus + ", " + error;
                reportError( "Could not edit the checklist item: " + err );
                testEditCheckitemException(textStatus, error );
            });
        }
    });
}



function activateEditCardNameSubmit(cardID){
    $("#tcdenb-"+cardID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method

        var checklistName = $("#tcdenn-" + cardID).val();
        var theCardID = cardID;

    if (checklistName.trim() != ""){
        $.ajax({
                type: 'PUT',
                url: nodeURL+'trello/card/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    cardname: checklistName,
                    cardid: theCardID
                })
            }).done(function(data) {
            if(data && data.error) //Error reporting code for problems caught in the Model
            {
                // if it fails, revert
                $("#tcdenc-"+theCardID).click();
                // report the error
                reportError(data.errorInfo+". " +data.HTTPError );
                testEditCardNameError(data);
            }else { // Actual code
                $("#tcdeno-"+theCardID).text(checklistName);
                $("#tcdenc-"+theCardID).click();
                reloadCardFromTrello(theCardID);
                testEditCardNameSuccess(data);
            }
        }).fail(function( jqxhr, textStatus, error ) {
            // if it fails, revert
            $("#tcdenc-"+theCardID).click();
            //Report uncaught exception
            var err = textStatus + ", " + error;
            reportError( "Could not change the card name: " + err );
            testEditCardNameException(textStatus, error);
        });
    }
    });
}

function activateEditCardDescriptionSubmit(cardID){
    var cardDescription = "";
    $("#tcdedb-"+cardID).click(function() {
        // Make sure the box isn't empty, then send the contents and the list to the create new card method
        var theCardID = cardID;
        cardDescription = $("#tcdedn-" + cardID).val();
        $.ajax({
                type: 'PUT',
                url: nodeURL+'trello/card/description/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    desc: cardDescription,
                    cardid: theCardID
                })
        })
            .done(function(data){
                if(data && data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, revert
                    $("#tcdedc-"+theCardID).click();
                    // report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testEditCardDescriptionError(data);
                }else { // Actual code
                    $("#tcdedo-"+theCardID).text(cardDescription);
                    var converter = new Showdown.converter();
                    if(cardDescription != "") {
                        var converted = converter.makeHtml(replaceURLWithHTMLLinks(cardDescription));
                    } else {
                        var converted = converter.makeHtml(replaceURLWithHTMLLinks("*Edit description…*"));
                    }
                    $("#tcdedom-"+theCardID).html(converted);
                    $("#tcdedc-"+theCardID).click();
                    reloadCardFromTrello(theCardID);
                    testEditCardDescriptionSuccess(data);
                }
            })
            .fail(function(jqxhr, textStatus, error){
                // if it fails, revert
                $("#tcdedc-"+theCardID).click();
                //Report uncaught exception
                var err = textStatus + ", " + error;
                reportError( "Could not change the card description: " + err );
                testEditCardDescriptionException(textStatus,error);
            });
    });
}



function activateEditChecklistNameSubmit(checklistID){
    $("#tcdecb-"+checklistID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method

        var checklistName = $("#tcdecn-" + checklistID).val();
        var theCardID = checklistID;

        if (checklistName.trim() != ""){
            $.ajax({
                    type: 'PUT',
                    url: nodeURL+'trello/checklist/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        checklistname: checklistName,
                        checklistid: theCardID
                    })
                }).done(function(data) {
                if(data && data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, revert
                    $("#tcdecc-"+theCardID).click();
                    // report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testEditChecklistNameError(data);

                }else { // Actual code
                    $("#tcdeco-"+theCardID).text(checklistName);
                    $("#tcdecc-"+theCardID).click();
                    testEditChecklistNameSuccess(data);
                }
            }).fail(function( jqxhr, textStatus, error ) {
                // if it fails, revert
                $("#tcdecc-"+theCardID).click();
                //Report uncaught exception
                var err = textStatus + ", " + error;
                reportError( "Could not edit the checklist name: " + err );
                testEditChecklistNameException(textStatus,error);
            });
        }
    });
}


//
//  Check/uncheck checkitem
//


function checkCheckItem(cardID,checkListID,checkItemID){
    var state = "";
    if($("#tcdc-ci-"+checkItemID).is(':checked')){
        state = "complete"
    } else {
        state = "incomplete"
    }
    $.ajax({
        type: 'PUT',
        url: nodeURL+'trello/checkitem/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            checklistid: checkListID,
            cardid: cardID,
            checkitemid: checkItemID,
            state: state
    })
    }).done(function(data) {
        if(data.error) //Error reporting code for problems caught in the Model
        {
            reportError(data.errorInfo+". " +data.HTTPError );
            // if it fails, revert the check/uncheck
            revertCheckitem(checkItemID);
            testCheckCheckitemError(data);
        }else { // Actual code
            reloadCardFromTrello(cardID);
            testCheckCheckitemSuccess(data);
        }
    }).fail(function( jqxhr, textStatus, error ) {
        // if it fails, revert the check/uncheck
        revertCheckitem(checkItemID);
        //Report uncaught exception
        var err = textStatus + ", " + error;
        reportError( "Could not change the checkitem state: " + err );
        testCheckCheckitemException(textStatus,error);
        });
}

function revertCheckitem(checkItemID){
    if($("#tcdc-ci-"+checkItemID).is(':checked')){
        $("#tcdc-ci-"+checkItemID).prop('checked', false);
    }else {
        $("#tcdc-ci-"+checkItemID).prop('checked', true);
    }
}

function activateDeleteCheckItemSubmit(checkitemID){
    $("#tcdecid-"+checkitemID).click(function() {

        var theCheckListID = checkitemID;
        var checklistID = $("#tcdecin-" + checkitemID).attr("checklistid");
        var cardID = $("#tcdecin-" + checkitemID).attr("cardID");


        $.ajax({
                type: 'DELETE',
                url: nodeURL+'trello/checkitem/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    checkitemid: theCheckListID
                })
            }).done(function(data) {
                if(data.error) //Error reporting code for problems caught in the Model
                {
        	        // if it fails, revert
        	        $("#tcdecic-"+theCheckListID).click();
        	        // report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testDeleteCheckitemError(data);
                }else { // Actual code
                    $("#tcdecig-"+theCheckListID).remove();
                    $("#tcdeciog-"+theCheckListID).remove();
                    reloadCardFromTrello(cardID);
                    testDeleteCheckitemSuccess(data);
                }
        }).fail(function( jqxhr, textStatus, error ) {
            // if it fails, revert
            $("#tcdecic-"+theCheckListID).click();
            //Report uncaught exception
            var err = textStatus + ", " + error;
            reportError( "Could not delete the checklist item: " + err );
            testDeleteCheckitemException(textStatus,error);

        });

    });
}

function activateDeleteChecklistSubmit(checklistID){
    $("#tcdecd-"+checklistID).click(function() {

        var theCheckListID = checklistID;
        var cardID = $("#tcdecn-" + checklistID).attr("cardID");


      $.ajax({
                type: 'DELETE',
                url: nodeURL+'trello/checklist/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    cardid: cardID
                })
            })
          .done(function(data) {
                if(data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, revert
                    $("#tcdecc-"+theCheckListID).click();
                    //Report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testDeleteChecklistError(data);
                }else { // Actual code
                    $("#tcdecg-"+theCheckListID).remove();
                    $("#tcdecog-"+theCheckListID).remove();
                    $("#tcdacig-"+theCheckListID).remove();
                    $("#tcdacil-"+theCheckListID).remove();
                    reloadCardFromTrello(cardID);
                    testDeleteChecklistSuccess(data);
                }
            })
          .fail(function( jqxhr, textStatus, error ) {
            // if it fails, revert
            $("#tcdecc-"+theCheckListID).click();

            //Report uncaught exception
            var err = textStatus + ", " + error;
            reportError( "Could not delete the checklist: " + err );
            testDeleteChecklistException(textStatus,error);
        });

    });
}

function activateArchiveCardSubmit(cardID){
    $("#tcdend-"+cardID).click(function() {
        var theCardID = cardID;
        $.ajax({
                type: 'PUT',
                url: nodeURL+'trello/card/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    cardid: theCardID,
                    closed: "true"
                })
            }).done(function(data) {
                if(data && data.error) //Error reporting code for problems caught in the Model
                {
                    // if it fails, report the error
                    reportError(data.errorInfo+". " +data.HTTPError );
                    testArchiveCardError(data);
                } else { // Actual code
                        // Remove the detail view and, from the summary view, the card archived
                    $("#tcd-"+theCardID).remove();
                    $("#tc-"+theCardID).remove();
                    testArchiveCardSuccess(data);
                }
        }).fail(function( jqxhr, textStatus, error ) {
            // if it fails, report uncaught exception
            var err = textStatus + ", " + error;
            reportError( "Could not archive the card: " + err );
            testArchiveCardException(textStatus,error);
        });
    });
}

//
// Add a <thing>
//

function activateAddThingLinks(prefix,identifier) {
        $("#"+prefix+"l-"+identifier).click(function() {
    //        Show the div with the editing controls, hide the div with the add a link button
    //        Also hide all the other editing divs, because someone could switch from one to the other
    //        and only one should show at a time
            //listID = $(this).attr("listID");
            $("#"+prefix+"l-"+identifier).hide();
            $("#"+prefix+"g-"+identifier).show();
            $("#"+prefix+"n-"+identifier).focus();
            var groupPrefix = prefix+"g-";
//            Find all the other divs and hide them
            $('[id^='+groupPrefix+']').each(function(){
                var thisID=$(this).attr("id");
                if(thisID != prefix+"g-"+identifier){
                    $(this).trigger("hideMe");
                }
                });
        });

        $("#"+prefix+"c-"+identifier).click(function() {
     //        Clear out the textarea, hide the edit div, show the add div
            //listID = $(this).attr("listID");
            $("#"+prefix+"n-" + identifier).val('');
            $("#"+prefix+"g-" + identifier).hide();
            $("#"+prefix+"l-" + identifier).show();
        });

        $("#"+prefix+"n-"+identifier).keypress(function(e) {
    //        Prevent the enter key from adding a return into the box. Otherwise act like pressing the add button
           if(e.keyCode == 13) // Enter key is pressed
           {
               event.preventDefault();
               //listID = $(this).attr("listID");
                $("#"+prefix+"b-"+identifier).click();
           }
        });

        $("#"+prefix+"n-"+identifier).keyup(function(e) {
    //        Act like hitting the cancel button
            if (e.keyCode == 27) { // esc key is released
                //listID = $(this).attr("listID");
                $("#"+prefix+"c-"+identifier).click();
            }
         });

        $("#"+prefix+"g-"+identifier).on("hideMe", function(event) {
               $("#"+prefix+"g-" + identifier).hide();
                $("#"+prefix+"l-" + identifier).show();
    });

}


//
// Edit a <thing>
//


function activateEditThingLinks(prefix,identifier) {
        $("#"+prefix+"o-"+identifier).click(function() {
    //        Show the div with the editing controls, hide the div with the original version
    //        Also hide all the other editing divs, because someone could switch from one to the other
    //        and only one should show at a time
            //listID = $(this).attr("listID");
            $("#"+prefix+"og-"+identifier).hide();
            $("#"+prefix+"g-"+identifier).show();
            $("#"+prefix+"n-"+identifier).focus();
            var groupPrefix = prefix+"g-";
//            Find all the other divs and hide them
            $('[id^='+groupPrefix+']').each(function(){
                var thisID=$(this).attr("id");
                if(thisID != prefix+"g-"+identifier){
                    $(this).trigger("hideMe");
                }
                });
        });

        $("#"+prefix+"om-"+identifier).click(function() {
            $("#"+prefix+"o-"+identifier).click();
        });

        $("#"+prefix+"c-"+identifier).click(function() {
     //        Replace contents of text box with original text, hide the edit div, show the add div
            //listID = $(this).attr("listID");
            var originalText = $("#"+prefix+"o-"+identifier).text();

            $("#"+prefix+"n-" + identifier).val(originalText);
            $("#"+prefix+"g-" + identifier).hide();
            $("#"+prefix+"og-" + identifier).show();
        });

        $("#"+prefix+"n-"+identifier).keypress(function(e) {
    //        Prevent the enter key from adding a return into the box. Otherwise act like pressing the add button
           if(e.keyCode == 13) // Enter key is pressed
           {
               if($("#"+prefix+"n-"+identifier).attr("submitOnReturn") != "false") {
                   event.preventDefault();
                   //listID = $(this).attr("listID");
                    $("#"+prefix+"b-"+identifier).click();
               }
           }
        });

        $("#"+prefix+"n-"+identifier).keyup(function(e) {
    //        Act like hitting the cancel button
            if (e.keyCode == 27) { // esc key is released
                //listID = $(this).attr("listID");
                $("#"+prefix+"c-"+identifier).click();
            }
         });

        $("#"+prefix+"g-"+identifier).on("hideMe", function(event) {
               $("#"+prefix+"g-" + identifier).hide();
                $("#"+prefix+"og-" + identifier).show();
    });

}


