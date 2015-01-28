angular.module('videoconference')
    .directive("clickAutoselect", function () {
        return { restrict: "A", link: function (e, element) {
            element.bind("click", function () {
                this.focus();
                this.select();
            });
        }}
    });