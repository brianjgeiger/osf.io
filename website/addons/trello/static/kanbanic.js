//
// Card Sorting
//

$(function() {
    $( ".CardList" ).sortable({
      connectWith: ".CardList",
      stop: function(ui, event){
        var cardID = event.item.attr('cardID');
        var cardPos = event.item.attr('cardPos');
//        console.log('Card ID: ' + cardID + ' with old position ' + cardPos + ' just moved.');
        var oldList = ui.target;
        var oldListID =  oldList.getAttribute('listID');
//        console.log('Moved from list ' + oldListID);
          var newList = event.item[0].parentElement;
          var newListID = newList.getAttribute('listID');
//          console.log('Moved to list ' + newListID);
          var cardList = $("div#cl-"+newListID).find("div.TrelloCard");
          var movedCard = null;
          var prevCard = null;
          var nextCard = null;
          console.log("div#cl-"+newListID + "," + "div#tc-"+cardID);
          movedCard = $("div#cl-"+newListID).find("div#tc-"+cardID);
          prevCard = movedCard.prev();
          nextCard = movedCard.next();
          var newCardPos = "";
          if(movedCard[0] && movedCard[0].getAttribute("cardPos") ){
//             console.log("Moved: " + movedCard[0].getAttribute("cardPos"));
              if(prevCard && prevCard.length > 0 && prevCard[0].getAttribute("cardPos") && prevCard[0].getAttribute("cardPos") != null ){
                var prevCardPos = parseInt(prevCard[0].getAttribute("cardPos"));
                if(nextCard && nextCard.length > 0 && nextCard[0].getAttribute("cardPos") && nextCard[0].getAttribute("cardPos") != null ){
                  var nextCardPos = parseInt(nextCard[0].getAttribute("cardPos"));
                  newCardPos = (prevCardPos + nextCardPos)/2;
//                  console.log("Prev: " + prevCardPos + " Next: " + nextCardPos + " New: " + newCardPos);
                } else {
                    nextCardPos = null;
                    newCardPos= "bottom";
//                    console.log("End of list");

                }
             } else {
                  prevCardPos = null;
                  newCardPos = "top";
//                  console.log("Beginning of list");
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
                    console.log("Update failed.");
                });
          }
      }
    }).disableSelection();


  });

