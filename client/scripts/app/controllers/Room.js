/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('RoomCtrl', function ($scope, $state, $stateParams, $window, fluidGrid, sounds) {

        var thiz = {};
        var signalingServer = $window.location.origin || "/";
        // Grab the room from the URL
        thiz.roomName = $stateParams.roomName;
        thiz.participants = 0;
        thiz.shuffle = fluidGrid('#remotes >');
        thiz.player = sounds();
        thiz.$ = angular.element;
        thiz.api = new SimpleWebRTC({
            // url: 'https://master.room43.in:8888',//'http://signaling.simplewebrtc.com:8888',
            // url: '/',//'http://signaling.simplewebrtc.com:8888',
            url: signalingServer,
            localVideoEl: 'localVideo',
            //remoteVideosEl: 'remotes',
            remoteVideosEl: null,
            autoRequestMedia: false,
            debug: false,
            detectSpeakingEvents: true,
            autoAdjustMic: false
        });


        thiz.handleVideoClick = function (e) {
            if (e.target.id == 'localVideo') return;

            // e.target is the video element, we want the container #remotes > div > div
            var container = angular.element(e.target).parent().parent();
            var alreadyFocused = container.hasClass('focused');
            angular.element('.videocontainer').removeClass('focused');

            if (!alreadyFocused) {
                container.addClass('focused');
                thiz.shuffle(container.get(0));
            } else {
                // clicking on the focused element removes focus
                thiz.shuffle();
            }
        };

        thiz.handleVideoAdded = function (el, peer) {
            var self = thiz;
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
            var container = thiz.$('<div class="videocontainer"><div><!-- video is prepended here--><div class="connectioninfo"><div class="connectionstate"></div><div class="connectionhelp"></div></div><span class="muted"><i class="ss-icon">volume</i>Muted audio</span><span class="paused"><i class="ss-icon">videocamera </i>Video paused</span></div></div>');
            container.attr('id', 'videocontainer_' + (peer ? thiz.api.getDomId(peer) : 'localScreen'));
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
        thiz.handleVideoRemoved = function (el, peer) {
            var conversationLength = Date.now() - el.videoStartTime
                , self = thiz
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

        thiz.handleEndCallClick = function () {
            thiz.api.stopScreenShare();
            thiz.api.stopLocalVideo();
            thiz.api.disconnect();
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
        thiz.api.startLocalVideo();
        thiz.api.on('videoAdded', thiz.handleVideoAdded);
        thiz.api.on('videoRemoved', thiz.handleVideoRemoved);
        thiz.api.on('readyToCall', function (sessionid) {
            // you can name it anything
            if (thiz.roomName) {
                thiz.api.joinRoom(thiz.roomName);
                console.log("joined sessionid: " + sessionid);
            } else {
                alert("joint fail")
            }
        });
        thiz.api.on('joinedRoom', function (roomName) {
            console.log("joined success, roomName: " + roomName);
        });
        thiz.$($window).bind('resize', function () {
            thiz.shuffle();
        });
        $scope.participants = 0;
        $scope.roomName = thiz.roomName;
        $scope.link2Share = "room43.in/" + thiz.roomName;
        $scope.handleVideoClick = thiz.handleVideoClick;
        $scope.endCallClick = thiz.handleEndCallClick;
    })
;

