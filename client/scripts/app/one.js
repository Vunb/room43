/**
 * Created by Vunb on 26/8/2014.
 */

angular
    .module('videoconference', [
        'ui.router'
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            var access = {
                public: 'public', anon: 'anon'
            };

            // Home routes
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'home',
                    controller: 'HomeCtrl'
                });
            // Information routes
            $stateProvider
                .state('about', {
                    url: '/about',
                    //abstract: true,
                    //template: "<ui-view/>",
                    templateUrl: "about.index", //"<h2>About page</h2><ui-view/>",
                    data: {
                        access: access.public
                    }
                })
                .state('about.team', {
                    url: '/team',
                    templateUrl: 'about.team',
                    controller: 'InfoCtrl'
                })
                .state('about.privacy', {
                    url: '/privacy',
                    //templateUrl: 'about.privacy',
                    template: "Privacy",
                    controller: 'InfoCtrl'
                })
                .state('about.terms', {
                    url: '/terms',
                    //templateUrl: 'about.terms',
                    template: "Terms",
                    controller: 'InfoCtrl'
                })
                .state('about.contact', {
                    url: '/contact',
                    //templateUrl: 'contact',
                    template: "Contact",
                    controller: 'InfoCtrl'
                })
                .state('about.jobs', {
                    url: '/jobs',
                    //templateUrl: 'jobs',
                    template: "Jobs",
                    controller: 'InfoCtrl'
                });
            // Zoom routes
            $stateProvider
                .state('room', {
                    abstract: true,
                    template: "<ui-view/>",
                    data: {
                        access: access.public
                    }
                })
                .state('room.join', {
                    url: '/:roomName',
                    templateUrl: 'room',
                    controller: 'RoomCtrl'
                });
            $urlRouterProvider.otherwise('/404');

            // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
            $urlRouterProvider.rule(function ($injector, $location) {
                if ($location.protocol() === 'file')
                    return;

                var path = $location.path()
                // Note: misnomer. This returns a query object, not a search string
                    , search = $location.search()
                    , params
                    ;

                // check to see if the path already ends in '/'
                if (path[path.length - 1] === '/') {
                    return;
                }

                // If there was no search string / query params, return with a `/`
                if (Object.keys(search).length === 0) {
                    return path + '/';
                }

                // Otherwise build the search string and return a `/?` prefix
                params = [];
                angular.forEach(search, function (v, k) {
                    params.push(k + '=' + v);
                });
                return path + '/?' + params.join('&');
            });

            $locationProvider.html5Mode(true);


        }
    ])
    .run(['$rootScope', '$state', '$location', '$window', function ($rootScope, $state, $location, $window) {
        //$state.go('home');
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        });
        $rootScope.$on('$stateChangeSuccess', function (event) {
            // Setup _ga:  http://www.arnaldocapo.com/blog/post/google-analytics-and-angularjs-with-ui-router/72
            if (!$window.ga) return;
            //- dev
            //- console.log('tracking ...');
            $window.ga('send', 'pageview', { page: $location.path() });
        });
    }])
;
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
/**
 * Created by Vunb on 1/11/2014.
 */

angular.module('videoconference')
    .factory('guid', function () {
        return (function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        })();
    })
;
/**
 * Created by Vunb on 1/11/2014.
 */

