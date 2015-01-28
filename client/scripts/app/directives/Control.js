angular.module('videoconference').
    directive("styledCheckbox", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "styled-checkbox.html",
            transclude: true,
            scope: {
                model: "=model",
                checkedText: "@checkedText",
                checkedIcon: "@checkedIcon",
                uncheckedText: "@?uncheckedText",
                uncheckedIcon: "@?uncheckedIcon",
                display: "@?display",
                reversed: "@?reversed",
                isDisabled: "@?isdisabled",
                change: "&change"
            },
            link: function (e) {
                e.id = "checkbox-" + e.$id
            }
        }
    });