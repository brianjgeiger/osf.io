function displayCard(cardID) {
    var the_url = "card/" + cardID;
    var box_contents = "";
    $.getJSON( the_url, function( data ) {
        box_contents += '<div class="trello_card_detail_name">' + data.trello_card.name + "</div>";
        box_contents += '<div class="trello_card_detail_desc">' + data.trello_card.desc + "</div>";
        bootbox.alert(box_contents);

    });


}
