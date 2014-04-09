/**
 * Controls the "Add Links" modal.
 */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        // TODO: Use require to load dependencies (jquery, knockout, etc.)
        define(['knockout'], factory);
    } else {
        global.PointerManager = factory(global.ko);
    }
}(this, function(ko) {
    'use strict';

    var AddPointerViewModel = function(nodeTitle) {

        var self = this;

        self.nodeTitle = nodeTitle;

        self.query = ko.observable();
        self.results = ko.observableArray();
        self.selection = ko.observableArray();
        self.errorMsg = ko.observable('');

        self.search = function(includePublic) {
            self.results([]);
            self.errorMsg('');
            $.ajax({
                type: 'POST',
                url: '/api/v1/search/node/',
                data: JSON.stringify({
                    query: self.query(),
                    nodeId: nodeId,
                    includePublic: includePublic
                }),
                contentType: 'application/json',
                dataType: 'json',
                success: function(result) {
                    if (!result.nodes.length) {
                        self.errorMsg('No results found.');
                    }
                    self.results(result.nodes);
                }
            });
        };

        self.addTips = function(elements) {
            elements.forEach(function(element) {
                $(element).find('.contrib-button').tooltip();
            });
        };

        self.add = function(data) {
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
                if (self.selection().indexOf(result) === -1) {
                    self.add(result);
                }
            });
        };

        self.removeAll = function() {
            $.each(self.selection(), function(idx, selected) {
                self.remove(selected);
            });
        };

        self.selected = function(data) {
            for (var idx=0; idx < self.selection().length; idx++) {
                if (data.id === self.selection()[idx].id) {
                    return true;
                }
            }
            return false;
        };

        self.submit = function() {
            var nodeIds = $.osf.mapByProperty(self.selection(), 'id');
            $.ajax({
                type: 'post',
                url: nodeApiUrl + 'pointer/',
                data: JSON.stringify({
                    nodeIds: nodeIds
                }),
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    window.location.reload();
                }
            });
        };

        self.clear = function() {
            self.query('');
            self.results([]);
            self.selection([]);
        };

        self.authorText = function(node) {
            var rv = node.firstAuthor;
            if (node.etal) {
                rv += ' et al.';
            }
            return rv;
        };

    };

    ////////////////
    // Public API //
    ////////////////

    function PointerManager (selector, nodeName) {
        var self = this;
        self.selector = selector;
        self.$element = $(self.selector);
        self.nodeName = nodeName;
        self.viewModel = new AddPointerViewModel(nodeName);
        self.init();
    }

    PointerManager.prototype.init = function() {
        var self = this;
        ko.applyBindings(self.viewModel, self.$element[0]);
        self.$element.on('hidden.bs.modal'), function() {
            self.viewModel.clear();
        };
    };

    return PointerManager;

}));
