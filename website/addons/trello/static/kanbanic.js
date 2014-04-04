
//
//  List loading
//

function loadListCards(listID) {
    var cardTemplate = Handlebars.compile($("#kanban-card-template").html());
    var the_url = "list/" + listID;
    $.getJSON( the_url, function(data){
        $.each(data.trello_cards, function() {
            var newDiv = cardTemplate($(this)[0]);
            $("#cl-" + listID).append(newDiv);
        });
        makeCardListsSortable();
    });
}

function loadBoard() {
    var cardTemplate = Handlebars.compile($("#kanban-board-template").html());
    var the_url = "lists";
    $.getJSON( the_url, function(data){
        var newDiv = cardTemplate(data);
        $("#KanbanBoard").append(newDiv);
        $(".TrelloListBlock").each(function() {
            var listID = $(this).attr('listID');
            loadListCards(listID);
            activateAddThingLinks("atc",listID);
            activateAddCardSubmit(listID);
        });
    });
}

//
// Card reloading
//

function reloadCardFromTrello(cardID) {
    var cardTemplate = Handlebars.compile($("#kanban-card-template").html());
    var the_url = "card/"+cardID;
    $.getJSON( the_url, function(data){
        var newDiv = cardTemplate(data.trello_card);
        console.log(data);
        console.log("#tc-"+cardID);
        $("#tc-"+cardID).replaceWith(newDiv);
    });
}

//
// Card Sorting
//

function makeCardListsSortable() {
    $( ".CardList" ).sortable({
      connectWith: ".CardList",
      stop: function(ui, event){
        //        Gather card data
        var cardID = event.item.attr('cardID');
        var cardDivID = event.item.attr('id');
        var cardPos = event.item.attr('cardPos');
        var oldList = ui.target;
        var oldListDivID = oldList.getAttribute('id');
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
            //    There's no previous card (and may or may not be a next card, but whatever)
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
              //  console.log(originalCardAfter);
                prevCard = null;
                $("#"+oldListDivID).find(".TrelloCard").each(function(){
                    oldCardPos = parseFloat($("#"+cardDivID).attr('cardPos'));
                    iterationCardPos = parseFloat($(this).attr('cardPos'));

                    if(oldCardPos > iterationCardPos){
                        prevCard=$(this);
                    }
                });
                if(prevCard) {
                    prevCard.after($("#"+cardDivID));
                } else {
                    $("#"+cardDivID).prependTo(oldList);
                }
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

// This useful function found on StackOverflow http://stackoverflow.com/a/7385673
$(document).click(function (e) {
    var container = $(".trello_card_detail_card");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $(".trello_card_detail").remove();
    }
});

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
        theDate = new Date(date);
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
            activateEditChecklistNameSubmit(checkListID)
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
        var the_url = "attachments/" + data.trello_card_id;
        $.getJSON( the_url, addAttachmentInfo);
    }
}

function addAttachmentInfo(data){
    var cardTemplate = Handlebars.compile($("#kanban-card-detail-attachments-template").html());
    $(".trello_card_detail_card").append(cardTemplate(data));
}

function replaceURLWithHTMLLinks(text) {
    var linkedText = Autolinker.link( text, {truncate: 50, newWindow: true } );
  return linkedText;
}

//
// Add a card
//

function activateAddCardSubmit(listID){
    $("#atcb-"+listID).click(function() {
//        Make sure the box isn't empty, then send the contents and the list to the create new card method
        var checklistName = $("#atcn-" + listID).val();
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
              var cardTemplate = Handlebars.compile($("#kanban-card-template").html());
              var newDiv = cardTemplate(data);
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
        var theCardID=cardID
        var checklistName = $("#tcdacln-" + theCardID).val();
        if (checklistName.trim() != ""){
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
        var checkItemName = $("#tcdacin-" + checklistID).val();
        var cardID = $("#tcdacin-" + checklistID).attr("cardid");

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
      }).fail(function(xhr) {
                console.log("Card creation failed.");
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
                url: 'checkitem/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    checklistid: checklistID,
                    name: checkItemName,
                    cardid: cardID,
                    checkitemid: theCheckItemID
                })
            }).done(function(data) {
                $("#tcdecio-"+theCheckItemID).text(checkItemName);
                $("#tcdecic-"+theCheckItemID).click();
                reloadCardFromTrello(cardID);
      }).fail(function(xhr) {
                $("#tcdecic-"+theCheckItemID).click();
                console.log("Checkitem update failed.");
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
                reloadCardFromTrello(theCardID);
      }).fail(function(xhr) {
                $("#tcdenc-"+theCardID).click();
                console.log("Checkitem update failed.");
            });
    }
    });
}

function activateEditCardDescriptionSubmit(cardID){
    $("#tcdedb-"+cardID).click(function() {
    //        Make sure the box isn't empty, then send the contents and the list to the create new card method
        var theCardID = cardID;
        var cardDescription = $("#tcdedn-" + cardID).val();



      $.ajax({
                type: 'PUT',
                url: 'card/description/',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    desc: cardDescription,
                    cardid: theCardID
                })
            }).done(function(data) {
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
      }).fail(function(xhr) {
                $("#tcdedc-"+theCardID).click();
                console.log("Checkitem update failed.");
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

        var theCheckListID = checkitemID;
        var checklistID = $("#tcdecin-" + checkitemID).attr("checklistid");
        var cardID = $("#tcdecin-" + checkitemID).attr("cardID");


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
                reloadCardFromTrello(cardID);

      }).fail(function(xhr) {
                $("#tcdecic-"+theCheckListID).click();
                console.log("Checkitem delete failed.");
            });

    });
}


function activateDeleteChecklistSubmit(checklistID){
    $("#tcdecd-"+checklistID).click(function() {

        var theCheckListID = checklistID;
        var cardID = $("#tcdecn-" + checklistID).attr("cardID");


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
                reloadCardFromTrello(cardID);
      }).fail(function(xhr) {
                $("#tcdecc-"+theCheckListID).click();
                console.log("Checkitem delete failed.");
            });

    });
}


function activateArchiveCardSubmit(cardID){
    $("#tcdend-"+cardID).click(function() {
        var theCardID = cardID;
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
        reloadCardFromTrello(cardID);
    }).fail(function(xhr) {
        // if it fails, revert the check/uncheck
        if($("#tcdc-ci-"+checkItemID).is(':checked')){
            $("#tcdc-ci-"+checkItemID).prop('checked', false);
        }else {
            $("#tcdc-ci-"+checkItemID).prop('checked', true);
        }
        console.log("Update failed.");
    });
}

