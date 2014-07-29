<div class="modal fade" id="addPrivateLink">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-bind="text:pageTitle"></h3>
            </div>

            <div class="modal-body">

                <div>
                    <div>
                        Name this link (e.g., "For Peer Review", "Sharing data", "Share project")
                        <div class="form-group">
                            <input type="text" class="form-control private-link-name" placeholder="Add a link name" data-bind="value:name"/>
                        </div>
                    </div>

                    <hr />

                    <div class="checkbox">
                        <label>
                            <input type="checkbox" data-bind="checked: anonymous"/>
                            Anonymize contributor list for this link (e.g., for blind peer review)
                        </label>
                    </div>

                    <hr />

                    <div style="margin-bottom:10px;">
                        Anyone with the private link can view, but not edit,
                        the components associated with the link.
                        Which components would you like to associate with this link?
                    </div>



                    <div class="row">

                        <div class="col-md-6" >
                            <div class="list-overflow">
                            <input type="checkbox" checked disabled />
                            <span data-bind="text:title"></span> (current component)
                            <div data-bind="foreach:nodes">
                                <div data-bind="style:{'marginLeft':margin}">
                                    <input type="checkbox" data-bind="checked:$parent.nodesToChange, value:id" />
                                    <span data-bind="text:title"></span>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div class="col-md-6">

                            <div>
                                <a data-bind="click:selectNodes, css:{disabled:cantSelectNodes()}">Select all</a>
                            </div>
                            <div>
                                <a data-bind="click:deselectNodes, css:{disabled:cantDeselectNodes()}">De-select all</a>
                            </div>
                        </div>

                    </div>

                </div>

            </div><!-- end modal-body -->

            <div class="modal-footer">

                <a href="#" class="btn btn-default" data-dismiss="modal">Cancel</a>
                <a class="btn btn-success" data-bind="click:submit">Submit</a>

            </div><!-- end modal-footer -->
        </div><!-- end modal-content -->
    </div><!-- end modal-dialog -->
</div><!-- end modal -->