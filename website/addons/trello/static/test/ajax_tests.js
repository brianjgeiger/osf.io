function mockList(listnum,canEdit){
    var url = '/trello/list/'+listnum+'/'
    $.mockjax({
        responseTime: 1,
        url: url,
        responseText:{
            "istest": true,
            "oneTestOnly": true,
            "complete": true,
            "trello_cards": [
                {
                    "badges": {
                        "attachments": 0,
                        "checkItems": 1,
                        "checkItemsChecked": 0,
                        "comments": 0,
                        "description": true,
                        "due": null,
                        "fogbugz": "",
                        "subscribed": false,
                        "viewingMemberVoted": false,
                        "votes": 0
                    },
                    "checkItemStates": [],
                    "closed": false,
                    "dateLastActivity": "2014-04-03T21:07:51.777Z",
                    "desc": '"'+listnum+1+'"',
                    "descData": {
                        "emoji": {}
                    },
                    "due": null,
                    "due_date_string": "",
                    "id": listnum+1,
                    "idAttachmentCover": null,
                    "idBoard": "fakeid",
                    "idChecklists": [
                        '"'+listnum+1+'"'
                    ],
                    "idList": listnum,
                    "idMembers": [],
                    "idMembersVoted": [],
                    "idShort": 113,
                    "labels": [],
                    "manualCoverAttachment": false,
                    "name": '"'+listnum+1+'"',
                    "pos": 1462271,
                    "shortLink": "fakeshortlink",
                    "shortUrl": "https://trello.com/c/fakeid",
                    "subscribed": false,
                    "url": "https://trello.com/c/fakeid/not-real"
                },
                {
                    "badges": {
                        "attachments": 0,
                        "checkItems": 0,
                        "checkItemsChecked": 0,
                        "comments": 0,
                        "description": false,
                        "due": null,
                        "fogbugz": "",
                        "subscribed": false,
                        "viewingMemberVoted": false,
                        "votes": 0
                    },
                    "checkItemStates": [],
                    "closed": false,
                    "dateLastActivity": "2014-04-03T21:05:28.256Z",
                    "desc": '"'+listnum+2+'"',
                    "descData": null,
                    "due": null,
                    "due_date_string": "",
                    "id": listnum+2,
                    "idAttachmentCover": null,
                    "idBoard": "fakeid",
                    "idChecklists": [],
                    "idList": listnum,
                    "idMembers": [],
                    "idMembersVoted": [],
                    "idShort": 129,
                    "labels": [],
                    "manualCoverAttachment": false,
                    "name": '"'+listnum+2+'"',
                    "pos": 1482751,
                    "shortLink": "g95XHvb9",
                    "shortUrl": "https://trello.com/c/fakeid",
                    "subscribed": false,
                    "url": "https://trello.com/c/fakeid/not-a-real-url"
                }
            ],
            "trello_list_id": listnum,
            "user_can_edit": canEdit
            }
    });
}

function mockErrorList(listnum,canEdit,errorInfo){
    var url = '/trello/list/'+listnum+'/';
    $.mockjax({
        responseTime: 1,
        url: url,
        responseText: {
            "istest": true,
            "error": true,
            "complete": true,
            "errorInfo": errorInfo,
            "HTTPError": "Should test as an error.",
            "trello_list_id": listnum,
            "user_can_edit": canEdit
        }
    });
}

function mockErrorBoard(canEdit,errorInfo){
        $.mockjax({
            url: '/trello/lists/',
            responseTime: 1,
            responseText: {
                "istest": true,
                "error": true,
                "complete": true,
                "errorInfo": errorInfo,
                "HTTPError": "Should test as an error.",
                "user_can_edit": canEdit
            }
        });
}

function mockException(url,errorNum,extraResponse){
    $.mockjax({
        url: url,
        status: errorNum,
        responseTime: 1,
        statusText: "Unit test "+extraResponse,
        isTest: true
    });

}

function mockBoard(canEdit){
    $.mockjax({
            url: '/trello/lists/',
            responseTime: 1,
            responseText: {
                "istest": true,
                "complete": true,
                "trello_board_name": "OSF Trello",
                "trello_board_url": "https://trello.com/b/Kg6ZmCRJ/osf-trello",
                "trello_lists": [
                    {
                        "closed": false,
                        "id": "1",
                        "idBoard": "53189b693b58e0d16ac26e51",
                        "name": "One",
                        "pos": 10000,
                        "subscribed": false
                    }
                ],
                "user_can_edit": canEdit
            }
        });
}

