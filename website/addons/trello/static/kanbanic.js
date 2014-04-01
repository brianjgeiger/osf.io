
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
            activateAddThingLinks("atc",listID);
            activateAddCardSubmit(listID);
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

    $("#KanbanBoard").append(box_contents);

    cardBeingDisplayed = false;
    $(document).mouseup(function (e) {
        var container = $(".trello_card_detail_card");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            $(".trello_card_detail").remove();
        }
    });
//    edit card name and archive card
        activateEditThingLinks("tcden",data.trello_card_id);
        activateEditCardNameSubmit(data.trello_card_id);
        activateArchiveCardSubmit(data.trello_card_id);
//    Add checklist
        activateAddThingLinks("tcdacl",data.trello_card_id);
        activateAddChecklistSubmit(data.trello_card_id);
    $(".trello_card_detail_checklist").each(function() {
        checkListID = $(this).attr("checklistID");
//        add checkitems
        activateAddThingLinks("tcdaci",checkListID);
        activateAddCheckItemSubmit(checkListID);
//        edit checklist names
        activateEditThingLinks("tcdec",checkListID);
        activateEditChecklistNameSubmit(checkListID)
        activateDeleteChecklistSubmit(checkListID);
    });

    $(".trello_card_detail_checklist_checkitem").each(function() {
        checkItemID = $(this).attr("checkitemid");
//        edit checkitems
        activateEditThingLinks("tcdeci",checkItemID);
        activateEditCheckItemSubmit(checkItemID);
        activateDeleteCheckItemSubmit(checkItemID);
    });



    if(data.trello_card.badges.attachments>0){
        the_url = "attachments/" + data.trello_card_id;
        $.getJSON( the_url, addAttachmentInfo);
    }

}


function addAttachmentInfo(data){
    cardTemplate = Handlebars.compile($("#kanban-card-detail-attachments-template").html());
    $(".trello_card_detail_card").append(cardTemplate(data));
}


function replaceURLWithHTMLLinks(text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1'>$1</a>");
}

//
// Add a card
//

function activateAddCardSubmit(listID){
    $("#atcb-"+listID).click(function() {
//        Make sure the box isn't empty, then send the contents and the list to the create new card method
        checklistName = $("#atcn-" + listID).val();
        if (checklistName.trim() != ""){
//          Send the card name and list id to trello
          $.ajax({
                    type: 'POST',
                    url: 'card/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        listid: listID,
                        cardname: checklistName
                    })
                }).done(function(data) {
    //            Add a card div to the bottom of the list
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
}

function activateAddChecklistSubmit(cardID){
    $("#tcdaclb-"+cardID).click(function() {
//        Make sure the box isn't empty, then send the contents and the list to the create new card method
        theCardID=cardID
        checklistName = $("#tcdacln-" + theCardID).val();
        if (checklistName.trim() != ""){
//          Send the card name and list id to trello
          $.ajax({
                    type: 'POST',
                    url: 'checklist/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        cardid: theCardID,
                        checklistname: checklistName
                    })
                }).done(function(data) {
    //            Add a checklist div to the bottom of the list
              data.cardid=theCardID;
              cardTemplate = Handlebars.compile($("#kanban-card-detail-checklist-template").html());
              newDiv = cardTemplate(data);
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
          }).fail(function(xhr) {
                    console.log("Card creation failed.");
                });
        }
    });
}

function activateAddCheckItemSubmit(checklistID){
    $("#tcdacib-"+checklistID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method
    //listID = $(this).attr("listID");
    checkItemName = $("#tcdacin-" + checklistID).val();
        cardID = $("#tcdacin-" + checklistID).attr("cardid");

    if (checkItemName.trim() != ""){
    //          Send the card name and list id to trello
      $.ajax({
                type: 'POST',
                url: 'checkitem/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    checkitemname: checkItemName
                })
            }).done(function(data) {
    //            Add a card div to the bottom of the list
    //            Also, not at all happy about needing to re-write the contents. Really should be templated (or done all in JS rather than
    //            writing html by hand. Still a bit duplicate-y).
          cardTemplate = Handlebars.compile($("#kanban-card-detail-checkitem-template").html());
          data.checklistid = checklistID;
          data.cardid = cardID;

          newDiv = cardTemplate(data);
        $("#tcdccl-" + checklistID).append(newDiv);
        activateEditThingLinks("tcdeci",data.id);
        activateEditCheckItemSubmit(data.id);
        activateDeleteCheckItemSubmit(data.id);
   //          Clear out the contents of the textarea, hide the name input div,
    //          and show the add card div (i.e. click the cancel button)
        $("#tcdacic-"+checklistID).click();
      }).fail(function(xhr) {
                console.log("Card creation failed.");
            });
    }
    });

}

