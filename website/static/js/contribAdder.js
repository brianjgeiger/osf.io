/**
 * Controller for the Add Contributor modal.
 */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'knockout', 'bootstrap', 'editable'], factory);
    } else {
        global.ContribAdder = factory(jQuery, global.ko);
    }
}(this, function($, ko) {

    NODE_OFFSET = 25;

    /**
     * The add contributor VM, scoped to the add contributor modal dialog.
     */
    var AddContributorViewModel = function(title, parentId, parentTitle) {

        var self = this;

        self.permissions = ['read', 'write', 'admin'];

        self.title = title;
        self.parentId = parentId;
        self.parentTitle = parentTitle;

        self.page = ko.observable('whom');
        self.pageTitle = ko.computed(function() {
            return {
                whom: 'Add Contributors',
                which: 'Select Components',
                invite: 'Add Unregistered Contributor'
            }[self.page()];
        });
        self.query = ko.observable();
        self.results = ko.observableArray([]);
        self.selection = ko.observableArray();
        self.errorMsg = ko.observable('');
        self.inviteError = ko.observable('');

        self.nodes = ko.observableArray([]);
        self.nodesToChange = ko.observableArray();
        $.getJSON(
            nodeApiUrl + 'get_editable_children/',
            {},
            function(result) {
                $.each(result['children'] || [], function(idx, child) {
                    child['margin'] = NODE_OFFSET + child['indent'] * NODE_OFFSET + 'px';
                });
                self.nodes(result['children']);
            }
        );

        self.foundResults = ko.computed(function() {
            return self.query() && self.results().length;
        });

        self.noResults = ko.computed(function() {
            return self.query() && !self.results().length
        });

        self.inviteName = ko.observable();
        self.inviteEmail = ko.observable();

        self.selectWhom = function() {
            self.page('whom');
        };
        self.selectWhich = function() {
            self.page('which');
        };

        self.gotoInvite = function() {
            self.inviteName(self.query());
            self.inviteError('');
            self.inviteEmail('');
            self.page('invite');
        };

        self.goToPage = function(page) {
            self.page(page);
        };

        self.search = function() {
            self.errorMsg('');
            if (self.query()) {
                $.getJSON(
                    '/api/v1/user/search/',
                    {
                        query: self.query(),
                        excludeNode: nodeId,
                    },
                    function(result) {
                        self.results(result['users']);
                    }
                )
            } else {
                self.results([]);
            }
        };

        self.importFromParent = function() {
            self.errorMsg('');
            $.getJSON(
                nodeApiUrl + 'get_contributors_from_parent/',
                {},
                function(result) {
                    if (!result.contributors.length) {
                        self.errorMsg('All contributors from parent already included.');
                    }
                    self.results(result['contributors']);
                }
            )
        };

        self.recentlyAdded = function() {
            self.errorMsg('');
            $.getJSON(
                nodeApiUrl + 'get_recently_added_contributors/',
                {},
                function(result) {
                    if (!result.contributors.length) {
                        self.errorMsg('All recently added contributors already included.');
                    }
                    self.results(result['contributors']);
                }
            )
        };


        self.addTips = function(elements) {
            elements.forEach(function(element) {
                $(element).find('.contrib-button').tooltip();
            });
        };

        self.setupEditable = function(elm, data) {
            var $elm = $(elm);
            var $editable = $elm.find('.permission-editable');
            $editable.editable({
                showbuttons: false,
                value: 'admin',
                source: [
                    {value: 'read', text: 'Read'},
                    {value: 'write', text: 'Read + Write'},
                    {value: 'admin', text: 'Administrator'}
                ],
                success: function(response, value) {
                    data.permission(value);
                }
            });
        };

        self.afterRender = function(elm, data) {
            self.addTips(elm, data);
            self.setupEditable(elm, data);
        };

        function postInviteRequest(fullname, email, options) {
            var ajaxOpts = $.extend({
                url: nodeApiUrl + 'invite_contributor/',
                type: 'POST',
                data: JSON.stringify({'fullname': fullname, 'email': email}),
                dataType: 'json', contentType: 'application/json'
            }, options);
            return $.ajax(ajaxOpts);
        }

        function onInviteSuccess(result) {
            self.query('');
            self.results([]);
            self.page('whom');
            self.add(result.contributor);
        }

        function onInviteError(xhr, status, error) {
            var response = JSON.parse(xhr.responseText);
            // Update error message
            self.inviteError(response.message);
        }

        /** Validate the invite form. Returns a string error message or
        *   true if validation succeeds.
        */
        self.validateInviteForm = function (){
            // Make sure Full Name is not blank
            if (!self.inviteName().trim().length) {
                return 'Full Name is required.';
            }
            if (self.inviteEmail() && !$.osf.isEmail(self.inviteEmail())) {
                return 'Not a valid email address.';
            }
            // Make sure that entered email is not already in selection
            for (var i=0, contrib; contrib = self.selection()[i]; ++i){
                var contribEmail = contrib.email.toLowerCase().trim();
                if (contribEmail === self.inviteEmail().toLowerCase().trim()) {
                    return self.inviteEmail() + ' is already in queue.';
                }
            }
            return true;
        };

        self.postInvite = function() {
            self.inviteError('');
            var validated = self.validateInviteForm();
            if (typeof validated === 'string') {
                self.inviteError(validated);
                return false;
            }
            return postInviteRequest(self.inviteName(), self.inviteEmail(),
                {
                    success: onInviteSuccess,
                    error: onInviteError
                }
            );
        };

        self.add = function(data) {
            data.permission = ko.observable('admin');
            self.selection.push(data);
            // Hack: Hide and refresh tooltips
            $('.tooltip').hide();
            $('.contrib-button').tooltip();
        };


        self.remove = function(data) {
            self.selection.splice(
                self.selection.indexOf(data), 1
            );
            // Hack: Hide and refresh tooltips
            $('.tooltip').hide();
            $('.contrib-button').tooltip();
        };

        self.addAll = function() {
            $.each(self.results(), function(idx, result) {
                if (self.selection().indexOf(result) == -1) {
                    self.add(result);
                }
            });
        };

        self.removeAll = function() {
            $.each(self.selection(), function(idx, selected) {
                self.remove(selected);
            });
        };

        self.cantSelectNodes = function() {
            return self.nodesToChange().length == self.nodes().length;
        };
        self.cantDeselectNodes = function() {
            return self.nodesToChange().length == 0;
        };

        self.selectNodes = function() {
            self.nodesToChange($.osf.mapByProperty(self.nodes(), 'id'));
        };
        self.deselectNodes = function() {
            self.nodesToChange([]);
        };

        self.selected = function(data) {
            for (var idx=0; idx < self.selection().length; idx++) {
                if (data.id == self.selection()[idx].id)
                    return true;
            }
            return false;
        };


        self.addingSummary = ko.computed(function() {
            var names = $.map(self.selection(), function(result) {
                return result.fullname
            });
            return names.join(', ');
        });

        self.submit = function() {
            $.osf.block();
            $(".modal").modal('hide');
            $.ajax({
                url: nodeApiUrl + 'contributors/',
                type: "post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    users: self.selection().map(function(user) {
                        return ko.toJS(user);
                    }),
                    node_ids: self.nodesToChange()
                }),
                success: function(response) {
                        window.location.reload();
                },
                error: function(response){
                    $.osf.unblock();
                    bootbox.alert("Add contributor failed.");
                }
            });
        };

        self.clear = function() {
            self.page('whom');
            self.query('');
            self.results([]);
            self.selection([]);
            self.nodesToChange([]);
            self.errorMsg('');
        };

    };

    ////////////////
    // Public API //
    ////////////////

    function ContribAdder (selector, nodeTitle, nodeId, parentTitle) {
        var self = this;
        self.selector = selector;
        self.$element = $(selector);
        self.nodeTitle = nodeTitle;
        self.nodeId = nodeId;
        self.parentTitle = parentTitle;
        self.viewModel = new AddContributorViewModel(self.nodeTitle,
            self.nodeId, self.parentTitle);
        self.init();
    }

    ContribAdder.prototype.init = function() {
        var self = this;
        ko.applyBindings(self.viewModel, self.$element[0]);
        // Clear popovers on dismiss start
        self.$element.on('hide.bs.modal', function() {
            self.$element.find('.popover').popover('hide');
        });
        // Clear user search modal when dismissed; catches dismiss by escape key
        // or cancel button.
        self.$element.on('hidden.bs.modal', function() {
            self.viewModel.clear();
        });
        // Load recently added contributors every time the modal is activated.
        self.$element.on('shown.bs.modal', function() {
            self.viewModel.recentlyAdded();
        });
    };

    return ContribAdder;
}));