function mockFilledCard(id,canEdit){
    var cardResponse = {
    "complete": true,
    "trello_card": {
        "badges": {
            "attachments": 2,
            "checkItems": 2,
            "checkItemsChecked": 1,
            "comments": 3,
            "description": true,
            "due": "2014-04-30T16:00:00.000Z",
            "fogbugz": "",
            "subscribed": false,
            "viewingMemberVoted": false,
            "votes": 0
        },
        "checkItemStates": [
            {
                "idCheckItem": "53454a6654a3bb6e0892f562",
                "state": "complete"
            }
        ],
        "checklists": [
            {
                "checkItems": [
                    {
                        "checked": "",
                        "id": "534483a6209470670812e6b4",
                        "name": "Do stuff",
                        "nameData": null,
                        "pos": 16384,
                        "state": "incomplete"
                    },
                    {
                        "checked": "checked",
                        "id": "53454a6654a3bb6e0892f562",
                        "name": "And other stuff",
                        "nameData": null,
                        "pos": 32768,
                        "state": "complete"
                    }
                ],
                "id": "5344839fbd40b02509901234",
                "idBoard": "53189b693b58e0d16ac26e51",
                "idCard": "53189c6e69a91aea3e37b12d",
                "name": "Things",
                "pos": 16384
            }
        ],
        "closed": false,
        "comments": [
            {
                "data": {
                    "board": {
                        "id": "53189b693b58e0d16ac26e51",
                        "name": "OSF Trello",
                        "shortLink": "Kg6ZmCRJ"
                    },
                    "card": {
                        "id": "53189c6e69a91aea3e37b12d",
                        "idShort": 5,
                        "name": "Integrate with log",
                        "shortLink": "d4aEsbWn"
                    },
                    "text": "The big concern with this at the moment is we might want to note which things happened through the OSF interface (and if so, by whom) and which happened from outside. This is a class of problems that will be entirely avoided by having the users only be able to modify things if they use their IDs."
                },
                "date": "2014-04-02T17:52:35.440Z",
                "id": "533c4e631708d0df2fd5c491",
                "idMemberCreator": "4f073cdebf2f1e200c05564d",
                "memberCreator": {
                    "avatarHash": "b7c3f75c538cb95554da01027c6c8d5f",
                    "fullName": "Brian J. Geiger",
                    "id": "4f073cdebf2f1e200c05564d",
                    "initials": "BG",
                    "username": "thefoodgeek"
                },
                "type": "commentCard"
            },
            {
                "data": {
                    "board": {
                        "id": "53189b693b58e0d16ac26e51",
                        "name": "OSF Trello",
                        "shortLink": "Kg6ZmCRJ"
                    },
                    "card": {
                        "id": "53189c6e69a91aea3e37b12d",
                        "idShort": 5,
                        "name": "Integrate with log",
                        "shortLink": "d4aEsbWn"
                    },
                    "text": "Current plan is to grab the activities from Trello, find out what the last one logged (or, if nothing logged, what all the activities from after the board was linked to the OSF project), and turn those into log messages."
                },
                "date": "2014-03-25T20:05:06.458Z",
                "id": "5331e172c1ee2a9066c9f686",
                "idMemberCreator": "4f073cdebf2f1e200c05564d",
                "memberCreator": {
                    "avatarHash": "b7c3f75c538cb95554da01027c6c8d5f",
                    "fullName": "Brian J. Geiger",
                    "id": "4f073cdebf2f1e200c05564d",
                    "initials": "BG",
                    "username": "thefoodgeek"
                },
                "type": "commentCard"
            },
            {
                "data": {
                    "board": {
                        "id": "53189b693b58e0d16ac26e51",
                        "name": "OSF Trello",
                        "shortLink": "Kg6ZmCRJ"
                    },
                    "card": {
                        "id": "53189c6e69a91aea3e37b12d",
                        "idShort": 5,
                        "name": "Integrate with log",
                        "shortLink": "d4aEsbWn"
                    },
                    "text": "There's a philosophical question of whether to use notifications for the log, as the notifications can be cleared from the Trello and might not make it to the logs. \n\nI am reasonably certain that the logs are stored in an internal database and not pulled from each of the data stores each time, so it it's mostly a question of whether it's okay to miss data.\n\nMy impression is that the logs are an interesting feature and not a philosophical standing stone, so it will probably be okay, but good to ask."
                },
                "date": "2014-03-06T19:26:14.349Z",
                "id": "5318cbd6e3365dcb3ed43221",
                "idMemberCreator": "4f073cdebf2f1e200c05564d",
                "memberCreator": {
                    "avatarHash": "b7c3f75c538cb95554da01027c6c8d5f",
                    "fullName": "Brian J. Geiger",
                    "id": "4f073cdebf2f1e200c05564d",
                    "initials": "BG",
                    "username": "thefoodgeek"
                },
                "type": "commentCard"
            }
        ],
        "coverURL": "https://trello-attachments.s3.amazonaws.com/53189b693b58e0d16ac26e51/53189c6e69a91aea3e37b12d/b22a1999e111e6bf28baa40f6010b89d/4636162605_9ac8e91b56_b.jpg_280x200.png",
        "dateLastActivity": "2014-04-14T15:53:26.049Z",
        "desc": "There is a logging mechanism. We should integrate with it.",
        "descData": {
            "emoji": {}
        },
        "due": "2014-04-30T16:00:00.000Z",
        "id": '"'+id+'"',
        "idAttachmentCover": "5318e2e8271141b345ea3a71",
        "idBoard": "53189b693b58e0d16ac26e51",
        "idChecklists": [
            "5344839fbd40b02509901234"
        ],
        "idList": "5329b9925ada884a59088461",
        "idMembers": [
            "4f073cdebf2f1e200c05564d"
        ],
        "idShort": 5,
        "labels": [
            {
                "color": "blue",
                "name": ""
            }
        ],
        "manualCoverAttachment": false,
        "name": "Integrate with log",
        "pos": 827391,
        "shortUrl": "https://trello.com/c/d4aEsbWn",
        "url": "https://trello.com/c/d4aEsbWn/5-integrate-with-log"
    },
    "trello_card_id": id,
    "user_can_edit": canEdit
}
    $.mockjax({
        url: '/trello/card/'+id+'/',
        responseTime: 1,
        responseText: cardResponse
    });
    return cardResponse;
}

