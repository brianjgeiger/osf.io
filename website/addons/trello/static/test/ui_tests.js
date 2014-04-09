function setupCardMoveTestDiv(cards){
    var context = {};
    context.user_can_edit=true;
    context.trello_board_url="http://osf.io/";
    context.trello_board_name="UI Test Board";
    context.trello_lists = [{id:1,name:"One"},{id:2,name:"Two"}];
    var boardTemplate = Handlebars.compile($("#kanban-board-ui-test-template").html());
    var newDiv = boardTemplate(context);
    $("#qunit-fixture").append(newDiv);
    cards.forEach(function(element, index, array){
        var cardTemplate = Handlebars.compile($("#kanban-card-ui-test-template").html());
        var cardDiv = cardTemplate(element);
        $("#cl-"+element.listID).append(cardDiv);

    });
}

function cardsInOrder(cards){
    return (parseInt(cards[0].getAttribute("cardpos")) < parseInt(cards[0].getAttribute("cardpos")) < parseInt(cards[0].getAttribute("cardpos")));
}

function kanbanicUITests(){
    module("Testing user interactions that do not connect with AJAX");
    test("should restore the card to the beginning of the list", function(){
        expect(5);
        // Setup card 1 in list 1, cards 2 and 3 in list 2
        var cards = [
            {listID: 1,id: 1, name: "One",pos: 1000},
            {listID: 2,id: 2, name: "Two", pos: 2000},
            {listID: 2,id: 3, name: "Three", pos: 3000}
        ];
        setupCardMoveTestDiv(cards);
        // Should start with 1 card in list 1
        equal($("#cl-1 > div").length,1,"Matched Div info");
        // Should start with 2 cards in list 2
        equal($("#cl-2 > div").length,2,"Matched Div info");
        // Move the card from list 1 back to list 2
        restoreCardPosition("cl-2","tc-1",$("#cl-2"));

        // Should end up with no cards in list 1
        equal($("#cl-1 > div").length,0,"Matched Div info");
        // Should end up with 3 cards in list 2
        equal($("#cl-2 > div").length,3,"Matched Div info");
        // Order of cards in list two should be 1, 2, and 3
        ok(cardsInOrder($("#cl-2 > div")),"Cards are in order");

   });
    test("should restore the card to the middle of the list",function(){
        expect(5);
        // Setup card 1 in list 1, cards 2 and 3 in list 2
        var cards = [
            {listID: 2,id: 1, name: "One",pos: 1000},
            {listID: 1,id: 2, name: "Two", pos: 2000},
            {listID: 2,id: 3, name: "Three", pos: 3000}
        ];
        setupCardMoveTestDiv(cards);
        // Should start with 1 card in list 1
        equal($("#cl-1 > div").length,1,"Matched Div info");
        // Should start with 2 cards in list 2
        equal($("#cl-2 > div").length,2,"Matched Div info");
        // Move the card from list 1 back to list 2
        restoreCardPosition("cl-2","tc-2",$("#cl-2"));

        // Should end up with no cards in list 1
        equal($("#cl-1 > div").length,0,"Matched Div info");
        // Should end up with 3 cards in list 2
        equal($("#cl-2 > div").length,3,"Matched Div info");
        // Order of cards in list two should be 1, 2, and 3
        ok(cardsInOrder($("#cl-2 > div")),"Cards are in order");
    });
    test("should restore the card to the end of the list",function(){
        expect(5);
        // Setup card 1 in list 1, cards 2 and 3 in list 2
        var cards = [
            {listID: 2,id: 1, name: "One",pos: 1000},
            {listID: 2,id: 2, name: "Two", pos: 2000},
            {listID: 1,id: 3, name: "Three", pos: 3000}
        ];
        setupCardMoveTestDiv(cards);
        // Should start with 1 card in list 1
        equal($("#cl-1 > div").length,1,"Matched Div info");
        // Should start with 2 cards in list 2
        equal($("#cl-2 > div").length,2,"Matched Div info");
        // Move the card from list 1 back to list 2
        restoreCardPosition("cl-2","tc-3",$("#cl-2"));

        // Should end up with no cards in list 1
        equal($("#cl-1 > div").length,0,"Matched Div info");
        // Should end up with 3 cards in list 2
        equal($("#cl-2 > div").length,3,"Matched Div info");
        // Order of cards in list two should be 1, 2, and 3
        ok(cardsInOrder($("#cl-2 > div")),"Cards are in order");
    });

    test("should remove the div when clicked outside the card", function() {
        expect(3);
        var divTemplate = Handlebars.compile($("#kanban-card-detail-ui-test-template").html());
        var newDiv = divTemplate(null);
        equal(typeof $(".trello_card_detail").html(),"undefined","Div does not exist");
        $("#qunit-fixture").append(newDiv);
        notEqual(typeof $(".trello_card_detail").html(),"undefined","Div has been added");
        $(".trello_card_detail").trigger("click");
        equal(typeof $(".trello_card_detail").html(),"undefined","Removed the div");
    });

    test("should NOT remove the div when clicked inside the card",function() {
        expect(3);
        var divTemplate = Handlebars.compile($("#kanban-card-detail-ui-test-template").html());
        var newDiv = divTemplate(null);
        equal(typeof $(".trello_card_detail").html(),"undefined","Div does not exist");
        $("#qunit-fixture").append(newDiv);
        notEqual(typeof $(".trello_card_detail").html(),"undefined","Div has been added");
        $(".trello_card_detail_card").trigger("click");
        notEqual(typeof $(".trello_card_detail").html(),"undefined","Did not remove the div");
    });

    test("should NOT remove the div when clicked inside a div inside the card", function() {
        expect(3);
        var divTemplate = Handlebars.compile($("#kanban-card-detail-ui-test-template").html());
        var newDiv = divTemplate(null);
        equal(typeof $(".trello_card_detail").html(),"undefined","Div does not exist");
        $("#qunit-fixture").append(newDiv);
        notEqual(typeof $(".trello_card_detail").html(),"undefined","Div has been added");
        $(".trello_test_inner_div").trigger("click");
        notEqual(typeof $(".trello_card_detail").html(),"undefined","Did not remove the div");
    });


}