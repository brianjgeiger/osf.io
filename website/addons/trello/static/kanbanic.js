
//
//  List loading
//

function loadListCards(listID) {
    cardTemplate = Handlebars.compile($("#kanban-card-template").html());
    var the_url = "list/" + listID;
    $.getJSON( the_url, function(data){
        $.each(data.trello_cards, function() {
            newDiv = cardTemplate($(this)[0]);
            $("#cl-" + listID).append(newDiv);
        });
        makeCardListsSortable();

    });
}

function loadBoard() {
    cardTemplate = Handlebars.compile($("#kanban-board-template").html());
    var the_url = "lists";
    $.getJSON( the_url, function(data){
        newDiv = cardTemplate(data);
        $("#KanbanBoard").append(newDiv);
        $(".TrelloListBlock").each(function() {
            listID = $(this).attr('listID');
            loadListCards(listID);
            activateAddCardLinks(listID);
        });

    });
}

//
// Card Sorting
//

function makeCardListsSortable() {
    $( ".CardList" ).sortable({
      connectWith: ".CardList",
      stop: function(ui, event){
//      Gather card data
        var cardID = event.item.attr('cardID');
        var cardPos = event.item.attr('cardPos');
        var oldList = ui.target;
        var oldListID =  oldList.getAttribute('listID');
        var newList = event.item[0].parentElement;
        var newListID = newList.getAttribute('listID');
        var cardList = $("div#cl-"+newListID).find("div.TrelloCard");
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
//              There's no previous card (and may or may not be a next card, but whatever)
              prevCardPos = null;
              newCardPos = "top";
          }
        }
        if(newCardPos != ""){
            $.ajax({
                type: 'PUT',
                url: 'card/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    listid: newListID,
                    cardid: cardID,
                    cardpos: newCardPos
                })
            }).done(function() {
        //                    console.log("Update done.");
            }).fail(function(xhr) {
                // TODO: move the card back to oldListID and position cardPos
                console.log("Update failed.");
            });
        }
      }
    }).disableSelection();


  }

//
//  Card details
//
var cardBeingDisplayed = false;
function displayCard(cardID) {
    if(!cardBeingDisplayed){
//        Doubleclick catcher
        cardBeingDisplayed = true;
        var domElement =$(event.target);
        var callerValue = domElement[0].attributes[0].value;
    //    This makes sure the detail card doesn't show when clicking on the "open in trello" link
        if(callerValue != "/addons/static/trello/to_trello_16.png"){
            var the_url = "card/" + cardID;
            $.getJSON( the_url, buildDetailCard);
        }
    }
}

var box_contents = "";

function buildDetailCard(data) {

    Handlebars.registerHelper('markdown', function(text) {
        if(text && text != ""){
            converter = new Showdown.converter();
            return new Handlebars.SafeString(converter.makeHtml(replaceURLWithHTMLLinks(text)));
        }
        return text;
    });

    Handlebars.registerHelper('localTime', function(date) {
        theDate = new Date(date);
        dateString = theDate.toLocaleDateString() + " " + theDate.toLocaleTimeString();
        return dateString;
    });
    cardTemplate = Handlebars.compile($("#kanban-card-detail-template").html());
    var card_writer = "";
    if(data.user_can_edit){
        card_writer = "*"
    }
    box_contents = cardTemplate(data);
    if(data.trello_card.badges.attachments>0){
        the_url = "attachments/" + data.trello_card_id;
        $.getJSON( the_url, addAttachmentInfo);
    } else {
        showDetailCard();
    }
}


function addAttachmentInfo(data){
    cardTemplate = Handlebars.compile($("#kanban-card-detail-attachments-template").html());
    box_contents += cardTemplate(data);
    showDetailCard();
}


function showDetailCard() {
    cardBeingDisplayed = false;
     bootbox.alert(box_contents);
}


function replaceURLWithHTMLLinks(text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1'>$1</a>");
}

//
// Add a card
//

function activateAddCardLinks(listID) {
        $("#atcl-"+listID).click(function() {
    //        Show the div with the editing controls, hide the div with the add a link button
    //        Also hide all the other editing divs, because someone could switch from one to the other
    //        and only one should show at a time
            //listID = $(this).attr("listID");
            $(this).hide();
            $("#atcg-"+listID).show();
            $("#atcn-"+listID).focus();
            $(".add_trello_card_group").trigger("hideAllOthers",[listID]);
        });

        $("#atcb-"+listID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method
            //listID = $(this).attr("listID");
            cardName = $("#atcn-" + listID).val();
            if (cardName.trim() != ""){
    //          Send the card name and list id to trello
              $.ajax({
                        type: 'POST',
                        url: 'card/',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({
                            listid: listID,
                            cardname: cardName
                        })
                    }).done(function(data) {
                  console.log(data);
    //            Add a card div to the bottom of the list
    //            Also, not at all happy about needing to re-write the contents. Really should be templated (or done all in JS rather than
    //            writing html by hand. Still a bit duplicate-y).
                  cardTemplate = Handlebars.compile($("#kanban-card-template").html());
                  newDiv = cardTemplate(data);
                $("#cl-" + listID).append(newDiv);


    //          Clear out the contents of the textarea, hide the name input div,
    //          and show the add card div (i.e. click the cancel button)
                $("#atcc-"+listID).click();
              }).fail(function(xhr) {
                        console.log("Card creation failed.");
                    });
            }
        });

        $("#atcc-"+listID).click(function() {
    //        Clear out the textarea, hide the edit div, show the add div
            //listID = $(this).attr("listID");
            $("#atcn-" + listID).val('');
            $("#atcg-" + listID).hide();
            $("#atcl-" + listID).show();
        });

        $("#atcn-"+listID).keypress(function(e) {
    //        Prevent the enter key from adding a return into the box. Otherwise act like pressing the add button
           if(e.keyCode == 13) // Enter key is pressed
           {
               event.preventDefault();
               //listID = $(this).attr("listID");
                $("#atcb-"+listID).click();
           }
        });

        $("#atcn-"+listID).keyup(function(e) {
    //        Act like hitting the cancel button
            if (e.keyCode == 27) { // esc key is released
                //listID = $(this).attr("listID");
                $("#atcc-"+listID).click();
            }
         });

        $("#atcg-"+listID).on( "hideAllOthers", function( event, listIdNotToHide ) {
    //        Hide every edit div but the current one so you can only add one card at a time
            //listID = $(this).attr("listID");
            if (listIdNotToHide != listID){
                $("#atcg-" + listID).hide();
                $("#atcl-" + listID).show();
            }
    });

}


//
//  Edit description
//



//
//  Check/uncheck checkitem
//

function checkCheckItem(cardID,checkListID,checkItemID){
    if($("#tcdc-ci-"+checkItemID).is(':checked')){
        state = "complete"
    } else {
        state = "incomplete"
    }
    $.ajax({
        type: 'PUT',
        url: 'checkitem/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            checklistid: checkListID,
            cardid: cardID,
            checkitemid: checkItemID,
            state: state
    })
    }).done(function() {
        //                    console.log("Update done.");
    }).fail(function(xhr) {
        // if it fails, revert the check/uncheck
        // TODO: Add a warning about not being able to do stuff
        if($("#tcdc-ci-"+checkItemID).is(':checked')){
            $("#tcdc-ci-"+checkItemID).prop('checked', false);
        }else {
            $("#tcdc-ci-"+checkItemID).prop('checked', true);
        }
        console.log("Update failed.");
    });
}

//
//  Add checkitem
//



//
//  Add comment
//



//
//  Add/edit due date
//


//
//  Add Lists
//