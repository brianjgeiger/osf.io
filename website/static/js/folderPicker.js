/**
 * A simple folder picker plugin built on HGrid.
 * Takes the same options as HGrid and additionally requires an
 * `onChooseFolder` option (the callback executed when a folder is selected).
 *
 * Usage:
 *
 *     $('#myPicker').folderpicker({
 *         data: // Array of HGrid-formatted data or URL to fetch data
 *         onPickFolder: function(evt, folder) {
 *             // do something with folder
 *         }
 *     });
 */
;(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hgrid'], factory);
    } else if (typeof $script === 'function') {
        $script.ready(['hgrid'], function() {
            global.FolderPicker = factory(jQuery, HGrid);
            $script.done('folderPicker');
        });
    } else {
        global.FolderPicker = factory(jQuery, global.HGrid);
    }
}(this, function($, HGrid){
    'use strict';

    // Extend the default HGrid name column
    FolderPicker.Col = {};
    FolderPicker.Col.Name = $.extend({}, HGrid.Col.Name);
    // Column title
    FolderPicker.Col.title = 'Folders';
    // Name for the radio button inputs
    var INPUT_NAME = 'folder-select';

    /**
     * Returns the folder select button for a single row.
     */
    function folderSelectView(row) {
        // Build the parts of the radio button
        var open = '<input type="radio" ';
        var name = 'name="' + INPUT_NAME + '" ';
        var checked = row._fpChecked ? ' checked ' : ' ';
        // Store the HGrid id as the value
        var value = 'value="' + row.id + '" ';
        var close = '/>';
        // Join all the parts
        return [open, name, checked, value, close].join('');
    }

    // Custom selection button column.
    FolderPicker.Col.SelectFolder = {
        name: 'Select', folderView: folderSelectView, width: 10
    };

    // Upon clicking the name of folder, toggle its collapsed state
    function onClickName(evt, row, grid) {
        grid.toggleCollapse(row);
    }

    // Default HGrid options
    var defaults = {
        columns: [FolderPicker.Col.Name,
                  FolderPicker.Col.SelectFolder
        ],
        // Disable uploads
        uploads: false, width: '100%', height: 300,
        // Add listener that expands a folder upon clicking its name
        listeners: [
            {selector: '.' + HGrid.Html.nameClass, on: 'click',
            callback: onClickName}
        ],
        // Optional selector for progress/loading bars
        progBar: null,
        init: function() {
            $(this.options.progBar).hide();
        }
    };

    function FolderPicker(selector, opts) {
        var self = this;
        self.selector = selector;
        // Custom HGrid action to select a folder that uses the passed in
        // "onChooseFolder" callback
        if (!opts.onPickFolder) {
            throw 'FolderPicker must have the "onPickFolder" option defined';
        }
        self.options = $.extend({}, defaults, opts);
        // Start up the grid
        self.grid = new HGrid(selector, self.options);
        // Set up listener for folder selection
        $(selector).on('change', 'input[name="' + INPUT_NAME + '"]', function(evt) {
            var id = $(this).val();
            var row = self.grid.getByID(id);
            // Store checked state so that radio button doesn't deselect when expanding a folder
            row._fpChecked = true;
            self.options.onPickFolder.call(self, evt, row);
        });
    }

    // Augment jQuery
    $.fn.folderpicker = function(options) {
        this.each(function() {
            // HGrid must take an ID as a selector if using as a jQuery plugin
            if (!this.id) { throw 'FolderPicker must have an ID if initializing with jQuery.'; }
            var selector = '#' + this.id;
            return new FolderPicker(selector, options);
        });
    };
    // Export
    return FolderPicker;
}));
