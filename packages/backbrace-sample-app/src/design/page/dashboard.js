backbrace.controller('dashboard', function(viewer, section) {

    section.template = '<div class="supporting-text"><a bb-repeat=true class="samples-comp" onclick="backbrace.loadPage(\'page/{{name}}\')">' +
        '<div class="shape-circle samples-comp-img" ' +
        'style="background-color:{{color}};background-image:url(./images/icons/{{icon}});"></div>' +
        '<span class="samples-comp-text">{{caption}}</span></a></div>';
});