function mockCard(id, canEdit) {
    var cardResponse = {
                "complete": true,
                "trello_card": {
                    "badges": {
                        "attachments": 0,
                        "checkItems": 12,
                        "checkItemsChecked": 10,
                        "comments": 0,
                        "description": false,
                        "due": null,
                        "fogbugz": "",
                        "subscribed": false,
                        "viewingMemberVoted": false,
                        "votes": 0
                    },
                    "checkItemStates": [
                        {
                            "idCheckItem": "53285af3b932a1f138a5ae3a",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285af75034afbb45da0b5e",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285afef6bffd6f7209b825",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285b0fa0c86ea4276b97fa",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285b179563125c6f460d52",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285b3eab35992f72fe76a4",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285b4da0c86ea4276b9856",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "53285b6aaf9daa640fa8197b",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "5339b708b7e5284137278e9a",
                            "state": "complete"
                        },
                        {
                            "idCheckItem": "5339b7713063ab02463ee3ad",
                            "state": "complete"
                        }
                    ],
                    "checklists": [
                        {
                            "checkItems": [
                                {
                                    "checked": "checked",
                                    "id": "53285af3b932a1f138a5ae3a",
                                    "name": "Number of comments",
                                    "nameData": null,
                                    "pos": 16516,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285af75034afbb45da0b5e",
                                    "name": "Number of attachments",
                                    "nameData": null,
                                    "pos": 33220,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285afef6bffd6f7209b825",
                                    "name": "Image view",
                                    "nameData": null,
                                    "pos": 49871,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285b0fa0c86ea4276b97fa",
                                    "name": "Number of checklist items (complete/total)",
                                    "nameData": null,
                                    "pos": 66656,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285b179563125c6f460d52",
                                    "name": "Are you a watcher",
                                    "nameData": null,
                                    "pos": 83970,
                                    "state": "complete"
                                },
                                {
                                    "checked": "",
                                    "id": "53285b2e9a1e8e7772f5de42",
                                    "name": "Who it's assigned to",
                                    "nameData": null,
                                    "pos": 101130,
                                    "state": "incomplete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285b3eab35992f72fe76a4",
                                    "name": "If it has a description",
                                    "nameData": null,
                                    "pos": 118337,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285b4da0c86ea4276b9856",
                                    "name": "Due date",
                                    "nameData": {
                                        "emoji": {}
                                    },
                                    "pos": 134989,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "53285b6aaf9daa640fa8197b",
                                    "name": "Card link to trello",
                                    "nameData": null,
                                    "pos": 151569,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "5339b708b7e5284137278e9a",
                                    "name": "Cool stuff?",
                                    "nameData": null,
                                    "pos": 167953,
                                    "state": "complete"
                                },
                                {
                                    "checked": "checked",
                                    "id": "5339b7713063ab02463ee3ad",
                                    "name": "new",
                                    "nameData": null,
                                    "pos": 184337,
                                    "state": "complete"
                                },
                                {
                                    "checked": "",
                                    "id": "5339b7db4c5bdb5f37b59d97",
                                    "name": "aaaaaaaa",
                                    "nameData": null,
                                    "pos": 200721,
                                    "state": "incomplete"
                                }
                            ],
                            "id": "53285aec349bf6b732b24c4f",
                            "idBoard": "53189b693b58e0d16ac26e51",
                            "idCard": "1",
                            "name": "Decorations",
                            "pos": 16384
                        }
                    ],
                    "closed": false,
                    "comments": [],
                    "dateLastActivity": "2014-04-01T15:54:30.502Z",
                    "desc": "",
                    "descData": null,
                    "due": null,
                    "id": id,
                    "idAttachmentCover": null,
                    "idBoard": "53189b693b58e0d16ac26e51",
                    "idChecklists": [
                        "53285aec349bf6b732b24c4f"
                    ],
                    "idList": "5329b9925ada884a59088461",
                    "idMembers": [],
                    "idShort": 22,
                    "labels": [],
                    "manualCoverAttachment": false,
                    "name": "Overview screen decorations",
                    "pos": 327679,
                    "shortUrl": "https://trello.com/c/tvx9lxBO",
                    "url": "https://trello.com/c/tvx9lxBO/22-overview-screen-decorations"
                },
                "trello_card_id": id,
                "user_can_edit": canEdit,
                "istest": true
            };
    $.mockjax({
        url: '/trello/card/'+id+'/',
        responseTime: 1,
        responseText: cardResponse
    });
    return cardResponse;
}

function mockErrorCard(id, canEdit, errorInfo) {
    var cardResponse = {
        "error": true,
        "complete": true,
        "errorInfo": errorInfo,
        "HTTPError": "Should test as an error.",
        "user_can_edit": canEdit
    };
    $.mockjax({
        url: '/trello/card/'+id+'/',
        responseTime: 1,
        responseText: cardResponse
    });
    return cardResponse;
}


function checkForAlertBox(alertBoxText,debug){
    $(".alertify-log").each( function(){
        if(debug) {
            console.log($(this).text());
        }
        if($(this).text() ==  alertBoxText){
            ok(true,"Found the error box");
        }
    });
}

function createAddCardTestSetup() {
    $("#qunit-fixture").append('<div id="cl-1"></div>');
    $("#qunit-fixture").append('<div id="atcc-1")></div>');
    $("#qunit-fixture").append('<div id="atcb-1")></div>');
    $("#qunit-fixture").append('<textarea id="atcn-1")>Test card name</textarea>');
    $("#atcc-1").click(function(){
        ok(true,"Clicked the cancel button");
    });
}