angular.module('videoconference')
    .factory('fluidGrid', function () {
        var focusedEl;
        var $ = angular.element;
        return function (selector) {
            return function (focus) {
                reOrganize(selector, focus);

                function biggestBox(container, aspectRatio) {
                    var aspectRatio = aspectRatio || (3 / 4),
                        height = (container.width * aspectRatio),
                        res = {};

                    if (height > container.height) {
                        return {
                            height: container.height,
                            width: container.height / aspectRatio
                        };
                    } else {
                        return {
                            width: container.width,
                            height: container.width * aspectRatio
                        };
                    }
                };

                function reOrganize(selector, focus) {
                    var floor = Math.floor,
                        elements = $(selector),
                        howMany = elements.length,
                        howManyNonFocused = function () {
                            var hasFocused = !!elements.find('.focused').length;
                            if (hasFocused && howMany > 1) {
                                return howMany - 1;
                            } else if (hasFocused && howMany === 1) {
                                return 1;
                            } else {
                                return howMany;
                            }
                        }(),

                        totalAvailableWidth = window.innerWidth,
                        totalAvailableHeight = window.innerHeight - 140,

                        availableWidth = totalAvailableWidth,
                        availableHeight = totalAvailableHeight,

                        container = {
                            width: availableWidth,
                            height: availableHeight
                        },
                        columnPadding = 15,
                        minimumWidth = 290,
                        aspectRatio = 3 / 4,

                        numberOfColumns,
                        numberOfRows,

                        numberOfPaddingColumns,
                        numberOfPaddingRows,

                        itemDimensions,
                        totalWidth,

                        videoWidth,
                        leftMargin,

                        videoHeight,
                        usedHeight,
                        topMargin,

                    // do we have one selected?
                    // this is because having a single
                    // focused element is not treated
                    // differently, but we don't want to
                    // lose that reference.
                        haveFocusedEl;


                    // if we passed in a string here (could be "none")
                    // then we want to either set or clear our current
                    // focused element.
                    if (focus) focusedEl = $(focus)[0];

                    // make sure our cached focused element is still
                    // attached.
                    if (focusedEl && !$(focusedEl).parent().length) focusedEl = undefined;
                    // also make sure our (cached) focused element is actually focused
                    if (focusedEl && !$(focusedEl).hasClass('focused')) focusedEl = undefined;

                    // figure out if we should consider us as having any
                    // special focused elements
                    haveFocusedEl = focusedEl && howManyNonFocused > 1;

                    elements.height(availableHeight);

                    // how we want the to stack at different numbers
                    if (haveFocusedEl) {
                        numberOfColumns = howManyNonFocused - 1;
                        numberOfRows = 1;
                        availableHeight = totalAvailableHeight * .2;
                    } else if (howManyNonFocused === 0) {
                        return;
                    } else if (howManyNonFocused === 1) {
                        numberOfColumns = 1;
                        numberOfRows = 1;
                    } else if (howManyNonFocused === 2) {
                        if (availableWidth > availableHeight) {
                            numberOfColumns = 2;
                            numberOfRows = 1;
                        } else {
                            numberOfColumns = 1;
                            numberOfRows = 2;
                        }
                    } else if (howManyNonFocused === 3) {
                        if (availableWidth > availableHeight) {
                            numberOfColumns = 3;
                            numberOfRows = 1;
                        } else {
                            numberOfColumns = 1;
                            numberOfRows = 3;
                        }
                    } else if (howManyNonFocused === 4) {
                        numberOfColumns = 2;
                        numberOfRows = 2;
                    } else if (howManyNonFocused === 5) {
                        numberOfColumns = 3;
                        numberOfRows = 2;
                    } else if (howManyNonFocused === 6) {
                        if (availableWidth > availableHeight) {
                            numberOfColumns = 3;
                            numberOfRows = 2;
                        } else {
                            numberOfColumns = 2;
                            numberOfRows = 3;
                        }
                    } else if (howManyNonFocused > 6) {
                        numberOfColumns = howManyNonFocused - 1;
                        numberOfRows = 1;
                        availableHeight = totalAvailableHeight * .2;
                        focusedEl = elements.get(0);
                        haveFocusedEl = true;
                    }

                    itemDimensions = biggestBox({
                        width: availableWidth / numberOfColumns,
                        height: availableHeight / numberOfRows
                    });

                    numberOfPaddingColumns = numberOfColumns - 1;
                    numberOfPaddingRows = numberOfRows - 1;

                    totalWidth = itemDimensions.width * numberOfColumns;

                    videoWidth = function () {
                        var totalWidthLessPadding = totalWidth - (columnPadding * numberOfPaddingColumns);
                        return totalWidthLessPadding / numberOfColumns;
                    }();

                    leftMargin = (availableWidth - totalWidth) / 2;

                    //videoHeight = itemDimensions.height - ((numberOfRows > 1) ? (columnPadding / numberOfRows) : 0);
                    videoHeight = videoWidth * aspectRatio;

                    usedHeight = (numberOfRows * videoHeight);
                    topMargin = (availableHeight - usedHeight) / 2;

                    if (haveFocusedEl) {
                        elements = elements.not('.focused');
                    }

                    elements.each(function (index) {
                        var order = index,
                            row = floor(order / numberOfColumns),
                            column = order % numberOfColumns,
                            intensity = 12,
                            rotation = function () {
                                if (numberOfColumns === 3) {
                                    if (column === 0) {
                                        return 1;
                                    } else if (column === 1) {
                                        return 0;
                                    } else if (column === 2) {
                                        return -1
                                    }
                                } else if (numberOfColumns === 2) {
                                    intensity = 5;
                                    return column == 1 ? -1 : 1
                                } else if (numberOfColumns === 1) {
                                    return 0;
                                }
                            }(),
                            transformation = 'rotateY(' + (rotation * intensity) + 'deg)';

                        if (rotation === 0) {
                            transformation += ' scale(.98)';
                        }

                        var calculatedTop;
                        if (haveFocusedEl) {
                            calculatedTop = (totalAvailableHeight * .8) + topMargin + 'px';
                        } else {
                            calculatedTop = (row * itemDimensions.height) + topMargin + 'px';
                        }

                        $(this).css({
                            //transform: transformation,
                            top: calculatedTop,
                            left: (column * itemDimensions.width) + leftMargin + 'px',
                            width: videoWidth + 'px',
                            height: videoHeight + 'px',
                            position: 'absolute'
                        });
                    });

                    if (haveFocusedEl) {
                        var aspectRatio = focusedEl.videoHeight / focusedEl.videoWidth;
                        if ($(focusedEl).find('video').length) {
                            aspectRatio = $(focusedEl).find('video').get(0).videoHeight / $(focusedEl).find('video').get(0).videoWidth;
                        }
                        var focusSize = biggestBox({
                            height: (totalAvailableHeight * .8),
                            width: totalAvailableWidth
                        }, aspectRatio);

                        $(focusedEl).css({
                            top: 0,
                            height: focusSize.height,
                            width: focusSize.width,
                            left: (totalAvailableWidth / 2) - (focusSize.width / 2)
                        });
                    }
                }
            };
        }
    })