//
//  Card details
//
var cardBeingDisplayed = false;
function displayCard(cardID) {
    if(!cardBeingDisplayed){
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

// This is terrible. I should be able to use a mako template and fill in from there. Find out how.
// The difficulty is that it's dynamic (the structure changes depending on the features of the card), so I
// may have to re-architect the card if it's possible at all. Otherwise, I might want to find a JS template
// system to use instead. I'm told there's some fancy {{ system in the mako templates that may do what I need.

function buildDetailCard(data) {
    var converter = new Showdown.converter();
    var card_writer = "";
    if(data.user_can_edit){
        card_writer = "*"
    }
    box_contents = '<div class="trello_card_detail_name">' + data.trello_card.name
        + '<a href="'+ data.trello_card.url + '" target=":_blank">'
        + '<img src = "/addons/static/trello/to_trello_24.png" title="Open'+ data.trello_card.name +' on Trello"></a>'
        + "</div>"
        + '<div class="trello_card_detail_desc">' + converter.makeHtml(replaceURLWithHTMLLinks(data.trello_card.desc)) + "</div>";
        if(data.trello_card.badges.checkItems > 0){
            $.each(data.trello_card.checklists, function(key,value) {
                box_contents += '<div class = "trello_card_detail_checklist_name">' + value.name +'</div>';
                $.each(value.checkItems, function(key,value) {
                    box_contents += '<div class = "trello_card_detail_checklist_checkitem">'
                        + '<span class = "' + value.state + '">' + value.name + '</span>';
                });
            });
        }

        if(data.trello_card.badges.comments > 0) {
            box_contents +=
                '<div class = "trello_card_detail_comment_count">'
                + data.trello_card.badges.comments + " comment";
            if (data.trello_card.badges.comments > 1) {
                box_contents += "s";
            }
            box_contents += '</div>';
            $.each(data.trello_card.comments,function(key,value){
                box_contents += '<div class = "trello_card_detail_comment">'
                    +    '<div class = "trello_card_detail_comment_header">'
                    +    '<div class = "trello_card_detail_comment_date">';

                commentDate = new Date(value.date);

                box_contents +=
                       commentDate.toLocaleDateString() +" "
                    +  commentDate.toLocaleTimeString() + '</div>'
                    +    '<div class =  "trello_card_detail_comment_owner">'
                    +       value.memberCreator.fullName + '</div>'
                    +    '</div>'
                    +    '<div class = "trello_card_detail_comment_comment"><p>'
                    +       converter.makeHtml(replaceURLWithHTMLLinks(value.data.text)) + '</p></div>'
                    + '</div>';
           });
        }
    if(data.trello_card.badges.attachments>0){
        the_url = "attachments/" + data.trello_card_id;
        $.getJSON( the_url, addAttachmentInfo);
    } else {
        showDetailCard();
    }
}

function addAttachmentInfo(data){
    box_contents += '<div class = "trello_card_detail_attchment_header">Attachments</div>';
    $.each(data.attachments, function(key, value){
        var nameSplit = value.name.split(".");
        var previewContents = "";
        if (nameSplit.length > 1) {
            previewContents = nameSplit[nameSplit.length-1];
        }

        if(value.previews.length > 0){
            previewItem = Math.min(1,value.previews.length);
            previewContents = '<img src = "' + value.previews[previewItem].url + '" title = "'
                + value.name + '">';
        }
        box_contents += '<div class = "trello_card_detail_attachment">'
                + '<span class = "attachment_preview">'
                    + previewContents
                + '</span>'
                + '<span class = "attachment_description">'
                    + '<a href="' + value.url + '" target="_none">' + value.name + '</a>'
                + '</span>'
            + '</div>';

    });
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

$(function() {
    $(".add_trello_card_link").click(function() {
        listID = $(this).attr("listID");
        $(this).hide();
        $("#atcg-"+listID).show();
        $("#atcn-"+listID).focus();
        $(".add_trello_card_group").trigger("hideAllOthers",[listID]);
    });

    $(".add_trello_card_button").click(function() {
        listID = $(this).attr("listID");
//      TODO: Sanitize this text. Although, since it's going through JSON, this may not be necessary.
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
//          Get info about new card
            newCardId = data.id;
            newCardPos = data.pos;
            newCardURL = data.url;
            newCardName = data.name;
//          Add a card div to the bottom of the list
//          Also, not at all happy about needing to re-write the contents. Really should be templated (or done all in JS rather than
//          writing html by hand. Still a bit duplicate-y).
            newDiv = '<div class="TrelloCard" id="tc-' + newCardId + '" '
                    + 'onclick="displayCard(\'' + newCardId + '\');" '
                    + 'onmouseover="document.getElementById(\'tcli-' + newCardId +'\').style.display = \'inline\';" '
                    + 'onmouseout="document.getElementById(\'tcli-' + newCardId +'\').style.display = \'none\';" '
                    + 'cardPos="'+ newCardPos + '" cardID="' + newCardId + '"> '
                    + '<div class="TrelloCardLinkIcon" id="tcli-' + newCardId +'"><a href="' + newCardURL + '" target=":_blank"> '
                    + '<img src = "/addons/static/trello/to_trello_16.png" title="Open \'' + newCardName +'\' on Trello"></a></div> '
                    + '<div class = "TrelloCardName">'+ newCardName +'</div>';
            $("#cl-" + listID).append(newDiv);


//          Clear out the contents of the textarea, hide the name input div,
//          and show the add card div (i.e. click the cancel button)
            $("#atcc-"+listID).click();
          }).fail(function(xhr) {
                    console.log("Card creation failed.");
                });
        }
    });

    $(".add_trello_card_cancel").click(function() {
        listID = $(this).attr("listID");
        $("#atcn-" + listID).val('');
        $("#atcg-" + listID).hide();
        $("#atcl-" + listID).show();
    });

    $(".add_trello_card_name").keypress(function(e) {
       if(e.keyCode == 13) // Enter key is pressed
       {
           event.preventDefault();
           listID = $(this).attr("listID");
            $("#atcb-"+listID).click();
       }
    });

    $(".add_trello_card_name").keyup(function(e) {
        if (e.keyCode == 27) { // esc key is released
            listID = $(this).attr("listID");
            $("#atcc-"+listID).click();
        }
     });

    $(".add_trello_card_group").on( "hideAllOthers", function( event, listIdNotToHide ) {
        listID = $(this).attr("listID");
        if (listIdNotToHide != listID){
            $("#atcg-" + listID).hide();
            $("#atcl-" + listID).show();
        }
});

});