<%inherit file="project/addon/user_settings.mako" />

<!-- Authorization -->
<div>
    % if authorized:
        <a id="trelloDelKey" class="btn btn-danger">Delete Access Token</a>

    % else:
        <a id="trelloAddKey" class="btn btn-primary">
            Create Access Token
        </a>
    % endif
</div>

<script type="text/javascript">

    $(document).ready(function() {

        $('#trelloAddKey').on('click', function() {
            % if authorized_user_id:
                $.ajax({
                    type: 'POST',
                    url: '/api/v1/profile/settings/oauth/',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
                        window.location.reload();
                    }
                });
            % else:
                window.location.href = '/api/v1/settings/trello/oauth/';
            % endif
        });

        $('#trelloDelKey').on('click', function() {
            bootbox.confirm(
                'Are you sure you want to delete your Trello access key? This will ' +
                    'revoke access to Trello for all projects you have authorized ' +
                    'and delete your access token from Trello. ',
                function(result) {
                    if (result) {
                        $.ajax({
                            url: '/api/v1/settings/trello/oauth/',
                            type: 'DELETE',
                            success: function() {
                                window.location.reload();
                            }
                        });
                    }
                }
            )
        });
    });

</script>

<%def name="submit_btn()"></%def>
<%def name="on_submit()"></%def>