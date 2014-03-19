<%inherit file="project/project_base.mako"/>
%for addon_css in addon_page_css:
    <link rel="stylesheet" type="text/css" href="${addon_css}">
%endfor
%for addon_js in addon_page_js:
    <script src="${addon_js}"></script>
%endfor

%if trello_board_name is not None:
    <div id="TrelloBoard">
    <span class="TrelloBoardName"><a href="${trello_board_url}" target=":_blank">${trello_board_name }
        <img src = "/addons/static/trello/to_trello_24.png" title="Open '${trello_board_name }' on Trello"></a></span>


    <ul id="TrelloList">
    % for list in trello_lists:
        <div class="TrelloListBlock">
        <li>${list[u'name']}</li>
        %if len(list[u'cards']) != 0:

            <ul id="TrelloCardList">
            % for card in list[u'cards']:
                <div class="TrelloCard" id="tc-${card[u'id']}"
                     onmouseover="document.getElementById('tcli-${card[u'id']}').style.display = 'inline';"
                     onmouseout="document.getElementById('tcli-${card[u'id']}').style.display = 'none';">
                <div class="TrelloCardLinkIcon" id="tcli-${card[u'id']}"><a href="${card[u'url']}" target=":_blank">
                    <img src = "/addons/static/trello/to_trello_16.png" title="Open '${card[u'name']}' on Trello"></a></div>
                <li>
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
                    %if card[u'checkItemCount'] != 0:
                        <img src="/addons/static/trello/checklist_16.png" title="Checklists: checked items / total items">
                    ${card[u'checkedItemCount']} / ${card[u'checkItemCount']}
                    %endif
                    %if len(card[u'comments']) != 0:
                        <img src="/addons/static/trello/comment_icon_16.png" title="Comment count"> ${len(card[u'comments'])}
                    %endif
                    </div>
                </li>

                </div>
            % endfor
            </ul>
        %endif
        </div>
    % endfor
    </ul>
    </div>
%else:
    To use this module, you need to <a href="../settings">link a Trello board</a> to this project.
%endif