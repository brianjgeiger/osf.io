  $(function() {
    $( ".TrelloListBlock" ).sortable({
      connectWith: ".TrelloListBlock",
      stop: function(ui, event){
        var cardID = event.item.attr('cardID');
        var cardPos = event.item.attr('cardPos');
        console.log('Card ID: ' + cardID + ' with old position ' + cardPos + ' just moved.');
        var oldList = ui.target;
        var oldListID =  oldList.getAttribute('listID');
        console.log('Moved from list' + oldListID);
          var newList = event.item[0].parentElement;
          var newListID = newList.getAttribute('listID');
          console.log('Moved to list' + newListID);
          var cardList = $("div#tl-"+newListID).find("div.TrelloCard");
          var movedCard = null;
          var prevCard = null;
          var nextCard = null;
          movedCard = $("div#tl-"+newListID).find("div#tc-"+cardID);
          prevCard = movedCard.prev();
          nextCard = movedCard.next();
          var newCardPos = "";
          if(movedCard[0].getAttribute("cardPos") ){
            console.log("Moved: " + movedCard[0].getAttribute("cardPos"));
              if(prevCard && prevCard[0].getAttribute("cardPos") && prevCard[0].getAttribute("cardPos") != null ){
                var prevCardPos = parseInt(prevCard[0].getAttribute("cardPos"));
                if(nextCard && nextCard.length > 0 && nextCard[0].getAttribute("cardPos") && nextCard[0].getAttribute("cardPos") != null ){
                  var nextCardPos = parseInt(nextCard[0].getAttribute("cardPos"));
                  newCardPos = (prevCardPos + nextCardPos)/2;
                  console.log("Prev: " + prevCardPos + " Next: " + nextCardPos + " New: " + newCardPos);
                } else {
                    nextCardPos = null;
                    newCardPos= "bottom";
                    console.log("End of list");

                }
             } else {
                  prevCardPos = null;
                  newCardPos = "top";
                  console.log("Beginning of list");
              }
           }
          if(newCardPos != ""){
                $.ajax({
                    type: 'POST',
                    url: 'card/',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        listid: newListID,
                        cardid: cardID,
                        cardpos: newCardPos
                    })
                }).done(function() {
                    console.log("Update done.");
                }).fail(function(xhr) {
                    console.log("Update failed.");
                });
          }
      }
    }).disableSelection();


  });
