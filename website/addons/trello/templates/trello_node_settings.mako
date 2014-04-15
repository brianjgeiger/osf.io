<%inherit file="/project/addon/node_settings.mako" />


<script type="text/javascript" src="/static/addons/trello/trello-node-cfg.js"></script>

% if node_has_auth:

    <input type="hidden" id="trelloBoardId" name="trello_board_id" value="${trello_board_id}">
    <input type="hidden" id="trelloBoardName" name="trello_board_name" value="${trello_board_name}">

    <div class="well well-sm">
        <span>Authorized by <a href="${owner_url}">${authorized_user}</a></span>
        % if user_has_auth:
            <a id="trelloDelKey" class="text-danger pull-right" style="cursor: pointer">Deauthorize</a>
        % endif
    </div>


    <div class="row">
            <div class="col-md-6">
                <select id="trelloSelectBoard" class="form-control" ${'' if is_owner and not is_registration else 'disabled'}>
                    <option>-----</option>
                    %if is_owner:

                        % for trello_board in trello_boards:
                            <option value="${trello_board[u'id']}" ${'selected' if trello_board[u'id'] == trello_board_id else ''}>
                            ${trello_board[u'name'] or 'Unnamed'}
                            ${' (trello_board_name)' if 'trello_board_name' in trello_board[u'name'] else ''}
                            </option>
                        % endfor
                    %else:
                        <option value="${trello_board_name}" selected>
                            ${trello_board[u'name'] or 'Unnamed'}
                            </option>>
                    %endif
                </select>
            </div>

    </div>



%else:
    <a id="trelloAddKey" class="btn btn-primary">
        %if user_has_auth:
            Authorize: Import Token from Profile
        %else:
            Authorize: Create Access Token
        %endif
    </a>
% endif

<%def name="submit_btn()">
    % if node_has_auth and is_owner and user_has_auth:
        <br />
        ${parent.submit_btn()}
    % endif
</%def>
