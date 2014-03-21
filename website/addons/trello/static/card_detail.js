function displayCard(cardID) {
    var domElement =$(event.target);
    var callerValue = domElement[0].attributes[0].value;
//    This makes sure the detail card doesn't show when clicking on the "open in trello" link
    if(callerValue != "/addons/static/trello/to_trello_16.png"){
        var the_url = "card/" + cardID;
        $.getJSON( the_url, buildDetailCard);
    }
}

var box_contents = "";

function buildDetailCard(data) {
    box_contents = '<div class="trello_card_detail_name">' + data.trello_card.name
        + '<a href="'+ data.trello_card.url + '" target=":_blank">'
        + '<img src = "/addons/static/trello/to_trello_24.png" title="Open'+ data.trello_card.name +' on Trello"></a>'
        + "</div>"
        + '<div class="trello_card_detail_desc">' + data.trello_card.desc + "</div>";
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

                theDate = new Date(value.date);

                box_contents +=
                       theDate.toLocaleDateString() +" "
                    +  theDate.toLocaleTimeString() + '</div>'
                    +    '<div class =  "trello_card_detail_comment_owner">'
                    +       value.memberCreator.fullName + '</div>'
                    +    '</div>'
                    +    '<div class = "trello_card_detail_comment_comment"><p>'
                    +       replaceURLWithHTMLLinks(value.data.text) + '</p></div>'
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
        box_contents += '<div class = "trello_card_detail_attachment">'
        + '<a href="' + value.url + '">' + value.name + '</a>'

        + '</div>';

    });
    showDetailCard();
}


function showDetailCard() {
     bootbox.alert(box_contents);
}


function replaceURLWithHTMLLinks(text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    text = text.replace(/\n\n/g, "</p><p>");
    text = text.replace(/\n/g, "<br />");
  return text.replace(exp,"<a href='$1'>$1</a>");
}