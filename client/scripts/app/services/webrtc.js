/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .factory('webrtc', function () {
        return {
            init: function () {
                return new SimpleWebRTC({
                    localVideoEl: 'localVideo',
                    remoteVideosEl: 'remotes',
                    autoRequestMedia: true,
                    debug: false,
                    detectSpeakingEvents: true,
                    autoAdjustMic: false
                });
            }
        }
    })
;