;
/**
 * Created by Vunb on 1/11/2014.
 */
angular.module('videoconference')
    .factory('SoundEffectManager', function () {
        return (function () {
            function SoundEffectManager() {
                this.AudioContext = window.AudioContext || window.webkitAudioContext;

                this.support = !!this.AudioContext;
                if (this.support) {
                    this.context = new this.AudioContext();
                }

                this.sounds = {};
                this.sources = {};
            }

// async load a file at a given URL, store it as 'name'.
            SoundEffectManager.prototype.loadFile = function (url, name, delay, cb) {
                if (this.support) {
                    this._loadWebAudioFile(url, name, delay, cb);
                } else {
                    this._loadWaveFile(url.replace('.mp3', '.wav'), name, delay, 3, cb);
                }
            };

// async load a file at a given URL, store it as 'name'.
            SoundEffectManager.prototype._loadWebAudioFile = function (url, name, delay, cb) {
                if (!this.support) {
                    return;
                }

                var self = this;
                var request = new XMLHttpRequest();

                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    self.context.decodeAudioData(request.response,
                        function (data) { // Success
                            self.sounds[name] = data;
                            if (cb) {
                                cb(null, data);
                            }
                        },
                        function (err) { // Error
                            if (cb) {
                                cb(err);
                            }
                        }
                    );
                };

                setTimeout(function () {
                    request.send();
                }, delay || 0);
            };

            SoundEffectManager.prototype._loadWaveFile = function (url, name, delay, multiplexLimit, cb) {
                var self = this;
                var limit = multiplexLimit || 3;

                setTimeout(function () {
                    var a, i = 0;

                    self.sounds[name] = [];
                    while (i < limit) {
                        a = new Audio();
                        a.src = url;
                        // for our callback
                        if (i === 0 && cb) {
                            a.addEventListener('canplaythrough', cb, false);
                        }
                        a.load();
                        self.sounds[name][i++] = a;
                    }
                }, delay || 0);
            };

            SoundEffectManager.prototype._playWebAudio = function (soundName, loop) {
                var buffer = this.sounds[soundName];

                if (!buffer) {
                    return;
                }

                if (loop && this.sources[soundName]) {
                    // Only start the sound once if it's looping
                    return;
                }

                var source = this.context.createBufferSource();
                source.buffer = buffer;
                source.loop = loop;
                source.connect(this.context.destination);

                if (loop) {
                    this.sources[soundName] = source;
                }

                source.start(0);
            };

            SoundEffectManager.prototype._playWavAudio = function (soundName, loop) {
                var audio = this.sounds[soundName];
                var howMany = audio && audio.length || 0;
                var i = 0;
                var currSound;

                if (!audio) {
                    return;
                }

                while (i < howMany) {
                    currSound = audio[i++];
                    // this covers case where we loaded an unplayable file type
                    if (currSound.error) {
                        return;
                    }
                    if (currSound.currentTime === 0 || currSound.currentTime === currSound.duration) {
                        currSound.currentTime = 0;
                        currSound.loop = !!loop;
                        i = howMany;
                        return currSound.play();
                    }
                }
            };

            SoundEffectManager.prototype.play = function (soundName, loop) {
                if (this.support) {
                    this._playWebAudio(soundName, loop);
                } else {
                    return this._playWavAudio(soundName, loop);
                }
            };

            SoundEffectManager.prototype.stop = function (soundName) {
                if (this.support) {
                    if (this.sources[soundName]) {
                        this.sources[soundName].stop(0);
                        delete this.sources[soundName];
                    }
                } else {
                    var soundArray = this.sounds[soundName];
                    var howMany = soundArray && soundArray.length || 0;
                    var i = 0;
                    var currSound;

                    while (i < howMany) {
                        currSound = soundArray[i++];
                        currSound.pause();
                        currSound.currentTime = 0;
                    }
                }
            };

            return SoundEffectManager;
        })();
    })
