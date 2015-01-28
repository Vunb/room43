/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('RoomCtrl', function ($scope, $state, $stateParams, $window, fluidGrid, sounds) {

        var thjs = {};
        // Grab the room from the URL
        thjs.roomName = $stateParams.roomName;
        thjs.participants = 0;
        thjs.shuffle = fluidGrid('#remotes >');
        thjs.player = sounds();
        thjs.$ = angular.element;
        thjs.api = new SimpleWebRTC({
            url: 'https://master.room43.in:8888',//'http://signaling.simplewebrtc.com:8888',
            localVideoEl: 'localVideo',
            //remoteVideosEl: 'remotes',
            remoteVideosEl: null,
            autoRequestMedia: false,
            debug: false,
            detectSpeakingEvents: true,
            autoAdjustMic: false
        });


        thjs.handleVideoClick = function (e) {
            if (e.target.id == 'localVideo') return;

            // e.target is the video element, we want the container #remotes > div > div
            var container = angular.element(e.target).parent().parent();
            var alreadyFocused = container.hasClass('focused');
            angular.element('.videocontainer').removeClass('focused');

            if (!alreadyFocused) {
                container.addClass('focused');
                thjs.shuffle(container.get(0));
            } else {
                // clicking on the focused element removes focus
                thjs.shuffle();
            }
        };

        thjs.handleVideoAdded = function (el, peer) {
            var self = thjs;
            self.player.play('online');
            if (peer) {
                peer.videoEl = el;
//                tracking.track('videoConnected', {
//                    loggedIn: me.authed,
//                    name: me.currentRoom,
//                    locked: me.roomLocked,
//                    reserved: me.roomIsReserved,
//                    type: peer.type,
//                    peerId: peer.id
//                });
            }

            // suppress context menu
            el.oncontextmenu = function () {
                return false;
            };

            // video container
            var container = thjs.$('<div class="videocontainer"><div><!-- video is prepended here--><div class="connectioninfo"><div class="connectionstate"></div><div class="connectionhelp"></div></div><span class="muted"><i class="ss-icon">volume</i>Muted audio</span><span class="paused"><i class="ss-icon">videocamera </i>Video paused</span></div></div>');
            container.attr('id', 'videocontainer_' + (peer ? thjs.api.getDomId(peer) : 'localScreen'));
            // video is prepended here
            container.find('>div').prepend(el);
            // remotevideos can be focused
            container.addClass('focusable');

            self.$('#remotes').append(container);

            el.videoStartTime = Date.now();
            // !important, play actually gets called by SimpleWebRTC
            // for for some reason this fixes things in FF as of right
            // now.
            el.play();
            el.onresize = function (event) {
                self.shuffle();
            };

            if (peer) {
                peer.hasdata = false;
                peer.firstconnect = true;
            }
            // functions called when video data arrives
            // videoWidth and videoHeight are set then
            el.onloadedmetadata = function (event) {
            };
            el.onloadeddata = function (event) {
                // hide text when we have data
                container.find('.connectionstate').hide();
                if (peer) peer.hasdata = true;
            };

//            if (peer && peer.pc) {
//                peer.pc.on('iceConnectionStateChange', function (event) {
//                    self.handleIceConnectionStateChange(peer, container);
//                });
//                if (!(peer.pc.iceConnectionState === 'connected' ||
//                    peer.pc.iceConnectionState === 'completed')) {
//                    thjs.$(el).hide();
//                }
//            }

            self.shuffle();
            self.$(el).bind('click', self.handleVideoClick);
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.participants = self.$('#remotes video').length;
                });
            }, 100);
        };
        thjs.handleVideoRemoved = function (el, peer) {
            var conversationLength = Date.now() - el.videoStartTime
                , self = thjs
                ;

            self.player.play('offline');
            if (peer) {
//                tracking.track('videoDisconnected', {
//                    duration: conversationLength,
//                    peerId: peer.id,
//                    type: peer.type
//                });
            }

            self.$('#videocontainer_' + (peer ? self.api.getDomId(peer) : el.id)).remove();
            self.shuffle();
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.participants = self.$('#remotes video').length;
                });
            }, 100);
        };

        thjs.handleEndCallClick = function () {
            thjs.api.stopScreenShare();
            thjs.api.stopLocalVideo();
            thjs.api.disconnect();
            //thjs.api.leaveRoom();
            $state.go('home');
        };

        /* Events */
        /*
         app.api.on('readyToCall', _.bind(this.handleReadyToCall, this));
         app.api.on('videoAdded', _.bind(this.handleVideoAdded, this));
         app.api.on('localScreenAdded', _.bind(this.handleVideoAdded, this));
         app.api.on('videoRemoved', _.bind(this.handleVideoRemoved, this));
         app.api.on('leftCall', _.bind(this.handleLeftCall, this));
         app.api.on('localScreenStopped', function () {
         me.sharingScreen = false;
         }); //*/

        // when it's ready, join if we got a room from the URL
        thjs.api.startLocalVideo();
        thjs.api.on('videoAdded', thjs.handleVideoAdded);
        thjs.api.on('videoRemoved', thjs.handleVideoRemoved);
        thjs.api.on('readyToCall', function (sessionid) {
            // you can name it anything
            if (thjs.roomName) {
                thjs.api.joinRoom(thjs.roomName);
                console.log("joined sessionid: " + sessionid);
            } else {
                alert("joint fail")
            }
        });
        thjs.api.on('joinedRoom', function (roomName) {
            console.log("joined success, roomName: " + roomName);
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.joined = true;
                });
            }, 100);
        });
        thjs.$($window).bind('resize', function () {
            thjs.shuffle();
        });
        $scope.participants = 0;
        $scope.roomName = thjs.roomName;
        $scope.link2Share = "room43.in/" + thjs.roomName;
        $scope.handleVideoClick = thjs.handleVideoClick;
        $scope.endCallClick = thjs.handleEndCallClick;
    })
;

