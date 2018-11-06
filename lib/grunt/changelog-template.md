<a name="<%= version.name %>"></a>
# v<%= version.name %> (<%= intro %>)
<% _.forEach(sections, function(section){ if(section.commitsCount > 0) { %>
## <%= section.title %>
<% _.forEach(section.commits, function(commit){ %>  - <%= printCommit(commit, false) %><% }) %>
<% _.forEach(section.components, function(component){ %>  - **<%= component.name %>**
<% _.forEach(component.commits, function(commit){ %>    - <%= printCommit(commit, false) %><% }) %>
<% }) %>
<% } %>
<% }) %>