;
/**
 * Created by Vunb on 1/11/2014.
 */

angular.module('videoconference')
    .factory('sounds', ['SoundEffectManager' , function (SoundEffectManager) {
        return (function() {
            var sounds = new SoundEffectManager();
            sounds.loadFile('/sounds/online.mp3', 'online');
            sounds.loadFile('/sounds/offline.mp3', 'offline');
            return sounds;
        });
    }])
;
/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('HomeCtrl', ['$scope', '$location', '$state', '$window', 'guid', function ($scope, $location, $state, $window, guid) {
        var simpleGuy = new Guy({
            'appendElement': document.getElementById( 'faceGuy' ),
            'color': '#D53972'
        });

        $scope.createRoom = function (roomName) {
            var val = roomName.toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '') || guid();
            $state.go("room.join", {roomName: val});
        };
    }])
;

/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('RoomCtrl', ['$scope', '$state', '$stateParams', '$window', 'fluidGrid', 'sounds', function ($scope, $state, $stateParams, $window, fluidGrid, sounds) {

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
    }])
;


/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('videoconference')
    .controller('InfoCtrl', ['$scope', '$location', function ($scope, $location) {

        this.createZoom = function (zoom) {
            $location.path('/' + zoom);
        };

        return $scope.InfoCtrl = this;
    }])
