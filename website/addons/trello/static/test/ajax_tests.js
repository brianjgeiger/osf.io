function mockList(canEdit){
   $.mockjax(function(lists) {
        // lists.url == 'list/<listnum>'
        var listnum = lists.url.match(/list\/(.*)$/);
        if ( listnum ) {
            return {
                responseTime: 1,
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

            };
        }
    });
}

function mockErrorList(canEdit,errorInfo){
   $.mockjax(function(lists) {
        // lists.url == 'list/<listnum>'
        var listnum = lists.url.match(/list\/(.*)$/);
        if ( listnum ) {
            return {
                responseTime: 1,
                responseText: {
                    "istest": true,
                    "error": true,
                    "complete": true,
                    "errorInfo": errorInfo,
                    "HTTPError": "Should test as an error.",
                    "trello_list_id": listnum,
                    "user_can_edit": canEdit
                }

            };
        }
    });
}

function mockErrorBoard(canEdit,errorInfo){
        $.mockjax({
            url: 'lists',
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
            url: 'lists',
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

function mockCard(id, canEdit) {
            $.mockjax({
            url: 'card/'+id,
            responseTime: 1,
            responseText: {
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
                "trello_card_id": '"'+id+'"',
                "user_can_edit": canEdit,
                "istest": true
            }
        });

}

function kanbanicAJAXTests(){
    module("Fill out elements from AJAX calls");

    asyncTest("should fill in a card with useful information - reloadCardFromTrello()", function(assert) {
        $.mockjaxClear();
        this.clock.restore();
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
        this.clock.restore();
        mockBoard(true);
        mockList(true);

        expect(3);

        var $fixture = $( "#qunit-fixture" );
        $fixture.append('<div id="KanbanBoard"></div>');

        //Perform ajax call, fill out Mustache template, modify div
        loadBoard();

    });

    module("Return error conditions from AJAX calls");

    asyncTest("should display error box - loadListCards(listID)", function(assert) {
        $.mockjaxClear();
        this.clock.restore();
        expect(2);
        mockErrorList(true,"loadListCards");
        loadListCards(1);
    });
    asyncTest("should show error for 500 exception - loadListCards()", function(assert) {
        $.mockjaxClear();
        this.clock.restore();
        expect(2);
        mockException("list/1",500,"loadListCards 500");
        loadListCards(1);
    });

    asyncTest("should display error box - loadBoard()", function(assert) {
        $.mockjaxClear();
        this.clock.restore();
        expect(2);
        mockErrorBoard(true,"loadBoard");
        loadBoard();
    });
    asyncTest("should show error for 500 exception - loadBoard()", function(assert) {
        $.mockjaxClear();
        this.clock.restore();
        expect(2);
        mockException("lists",500,"loadBoard 500");
        loadBoard();
    });
}