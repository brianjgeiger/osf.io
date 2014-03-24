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
    <div id="TrelloBoard">
    <span class="TrelloBoardName"><a href="${trello_board_url}" target=":_blank">${trello_board_name }
        <img src = "/addons/static/trello/to_trello_24.png" title="Open '${trello_board_name }' on Trello"></a></span>

    <div id="TrelloList">
    % for list in trello_lists:
        <div class="TrelloListBlock" id="tl-${list['id']}" listID = "${list['id']}">
        <span class="TrelloListName">${list[u'name']}</span>
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
    % endfor
    </div>
    </div>


##        <script type="text/javascript" charset="utf-8">
##            $('#TrelloBoard').kinetic({
##                filterTarget: function(target){
##                    var returnValue = target.className.indexOf('ui-') === -1;
##                    return returnValue;
##                }
##            });
##            $('#left').click(function(){
##                $('#TrelloBoard').kinetic('start', { velocity: -10 });
##            });
##            $('#right').click(function(){
##                $('#TrelloBoard').kinetic('start', { velocity: 10 });
##            });
##            $('#end').click(function(){
##                $('#TrelloBoard').kinetic('end');
##            });
##            $('#stop').click(function(){
##                $('#TrelloBoard').kinetic('stop');
##            });
##        </script>

%else:
    To use this module, you need to <a href="../settings">link a Trello board</a> to this project.
%endif