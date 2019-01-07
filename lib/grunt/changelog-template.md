<a name="<%= version.name %>"></a>
# [<%= version.name %>](https://github.com/backbrace/backbrace/compare/<%= logo %>...<%= version.name %>) (<%= intro %>)
<% _.forEach(sections, function(section){ if(section.commitsCount > 0) { %>
## <%= section.title %>
<% _.forEach(section.commits, function(commit){ %>* <%= printCommit(commit, true) %><% }) %>
<% _.forEach(section.components, function(component){ %>
<% _.forEach(component.commits, function(commit){ %>* **<%= component.name %>:** <%= printCommit(commit, true) %><% }) %>
<% }) %>
<% } %>
<% }) %>