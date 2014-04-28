% if summary['can_view']:

    <li
            node_id="${summary['id']}"
            node_reference="${summary['id']}:${'node' if summary['primary'] else 'pointer'}"
            class="
                project list-group-item list-group-item-node cite-container
                ${'pointer' if not summary['primary'] else ''}
        ">

        <h4 class="list-group-item-heading">
            <span class="overflow" style="display:inline-block;">
            % if not summary['primary']:
                <i class="icon-hand-right" data-toggle="tooltip" title="Linked ${summary['category']}"></i>
            % endif
            <a href="${summary['url']}">${summary['title']}</a>

            % if summary['is_registration']:
                | Registered: ${summary['registered_date']}
            % endif
            </span>
            <div class="pull-right">
                % if not summary['primary'] and 'admin' in user['permissions']:
                    <i class="icon-remove remove-pointer" data-id="${summary['id']}" data-toggle="tooltip" title="Remove link"></i>
                    <i class="icon-code-fork" onclick="NodeActions.forkPointer('${summary['id']}', '${summary['primary_id']}');" data-toggle="tooltip" title="Fork this ${summary['category']} into ${node['category']} ${node['title']}"></i>
                % endif
                <i id="icon-${summary['id']}" class="icon-plus" onclick="NodeActions.openCloseNode('${summary['id']}');" data-toggle="tooltip" title="More"></i>
            </div>
        </h4>
        <div class="list-group-item-text"></div>

        <!-- Show abbreviated contributors list -->
        <div mod-meta='{
                "tpl": "util/render_users_abbrev.mako",
                "uri": "${summary['api_url']}contributors_abbrev/",
                "kwargs": {
                    "node_url": "${summary['url']}"
                },
                "replace": true
            }'></div>

        <!--Stacked bar to visualize user activity level against total activity level of a project -->
        <!--Length of the stacked bar is normalized over all projects -->
        <div class="user-activity-meter">
            <ul class="meter-wrapper">
                <li class="ua-meter" data-toggle="tooltip" title="${user_full_name} made ${summary['ua_count']} contributions" style="width:${summary['ua']}px;"></li>
                <li class="pa-meter" style="width:${summary['non_ua']}px;"></li>
                <li class="pa-meter-label">${summary['nlogs']} contributions</li>
            </ul>
        </div>

        <div class="body hide" id="body-${summary['id']}" style="overflow:hidden;">
            <hr />
            Recent Activity
            <div id="logs-${summary['id']}" class="log-container" data-uri="${summary['api_url']}log/">
                <dl class="dl-horizontal activity-log"
                    data-bind="foreach: {data: logs, as: 'log'}">
                    <dt><span class="date log-date" data-bind="text: log.date.local, tooltip: {title: log.date.utc}"></span></dt>
                  <dd class="log-content">
                    <a data-bind="text: log.userFullName || log.apiKey, attr: {href: log.userURL}"></a>
                    <!-- log actions are the same as their template name -->
                    <span data-bind="template: {name: log.action, data: log}"></span>
                  </dd>
                </dl><!-- end foreach logs -->
            </div>
         </div>

    </li>

% else:

    <li
        node_reference="${summary['id']}:${'node' if summary['primary'] else 'pointer'}"
        class="project list-group-item list-group-item-node unavailable">
        <h4 class="list-group-item-heading">
            Private Component
        </h4>
    </li>

% endif