function createAddCheckitemTestSetup() {
    $("#qunit-fixture").append('<div id="tcdccl-1"></div>');
    $("#qunit-fixture").append('<div id="tcdacic-1")></div>');
    $("#qunit-fixture").append('<div id="tcdacib-1")></div>');
    $("#qunit-fixture").append('<textarea id="tcdacin-1" cardid="2")>Test checkitem Name</textarea>');
    $("#tcdacic-1").click(function(){
        ok(true,"Clicked the cancel button");
    });
}

function createAddChecklistTestSetup() {
    $("#qunit-fixture").append('<div class="trello_card_detail_checklist_list"></div>');
    $("#qunit-fixture").append('<div id="tcdaclc-1")></div>');
    $("#qunit-fixture").append('<div id="tcdaclb-1")></div>');
    $("#qunit-fixture").append('<textarea id="tcdacln-1" cardid="2")>Test List Name</textarea>');
    $("#tcdaclc-1").click(function(){
        ok(true,"Clicked the cancel button");
    });

}

function createEditCheckitemTestSetup() {
    $("#qunit-fixture").append('<div id="tcdecic-1")></div>');
    $("#qunit-fixture").append('<div id="tcdecib-1")></div>');
    $("#qunit-fixture").append('<div id="tcdecio-1")>Original checkitem name</div>');
    $("#qunit-fixture").append('<textarea id="tcdecin-1" cardid="2" checklistid="3")>New Checkitem Name</textarea>');
    $("#tcdecic-1").click(function(){
        ok(true,"Clicked the cancel button");
    });
}

function createEditCardNameTestSetup() {
    $("#qunit-fixture").append('<div id="tcdenc-1")></div>');
    $("#qunit-fixture").append('<div id="tcdenb-1")></div>');
    $("#qunit-fixture").append('<div id="tcdeno-1")>Original card name</div>');
    $("#qunit-fixture").append('<textarea id="tcdenn-1" cardid="2" checklistid="3")>New Card Name</textarea>');
    $("#tcdenc-1").click(function(){
        ok(true,"Clicked the cancel button");
    });
}

function createEditCardDescriptionTestSetup() {
    $("#qunit-fixture").append('<div id="tcdedc-1")></div>');
    $("#qunit-fixture").append('<div id="tcdedb-1")></div>');
    $("#qunit-fixture").append('<div id="tcdedo-1")>Original *card* description</div>');
    $("#qunit-fixture").append('<div id="tcdedom-1")></div>');
    $("#qunit-fixture").append('<textarea id="tcdedn-1" cardid="2" checklistid="3")>New *Card* Description</textarea>');
    $("#tcdedc-1").click(function(){
        ok(true,"Clicked the cancel button");
    });
}

function createEditChecklistNameTestSetup() {
    $("#qunit-fixture").append('<div id="tcdecc-1")></div>');
    $("#qunit-fixture").append('<div id="tcdecb-1")></div>');
    $("#qunit-fixture").append('<div id="tcdeco-1")>Original checklist name</div>');
    $("#qunit-fixture").append('<textarea id="tcdecn-1" cardid="2" checklistid="3")>New checklist name</textarea>');
    $("#tcdecc-1").click(function(){
        ok(true,"Clicked the cancel button");
    });
}

function createEditCheckCheckitemTestSetup() {
    $("#qunit-fixture").append('<input type="checkbox" unchecked id="tcdc-ci-1" value="1" onclick="checkCheckItem(\'21\',\'22\',\'1\');" /><span id="tcdecio-1">Checkitem One</span>')
    $("#qunit-fixture").append('<input type="checkbox" checked id="tcdc-ci-2" value="2" onclick="checkCheckItem(\'21\',\'22\',\'2\');" /><span id="tcdecio-2">Checkitem Two</span>')
}

function createDisplayCardTestSetup(){
    $("#qunit-fixture").append('<div id="cl-1"></div>');
    $("#cl-10").append('<div class = "TrelloCard" id="tc-10" onclick="displayCard(\'10\');"><div class = "TrelloCardName">Card ten</div></div>');
}

function createBoardTestSetup(){
    var $fixture = $( "#qunit-fixture" );
    $fixture.append('<div id="KanbanBoard"></div>');
}