;


angular.module('videoconference')
    .directive("clickAutoselect", function () {
        return { restrict: "A", link: function (e, element) {
            element.bind("click", function () {
                this.focus();
                this.select();
            });
        }}
    });
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
/**
 * Created by Vunb on 26/8/2014.
 */

angular.module('simplewebrtc', ['simplewebrtc'])
    .factory('SimpleWebRTC', function() {
        return SimpleWebRTC;
    })
    .directive('screenshare', ['SimpleWebRTC', function(SimpleWebRTC) {
        return {
            restrict: 'AE',
            template: '<div id="simplewebrtc-local"></div><div id="simplewebrtc-remote"></div>',
            link: function(scope, elem, attrs) {
                var webrtc = new SimpleWebRTC({
                    // the id/element dom element that will hold "our" video
                    localVideoEl: 'simplewebrtc-local',
                    // the id/element dom element that will hold remote videos
                    remoteVideosEl: 'simplewebrtc-remote',
                    // immediately ask for camera access
                    autoRequestMedia: true
                });
                webrtc.on('readyToCall', function () {
                    webrtc.joinRoom(attrs.room);
                });
            }
        }
    }])
;
function Eye( x1, y1, r, c ){
	this.radius = r;
	this.x = x1;
	this.y = y1;
	this.color = c;
}

function Eyeball( x1, y1, r, m, c ){
	this.radius = r;
	this.x = x1;
	this.y = y1;
	this.startX = x1;
	this.startY = y1;
	this.canvasX = 0;
	this.canvasY = 0;
	this.max = m;
	this.color = c;
}

function Head( x1, y1, r, c ){
	this.radius = r;
	this.x = x1;
	this.y = y1;
	this.color = c;	
}

function Mouth( x1, y1, r, h, c ){
	this.radius = r;
	this.x = x1;
	this.y = y1;
	this.headH = h;
	this.canvasY = 0;
	this.happy = true;
	this.normal = false;
	this.color = c;
}

Mouth.prototype = {
	
		paint: function( g ){
			
			g.beginPath();
			
			if( this.happy ){
				g.arc( this.x, this.y, this.radius, Math.PI / 4,  3 * Math.PI / 4, false );
			}else if( this.normal ){
				g.moveTo( this.x - this.radius, this.y + this.radius );
				g.lineTo( this.x + this.radius, this.y + this.radius );
			}else{
				g.arc( this.x, this.y + this.radius * 2, this.radius, -Math.PI / 4,  -3 * Math.PI / 4, true );
			}	
			g.strokeStyle = this.color;
			g.stroke();
			g.closePath();

		},
		
		follow: function(x, y){
			
			if( Math.abs( ( this.y + this.canvasY ) - y ) <= this.headH ){
				this.normal = true;
				this.happy = false;
			}else{
				this.normal = false;
				if( this.y + this.canvasY > y ){
					this.happy = false;
				}else{
					this.happy = true;
				}
			}
			
		}
};

Head.prototype = {

	paint: function( g ){
		
		g.beginPath();
			
		g.arc( this.x, this.y, this.radius, 0, 2 * Math.PI, true );
		
		g.strokeStyle = this.color;
		
		g.stroke();
		
		g.closePath();
		
	}
	
};

Eye.prototype = {
	
		paint: function( g ){

			g.beginPath();

			g.arc( this.x, this.y, this.radius, 0, 2 * Math.PI, true );
			
			g.strokeStyle = this.color;
			
			g.stroke();
			
			g.closePath();

		}
	
	
};

