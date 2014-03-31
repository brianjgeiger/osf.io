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

<script id="kanban-card-template" type="text/x-handlebars-template">
    <div class = "TrelloCard" id="tc-{{id}}"
    onclick="displayCard('{{id}}');"
    onmouseover="document.getElementById('tcli-{{id}}').style.display = 'inline';"
    onmouseout="document.getElementById('tcli-{{id}}').style.display = 'none';"
    cardpos="{{pos}}" cardID="{{id}}">
        <div class="TrelloCardLinkIcon" id="tcli-{{id}}"><a href="{{id}}" target=":_blank">
            <img src = "/addons/static/trello/to_trello_16.png" title="Open '{{id}}' on Trello"></a></div>

            {{#if coverURL}}
                <div class = "TrelloCoverImage">
                    <img src="{{coverURL}}">
                </div>
            {{/if}}
            <div class = "TrelloCardName">{{name}}</div>
            <div class = "TrelloCardSummaryInfo">
               {{#if desc}}
                    <img src="/addons/static/trello/description_icon_16.png" title="This card has a description.">
               {{/if}}
                {{# if subscribed}}
                    <img src="/addons/static/trello/eye_icon_16.png" title="You are subscribed to this card's notifications.">
                {{/if}}
               {{#if badges.checkItems}}
                    <img src="/addons/static/trello/checklist_16.png" title="Checklists: checked items / total items">
                    {{badges.checkItemsChecked}} / {{badges.checkItems}}
                {{/if}}
                {{# if badges.comments}}
                    <img src="/addons/static/trello/comment_icon_16.png" title="Number of Comments: {{badges.comments}}">
                        {{badges.comments}}
                {{/if}}
                {{#if badges.attachments}}
                    <img src="/addons/static/trello/attachments_icon_16.png" title="Number of Attachments: {{badges.attachments}}">
                    {{badges.attachments}}
                {{/if}}

                {{#if due_date_string}}
                    <span class = "card_summary_due_date">
                         <img src="/addons/static/trello/due_date_icon_16.png" title="This card is due on {{due_date_string}}.">
                        {{due_date_string}}
                    </span>
                {{/if}}
            </div>
    </div>
</script>

<script id="kanban-card-detail-template" type="text/x-handlebars-template">
    <div class="trello_card_detail_name"> {{trello_card.name}}
        <a href="{{trello_card.url}}" target=":_blank">
        <img src="/addons/static/trello/to_trello_24.png" title="Open {{trello_card.name}} on Trello"></a>
    </div>
     <div class="trello_card_detail_desc">{{markdown desc}}</div>
        {{#if trello_card.badges.checkItems}}
            {{#each trello_card.checklists}}
                <div class = "trello_card_detail_checklist_name">{{name}}</div>
                {{#each checkItems}}
                    <div class = "trello_card_detail_checklist_checkitem">
                        {{#if ../../user_can_edit}}
                            <input type="checkbox" {{checked}} id="tcdc-ci-{{id}}" value="{{id}}"
                             onclick="checkCheckItem('{{../../../trello_card.id}}','{{../../id}}','{{id}}');" />{{name}}
                        {{else}}
                            <span class = "{{state}}">{{name}}</span>
                        {{/if}}
                    </div>
                {{/each}}
            {{/each}}
        {{/if}}
        {{#if trello_card.badges.comments}}
            {{#each trello_card.comments}}
                <div class = "trello_card_detail_comment">
                    <div class = "trello_card_detail_comment_header">
                        <div class = "trello_card_detail_comment_date">
                            {{localTime date}}
                        </div>
                        <div class =  "trello_card_detail_comment_owner">
                            {{memberCreator.fullName}}
                        </div>
                    </div>
                    <div class = "trello_card_detail_comment_comment">
                        <p>
                           {{markdown data.text}}
                        </p>
                    </div>
                </div>
           {{/each}}
        {{/if}}
</script>

<script id="kanban-card-detail-attachments-template" type="text/x-handlebars-template">
    <div class = "trello_card_detail_attchment_header">Attachments</div>
        {{#each attachments}}
             <div class = "trello_card_detail_attachment">
                <span class = "attachment_preview">
                    {{#if previewURL}}
                        <img src="{{previewURL}}">
                    {{else}}
                        {{previewType}}
                    {{/if}}
                </span>
                <span class = "attachment_description">
                    <a href="{{url}}" target="_none">{{name}}</a>
                </span>
             </div>
        {{/each}}
</script>

<script id="kanban-board-template" type="text/x-handlebars-template">
    <span class="TrelloBoardName"><a href="{{trello_board_url}}" target=":_blank">{{trello_board_name}}
        <img src = "/addons/static/trello/to_trello_24.png" title="Open '{{trello_board_name}}' on Trello"></a></span>

    <div id="TrelloList">
        {{#each trello_lists}}
            <div class="TrelloListBlock" id="tl-{{id}}" listID="{{id}}">
            <span class="TrelloListName">{{name}}</span>
                {{#if ../user_can_edit}}
                    <div class="CardList" id="cl-{{id}}" listID="{{id}}"></div>
                {{else}}
                    <div class="CardListNoEdit" id="cl-{{id}}" listID="{{id}}"></div>
                {{/if}}
                {{#if ../user_can_edit}}
                    <div class = "add_trello_card_link" id="atcl-{{id}}" listID = "{{id}}">Add a card…</div>
                    <div class = "add_trello_card_group" id="atcg-{{id}}" listID = "{{id}}">
                        <textarea maxlength="16384" rows="2" name="atcn-{{id}}"
                            class="add_trello_card_name" id="atcn-{{id}}" listID = "{{id}}"> </textarea> <br />
                        <span class = "add_trello_card_button" id ="atcb-{{id}}" listID = "{{id}}">Add</span>
                        <span class = "add_trello_card_cancel" id ="atcc-{{id}}" listID = "{{id}}">X</span>
                    </div>
                {{/if}}
            </div>
        {{/each}}
    </div>
</script>

<script>
    $( document ).ready(function() {
        $("#KanbanBoard").each(function() {
           loadBoard();
        });
    });
</script>

%if trello_board_name is not None:
    <div id="KanbanBoard">
    </div>

    <%doc>
        I tried pulling this script into the javascript, but it didn't work, even after wrapping it so it only
        runs after the dom has loaded. I didn't spend much time on it, but it would be good to get this grouped
        with all of the rest of the UI scripts.
    </%doc>

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