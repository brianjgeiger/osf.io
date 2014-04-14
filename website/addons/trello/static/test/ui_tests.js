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

    module("Interface element activation tests (add/edit items)");

    test("should activate UI components for adding elements", function() {
        expect(30);
        var prefix="addtest";
        var identifier = 1;
        var otherIdentifier = identifier+1;
        var ldiv = prefix+"l-"+identifier;
        var gdiv = prefix+"g-"+identifier;
        var ndiv = prefix+"n-"+identifier;
        var bdiv = prefix+"b-"+identifier;
        var cdiv = prefix+"c-"+identifier;
        var otherGdiv = prefix+"g-"+otherIdentifier;

        $("#qunit-fixture").append('<div id="'+ldiv+'"></div>');
        $("#qunit-fixture").append('<div id="'+gdiv+'"></div>');
        $("#qunit-fixture").append('<div id="'+otherGdiv+'"></div>');
        $("#"+gdiv).append('<div id="'+ndiv+'"></div>');
        $("#"+gdiv).append('<div id="'+bdiv+'"></div>');
        $("#"+gdiv).append('<div id="'+cdiv+'"></div>');
        $("#"+ldiv).show();
        $("#"+gdiv).hide();
        $("#"+otherGdiv).show();


        ok($("#"+ldiv).is(":visible"),"Seeing the ldiv at setup");
        ok($("#"+otherGdiv).is(":visible"),"Seeing the other gdiv at setup");
        ok($("#"+gdiv).is(":hidden"),"Not seeing the gdiv at setup");
        ok($("#"+ndiv).is(":hidden"),"Not seeing the ndiv at setup");
        ok($("#"+bdiv).is(":hidden"),"Not seeing the bdiv at setup");
        ok($("#"+cdiv).is(":hidden"),"Not seeing the cdiv at setup");
        // Activate the links
        activateAddThingLinks(prefix,identifier);
        activateAddThingLinks(prefix,otherIdentifier);

        // Click the "Add a thing" link
        $("#"+ldiv).click();
        ok($("#"+ldiv).is(":hidden"),"Not seeing the ldiv after clicking  add thing link");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after clicking add thing link");
        ok($("#"+gdiv).is(":visible"),"Seeing the gdiv after clicking add thing link");
        ok($("#"+ndiv).is(":visible"),"Seeing the ndiv after clicking add thing link");
        ok($("#"+bdiv).is(":visible"),"Seeing the bdiv after clicking add thing link");
        ok($("#"+cdiv).is(":visible"),"Seeing the cdiv after clicking add thing link");

        // Click the cancel link
        $("#"+cdiv).click();
        ok($("#"+ldiv).is(":visible"),"Seeing the ldiv after clicking cancel");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after clicking cancel");
        ok($("#"+gdiv).is(":hidden"),"Not seeing the gdiv after clicking cancel");
        ok($("#"+ndiv).is(":hidden"),"Not seeing the ndiv after clicking cancel");
        ok($("#"+bdiv).is(":hidden"),"Not seeing the bdiv after clicking cancel");
        ok($("#"+cdiv).is(":hidden"),"Not seeing the cdiv after clicking cancel");

        // Click the "Add a thing" link again
        $("#"+ldiv).click();
        ok($("#"+ldiv).is(":hidden"),"Not seeing the ldiv after clicking  add thing link again");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after clicking add thing link again");
        ok($("#"+gdiv).is(":visible"),"Seeing the gdiv after clicking add thing link again");
        ok($("#"+ndiv).is(":visible"),"Seeing the ndiv after clicking add thing link again");
        ok($("#"+bdiv).is(":visible"),"Seeing the bdiv after clicking add thing link again");
        ok($("#"+cdiv).is(":visible"),"Seeing the cdiv after clicking add thing link again");

        //hit escape in the name entry field should act like cancel
        var event = $.Event( "keyup" );
        event.keyCode = 27;
        $("#"+ndiv).trigger(event);

        ok($("#"+ldiv).is(":visible"),"Seeing the ldiv after hitting escape");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after hitting escape");
        ok($("#"+gdiv).is(":hidden"),"Not seeing the gdiv after hitting escape");
        ok($("#"+ndiv).is(":hidden"),"Not seeing the ndiv after hitting escape");
        ok($("#"+bdiv).is(":hidden"),"Not seeing the bdiv after hitting escape");
        ok($("#"+cdiv).is(":hidden"),"Not seeing the cdiv after hitting escape");

    });
    
    test("should activate UI components for editing elements", function() {
        expect(48);
        var prefix="edittest";
        var identifier = 10;
        var otherIdentifier = identifier+1;
        var odiv = prefix+"o-"+identifier;
        var omdiv = prefix+"om-"+identifier;
        var ogdiv = prefix+"og-"+identifier;
        var gdiv = prefix+"g-"+identifier;
        var ndiv = prefix+"n-"+identifier;
        var bdiv = prefix+"b-"+identifier;
        var cdiv = prefix+"c-"+identifier;
        var otherGdiv = prefix+"g-"+otherIdentifier;

        $("#qunit-fixture").append('<div id="'+ogdiv+'"></div>');
        $("#"+ogdiv).append('<div id="'+odiv+'">Original Text</div>');
        $("#"+ogdiv).append('<div id="'+omdiv+'"></div>');
        $("#qunit-fixture").append('<div id="'+gdiv+'"></div>');
        $("#qunit-fixture").append('<div id="'+otherGdiv+'"></div>');

        $("#"+gdiv).append('<textarea id="'+ndiv+'" name="'+ndiv+'">Original Text</textarea>');
        $("#"+gdiv).append('<div id="'+bdiv+'"></div>');
        $("#"+gdiv).append('<div id="'+cdiv+'"></div>');
        $("#"+ogdiv).show();
        $("#"+omdiv).show();
        $("#"+odiv).show();
        $("#"+gdiv).hide();
        $("#"+otherGdiv).show();


        ok($("#"+ogdiv).is(":visible"),"Seeing the ogdiv at setup");
        ok($("#"+omdiv).is(":visible"),"Seeing the omdiv at setup");
        ok($("#"+odiv).is(":visible"),"Seeing the odiv at setup");
        ok($("#"+otherGdiv).is(":visible"),"Seeing the other gdiv at setup");
        ok($("#"+gdiv).is(":hidden"),"Not seeing the gdiv at setup");
        ok($("#"+ndiv).is(":hidden"),"Not seeing the ndiv at setup");
        ok($("#"+bdiv).is(":hidden"),"Not seeing the bdiv at setup");
        ok($("#"+cdiv).is(":hidden"),"Not seeing the cdiv at setup");
        equal($("#"+odiv).text(),"Original Text","Original text is in the odiv at setup");
        equal($("#"+ndiv).val(),"Original Text","Original text is in the ndiv at setup");
        // Activate the links
        activateEditThingLinks(prefix,identifier);
        activateEditThingLinks(prefix,otherIdentifier);

        // Click the div of the thing to be edited
        $("#"+odiv).click();
        ok($("#"+odiv).is(":hidden"),"Not seeing the odiv after clicking  thing to be edited");
        ok($("#"+omdiv).is(":hidden"),"Not seeing the omdiv after clicking  thing to be edited");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after clicking thing to be edited");
        ok($("#"+gdiv).is(":visible"),"Seeing the gdiv after clicking thing to be edited");
        ok($("#"+ndiv).is(":visible"),"Seeing the ndiv after clicking thing to be edited");
        ok($("#"+bdiv).is(":visible"),"Seeing the bdiv after clicking thing to be edited");
        ok($("#"+cdiv).is(":visible"),"Seeing the cdiv after clicking thing to be edited");
        equal($("#"+odiv).text(),"Original Text","Original text is in the odiv after clicking thing to be edited");
        equal($("#"+ndiv).val(),"Original Text","Original text is in the ndiv after clicking thing to be edited");

        $("#"+ndiv).val("New Text");
        equal($("#"+ndiv).val(),"New Text","New text is in the ndiv after changing the value");

        // Click the cancel link
        $("#"+cdiv).click();
        ok($("#"+odiv).is(":visible"),"Seeing the odiv after clicking cancel");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after clicking cancel");
        ok($("#"+gdiv).is(":hidden"),"Not seeing the gdiv after clicking cancel");
        ok($("#"+ndiv).is(":hidden"),"Not seeing the ndiv after clicking cancel");
        ok($("#"+bdiv).is(":hidden"),"Not seeing the bdiv after clicking cancel");
        ok($("#"+cdiv).is(":hidden"),"Not seeing the cdiv after clicking cancel");
        equal($("#"+odiv).text(),"Original Text","Original text is in the odiv after clicking cancel");
        equal($("#"+ndiv).val(),"Original Text","Original text is in the ndiv after clicking cancel");

        // Click the markdown visible container of the thing to be edited
        $("#"+omdiv).click();
        ok($("#"+odiv).is(":hidden"),"Not seeing the odiv after clicking markdown version of the thing to be edited");
        ok($("#"+omdiv).is(":hidden"),"Not seeing the odiv after clicking markdown version of the thing to be edited");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after clicking markdown version of the thing to be edited");
        ok($("#"+gdiv).is(":visible"),"Seeing the gdiv after clicking markdown version of the thing to be edited");
        ok($("#"+ndiv).is(":visible"),"Seeing the ndiv after clicking markdown version of the thing to be edited");
        ok($("#"+bdiv).is(":visible"),"Seeing the bdiv after clicking markdown version of the thing to be edited");
        ok($("#"+cdiv).is(":visible"),"Seeing the cdiv after clicking markdown version of the thing to be edited");
        equal($("#"+odiv).text(),"Original Text","Original text is in the odiv after clicking markdown version of the thing to be edited");
        equal($("#"+ndiv).val(),"Original Text","Original text is in the ndiv after clicking markdown version of the thing to be edited");

        $("#"+ndiv).val("Newer Text");
        equal($("#"+ndiv).val(),"Newer Text","Newer text is in the ndiv after changing the value");

        //hit escape in the name entry field should act like cancel
        var event = $.Event( "keyup" );
        event.keyCode = 27;
        $("#"+ndiv).trigger(event);

        ok($("#"+ogdiv).is(":visible"),"Seeing the odiv after hitting escape");
        ok($("#"+omdiv).is(":visible"),"Seeing the omdiv after hitting escape");
        ok($("#"+odiv).is(":visible"),"Seeing the odiv after hitting escape");
        ok($("#"+otherGdiv).is(":hidden"),"Not seeing the other gdiv after hitting escape");
        ok($("#"+gdiv).is(":hidden"),"Not seeing the gdiv after hitting escape");
        ok($("#"+ndiv).is(":hidden"),"Not seeing the ndiv after hitting escape");
        ok($("#"+bdiv).is(":hidden"),"Not seeing the bdiv after hitting escape");
        ok($("#"+cdiv).is(":hidden"),"Not seeing the cdiv after hitting escape");
        equal($("#"+odiv).text(),"Original Text","Original text is in the odiv after hitting escape");
        equal($("#"+ndiv).val(),"Original Text","Original text is in the ndiv after hitting escape");

    });
    
}