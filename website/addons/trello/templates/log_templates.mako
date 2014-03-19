<script type="text/html" id="trello_content_linked">
linked Trello board <span data-bind="text: params.trello.trello_board_name"></span> in
<a class="log-board-name-link overflow" data-bind="attr: {href: nodeUrl}, text: nodeTitle"></a>
</script>

<script type="text/html" id="trello_content_unlinked">
unlinked Trello board <span data-bind="text: params.trello.trello_board_name"></span> in
<span data-bind="text: nodeCategory"></span>
<a class="log-board_name-link overflow" data-bind="attr: {href: nodeUrl}, text: nodeTitle"></a>
</script>