function activateEditCheckItemSubmit(checkitemID){
    $("#tcdecib-"+checkitemID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method

        checkItemName = $("#tcdecin-" + checkitemID).val();
        theCheckListID = checkitemID;
        checklistID = $("#tcdecin-" + checkitemID).attr("checklistid");
        cardID = $("#tcdecin-" + checkitemID).attr("cardid");

    if (checkItemName.trim() != ""){
    //          Send the checkitem name, checklist id, checkitem id, and card id to trello
      $.ajax({
                type: 'PUT',
                url: 'checkitem/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    name: checkItemName,
                    cardid: cardID,
                    checkitemid: theCheckListID
                })
            }).done(function(data) {
                $("#tcdecio-"+theCheckListID).text(checkItemName);
                $("#tcdecic-"+theCheckListID).click();
      }).fail(function(xhr) {
                $("#tcdecic-"+theCheckListID).click();
                console.log("Checkitem update failed.");
            });
    }
    });
}


function activateEditCardNameSubmit(cardID){
    $("#tcdenb-"+cardID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method

        checklistName = $("#tcdenn-" + cardID).val();
        theCardID = cardID;

    if (checklistName.trim() != ""){
      $.ajax({
                type: 'PUT',
                url: 'card/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    cardname: checklistName,
                    cardid: theCardID
                })
            }).done(function(data) {
                $("#tcdeno-"+theCardID).text(checklistName);
                $("#tcdenc-"+theCardID).click();
      }).fail(function(xhr) {
                $("#tcdenc-"+theCardID).click();
                console.log("Checkitem update failed.");
            });
    }
    });
}


function activateEditChecklistNameSubmit(checklistID){
    $("#tcdecb-"+checklistID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method

        checklistName = $("#tcdecn-" + checklistID).val();
        theCardID = checklistID;

    if (checklistName.trim() != ""){
      $.ajax({
                type: 'PUT',
                url: 'checklist/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistname: checklistName,
                    checklistid: theCardID
                })
            }).done(function(data) {
                $("#tcdeco-"+theCardID).text(checklistName);
                $("#tcdecc-"+theCardID).click();
      }).fail(function(xhr) {
                $("#tcdecc-"+theCardID).click();
                console.log("Checkitem update failed.");
            });
    }
    });
}


function activateDeleteCheckItemSubmit(checkitemID){
    $("#tcdecid-"+checkitemID).click(function() {

        theCheckListID = checkitemID;
        checklistID = $("#tcdecin-" + checkitemID).attr("checklistid");


      $.ajax({
                type: 'DELETE',
                url: 'checkitem/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    checkitemid: theCheckListID
                })
            }).done(function(data) {
                $("#tcdecig-"+theCheckListID).remove();
                $("#tcdeciog-"+theCheckListID).remove();
      }).fail(function(xhr) {
                $("#tcdecic-"+theCheckListID).click();
                console.log("Checkitem delete failed.");
            });

    });
}


function activateDeleteChecklistSubmit(checklistID){
    $("#tcdecd-"+checklistID).click(function() {

        theCheckListID = checklistID;
        cardID = $("#tcdecn-" + checklistID).attr("cardID");


      $.ajax({
                type: 'DELETE',
                url: 'checklist/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    cardid: cardID
                })
            }).done(function(data) {
                $("#tcdecg-"+theCheckListID).remove();
                $("#tcdecog-"+theCheckListID).remove();
                $("#tcdacig-"+theCheckListID).remove();
                $("#tcdacil-"+theCheckListID).remove();
      }).fail(function(xhr) {
                $("#tcdecc-"+theCheckListID).click();
                console.log("Checkitem delete failed.");
            });

    });
}


function activateArchiveCardSubmit(cardID){
    $("#tcdend-"+cardID).click(function() {
        theCardID = cardID;
      $.ajax({
                type: 'PUT',
                url: 'card/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    cardid: theCardID,
                    closed: "true"
                })
            }).done(function(data) {
//          Remove the detail view and, from the summary view, the card archived
                $(".trello_card_detail").remove();
                $("#tc-"+theCardID).remove();
      }).fail(function(xhr) {
                console.log("Card archive failed.");
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
            groupPrefix = prefix+"g-";
//            Find all the other divs and hide them
            $('[id^='+groupPrefix+']').each(function(){
                thisID=$(this).attr("id");
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
            groupPrefix = prefix+"g-";
//            Find all the other divs and hide them
            $('[id^='+groupPrefix+']').each(function(){
                thisID=$(this).attr("id");
                if(thisID != prefix+"g-"+identifier){
                    $(this).trigger("hideMe");
                }
                });
        });

        $("#"+prefix+"c-"+identifier).click(function() {
     //        Replace contents of text box with original text, hide the edit div, show the add div
            //listID = $(this).attr("listID");
            originalText = $("#"+prefix+"o-"+identifier).text();
            $("#"+prefix+"n-" + identifier).val(originalText);
            $("#"+prefix+"g-" + identifier).hide();
            $("#"+prefix+"og-" + identifier).show();
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
                $("#"+prefix+"og-" + identifier).show();
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
//  Add comment
//



//
//  Add/edit due date
//


//
//  Add Lists
//