function kanbanicAJAXTests(){
    module("Fill out elements from AJAX calls");

    asyncTest("should fill in a card with useful information - reloadCardFromTrello()", function(assert) {
        $.mockjaxClear();
        testReloadCardSuccess = function(){
            start(); // Lets the test know that it's done with async stuff
            var expectedText = "id,1,name,Overview screen decorations,cardpos,327679,coverURL,,desc,,subscribed,,badges.checkItems,12,badges.checkItemsChecked,10,badges.comments,0,badges.attachments,0,due_date_string,";
            equal($("div#tc-1").html(),expectedText); //ensures that the test div is populated with the right data
        };
        testReloadCardError = function() {
            start();
            ok(false,"Incorrectly called reload card error.");
        };
        testReloadCardException = function() {
            start();
            ok(false,"Incorrectly called reload card exception.");
        };
        
        expect(1);
        var $fixture = $( "#qunit-fixture" );
        mockCard(1, true);

        // Create a card div
        $fixture.append('<div id="tc-1">Unchanged</div>');

        //Perform ajax call, fill out Mustache template, modify div
        reloadCardFromTrello(1);
    });

    asyncTest("should fill in the board with useful information - loadBoard()", function(assert) {
        $.mockjaxClear();
        testSuccessListCards = function() {
            ok(true,"loadListCards Succeeded");
            var expectedText ='trello_board_url=https://trello.com/b/Kg6ZmCRJ/osf-trello,trello_board_name=OSF Trello<div class=\"TrelloListBlock\" id=\"cl-1\" listid=\"1\">listID=1,listName=One<div id=\"tc-2\">id,2,name,\"11\",cardpos,1462271,coverURL,,desc,\"11\",subscribed,,badges.checkItems,1,badges.checkItemsChecked,0,badges.comments,0,badges.attachments,0,due_date_string,</div><div id=\"tc-3\">id,3,name,\"12\",cardpos,1482751,coverURL,,desc,\"12\",subscribed,,badges.checkItems,0,badges.checkItemsChecked,0,badges.comments,0,badges.attachments,0,due_date_string,</div></div>';
            equal($("#KanbanBoard").html(),expectedText,"Matched Div info");
            start();

        };

        testErrorListCards = function(){
            start();
            ok(false,"Incorrectly called list card error.");
        };

        testExceptionListCards = function(){
            start();
            ok(false,"Incorrectly called list card exception.");
        };

        testSuccessBoard = function() {
            ok(true,"loadBoard succeeded");
        };

        testErrorBoard = function(){
            start();
            ok(false,"Incorrectly called board load error.");
        };

        testExceptionBoard = function() {
            start();
            ok(false,"Incorrect called board load exception.");
        };
        
        mockBoard(true);
        mockList(1,true);

        expect(3);

        createBoardTestSetup();

        //Perform ajax call, fill out Mustache template, modify div
        loadBoard();

    });

    asyncTest("should load the JSON for card 10 - getCardDetailInformation()", function(assert) {
        $.mockjaxClear();
        var cardData = "{\"complete\":true,\"trello_card\":{\"badges\":{\"attachments\":0,\"checkItems\":12,\"checkItemsChecked\":10,\"comments\":0,\"description\":false,\"due\":null,\"fogbugz\":\"\",\"subscribed\":false,\"viewingMemberVoted\":false,\"votes\":0},\"checkItemStates\":[{\"idCheckItem\":\"53285af3b932a1f138a5ae3a\",\"state\":\"complete\"},{\"idCheckItem\":\"53285af75034afbb45da0b5e\",\"state\":\"complete\"},{\"idCheckItem\":\"53285afef6bffd6f7209b825\",\"state\":\"complete\"},{\"idCheckItem\":\"53285b0fa0c86ea4276b97fa\",\"state\":\"complete\"},{\"idCheckItem\":\"53285b179563125c6f460d52\",\"state\":\"complete\"},{\"idCheckItem\":\"53285b3eab35992f72fe76a4\",\"state\":\"complete\"},{\"idCheckItem\":\"53285b4da0c86ea4276b9856\",\"state\":\"complete\"},{\"idCheckItem\":\"53285b6aaf9daa640fa8197b\",\"state\":\"complete\"},{\"idCheckItem\":\"5339b708b7e5284137278e9a\",\"state\":\"complete\"},{\"idCheckItem\":\"5339b7713063ab02463ee3ad\",\"state\":\"complete\"}],\"checklists\":[{\"checkItems\":[{\"checked\":\"checked\",\"id\":\"53285af3b932a1f138a5ae3a\",\"name\":\"Number of comments\",\"nameData\":null,\"pos\":16516,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"53285af75034afbb45da0b5e\",\"name\":\"Number of attachments\",\"nameData\":null,\"pos\":33220,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"53285afef6bffd6f7209b825\",\"name\":\"Image view\",\"nameData\":null,\"pos\":49871,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"53285b0fa0c86ea4276b97fa\",\"name\":\"Number of checklist items (complete/total)\",\"nameData\":null,\"pos\":66656,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"53285b179563125c6f460d52\",\"name\":\"Are you a watcher\",\"nameData\":null,\"pos\":83970,\"state\":\"complete\"},{\"checked\":\"\",\"id\":\"53285b2e9a1e8e7772f5de42\",\"name\":\"Who it's assigned to\",\"nameData\":null,\"pos\":101130,\"state\":\"incomplete\"},{\"checked\":\"checked\",\"id\":\"53285b3eab35992f72fe76a4\",\"name\":\"If it has a description\",\"nameData\":null,\"pos\":118337,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"53285b4da0c86ea4276b9856\",\"name\":\"Due date\",\"nameData\":{\"emoji\":{}},\"pos\":134989,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"53285b6aaf9daa640fa8197b\",\"name\":\"Card link to trello\",\"nameData\":null,\"pos\":151569,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"5339b708b7e5284137278e9a\",\"name\":\"Cool stuff?\",\"nameData\":null,\"pos\":167953,\"state\":\"complete\"},{\"checked\":\"checked\",\"id\":\"5339b7713063ab02463ee3ad\",\"name\":\"new\",\"nameData\":null,\"pos\":184337,\"state\":\"complete\"},{\"checked\":\"\",\"id\":\"5339b7db4c5bdb5f37b59d97\",\"name\":\"aaaaaaaa\",\"nameData\":null,\"pos\":200721,\"state\":\"incomplete\"}],\"id\":\"53285aec349bf6b732b24c4f\",\"idBoard\":\"53189b693b58e0d16ac26e51\",\"idCard\":\"1\",\"name\":\"Decorations\",\"pos\":16384}],\"closed\":false,\"comments\":[],\"dateLastActivity\":\"2014-04-01T15:54:30.502Z\",\"desc\":\"\",\"descData\":null,\"due\":null,\"id\":10,\"idAttachmentCover\":null,\"idBoard\":\"53189b693b58e0d16ac26e51\",\"idChecklists\":[\"53285aec349bf6b732b24c4f\"],\"idList\":\"5329b9925ada884a59088461\",\"idMembers\":[],\"idShort\":22,\"labels\":[],\"manualCoverAttachment\":false,\"name\":\"Overview screen decorations\",\"pos\":327679,\"shortUrl\":\"https://trello.com/c/tvx9lxBO\",\"url\":\"https://trello.com/c/tvx9lxBO/22-overview-screen-decorations\"},\"trello_card_id\":10,\"user_can_edit\":false,\"istest\":true}";
        mockCard(10,false);
        createDisplayCardTestSetup();


        testDetailCardSuccess = function(data){
            ok(true, "Successfully loaded card AJAX");
            start();
            equal(JSON.stringify(data),cardData,"JSON matches what we passed in.");
        };

        testDetailCardError = function(data){
            start();
            ok(false,"Incorrectly called error on detail card creation.");
        };

        testDetailCardException = function(data) {
            start();
            ok(false,"Incorrectly called exception on detail card creation.");
        };
        getCardDetailInformation(10);
    });



    module("Return error conditions from AJAX calls");

    asyncTest("should display error box - loadListCards(listID)", function(assert) {
        $.mockjaxClear();
         testErrorListCards = function() {
            start();
            ok(true,"loadListCards successfully detected the error");

            var alertBoxError = "loadListCards. Should test as an error.";
            checkForAlertBox(alertBoxError,false);
        };

        expect(2);
        mockErrorList(1,true,"loadListCards");
        loadListCards(1);
    });

    asyncTest("should show error for 500 exception - loadListCards()", function(assert) {
        $.mockjaxClear();
        testExceptionListCards = function() {
            start();
            ok(true,"loadListCards successfully detected the exception");

            var alertBoxError = "Could not load the cards: error, Unit test loadListCards 500";
            checkForAlertBox(alertBoxError,false);
        };
        
        expect(2);
        mockException("/trello/list/1/",500,"loadListCards 500");
        loadListCards(1);
    });

    asyncTest("should display error box - loadBoard()", function(assert) {
        $.mockjaxClear();
        testErrorBoard = function() {
            start();
            ok(true,"loadBoard successfully detected the error");
            var alertBoxError = "loadBoard. Should test as an error.";
            checkForAlertBox(alertBoxError,false);
        };
        
        expect(2);
        mockErrorBoard(true,"loadBoard");
        loadBoard();
    });

    asyncTest("should show error for 500 exception - loadBoard()", function(assert) {
        $.mockjaxClear();
        testExceptionBoard = function() {
            start();
            ok(true,"loadBoard successfully detected the exception");
            var alertBoxError = "Could not load the Trello board: error, Unit test loadBoard 500";
            checkForAlertBox(alertBoxError,false);
        };
        
        expect(2);
        mockException("/trello/lists/",500,"loadBoard 500");
        loadBoard();
    });

    asyncTest("should display error box - getCardDetailInformation()", function(assert) {
        $.mockjaxClear();
        testDetailCardError = function() {
            start();
            ok(true,"getCardDetailInformation successfully detected the error");
            var alertBoxError = "getCardDetailInformation. Should test as an error.";
            checkForAlertBox(alertBoxError,false);
        };

        testDetailCardSuccess = function(){
            start();
            ok(false,"Incorrectly called success function.");
        };

        testDetailCardException = function() {
            start();
            ok(false,"Incorrectly called exception function.");
        };

        expect(2);
        mockErrorCard(1,true,"getCardDetailInformation");
        getCardDetailInformation(1);
    });

    asyncTest("should show error for 404 exception - getCardDetailInformation()", function(assert) {
        $.mockjaxClear();
        testDetailCardException = function() {
            start();
            ok(true,"getCardDetailInformation successfully detected the exception");
            var alertBoxError = "Could not display the card details: error, Not Found";
            checkForAlertBox(alertBoxError,true);
        };

        testDetailCardSuccess = function() {
            start();
            ok(false,"Incorrectly called success function.");
        };

        testDetailCardError = function() {
            ok(false,"Incorrectly called error function.");
        };

        expect(2);
        getCardDetailInformation(3);
    });

    module("Add Item Submit callback tests");

    //Add card submit
    asyncTest("should add new card from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/card/',
            responseTime: 1,
            type: 'POST',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });

        
        createAddCardTestSetup();
        activateAddCardSubmit(1);
        testAddCardSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"listid\":1,\"cardname\":\"Test card name\"}",'Original "Add Card" POST sent the correct data');
        };

        testAddCardError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testAddCardException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#atcb-1").click();
    });

    asyncTest("should NOT add new card from user interaction (Error)", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/card/',
            responseTime: 1,
            type: 'POST',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error adding card from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });

        
        createAddCardTestSetup();
        activateAddCardSubmit(1);
        testAddCardSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testAddCardError = function(data) {
            start();
            var alertBoxError = "Unit test of error adding card from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"listid\":1,\"cardname\":\"Test card name\"}",'Original "Add Card" POST sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testAddCardException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#atcb-1").click();
    });

    asyncTest("should NOT add new card from user interaction (Exception - 404 Not Found)", function() {
        expect(3);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        
        createAddCardTestSetup();
        activateAddCardSubmit(1);
        testAddCardSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testAddCardError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testAddCardException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not add the card: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#atcb-1").click();
    });

    // Add checkitem submit
    asyncTest("should add new checkitem from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'POST',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });

        
        createAddCheckitemTestSetup();
        activateAddCheckItemSubmit(1);
        testAddCheckitemSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"checklistid\":1,\"checkitemname\":\"Test checkitem Name\"}",'Original "Add Checkitem" POST sent the correct data');
        };

        testAddCheckitemError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testAddCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdacib-1").click();
    });

    asyncTest("should NOT add new checkitem from user interaction (Error)", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'POST',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error adding checkitem from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });

        
        createAddCheckitemTestSetup();
        activateAddCheckItemSubmit(1);
        testAddCheckitemSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testAddCheckitemError = function(data) {
            start();
            var alertBoxError = "Unit test of error adding checkitem from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"checklistid\":1,\"checkitemname\":\"Test checkitem Name\"}",'Original "Add Checkitem" POST sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testAddCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdacib-1").click();
    });

    asyncTest("should NOT add new checkitem from user interaction (Exception - 404 Not Found)", function() {
        expect(3);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        
        createAddCheckitemTestSetup();
        activateAddCheckItemSubmit(1);
        testAddCheckitemSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testAddCheckitemError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testAddCheckitemException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not add the checklist item: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#tcdacib-1").click();
    });

    // Add Checklist Submit
    asyncTest("should add new checklist from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checklist/',
            responseTime: 1,
            type: 'POST',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });

        
        createAddChecklistTestSetup();
        activateAddChecklistSubmit(1);
        testAddChecklistSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"cardid\":1,\"checklistname\":\"Test List Name\"}",'Original "Add Checklist" POST sent the correct data');
        };

        testAddChecklistError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testAddChecklistException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdaclb-1").click();
    });

    asyncTest("should NOT add new checklist from user interaction (Error)", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checklist/',
            responseTime: 1,
            type: 'POST',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error adding checklist from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });

        
        createAddChecklistTestSetup();
        activateAddChecklistSubmit(1);
        testAddChecklistSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testAddChecklistError = function(data) {
            start();
            var alertBoxError = "Unit test of error adding checklist from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"cardid\":1,\"checklistname\":\"Test List Name\"}",'Original "Add Checklist" POST sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testAddChecklistException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdaclb-1").click();
    });

    asyncTest("should NOT add new checklist from user interaction (Exception - 404 Not Found)", function() {
        expect(3);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        
        createAddChecklistTestSetup();
        activateAddChecklistSubmit(1);
        testAddChecklistSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testAddChecklistError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testAddChecklistException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not add the checklist: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#tcdaclb-1").click();
    });

    module("Edit Item Submit callback tests");

        // Edit Checkitem Submit
    asyncTest("should edit checkitem from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });


        createEditCheckitemTestSetup();
        activateEditCheckItemSubmit(1);
        testEditCheckitemSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"checklistid\":\"3\",\"name\":\"New Checkitem Name\",\"cardid\":\"2\",\"checkitemid\":1}",'Original "Edit Checkitem" PUT sent the correct data');
        };

        testEditCheckitemError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdecib-1").click();
    });

    asyncTest("should NOT edit checkitem from user interaction (Error)", function() {
        expect(4);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error editing checkitem from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });


        createEditCheckitemTestSetup();
        activateEditCheckItemSubmit(1);
        testEditCheckitemSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditCheckitemError = function(data) {
            start();
            var alertBoxError = "Unit test of error editing checkitem from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"checklistid\":\"3\",\"name\":\"New Checkitem Name\",\"cardid\":\"2\",\"checkitemid\":1}",'Original "Edit Checkitem" PUT sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testEditCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdecib-1").click();
    });

    asyncTest("should NOT edit checkitem from user interaction (Exception - 404 Not Found)", function() {
        expect(4);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        createEditCheckitemTestSetup();
        activateEditCheckItemSubmit(1);
        testEditCheckitemSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditCheckitemError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditCheckitemException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not edit the checklist item: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#tcdecib-1").click();
    });

    // Edit card name tests

    asyncTest("should edit card name from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/card/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });


        createEditCardNameTestSetup();
        activateEditCardNameSubmit(1);
        testEditCardNameSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"cardname\":\"New Card Name\",\"cardid\":1}",'Original "Edit Card Name" PUT sent the correct data');
        };

        testEditCardNameError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditCardNameException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdenb-1").click();
    });

    asyncTest("should NOT edit name from user interaction (Error)", function() {
        expect(4);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/card/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error editing name from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });


        createEditCardNameTestSetup();
        activateEditCardNameSubmit(1);
        testEditCardNameSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditCardNameError = function(data) {
            start();
            var alertBoxError = "Unit test of error editing name from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"cardname\":\"New Card Name\",\"cardid\":1}",'Original "Edit name" PUT sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testEditCardNameException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdenb-1").click();
    });

    asyncTest("should NOT edit card name from user interaction (Exception - 404 Not Found)", function() {
        expect(4);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        createEditCardNameTestSetup();
        activateEditCardNameSubmit(1);
        testEditCardNameSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditCardNameError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditCardNameException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not change the card name: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#tcdenb-1").click();
    });

    // Edit card description tests
    asyncTest("should edit card description from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/card/description/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });


        createEditCardDescriptionTestSetup();
        activateEditCardDescriptionSubmit(1);
        testEditCardDescriptionSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"desc\":\"New *Card* Description\",\"cardid\":1}",'Original "Edit Card Description" PUT sent the correct data');
        };

        testEditCardDescriptionError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditCardDescriptionException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdedb-1").click();
    });

    asyncTest("should NOT edit card description from user interaction (Error)", function() {
        expect(4);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/card/description/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error editing description from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });


        createEditCardDescriptionTestSetup();
        activateEditCardDescriptionSubmit(1);
        testEditCardDescriptionSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditCardDescriptionError = function(data) {
            start();
            var alertBoxError = "Unit test of error editing description from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"desc\":\"New *Card* Description\",\"cardid\":1}",'Original "Edit description" PUT sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testEditCardDescriptionException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdedb-1").click();
    });

    asyncTest("should NOT edit card description from user interaction (Exception - 404 Not Found)", function() {
        expect(4);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        createEditCardDescriptionTestSetup();
        activateEditCardDescriptionSubmit(1);
        testEditCardDescriptionSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditCardDescriptionError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditCardDescriptionException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not change the card description: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#tcdedb-1").click();
    });


    // Edit checklist name tests
    asyncTest("should edit checklist name from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checklist/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });


        createEditChecklistNameTestSetup();
        activateEditChecklistNameSubmit(1);
        testEditChecklistNameSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"checklistname\":\"New checklist name\",\"checklistid\":1}",'Original "Edit checklist name" PUT sent the correct data');
        };

        testEditChecklistNameError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditChecklistNameException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdecb-1").click();
    });

    asyncTest("should NOT edit checklist name from user interaction (Error)", function() {
        expect(4);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checklist/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error editing checklist name from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });


        createEditChecklistNameTestSetup();
        activateEditChecklistNameSubmit(1);
        testEditChecklistNameSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditChecklistNameError = function(data) {
            start();
            var alertBoxError = "Unit test of error editing checklist name from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"checklistname\":\"New checklist name\",\"checklistid\":1}",'Original "Edit checklist name" PUT sent the correct data');
            checkForAlertBox(alertBoxError,false);
        };

        testEditChecklistNameException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdecb-1").click();
    });

    asyncTest("should NOT edit checklist name from user interaction (Exception - 404 Not Found)", function() {
        expect(4);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        createEditChecklistNameTestSetup();
        activateEditChecklistNameSubmit(1);
        testEditChecklistNameSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testEditChecklistNameError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testEditChecklistNameException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not edit the checklist name: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
        };

        $("#tcdecb-1").click();
    });

    // Check Checkitem tests
    asyncTest("should check checkitem from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });


        createEditCheckCheckitemTestSetup();
        testCheckCheckitemSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"checklistid\":\"22\",\"cardid\":\"21\",\"checkitemid\":\"1\",\"state\":\"complete\"}",'Original "Check checkitem" PUT sent the correct data');
            ok($("#tcdc-ci-1").is(':checked'),"Checkitem should be checked after this.")
        };

        testCheckCheckitemError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testCheckCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdc-ci-1").click();
    });

    asyncTest("should uncheck checkitem from user interaction", function() {
        expect(3);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    Error: false,
                    data: settings.data
                }
            }
        });


        createEditCheckCheckitemTestSetup();
        testCheckCheckitemSuccess = function(data) {
            start();
            ok(true,"Correctly called success function");
            equal(data.data,"{\"checklistid\":\"22\",\"cardid\":\"21\",\"checkitemid\":\"2\",\"state\":\"incomplete\"}",'Original "Check checkitem" PUT sent the correct data');
            ok(!$("#tcdc-ci-2").is(':checked'),"Checkitem should not be checked after this.")
        };

        testCheckCheckitemError = function() {
            start();
            ok(false,"Incorrectly called Error");
        };

        testCheckCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdc-ci-2").click();
    });

    asyncTest("should NOT check checkitem from user interaction (Error)", function() {
        expect(4);
        $.mockjaxClear();

        $.mockjax({
            url: '/trello/checkitem/',
            responseTime: 1,
            type: 'PUT',
            response: function(settings) {
                this.responseText=
                {
                    error: true,
                    data: settings.data,
                    errorInfo: "Unit test of error checking checkitem from user interaction",
                    HTTPError: "Should test as an error."
                }
            }
        });


        createEditCheckCheckitemTestSetup();
        testCheckCheckitemSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testCheckCheckitemError = function(data) {
            start();
            var alertBoxError = "Unit test of error checking checkitem from user interaction. Should test as an error.";
            ok(true,"Correctly called Error");
            equal(data.data,"{\"checklistid\":\"22\",\"cardid\":\"21\",\"checkitemid\":\"1\",\"state\":\"complete\"}",'Original "Check Checkitem" PUT sent the correct data');
            checkForAlertBox(alertBoxError,false);
            ok(!$("#tcdc-ci-1").is(':checked'),"Checkitem should not be checked after this.")
        };

        testCheckCheckitemException = function() {
            start();
            ok(false,"Incorrectly called Exception");
        };

        $("#tcdc-ci-1").click();
    });

    asyncTest("should NOT check checkitem from user interaction (Exception - 404 Not Found)", function() {
        expect(4);
        $.mockjaxClear();
        // Did not add a mockjax to this so it will report a 404 error.

        createEditCheckCheckitemTestSetup();
        testCheckCheckitemSuccess = function(data) {
            start();
            ok(false,"Incorrectly called success function");
        };

        testCheckCheckitemError = function(data) {
            start();
            ok(false,"Incorrectly called Error");
        };

        testCheckCheckitemException = function(textStatus, error) {
            start();
            var err = textStatus + ", " + error;
            var alertBoxError = "Could not change the checkitem state: "+err;
            ok(true,"Correctly called Exception");
            equal(err,"error, Not Found", "404 Not Found");
            checkForAlertBox(alertBoxError,false);
            ok(!$("#tcdc-ci-1").is(':checked'),"Checkitem should not be checked after this.")
        };

        $("#tcdc-ci-1").click();
    });



    module("Archive/Delete Item Submit callback tests");


    module("Interface element activation tests (add/edit items)")

}