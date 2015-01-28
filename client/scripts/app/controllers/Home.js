/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('HomeCtrl', function ($scope, $location, $state, $window, guid) {
        var simpleGuy = new Guy({
            'appendElement': document.getElementById( 'faceGuy' ),
            'color': '#D53972'
        });

        $scope.createRoom = function (roomName) {
            var val = roomName.toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '') || guid();
            $state.go("room.join", {roomName: val});
        };
    })
;
