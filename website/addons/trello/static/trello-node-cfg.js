    $(document).ready(function() {


        $('#trelloAddKey').on('click', function() {
            if ($(this)[0].outerText == 'Authorize: Create Access Token')
                window.location.href = nodeApiUrl + 'trello/oauth/';
            $.ajax({
                type: 'POST',
                url: nodeApiUrl + 'trello/user_auth/',
                contentType: 'application/json',
                dataType: 'json',
                success: function(response) {
                    window.location.reload();
                }
            });

        });

        $('#trelloDelKey').on('click', function() {
            bootbox.confirm(
                'Are you sure you want to delete your Trello access key? This will ' +
                'revoke the ability to view your Trello boards.',
                function(result) {
                    if (result) {
                        $.ajax({
                            url: nodeApiUrl + 'trello/oauth/',
                            type: 'DELETE',
                            contentType: 'application/json',
                            dataType: 'json',
                            success: function() {
                                window.location.reload();
                            }
                        });
                    }
                }
            );
        });

        $('#trelloSelectBoard').on('change', function() {
            var value = $(this).val();
            if (value) {
                $('#trelloBoardId').val(value)
                $('#trelloBoardName').val($('#trelloSelectBoard option:selected').text())
            }
        });

        $('#addonSettingsTrello .addon-settings-submit').on('click', function() {
            if ($('#trelloBoardId').val() == '-----') {
                return false;
            }
        });


    });

