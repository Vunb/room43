/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('InfoCtrl', function ($scope, $location) {

        this.createZoom = function (zoom) {
            $location.path('/' + zoom);
        };

        return $scope.InfoCtrl = this;
    })
;