Eyeball.prototype = {
		
		follow: function( x1, y1 ){
			
			if( Math.abs( x1 - this.startX ) > this.max ||  Math.abs( y1 - this.startY ) > this.max ){
				
				var angle = Math.atan2( y1 - ( this.startY + this.canvasY ) , x1 - ( this.startX + this.canvasX ) );
					
					var movX = Math.cos( angle ) * this.max;
					var movY = Math.sin( angle ) * this.max;
					
					this.x = this.startX + movX;
					this.y = this.startY + movY;
					
			}
			
			
		},

		paint: function( g ){

				g.beginPath();
				g.arc( this.x, this.y, this.radius, 0, 2 * Math.PI, true );
				g.fillStyle = this.color;
				g.fill();
				g.closePath();

		}
};






function Guy( options ){
	
	this.options = options || {};
	
	if( !window.HTMLCanvasElement ){
		console.log( 'HTML5 Canvas Element is not supported!' );
		return;
	}
	
	options = options || {};
	
	this.appendElement = options.appendElement || document.body;
	
	 var scale = options.scale || 1;
	
	this.domElement = document.createElement( 'canvas' );
	if( options.position ){
		this.domElement.style.position = options.position;
	}
	this.domElement.style.left =  ( options.x || 0 ) + 'px';
	this.domElement.style.top =  ( options.y || 0 ) + 'px';
	this.domElement.style.zIndex = '999';
	this.domElement.width = 120 * scale;
	this.domElement.height = 120 * scale;
	this.color = options.color || '#1B1918';
	
	var	g = this.domElement.getContext( '2d' ),
	 	that = this;
		
		
	var head = new Head( 60 * scale, 60 * scale, 50 * scale, this.color ),
	 	eyeL = new Eye( 43 * scale, 60 * scale, 15 * scale, this.color ),
		eyeR = new Eye( 77 * scale, 60 * scale, 15 * scale, this.color ),
		eyeballL = new Eyeball( 43 * scale, 60 * scale, 6 * scale, eyeL.radius - 7 * scale, this.color ),
		eyeballR = new Eyeball( 77 * scale, 60 * scale, 6 * scale, eyeR.radius - 7 * scale, this.color ),
		mouth = new Mouth( 60 * scale, 70 * scale, 20 * scale, 50 * scale, this.color );
		
		
		// find Element Position
		var findPos = function( el ){
				var left = 0, top = 0;

			do{
					left += el.offsetLeft;
					top += el.offsetTop;
			}while( el = el.offsetParent );

			return { 'x': left, 'y': top };
		};
			
			this.appendElement.appendChild( this.domElement );
		
			var canvasPos = findPos( this.domElement );

			eyeballL.canvasX = canvasPos.x;
			eyeballR.canvasX = canvasPos.x;		

			eyeballL.canvasY = canvasPos.y;
			eyeballR.canvasY = canvasPos.y;

			mouth.canvasY = canvasPos.y;
	
 
	
			g.lineWidth = 3 * scale;
			g.lineCap = 'round';
	
	
	window.addEventListener( 'mousemove', function( ev ){
		
		var x = ev.pageX,
			y = ev.pageY;
			
			if( that.options.position !== undefined && that.options.position === 'fixed' ){
				 	x = ev.pageX - (window.scrollX || 0);
					y = ev.pageY - (window.scrollY || 0);
			}



			   canvasPos = findPos( that.domElement );

				eyeballL.canvasX = canvasPos.x;
				eyeballR.canvasX = canvasPos.x;		

				eyeballL.canvasY = canvasPos.y;
				eyeballR.canvasY = canvasPos.y;

				mouth.canvasY = canvasPos.y;	

		
		eyeballL.follow( x, y );
		eyeballR.follow( x, y );			
		
		mouth.follow( x, y );
		
		g.clearRect( 0, 0, 120 * scale, 120 * scale );
		
		head.paint(g);
		
		eyeL.paint(g);
		eyeR.paint(g);

		eyeballL.paint(g);
		eyeballR.paint(g);
		
		mouth.paint(g);

	}, false );
	
	head.paint(g);
	
	eyeL.paint(g);
	eyeR.paint(g);

	eyeballL.paint(g);
	eyeballR.paint(g);

	mouth.paint(g);		
	
	
	
}
