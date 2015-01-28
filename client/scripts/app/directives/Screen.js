angular.module('videoconference').
    directive("dancingDots", function () {
        return function (e, element) {
            (function () {
                var e = 0;
                window.setInterval(function () {
                    for (var t = "", o = 0; e > o; o++)t += ".";
                    element.text(t), 3 !== e ? e += 1 : e = 0;
                }, 1000)
            })()
        };
    });