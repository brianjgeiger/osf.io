<%inherit file="project/project_base.mako"/>
<%!
    import dateutil.parser
%>
%for addon_css in addon_page_css:
    <link rel="stylesheet" type="text/css" href="${addon_css}">
%endfor
%for addon_js in addon_page_js:
    <script type="text/javascript" src="${addon_js}"></script>
%endfor



%if trello_board_name is not None:
    <span class="TrelloBoardName"><a href="${trello_board_url}" target=":_blank">${trello_board_name }
        <img src = "/addons/static/trello/to_trello_24.png" title="Open '${trello_board_name }' on Trello"></a></span>
    <div id="KanbanBoard">

    <div id="TrelloList">
    % for list in trello_lists:
        <div class="TrelloListBlock" id="tl-${list['id']}" listID = "${list['id']}">
        <span class="TrelloListName">${list[u'name']}</span>
            % if user_can_edit:
                <% card_list_class = '"CardList"' %>
            % else:
                <% card_list_class = '"CardListNoEdit"' %>
            % endif

            <div class=${card_list_class} id="cl-${list['id']}" listID = "${list['id']}">
        %if len(list[u'cards']) != 0:


            % for card in list[u'cards']:
                <div class="TrelloCard" id="tc-${card[u'id']}"
                     onclick="displayCard('${card[u'id']}');"
                     onmouseover="document.getElementById('tcli-${card[u'id']}').style.display = 'inline';"
                     onmouseout="document.getElementById('tcli-${card[u'id']}').style.display = 'none';"
                     cardpos="${card[u'pos']}" cardID="${card[u'id']}">
                <div class="TrelloCardLinkIcon" id="tcli-${card[u'id']}"><a href="${card[u'url']}" target=":_blank">
                    <img src = "/addons/static/trello/to_trello_16.png" title="Open '${card[u'name']}' on Trello"></a></div>

                    %if u'coverURL' in card:
                        <div class = "TrelloCoverImage">
                            <img src="${card[u'coverURL']}">
                        </div>
                    %endif
                    <div class = "TrelloCardName">${card[u'name']}</div>
                    <div class = "TrelloCardSummaryInfo">
                       %if card[u'desc'] != "":
                            <img src="/addons/static/trello/description_icon_16.png" title="This card has a description.">
                       %endif
                    %if card[u'subscribed'] == True:
                        <img src="/addons/static/trello/eye_icon_16.png" title="You are subscribed to this card's notifications.">
                    %endif
                    %if card[u'badges'][u'checkItems'] != 0:
                        <img src="/addons/static/trello/checklist_16.png" title="Checklists: checked items / total items">
                    ${card[u'badges'][u'checkItemsChecked']} / ${card[u'badges'][u'checkItems']}
                    %endif
                    %if card[u'badges'][u'comments'] != 0:
                        <img src="/addons/static/trello/comment_icon_16.png" title="Number of Comments: ${card[u'badges'][u'comments']}">
                            ${card[u'badges'][u'comments']}
                    %endif
                    %if card[u'badges'][u'attachments'] != 0:
                        <img src="/addons/static/trello/attachments_icon_16.png" title="Number of Attachments: ${card[u'badges'][u'attachments']}">
                        ${card[u'badges'][u'attachments']}
                    %endif

                    %if card['badges']['due'] is not None:
                        <%
                            due_date = dateutil.parser.parse(card['badges']['due'])
                        %>
                        <span class = "card_summary_due_date">
                             <img src="/addons/static/trello/due_date_icon_16.png" title="This card is due on ${due_date.strftime('%b %d')}.">
                            ${due_date.strftime('%b %d')}
                        </span>
                    %endif
                    </div>


                </div>
            % endfor

        %endif
                </div>
##            % if user_can_edit:
                <div class = "add_trello_card_link" id="atcl-${list['id']}" listID = "${list['id']}">Add a card…</div>
                <div class = "add_trello_card_group" id="atcg-${list['id']}" listID = "${list['id']}">
                    <textarea maxlength="16384" rows="2" name="atcn-${list['id']}" class="add_trello_card_name" id="atcn-${list['id']}" listID = "${list['id']}"> </textarea> <br />
                    <span class = "add_trello_card_button" id ="atcb-${list['id']}" listID = "${list['id']}">Add</span>
                    <span class = "add_trello_card_cancel" id ="atcc-${list['id']}" listID = "${list['id']}">X</span>
                </div>
##            %endif
        </div>
    % endfor
    </div>
    </div>

##I tried pulling this script into the javascript, but it didn't work, even after wrapping it so it only
##runs after the dom has loaded. I didn't spend much time on it, but it would be good to get this grouped
##with all of the rest of the UI scripts.

        <script type="text/javascript" charset="utf-8">
            $('#KanbanBoard').kinetic({
                filterTarget: function(target){
                    var returnValue = false;
                    if(target.id){
                        if(target.id === "TrelloList" || target.id === "KanbanBoard") {
                            returnValue = true;
                        }
                    }

                    return returnValue;
                }
            });
            $('#left').click(function(){
                $('#KanbanBoard').kinetic('start', { velocity: -10 });
            });
            $('#right').click(function(){
                $('#KanbanBoard').kinetic('start', { velocity: 10 });
            });
            $('#end').click(function(){
                $('#KanbanBoard').kinetic('end');
            });
            $('#stop').click(function(){
                $('#KanbanBoard').kinetic('stop');
            });
        </script>

%else:
    To use this module, you need to <a href="../settings">link a Trello board</a> to this project.
%endif