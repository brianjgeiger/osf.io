<%inherit file="project/project_base.mako" />
<%!
    import dateutil.parser
%>
%for addon_css in addon_page_css:
    <link rel="stylesheet" type="text/css" href="${addon_css}">
%endfor
%for addon_js in addon_page_js:
    <script type="text/javascript" src="${addon_js}"></script>
%endfor

<script id="kanbanCardTemplate" type="text/x-handlebars-template">
    <div class = "TrelloCard" id="tc-{{id}}"
    onclick="displayCard(event,'{{id}}');"
    onmouseover="document.getElementById('tcli-{{id}}').style.display = 'inline';"
    onmouseout="document.getElementById('tcli-{{id}}').style.display = 'none';"
    cardpos="{{pos}}" cardID="{{id}}">
        <div class="TrelloCardLinkIcon" id="tcli-{{id}}"><a href="{{url}}" target=":_blank">
            <img src = "/static/addons/trello/to_trello_16.png" title="Open '{{id}}' on Trello"></a></div>

            {{#if coverURL}}
                <div class = "TrelloCoverImage">
                    <img src="{{coverURL}}">
                </div>
            {{/if}}
            <div class = "TrelloCardName">{{name}}</div>
            <div class = "TrelloCardSummaryInfo">
               {{#if desc}}
                    <img src="/static/addons/trello/description_icon_16.png" title="This card has a description.">
               {{/if}}
                {{# if subscribed}}
                    <img src="/static/addons/trello/eye_icon_16.png" title="You are subscribed to this card's notifications.">
                {{/if}}
               {{#if badges.checkItems}}
                    <img src="/static/addons/trello/checklist_16.png" title="Checklists: checked items / total items">
                    {{badges.checkItemsChecked}} / {{badges.checkItems}}
                {{/if}}
                {{# if badges.comments}}
                    <img src="/static/addons/trello/comment_icon_16.png" title="Number of Comments: {{badges.comments}}">
                        {{badges.comments}}
                {{/if}}
                {{#if badges.attachments}}
                    <img src="/static/addons/trello/attachments_icon_16.png" title="Number of Attachments: {{badges.attachments}}">
                    {{badges.attachments}}
                {{/if}}

                {{#if due_date_string}}
                    <span class = "card_summary_due_date">
                         <img src="/static/addons/trello/due_date_icon_16.png" title="This card is due on {{due_date_string}}.">
                        {{due_date_string}}
                    </span>
                {{/if}}
            </div>
    </div>
</script>

<script id="kanban-card-detail-checkitem-template" type="text/x-handlebars-template">
                        <div class = "trello_card_detail_edit_checkitem_group" id="tcdecig-{{id}}">
                            <textarea maxlength="16384" rows="2" name="tcdecin-{{id}}"
                               checklistID="{{checklistid}}" cardID="{{cardid}}"
                               class="trello_card_detail_edit_checkitem_name" id="tcdecin-{{id}}">{{name}}</textarea> <br />
                            <div class="trello_card_detail_edit_checkitem_button" id="tcdecib-{{id}}">
                                Save
                            </div>
                            <div class="trello_card_detail_edit_checkitem_cancel" id="tcdecic-{{id}}">
                                X
                            </div>
                            <div class="trello_card_detail_edit_checkitem_delete" id="tcdecid-{{id}}">
                                Delete
                            </div>
                        </div>
                        <div class = "trello_card_detail_checklist_checkitem" checkitemid="{{id}}"  id="tcdeciog-{{id}}" >
                                <input type="checkbox" {{checked}} id="tcdc-ci-{{id}}" value="{{id}}"
                                 onclick="checkCheckItem('{{cardid}}','{{checklistid}}','{{id}}');" /><span id="tcdecio-{{id}}">{{name}}</span>
                        </div>
</script>

<script id="kanban-card-detail-checklist-template" type="text/x-handlebars-template">
                    <div class="trello_card_detail_checklist" id="tcdcl-{{id}}" checklistID="{{id}}">
                        <div class = "trello_card_detail_checklist_original_group" id="tcdecog-{{id}}">
                            <div class = "trello_card_detail_checklist_name" id="tcdeco-{{id}}">{{name}}</div>
                        </div>
                        <div class = "trello_card_detail_edit_checklist_group" id="tcdecg-{{id}}">
                            <textarea maxlength="16384" rows="2" name="tcdecn-{{id}}"
                               checklistID="{{id}}" cardID="{{cardid}}"
                               class="trello_card_detail_edit_checklist_name" id="tcdecn-{{id}}">{{name}}</textarea> <br />
                            <div class="trello_card_detail_edit_checklist_button" id="tcdecb-{{id}}">
                                Save
                            </div>
                            <div class="trello_card_detail_edit_checklist_cancel" id="tcdecc-{{id}}">
                                X
                            </div>
                            <div class="trello_card_detail_edit_checklist_delete" id="tcdecd-{{id}}">
                                Delete
                            </div>
                        </div>
                        <div class="trello_card_detail_checklist_checkitem_list" id="tcdccl-{{id}}" checklistID="{{id}}">
                        </div>
                    </div>
                    <div class="trello_card_detail_add_checkitem_group" id="tcdacig-{{id}}" checklistID="{{id}}" cardID="{{cardid}}">
                         <textarea maxlength="16384" rows="2" name="tcdacin-{{id}}"
                            listID="{{id}}" cardID="{{cardid}}" placeholder="Item name"
                         class="add_trello_card_detail_add_checkitem_name" id="tcdacin-{{id}}"></textarea> <br />
                    <div class="trello_card_detail_add_checkitem_button" id="tcdacib-{{id}}" checklistID="{{id}}" cardID="{{cardid}}">
                        Add
                    </div>
                    <div class="trello_card_detail_add_checkitem_cancel" id="tcdacic-{{id}}" checklistID="{{id}}" cardID="{{cardid}}">
                        X
                    </div>
                </div>
                <div class="trello_card_detail_add_checkitem_link" id="tcdacil-{{id}}" checklistID="{{id}}" cardID="{{cardid}}">
                    Add an item…
                </div>
</script>

<script id="kanban-card-detail-template" type="text/x-handlebars-template">
    <div class="trello_card_detail" id="tcd-{{trello_card.id}}">
        <div class="trello_card_detail_card" id="tcdc-{{trello_card.id}}">
        <div class = "trello_card_detail_edit_name_original_group" cardid="{{trello_card.id}}" id="tcdenog-{{trello_card.id}}" >
        <div class="trello_card_detail_name"> <span id="tcdeno-{{trello_card.id}}">{{trello_card.name}}</span></div>
            {{#if user_can_edit}}
             <div class="trello_card_detail_edit_name_delete" id="tcdend-{{trello_card.id}}">
                 Archive Card
            </div>
            {{/if}}
            <a href="{{trello_card.url}}" target=":_blank">
            <img src="/static/addons/trello/to_trello_24.png" title="Open {{trello_card.name}} on Trello"></a>
            </div>
            {{#if user_can_edit}}
            <div class = "trello_card_detail_edit_name_group" id="tcdeng-{{trello_card.id}}">
                <textarea maxlength="16384" rows="2" name="tcdenn-{{trello_card.id}}"
                   cardID="{{trello_card.id}}"
                   class="trello_card_detail_edit_name_name" id="tcdenn-{{trello_card.id}}">{{trello_card.name}}</textarea> <br />
                <div class="trello_card_detail_edit_name_button" id="tcdenb-{{trello_card.id}}">
                    Save
                </div>
                <div class="trello_card_detail_edit_name_cancel" id="tcdenc-{{trello_card.id}}">
                    X
                </div>
            </div>
        <div class = "trello_card_detail_description_original_group" id="tcdedog-{{trello_card.id}}">
            <div class="trello_card_detail_desc" id="tcdedom-{{trello_card.id}}">{{noBlankDescriptionMarkdown trello_card.desc}}</div>
            <div class="trello_card_detail_desc_hidden" id="tcdedo-{{trello_card.id}}">{{trello_card.desc}}</div>
        </div>
            {{else}}
             <div class = "trello_card_detail_description_original_group" id="tcdedog-{{trello_card.id}}">
                <div class="trello_card_detail_desc" id="tcdedom-{{trello_card.id}}">{{markdown trello_card.desc}}</div>
            </div>
            {{/if}}
        {{#if user_can_edit}}
            <div class = "trello_card_detail_edit_description_group" id="tcdedg-{{trello_card.id}}">
                <textarea maxlength="16384" rows="2" name="tcdedn-{{trello_card.id}}"
                   cardID="{{trello_card.id}}" submitOnReturn="false"
                   class="trello_card_detail_edit_description_name" id="tcdedn-{{trello_card.id}}">{{trello_card.desc}}</textarea> <br />
                <div class="trello_card_detail_edit_description_button" id="tcdedb-{{trello_card.id}}">
                    Save
                </div>
                <div class="trello_card_detail_edit_description_cancel" id="tcdedc-{{trello_card.id}}">
                    X
                </div>
            </div>
        {{/if}}
        <div class="trello_card_detail_checklist_list">
            {{#if trello_card.badges.checkItems}}
                {{#each trello_card.checklists}}
                    <div class="trello_card_detail_checklist" id="tcdcl-{{id}}" checklistID="{{id}}">
                        <div class = "trello_card_detail_checklist_original_group" id="tcdecog-{{id}}">
                            <div class = "trello_card_detail_checklist_name" id="tcdeco-{{id}}">{{name}}</div>
                        </div>
                        {{#if ../user_can_edit}}
                        <div class = "trello_card_detail_edit_checklist_group" id="tcdecg-{{id}}">
                            <textarea maxlength="16384" rows="2" name="tcdecn-{{id}}"
                               checklistID="{{id}}" cardID="{{../../trello_card.id}}"
                               class="trello_card_detail_edit_checklist_name" id="tcdecn-{{id}}">{{name}}</textarea> <br />
                            <div class="trello_card_detail_edit_checklist_button" id="tcdecb-{{id}}">
                                Save
                            </div>
                            <div class="trello_card_detail_edit_checklist_cancel" id="tcdecc-{{id}}">
                                X
                            </div>
                            <div class="trello_card_detail_edit_checklist_delete" id="tcdecd-{{id}}">
                                Delete
                            </div>
                        </div>
                        {{/if}}
                        <div class="trello_card_detail_checklist_checkitem_list" id="tcdccl-{{id}}" checklistID="{{id}}">
                    {{#each checkItems}}
                        {{#if ../../user_can_edit}}
                        <div class = "trello_card_detail_edit_checkitem_group" id="tcdecig-{{id}}">
                            <textarea maxlength="16384" rows="2" name="tcdecin-{{id}}"
                               checklistID="{{../../id}}" cardID="{{../../../trello_card.id}}"
                               class="trello_card_detail_edit_checkitem_name" id="tcdecin-{{id}}">{{name}}</textarea> <br />
                            <div class="trello_card_detail_edit_checkitem_button" id="tcdecib-{{id}}">
                                Save
                            </div>
                            <div class="trello_card_detail_edit_checkitem_cancel" id="tcdecic-{{id}}">
                                X
                            </div>
                            <div class="trello_card_detail_edit_checkitem_delete" id="tcdecid-{{id}}">
                                Delete
                            </div>
                        </div>
                        {{/if}}
                        <div class = "trello_card_detail_checklist_checkitem" checkitemid="{{id}}" id="tcdeciog-{{id}}" >
                            {{#if ../../user_can_edit}}
                                <input type="checkbox" {{checked}} id="tcdc-ci-{{id}}" value="{{id}}"
                                 onclick="checkCheckItem('{{../../../trello_card.id}}','{{../../id}}','{{id}}');" />
                            <span id="tcdecio-{{id}}" class=""{{state}}">{{name}}</span>
                            {{else}}
                                <span class = "{{state}}">{{name}}</span>
                            {{/if}}
                        </div>
                    {{/each}}
                            </div>
                    {{#if ../user_can_edit}}
                        <div class="trello_card_detail_add_checkitem_group" id="tcdacig-{{id}}" checklistID="{{id}}" cardID="{{../../trello_card.id}}">
                                 <textarea maxlength="16384" rows="2" name="tcdacin-{{id}}"
                                    listID="{{id}}" cardID="{{../../trello_card.id}}" placeholder="Item name"
                                 class="add_trello_card_detail_add_checkitem_name" id="tcdacin-{{id}}"></textarea> <br />
                            <div class="trello_card_detail_add_checkitem_button" id="tcdacib-{{id}}" checklistID="{{id}}" cardID="{{../../trello_card.id}}">
                                Add
                            </div>
                            <div class="trello_card_detail_add_checkitem_cancel" id="tcdacic-{{id}}" checklistID="{{id}}" cardID="{{../../trello_card.id}}">
                                X
                            </div>
                        </div>
                        <div class="trello_card_detail_add_checkitem_link" id="tcdacil-{{id}}" checklistID="{{id}}" cardID="{{../../trello_card.id}}">
                            Add an item…
                        </div>
                    {{/if}}
                    </div>
                {{/each}}
            {{/if}}
            </div>
            {{#if user_can_edit}}
                <div class="trello_card_detail_add_checklist_group" id="tcdaclg-{{trello_card.id}}" cardID="{{trello_card.id}}">
                    <textarea maxlength="16384" rows="2" name="tcdacln-{{trello_card.id}}" cardID="{{trello_card.id}}"
                     class="add_trello_card_detail_add_checklist_name" id="tcdacln-{{trello_card.id}}"
                            placeholder="Checklist name"></textarea> <br />
                    <div class="trello_card_detail_add_checklist_button" id="tcdaclb-{{trello_card.id}}" cardID="{{trello_card.id}}">
                        Add
                    </div>
                    <div class="trello_card_detail_add_checklist_cancel" id="tcdaclc-{{trello_card.id}}" cardID="{{trello_card.id}}">
                        X
                    </div>
                </div>
                <div class="trello_card_detail_add_checklist_link" id="tcdacll-{{trello_card.id}}" cardID="{{trello_card.id}}">
                    Add a checklist…
                </div>
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
            {{#if user_can_edit}}
            <div class="trello_card_detail_comment_unsupported">
                Commenting is not currently supported.
                To add or edit a comment, <a href="{{trello_card.url}}" target="_blank">visit the card on Trello</a>.
            </div>
            {{/if}}
        </div>
     </div>
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
        <img src = "/static/addons/trello/to_trello_24.png" title="Open '{{trello_board_name}}' on Trello"></a></span>

    <div id="TrelloList">
        {{#each trello_lists}}
            <div class="TrelloListBlock" id="tl-{{id}}" listID="{{id}}">
            <span class="TrelloListName">{{name}}</span>
                {{#if ../user_can_edit}}
                    <div class="CardList" id="cl-{{id}}" listID="{{id}}">

                    </div>
                    <div class = "add_trello_card_group" id="atcg-{{id}}" listID = "{{id}}">
                        <textarea maxlength="16384" rows="2" name="atcn-{{id}}"
                            class="add_trello_card_name" id="atcn-{{id}}" listID = "{{id}}"
                                placeholder="Card name"> </textarea> <br />
                        <span class = "add_trello_card_button" id ="atcb-{{id}}" listID = "{{id}}">Add</span>
                        <span class = "add_trello_card_cancel" id ="atcc-{{id}}" listID = "{{id}}">X</span>
                    </div>
                {{else}}
                    <div class="CardListNoEdit" id="cl-{{id}}" listID="{{id}}"></div>
                {{/if}}
                {{#if ../user_can_edit}}
                    <div class = "add_trello_card_link" id="atcl-{{id}}" listID = "{{id}}">Add a card…</div>

                {{/if}}
            </div>
        {{/each}}
    </div>
</script>

<script>
     $( document ).ajaxStart(function() {
        $("#progressbar").show();
     }).ajaxStop(function() {
        $("#progressbar").hide();
     });

    $( document ).ready(function() {
     $(function() {
        $( "#progressbar" ).progressbar({
          value: false
        });

     });
        $("#KanbanBoard").each(function() {
           loadBoard();
        });
    });
</script>

<script>
    %if node_url is not None:
        var nodeURL = '${node_url}';
    %else:
        reportError("Cannot locate url.");
    %endif

</script>


%if trello_board_name is not None:
    <div id="KanbanBoard">
        <div id="progressbar"></div>
    </div>

    <%doc>
        I tried pulling this script into the javascript, but it didn't work, even after wrapping it so it only
        runs after the dom has loaded. I didn't spend much time on it, but it would be good to get this grouped
        with all of the rest of the UI scripts.
    </%doc>

        <script type="text/javascript" charset="utf-8">
           $('#KanbanBoard').kinetic({
               slowdown: 0,
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
            $('#KanbanBoard').mouseleave(function(){
                $('#KanbanBoard').kinetic('stop');
            });
        </script>

%else:
    To use this module, you need to <a href="../settings">link a Trello board</a> to this project.
%endif