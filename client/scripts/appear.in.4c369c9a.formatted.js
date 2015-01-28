function ensurePrependedSlash(a) {
    return a && "/" !== a[0] ? "/" + a : a
}

function localStorageAdapter(a, b, c) {
    if (void 0 === a) {
        var d = {},
            e = window.localStorage;
        for (b in e) d[b] = JSON.parse(e[b]);
        return d
    }
    var f;
    if (window.localStorage[a]) try {
        f = JSON.parse(window.localStorage.getItem(a))
    } catch (g) {}
    if (f || (f = {}), 3 === arguments.length && void 0 === c) delete f[b], window.localStorage.setItem(a, JSON.stringify(f));
    else if (void 0 !== c) f[b] = c, window.localStorage.setItem(a, JSON.stringify(f));
    else if (void 0 !== b) return f[b];
    return f
}

function trace(a) {
    "\n" == a[a.length - 1] && (a = a.substring(0, a.length - 1)), console.log(a)
}

function maybeFixConfiguration(a) {
    if (null !== a)
        for (var b = 0; b < a.iceServers.length; b++) a.iceServers[b].hasOwnProperty("urls") && (a.iceServers[b].url = a.iceServers[b].urls, delete a.iceServers[b].urls)
}

function plugin0() {
    return document.getElementById("plugin0")
}

function TemInitPlugin0() {
    trace("plugin loaded"), plugin().setPluginId(TemPageId, "plugin0"), plugin().setLogFunction(console), TemPrivateWebRTCReadyCb()
}

function isPluginInstalled(a, b, c, d) {
    if (isChrome || isSafari || isFirefox) {
        for (var e = navigator.plugins, f = 0; f < e.length; f++)
            if (e[f].name.indexOf(b) >= 0) return void c();
        d()
    } else {
        if (!isIE) return;
        try {
            new ActiveXObject(a + "." + b)
        } catch (g) {
            return void d()
        }
        c()
    }
}

function defineWebRTCInterface() {
    function a(a) {
        return null != a && void 0 != a
    }
    injectPlugin = function() {
        var a = document.createDocumentFragment(),
            b = document.createElement("div");
        for (b.innerHTML = '<object id="plugin0" type="application/x-temwebrtcplugin" width="0" height="0"><param name="pluginId" value="plugin0" /> <param name="onload" value="TemInitPlugin0" /></object>'; b.firstChild;) a.appendChild(b.firstChild);
        document.body.appendChild(a)
    }, injectPlugin(), createIceServer = function(a, b, c) {
        var d = null,
            e = a.split(":");
        return 0 === e[0].indexOf("stun") ? d = {
            url: a,
            hasCredentials: !1
        } : 0 === e[0].indexOf("turn") && (d = {
            url: a,
            hasCredentials: !0,
            credential: c,
            username: b
        }), d
    }, createIceServers = function(a, b, c) {
        for (var d = new Array, e = 0; e < a.length; ++e) d.push(createIceServer(a[e], b, c));
        return d
    }, RTCSessionDescription = function(a) {
        return plugin().ConstructSessionDescription(a.type, a.sdp)
    }, RTCPeerConnection = function(b, c) {
        var d = null;
        if (b) {
            d = b.iceServers;
            for (var e = 0; e < d.length; e++) d[e].urls && !d[e].url && (d[e].url = d[e].urls), d[e].hasCredentials = a(d[e].username) && a(d[e].credential)
        }
        var f = c && c.mandatory ? c.mandatory : null,
            g = c && c.optional ? c.optional : null,
            h = plugin().PeerConnection(TemPageId, d, f, g),
            i = function() {
                return window.console.log("ice connection state change. Current state: %s", h.iceConnectionState), h.oniceconnectionstatechange ? h.oniceconnectionstatechange.apply(h, arguments) : void 0
            };
        return h.oneicechange = function() {
            return i.apply(null, arguments)
        }, h
    }, MediaStreamTrack = {}, MediaStreamTrack.getSources = function(a) {
        plugin().GetSources(a)
    }, getUserMedia = function(a, b, c) {
        a.audio || (a.audio = !1), plugin().getUserMedia(a, b, c)
    }, navigator.getUserMedia = getUserMedia, attachMediaStream = function(a, b) {
        if (b.enableSoundTracks(!0), "audio" != a.nodeName.toLowerCase()) {
            var c = 0 == a.id.length ? Math.random().toString(36).slice(2) : a.id;
            if (a.isTemWebRTCPlugin && a.isTemWebRTCPlugin()) {
                for (var d = a.children, e = 0; e != d.length; ++e)
                    if ("streamId" == d[e].name) {
                        d[e].value = b.id;
                        break
                    }
                a.setStreamId(b.id)
            } else {
                var f = document.createDocumentFragment(),
                    g = document.createElement("div"),
                    h = a.className ? 'class="' + a.className + '" ' : "";
                for (g.innerHTML = '<object id="' + c + '" ' + h + 'type="application/x-temwebrtcplugin"><param name="pluginId" value="' + c + '" /> <param name="pageId" value="' + TemPageId + '" /> <param name="streamId" value="' + b.id + '" /> </object>'; g.firstChild;) f.appendChild(g.firstChild);
                var i = a.getBoundingClientRect();
                a.parentNode.insertBefore(f, a), f = document.getElementById(c), f.width = i.width + "px", f.height = i.height + "px", a.parentNode.removeChild(a)
            }
            var j = document.getElementById(c);
            return j.onclick = a.onclick ? a.onclick : function() {}, j._TemOnClick = function(a) {
                var b = {
                    srcElement: document.getElementById(a)
                };
                j.onclick(b)
            }, j
        }
        return a
    }, reattachMediaStream = function(a, b) {
        for (var c = null, d = b.children, e = 0; e != d.length; ++e)
            if ("streamId" == d[e].name) {
                c = plugin().getStreamWithId(TemPageId, d[e].value);
                break
            }
        return null != c ? attachMediaStream(a, c) : void alert("Could not find the stream associated with this element")
    }, RTCIceCandidate = function(a) {
        return a.sdpMid || (a.sdpMid = ""), plugin().ConstructIceCandidate(a.sdpMid, a.sdpMLineIndex, a.candidate)
    }
}

function pluginNeededButNotInstalledCb() {
    window.RTCPeerConnection = null, window.WebRTCReadyCb && window.WebRTCReadyCb()
}
angular.module("videoconference", ["ngRoute", "ngSanitize", "flags", "flagsGoogleAnalytics", "jm.i18next", "vc-templates"]).directive("vcMuted", function() {
        return function(a, b, c) {
            a.$watch(c.vcMuted, function() {
                b[0].muted = a.$eval(c.vcMuted) === !0 ? "muted" : void 0
            })
        }
    }).config(["$provide", "$routeProvider", "$locationProvider", "flagsResolver", "$i18nextProvider", "$httpProvider", "userRegistrationEnabler", function(a, b, c, d, e, f, g) {
        for (var h = ["nb", "fr"], i = "en", j = navigator.language || navigator.userLanguage || navigator.browserLanguage || "", k = 0; k < h.length; k++)
            if (-1 !== j.indexOf(h[k])) {
                i = h[k];
                break
            }
        e.options = {
            lng: i,
            useCookie: !1,
            useLocalStorage: !1,
            fallbackLng: "en",
            resGetPath: "/translations/compiled/__lng__.json",
            nsseparator: ":::",
            keyseparator: "_._"
        }, f.defaults.useXDomain = !0, delete f.defaults.headers.common["X-Requested-With"], a.value("prefix", "appearin"), a.value("flags.config.googleAnalytics", {
            experimentId: window.googleAnalyticsExperimentId,
            experiments: {
                xUNPwbQOQ3mz1v9DeYmT4Q: [{
                    group: "Original",
                    flags: []
                }, {
                    group: "testimonials",
                    flags: ["testimonials"]
                }]
            }
        }), a.value("flags.config", {
            defaultFlags: {
                group: "testimonials",
                flags: ["testimonials"]
            }
        });
        var l = function() {
                return ["$i18next", "$route", function(a, b) {
                    var c = b.current.params.lng;
                    c && (a.options.lng = c)
                }]
            },
            m = function(a) {
                return _.defaults({}, a, {
                    locale: l()
                })
            };
        b.when("/", {
            templateUrl: "/templates/frontpage.html",
            controller: "frontpageController",
            resolve: m({
                flags: d(),
                userRegistration: g()
            })
        }).when("/error/webrtc", {
            templateUrl: "/templates/webRtcError.html",
            controller: "webRtcErrorController",
            resolve: m({
                flags: d()
            })
        }).when("/error/connection", {
            templateUrl: "/templates/connectionError.html",
            resolve: m({
                flags: d()
            })
        }).when("/error/:errorName", {
            templateUrl: "/templates/error.html",
            controller: "errorController",
            resolve: m({
                flags: d()
            })
        }).when("/information/faq", {
            templateUrl: "/templates/information.html",
            controller: "informationController",
            resolve: m()
        }).when("/information/tos", {
            templateUrl: "/templates/tos.html",
            controller: "informationController",
            resolve: m()
        }).when("/information/contact", {
            templateUrl: "/templates/contact.html",
            controller: "informationController",
            resolve: m()
        }).when("/information/feedback", {
            templateUrl: "/templates/feedback.html",
            controller: "feedbackController",
            resolve: m()
        }).when("/information/press", {
            templateUrl: "/templates/press.html",
            controller: "informationController",
            resolve: m()
        }).when("/information/jobs", {
            templateUrl: "/templates/jobs.html",
            controller: "informationController",
            resolve: m()
        }).when("/information/team", {
            templateUrl: "/templates/team.html",
            controller: "informationController",
            resolve: m()
        }).when("/information/ios", {
            templateUrl: "/templates/ios.html",
            controller: "informationController",
            resolve: m()
        }).when("/:roomName", {
            templateUrl: "/templates/views/room.html",
            controller: "roomController",
            resolve: m({
                userRegistration: g()
            })
        }).otherwise({
            templateUrl: "/templates/views/room.html",
            controller: "roomController",
            resolve: m({
                flags: d(),
                userRegistration: g()
            })
        }), c.html5Mode(!0)
    }]).value("isEmbedded", window !== window.top).constant("userRegistrationEnabler", function() {
        return ["features", "objStore", "$location", function(a, b, c) {
            return a.enableUserRegistration.then(function(d) {
                d && (b("features").save({
                    userRegistration: !0
                }), c.search("enableUserRegistration", null), a.userRegistration = !0)
            })
        }]
    }).run(["$rootScope", "$window", function(a, b) {
        a.windowHeight = b.innerHeight, angular.element(b).bind("resize", function() {
            a.windowHeight = b.innerHeight, a.$apply("windowHeight")
        })
    }]).run(["$rootScope", "$location", function(a, b) {
        "localhost" === window.location.hostname && (ga("_setDomainName", "none"), window.cxApi && window.cxApi.setDomainName("none")), a.controller = "", a.groupJoined = !1, a.$on("$routeChangeSuccess", function(c, d, e) {
            a.previousController = e && e.$$route ? e.$$route.controller : null, ga("send", "pageview", b.url())
        })
    }]).directive("shortcut", function() {
        return {
            restrict: "A",
            controller: ["$scope", "RoomService", "RoomAdminPanel", "$window", function(a, b, c, d) {
                a.applyKeyCode = function(a, e) {
                    switch (a) {
                        case 77:
                            var f = b.getLocalClient();
                            f && !e && b.setLocalAudioEnabled(!f.isAudioEnabled);
                            break;
                        case 27:
                            d.document.activeElement.blur(), c.close()
                    }
                }
            }],
            link: function(a) {
                $(document).on("keyup", function(b) {
                    a.$apply(a.applyKeyCode(b.keyCode, "INPUT" === b.target.nodeName))
                })
            }
        }
    }).run(["$rootScope", function(a) {
        a.clientHasFlash = "undefined" != typeof window.swfobject && 0 !== window.swfobject.getFlashPlayerVersion().major
    }]).run(["RoomService", function(a) {
        var b = function() {
            var b = a.getLocalClient();
            b && b.streams && 0 !== b.streams.length && b.streams[0].stream && b.streams[0].stream.stop()
        };
        window.addEventListener("unload", b)
    }]).run(["serverSocket", "Analytics", function(a, b) {
        a.on("disconnect", function() {
            b.helpers.recordSocketConnection("disconnect", a.getTransport())
        }), a.on("connect", function() {
            b.helpers.recordSocketConnection("connect", a.getTransport())
        }), a.on("connect_failed", function() {
            b.helpers.recordSocketConnection("connect_failed", a.getTransport())
        }), a.on("reconnect_failed", function() {
            b.helpers.recordSocketConnection("reconnect_failed", a.getTransport())
        }), a.on("error", function() {
            b.helpers.recordSocketConnection("error", a.getTransport())
        })
    }]), window.WebRTCReadyCb = function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["videoconference"])
        })
    }, angular.module("videoconference").directive("scrollTo", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                b.bind("click", function() {
                    var a = angular.element(c.scrollTo).offset().top;
                    return jQuery("html, body").animate({
                        scrollTop: a
                    }, "slow"), !1
                })
            }
        }
    }), angular.module("videoconference").directive("topbar", function() {
        return {
            templateUrl: "/templates/partials/topbar.html",
            restrict: "E",
            controller: ["$scope", "$rootScope", "$timeout", "$document", "Analytics", "RoomService", "RoomAdminPanel", "inRoomNotificationService", "features", "chromeExtension", "User", "modalService", function(a, b, c, d, e, f, g, h, i, j, k, l) {
                a.User = k, a.RoomService = f, a.descriptionHover = !1, a.features = i, a.extension = j, a.RoomAdminPanel = g, a.modalService = l, a.isRoomLockDisabled = function() {
                    return !f.isAllowedToLock()
                }, a.copyToClipboard = function() {
                    var a = angular.element(".room-url").addClass("flash");
                    h.setNotification({
                        type: "info",
                        text: "Link has been copied to the clipboard"
                    }), c(function() {
                        a.removeClass("flash")
                    }, 100)
                }, a.displayLockErrorIfAppropriate = function() {
                    a.isRoomLockDisabled() && h.setNotification(f.isLocked ? {
                        type: "info",
                        text: "This room is owned by someone, and only the owner can unlock the room"
                    } : {
                        type: "info",
                        text: "This room is owned by someone, and only the owner can lock the room"
                    })
                }, a.shouldShowFollowButton = function() {
                    return !i.userRegistration
                }, a.shouldShowRoomAdminButton = function() {
                    if (!i.userRegistration) {
                        var b = !f.isMigrated && f.hasOwnerId;
                        return !(b && !f.isSelfOwner)
                    }
                    return a.shouldShowCreateUserAndClaimRoom() ? !1 : f.isClaimed && f.hasOwnerId && !f.isSelfOwner ? !1 : !0
                }, a.shouldShowCreateUserAndClaimRoom = function() {
                    return i.userRegistration && !f.isClaimed && !k.isLoggedIn
                }, a.shouldShowUserButton = function() {
                    return i.userRegistration
                }, a.shouldShowMigrationButton = function() {
                    return f.isSelfOwner && !k.isLoggedIn && !f.hasOwnerId
                }, a.isUserLoggedIn = function() {
                    return i.userRegistration && k.isLoggedIn
                }, a.shouldShowLogin = function() {
                    var a = f.hasOwnerId && f.isClaimed;
                    return !k.isLoggedIn && (!f.isClaimed || a)
                }
            }]
        }
    }), angular.module("videoconference").directive("vcDropDown", ["$rootScope", function(a) {
        return function(b, c, d) {
            var e, f = $(c),
                g = $(d.vcDropDown);
            e = "vcDropDownContainer" in d ? d.vcDropDownContainer : void 0;
            var h, i, j = !1,
                k = !1,
                l = !1,
                m = null,
                n = function() {
                    m = $('<div class="modal-backdrop popover-backdrop"></div>').click(o).prependTo($("body"))
                },
                o = function(a) {
                    if (f.toggleClass("active"), f.toggleClass("bold"), j) {
                        var b = f.data("bs.popover").$tip,
                            c = b.find(".popover-content");
                        if (k) h = c.width(), i = c.height(), b.hide();
                        else {
                            var d = $('<div class="popover-filler" />').width(h).height(i);
                            b.append(d), c.detach(), f.data("bs.popover").show(), d.remove(), b.append(c)
                        }
                    } else g.show(), f.popover("show"), j = !0;
                    null === m ? n() : (m.remove(), m = null), k = !k, l = a
                },
                p = function() {
                    k && o()
                },
                q = function() {
                    g.hide(), g.find(".dismiss-popover").click(o), "vcDropDownDismiss" in d && $(d.vcDropDownDismiss).mousedown(p), f.popover({
                        html: !0,
                        content: g,
                        placement: d.vcDropDownPlacement,
                        container: e,
                        trigger: "manual",
                        animation: !1
                    }), void 0 === d.vcDropDownDisableClick && f.click(function() {
                        o(!1)
                    }), void 0 !== d.vcDropDownShow && b.$watch(d.vcDropDownShow, function(a) {
                        a === !0 ? k || o(!0) : a === !1 && k && l && o(!0)
                    }), a.$on("$routeChangeStart", function() {
                        f.popover("destroy"), null !== m && m.remove()
                    })
                };
            q()
        }
    }]), angular.module("videoconference").directive("videoView", ["$timeout", function(a) {
        return {
            templateUrl: "/templates/partials/video-view.html",
            restrict: "E",
            scope: {
                client: "=client",
                fillmode: "@fillmode"
            },
            controller: ["RoomService", "$scope", "Analytics", "features", function(a, b, c, d) {
                b.isVideoEnabled = b.client.capabilities.video, b.isAudioEnabled = b.client.capabilities.audio, b.isScreenshareEnabled = !1, b.features = d, b.isLocalClient = a.selfId === b.client.id, b.$watch("client.isScreenSharingEnabled", function(a) {
                    b.isScreenshareEnabled = a
                }), b.canKick = function() {
                    return a.isSelfOwner || a.isSelfMember
                }, b.kick = function(d) {
                    if (b.canKick()) {
                        a.kick(d);
                        var e = a.getClientType(d);
                        c.helpers.recordKickedUser(e, a.isSelfOwner)
                    }
                };
                var e = function() {
                    b.$emit("share-screen-help-needed")
                };
                b.toggleShareScreen = function() {
                    a.setLocalScreenShareEnabled(!b.client.isScreenSharingEnabled, e)
                }, b.enableAudio = function() {
                    a.setLocalAudioEnabled(!0)
                }, b.toggleAudioEnabled = function() {
                    a.setLocalAudioEnabled(!b.client.isAudioEnabled)
                }, b.toggleVideoEnabled = function() {
                    a.setLocalVideoEnabledByUser(!b.client.isVideoEnabled)
                }, b.isScreenShareSupported = a.isScreenShareSupported.bind(a)
            }],
            link: function(b, c) {
                var d, e, f = c.find(".video-box .toolbar"),
                    g = function() {
                        var a = e.height(),
                            b = d.height(),
                            c = a - b,
                            f = e.width(),
                            g = d.width(),
                            h = f - g;
                        h > c ? (d.removeClass("height-first"), d.css({
                            top: c / 2,
                            left: 0
                        })) : (d.addClass("height-first"), d.css({
                            top: 0,
                            left: (e.width() - d.width()) / 2
                        }))
                    },
                    h = function() {
                        a(function() {
                            d = angular.element("#" + b.client.id), e = d.parent(), d.on("play", function() {
                                d.off("play"), g()
                            })
                        }), $(window).on("resize", g)
                    };
                if (a(function() {
                        c.find(".video-box").removeClass("loading")
                    }, 0), a(function() {
                        f.removeClass("visible")
                    }, 5e3), b.fillmode) switch (b.fillmode) {
                    case "fit":
                        b.$watch("client", function() {
                            h()
                        }), b.$watch("client.isScreenSharingEnabled", function() {
                            a(function() {
                                g()
                            })
                        }), h()
                }
            }
        }
    }]), angular.module("videoconference").directive("moshpitClient", ["$timeout", function(a) {
        return {
            restrict: "A",
            link: function(b, c) {
                var d, e, f = function() {
                    var a = c.height(),
                        b = e.height(),
                        d = a - b;
                    e.css({
                        "margin-top": d / 2,
                        "padding-bottom": -d / 2
                    })
                };
                a(function() {
                    d = c.find("video"), e = c.find(".video-stream-container"), d.on("play", function() {
                        d.off("play"), f(), e.addClass("visible")
                    })
                }), $(window).on("resize", f)
            }
        }
    }]), angular.module("videoconference").directive("vcCopyToClipboard", ["Analytics", function(a) {
        return {
            scope: {
                mouseOver: "&",
                mouseLeave: "&"
            },
            link: function(b, c) {
                var d = new ZeroClipboard(c, {
                        moviePath: "/libraries/ZeroClipboard.swf"
                    }),
                    e = angular.element(c);
                d.on("complete", function() {
                    e.click(), a.sendEvent(a.events.COPIED_LINK_TO_CLIPBOARD)
                }), d.on("mouseout", function() {
                    b.$apply(function() {
                        b.mouseLeave()
                    })
                }), d.on("mouseover", function() {
                    b.$apply(function() {
                        b.mouseOver()
                    })
                })
            }
        }
    }]), angular.module("videoconference").directive("clickAutoselect", function() {
        return {
            restrict: "A",
            link: function(a, b) {
                b.bind("click", function() {
                    this.focus(), this.select()
                })
            }
        }
    }), angular.module("videoconference").directive("chat", function() {
        return {
            templateUrl: "/templates/partials/chat.html",
            restrict: "E",
            replace: !0,
            scope: {
                room: "="
            },
            link: function(a, b, c) {
                var d = angular.element("#chat-messages");
                a.isAdjustable = !0, a.$watch(c.adjustable, function(b) {
                    a.isAdjustable = b, b || (a.chatActive = !0)
                }), a.focusChatInputField = function() {
                    "Range" !== window.getSelection().type && b.find("#chatInputField").focus()
                }, a.updateChatWindow = function(b) {
                    var c = d.height(),
                        e = d.scrollTop(),
                        f = d[0].scrollHeight,
                        g = 14,
                        h = 50;
                    b && b.messageElemHeight && (h = b.messageHeight);
                    var i = b && b.isOwnChatMessage,
                        j = b && b.isHistoricalMessages,
                        k = i || j || g + 2 * h > f - c - e;
                    return k ? void a.scrollToBottom() : void(a.hasUnreadMessages = !0)
                }, a.scrollToBottom = function() {
                    a.hasUnreadMessages = !1, d.scrollTop(999999)
                };
                var e = _.throttle(function() {
                    d.scrollTop() + d.height() === d[0].scrollHeight && a.$apply(function() {
                        a.hasUnreadMessages = !1
                    })
                }, 150);
                d.scroll(e)
            },
            controller: ["$scope", "Chat", "$timeout", "$document", "$rootScope", "Analytics", "$window", "State", "serverSocket", function(a, b, c, d, e, f, g, h, i) {
                function j() {
                    var b;
                    a.chatActive && (b = "calc(" + angular.element(".video-wrapper").css("height") + " - 20px)"), a.chatWrapperStyle["max-height"] = b
                }

                function k() {
                    a.chatActive = !a.chatActive, a.chatWrapperStyle.height = a.chatActive ? n : l, j()
                }
                a.chatActive = !1, a.hasClosedChat = !1, a.numberOfUnreadMessages = 0, a.messages = b.entries, a.hasUnreadMessages = !1;
                var l = "3em",
                    m = 140,
                    n = 170;
                a.chatWrapperStyle = {
                    height: l
                }, a.$watch("windowHeight", function() {
                    j()
                }), g.addEventListener("beforeunload", function(b) {
                    if (a.message && a.message.length > 0) {
                        var c = g.i18n.t("You have not sent your last chat message yet.");
                        return (b || g.event).returnValue = c, c
                    }
                });
                var o, p, q = 4,
                    r = angular.element("#chat-message-notification")[0],
                    s = 0;
                "undefined" != typeof d[0].hidden ? (o = "hidden", p = "visibilitychange") : "undefined" != typeof d[0].webkitHidden && (o = "webkitHidden", p = "webkitvisibilitychange");
                var t = !1,
                    u = function() {
                        t = d[0][o], s = 0, !t && a.chatActive && a.$apply(function() {
                            a.numberOfUnreadMessages = 0
                        })
                    };
                d[0].addEventListener(p, u), a.playNotificationSound = function() {
                    (t || !a.chatActive) && q >= s && (r.play(), s++)
                };
                var v = d[0].title;
                a.$watch("numberOfUnreadMessages", function(a) {
                    return 0 === a ? void(d[0].title = v) : void(d[0].title = "(" + a + ") " + v)
                }), e.$on("new_chat_message", function() {
                    a.playNotificationSound(), a.hasClosedChat || a.chatActive || (k(), c(function() {
                        a.scrollToBottom()
                    })), (t || !a.chatActive) && a.numberOfUnreadMessages++, c(function() {
                        var b = angular.element("#chat-messages article.message").last().height();
                        a.updateChatWindow({
                            messageHeight: b
                        })
                    })
                }), e.$on("chat_history_updated", function() {
                    a.chatActive || k(), c(function() {
                        a.updateChatWindow({
                            isHistoricalMessages: !0
                        })
                    })
                }), a.handleChatToggleButtonClick = function() {
                    f.helpers.recordChatHistoryButtonClick(!!a.chatActive), a.handleManualChatToggle()
                }, a.handleKeydownEvent = function(a) {
                    27 === a.which && k()
                }, a.handleManualChatToggle = function() {
                    !a.hasClosedChat && a.chatActive && (a.hasClosedChat = !0), a.chatActive ? angular.element("#chat-message-box-input").blur() : (a.numberOfUnreadMessages = 0, a.updateChatWindow(), angular.element("#chat-message-box-input").focus()), k(), c(function() {
                        a.scrollToBottom()
                    })
                }, a.handleChatInputClick = function() {
                    a.messages.length > 0 && !a.chatActive && (f.sendEvent(f.events.CHAT_HISTORY_OPENED_USING_INPUT_FIELD), a.handleManualChatToggle())
                }, a.sendMessage = function() {
                    this.message && (f.sendEvent(f.events.CHAT_MESSAGE_SENT), a.chatActive || k(), b.sendMessage(this.message), this.message = "", c(function() {
                        a.updateChatWindow({
                            isOwnChatMessage: !0
                        })
                    }, 0))
                }, a.adjustChatHeight = function(b) {
                    n += b, m > n || (a.$apply(function() {
                        a.chatWrapperStyle.height = n + "px"
                    }), a.updateChatWindow())
                }, a.clearChatHistory = function() {
                    b.clearHistory()
                }, a.isConnected = i.isConnected.bind(i)
            }]
        }
    }), angular.module("videoconference").directive("dropArea", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                var d = c.dropArea,
                    e = a[d] && "function" == typeof a[d];
                b.bind("dragover", function(a) {
                    a.stopPropagation(), a.preventDefault()
                }), b.bind("dragleave", function(b) {
                    a.$apply(function() {
                        e && a[d](), b.stopPropagation(), b.preventDefault()
                    })
                }), b.bind("drop", function(b) {
                    a.$apply(function() {
                        var c;
                        b.stopPropagation(), b.preventDefault(), b.originalEvent.dataTransfer.files.length > 0 && (c = b.originalEvent.dataTransfer.files[0]), e && a[d](c)
                    })
                })
            }
        }
    }), angular.module("videoconference").directive("dragArea", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                var d = c.dragArea,
                    e = a[d] && "function" == typeof a[d];
                b.bind("dragenter", function(b) {
                    a.$apply(function() {
                        b.stopPropagation(), b.preventDefault(), e && a[d](b.originalEvent && b.originalEvent.dataTransfer && b.originalEvent.dataTransfer.types)
                    })
                })
            }
        }
    }), angular.module("videoconference").directive("fileSelector", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                var d = c.fileSelector,
                    e = a[d] && "function" == typeof a[d];
                b.bind("change", function(b) {
                    a.$apply(function() {
                        b.stopPropagation(), b.preventDefault(), e && b.target.files && b.target.files.length > 0 && a[d](b.target.files[0])
                    })
                })
            }
        }
    }), angular.module("videoconference").directive("styledCheckbox", function() {
        return {
            restrict: "E",
            replace: !0,
            templateUrl: "/templates/partials/styled-checkbox.html",
            transclude: !0,
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
            link: function(a) {
                a.id = "checkbox-" + a.$id
            }
        }
    }), angular.module("videoconference").directive("switch", function() {
        return {
            restrict: "E",
            replace: !0,
            templateUrl: "/templates/partials/switch.html",
            transclude: !0,
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
            controller: ["$scope", function(a) {
                a.id = "checkbox-" + a.$id, a.checked = a.model
            }]
        }
    }), angular.module("videoconference").directive("roomAdminPanel", function() {
        return {
            templateUrl: "/templates/partials/room-admin-panel.html",
            restrict: "E",
            scope: {},
            controller: ["$scope", "$rootScope", "RoomService", "Analytics", "ImageParser", "RoomAdminPanel", "User", "features", "modalService", function(a, b, c, d, e, f, g, h, i) {
                function j(b) {
                    return a.isDraggingInDropField = !1, a.dropAreaText = "Processing image...", b ? e.isValidImage(b) ? void e.parseFileAsImage({
                        file: b
                    }, function(b, c) {
                        a.$apply(function() {
                            return b ? void(a.customizeRoomError = b) : void k(c)
                        })
                    }) : void(a.dropAreaText = "Not a valid image file") : void(a.dropAreaText = "Drag an image here")
                }
                a.RoomAdminPanel = f, a.RoomService = c, a.User = g, a.modalService = i, a.ownerState = {
                    ownerEmail: "",
                    wantsNewsletter: !0,
                    currentMembers: c.getRoomMembers(),
                    members: c.getRoomMembers(),
                    isMembersValid: !0
                }, a.features = h, a.isNotificationPaneEnabled = function() {
                    return !g.isLoggedIn
                }, a.validateMembers = function() {
                    if (!a.ownerState.members) return void(a.ownerState.isMembersValid = !0);
                    var b = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        c = a.ownerState.members.split(/[,\s]+/);
                    a.ownerState.isMembersValid = c.reduce(function(a, c) {
                        return a && b.test(c)
                    }, !0)
                }, a.setRoomMembers = function() {
                    a.ownerState.currentMembers !== a.ownerState.members && (d.helpers.recordMemberListChanged(f.panelState), c.setRoomMembers(a.ownerState.members ? a.ownerState.members.split(/[,\s]+/) : []))
                }, a.$watch(function() {
                    return c.roomData.members
                }, function() {
                    a.ownerState.currentMembers = a.ownerState.members = c.getRoomMembers()
                }), a.shouldClaimWithUser = function() {
                    return h.userRegistration && g.isLoggedIn
                }, a.claim = function() {
                    a.isNextButtonDisabled() || (a.shouldClaimWithUser() ? c.claimRoomWithREST(c.roomName) : c.claimRoomWithSocket({
                        email: a.ownerState.ownerEmail,
                        wantsNewsletter: a.ownerState.wantsNewsletter
                    }))
                }, a.isNextButtonDisabled = function() {
                    return !(g.isLoggedIn || a.ownerState.ownerEmail)
                }, a.closeClaimDialog = function() {
                    f.close()
                }, a.handleClaimSubmit = function() {
                    a.isNextButtonDisabled() || a.claimWizard.nextTab()
                }, a.customizeRoomError = "", a.imagePreviewUrl = "", a.currentImageBase64Data = "", a.enableImageSubmit = function() {
                    return a.imagePreviewUrl && c.isAllowedToChangeBackground()
                }, a.dropAreaText = "Drag an image here", a.isDraggingInDropField = !1;
                var k = function(b) {
                    a.imagePreviewUrl = "data:image/jpeg;base64," + b, a.currentImageBase64Data = b
                };
                a.handleDragEvent = function() {
                    a.imagePreviewUrl = "", a.isDraggingInDropField = !0, a.dropAreaText = "Good, now drop it here"
                }, a.handleSelectedFile = function(a) {
                    d.sendEvent(d.events.BACKGROUND_IMAGE_SELECT_CLICK), j(a)
                }, a.handleDroppedFile = function(a) {
                    d.sendEvent(d.events.BACKGROUND_IMAGE_SELECT_DROP), j(a)
                }, a.onFileSelectButtonClicked = function() {
                    angular.element("#backgroundFileSelect").click()
                }, a.removePreview = function() {
                    a.dropAreaText = "Drag an image here", a.imagePreviewUrl = void 0, a.currentImageBase64Data = void 0
                }, a.submitCustomize = function() {
                    a.enableImageSubmit() && (c.submitBackgroundImage(e.base64toBlob(a.currentImageBase64Data, "image/jpeg")), a.removePreview())
                }, a.useDefaultBackgroundImage = function() {
                    c.resetBackgroundImage()
                }
            }]
        }
    }), angular.module("videoconference").directive("reclaimRoomAdminPanel", ["modalService", "RoomService", function(a, b) {
        return {
            templateUrl: "/templates/partials/reclaim-room-admin-panel.html",
            restrict: "E",
            scope: {},
            replace: "true",
            link: function(c) {
                c.RoomService = b, c.modalService = a
            }
        }
    }]), angular.module("videoconference").directive("resize", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                function d(a) {
                    h = a.pageY, g = 0, document.addEventListener("mousemove", e), document.addEventListener("mouseup", f)
                }

                function e(b) {
                    g += h - b.pageY, h = b.pageY, j && (a[i](g), g = 0)
                }

                function f() {
                    document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", f)
                }
                var g, h, i = c.resize,
                    j = i && "function" == typeof a[i];
                b[0].addEventListener("mousedown", d)
            }
        }
    }), angular.module("videoconference").directive("errorPage", function() {
        return {
            templateUrl: "/templates/partials/errorPage.html",
            restrict: "E",
            replace: !0,
            transclude: !0
        }
    }), angular.module("videoconference").directive("modalBox", function() {
        return {
            templateUrl: "/templates/partials/modal-box.html",
            restrict: "E",
            transclude: !0,
            replace: !0,
            scope: {
                modal: "=modal",
                newStyle: "&"
            },
            controller: ["$scope", function(a) {
                a.closeModal = function() {
                    a.modal.close()
                }
            }],
            link: function(a, b) {
                a.$watch("modal.isOpen", function(a) {
                    a && (b.find("form input[autofocus]").first().focus(), b.find("form textarea[autofocus]").first().focus())
                })
            }
        }
    }), angular.module("videoconference").directive("sendResetEmail", function() {
        return {
            templateUrl: "/templates/partials/send-reset-email.html",
            restrict: "E",
            scope: {
                fromPage: "="
            },
            controller: ["$scope", "$rootScope", "$window", "$location", "RoomService", "Analytics", function(a, b, c, d, e, f) {
                a.didSendEmail = !1, a.sendResetEmail = function() {
                    f.helpers.recordSendResetEmail(a.fromPage), e.sendResetEmail(), a.didSendEmail = !0
                }, b.$on("reset_email_sent", function(b, c) {
                    if (c && c.error) switch (c.error) {
                        case protocol.err.ROOM_EMAIL_MISSING:
                            a.sendResetEmailMessage = "Sorry, cannot send the email, no email address was found for this room.";
                            break;
                        default:
                            a.sendResetEmailMessage = "Sorry, but an error occurred sending the email."
                    } else a.sendResetEmailMessage = "Email sent, go check your email!"
                })
            }]
        }
    }), angular.module("videoconference").directive("notificationPane", ["$routeParams", "RoomService", function(a, b) {
        return {
            restrict: "E",
            replace: !0,
            templateUrl: "/templates/partials/notification-pane.html",
            scope: {
                header: "@",
                isEnabled: "="
            },
            compile: function() {
                return {
                    pre: function(a) {
                        a.roomName = b.roomName.substring(1)
                    }
                }
            }
        }
    }]), angular.module("videoconference").directive("tab", function() {
        return {
            templateUrl: "/templates/partials/tab.html",
            restrict: "E",
            transclude: !0,
            replace: !0,
            require: "?^tabs",
            scope: {
                title: "@",
                disableComplete: "&",
                completeText: "@",
                complete: "&",
                cancellable: "&",
                optional: "&",
                isEnabled: "="
            },
            link: function(a, b, c, d) {
                var e = function() {
                        return !1
                    },
                    f = function() {
                        return !0
                    },
                    g = {
                        title: a.title,
                        disableComplete: a.disableComplete || e,
                        complete: a.complete,
                        completeText: a.completeText || "Next",
                        optional: a.optional || e,
                        cancellable: a.cancellable || e,
                        isEnabled: a.isEnabled || f
                    };
                d && (d.addTab(g), a.$on("$destroy", function() {
                    d.removeTab(g)
                }))
            }
        }
    }), angular.module("videoconference").directive("tabs", function() {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/tabs.html",
            replace: !0,
            transclude: !0,
            scope: {
                tabs: "="
            },
            controller: ["$scope", function(a) {
                var b = function() {
                    return {
                        tabs: [],
                        activeIndex: -1,
                        setActiveTab: function(a) {
                            this.activeIndex = a
                        },
                        isActiveTab: function(a) {
                            return a === this.activeIndex
                        },
                        getActiveTab: function() {
                            return this.tabs[this.activeIndex]
                        },
                        hasNext: function() {
                            return this.activeIndex < this.tabs.length - 1
                        },
                        hasPrevious: function() {
                            return this.activeIndex > 0
                        },
                        skipToNextTab: function() {
                            for (; this.hasNext() && (this.activeIndex += 1, this.getActiveTab().isEnabled() === !1););
                        },
                        nextTab: function() {
                            var a = this.getActiveTab();
                            a.disableComplete() || (a.complete(), this.skipToNextTab())
                        },
                        previousTab: function() {
                            this.hasPrevious() && this.activeIndex--
                        },
                        addTab: function(a) {
                            this.tabs.push(a), 1 === this.tabs.length && (this.activeIndex = 0)
                        },
                        removeTab: function(a) {
                            var b = this.tabs.indexOf(a);
                            return -1 === b ? !1 : (this.tabs.splice(b, 1), this.activeIndex >= this.tabs.length && (this.activeIndex = this.tabs.length - 1), !0)
                        }
                    }
                };
                a.tabs = b(), this.addTab = a.tabs.addTab.bind(a.tabs), this.removeTab = a.tabs.removeTab.bind(a.tabs)
            }]
        }
    }), angular.module("videoconference").directive("inRoomNotifications", function() {
        return {
            templateUrl: "/templates/partials/in-room-notifications.html",
            restrict: "E",
            scope: {},
            replace: !0,
            controller: ["$scope", "$timeout", "$rootScope", "Event", "inRoomNotificationService", function(a, b, c, d, e) {
                var f;
                a.notification = e.getNotification(), a.dismissNotification = function() {
                    var a = e.setNotification(null);
                    a && a.onDismiss && a.onDismiss()
                }, a.removeCurrentActionRequired = e.getCurrentActionRequired(), a.dismissActionRequiredNotification = function() {
                    var a = e.removeCurrentActionRequired();
                    a && a.onDismiss && a.onDismiss()
                }, a.$watch(function() {
                    return e.getNotification()
                }, function(c) {
                    f && b.cancel(f), a.notification = c, c && c.displayDurationMillis && (f = b(function() {
                        c.isVisible = !1
                    }, c.displayDurationMillis))
                }), a.$watch(function() {
                    return e.getCurrentActionRequired()
                }, function(b) {
                    a.actionRequiredNotification = b
                })
            }]
        }
    }).directive("inRoomNotification", function() {
        return {
            templateUrl: "/templates/partials/in-room-notification.html",
            restrict: "E",
            scope: {
                notification: "=",
                dismiss: "&"
            },
            replace: !0,
            link: function(a, b) {
                var c = function() {
                    a.$apply(function() {
                        a.dismiss()
                    })
                };
                b.on("webkitTransitionEnd", c), b.on("transitionEnd", c)
            }
        }
    }), angular.module("videoconference").directive("roomLocked", function() {
        return {
            templateUrl: "/templates/partials/room-locked.html",
            restrict: "E",
            replace: !0,
            scope: {},
            controller: ["$rootScope", "$scope", "RoomService", "Snapshooter", "serverSocket", "$sce", "$window", "Analytics", "Event", "RTCManager", "features", "$element", "modalService", "User", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
                b.modalService = m, b.features = k, c.selfStream && (c.selfStream.url = f.trustAsResourceUrl(g.URL.createObjectURL(c.selfStream)));
                var o = function() {
                        b.User = n, b.RoomService = c, b.imageUrl = "", b.hasKnocked = !1, b.isOwnerLoginVisible = !1
                    },
                    p = function(a) {
                        var b = {
                            attrs: {}
                        };
                        angular.extend(this, angular.extend(b, a))
                    };
                p.prototype.open = function(a) {
                    b.modalActive = !0, this.hasOpened || (h.helpers.recordModalOpened(this.name), this.hasOpened = !0), this.isOpen = !0, a && (this.onClose = a.onClose, this.attrs = a || {})
                }, p.prototype.close = function() {
                    b.modalActive = !1, this.isOpen = !1, this.onClose && (this.onClose(), this.onClose = void 0)
                }, b.modals = {
                    recovery: new p({
                        name: constants.Modals.DISPLAYED_RECOVERY,
                        hasOpened: !1,
                        isOpen: !1
                    })
                }, b.openRecoveryModal = function() {
                    b.modals.recovery.open()
                }, b.enterRoomIfLoggedIn = function() {
                    n.isLoggedIn && g.location.reload()
                }, o();
                var q = function(a) {
                        var b = 640,
                            c = 480;
                        return 0 === a.videoWidth || 0 === a.videoHeight ? {
                            width: b,
                            height: c
                        } : {
                            width: a.videoWidth,
                            height: a.videoHeight
                        }
                    },
                    r = function() {
                        var a = l.find(".room-locked-video")[0] || {},
                            b = q(a),
                            c = Math.ceil(6 * constants.Room.KNOCK_ROOM_FILE_SIZE / 8);
                        return d.takeSnapshot(a, b.width / 2, b.height / 2, c)
                    };
                b.takePicture = function() {
                    b.imageUrl = r(), h.sendEvent(h.events.KNOCKER_TOOK_PICTURE)
                }, b.resetPicture = function() {
                    b.imageUrl = "", h.sendEvent(h.events.KNOCKER_RESET_PICTURE)
                }, b.knock = function() {
                    if (b.imageUrl) {
                        b.hasKnocked = !0;
                        var a = {
                            imageUrl: b.imageUrl,
                            roomName: c.roomName,
                            liveVideo: !0
                        };
                        e.emit(protocol.req.KNOCK_ROOM, a), h.sendEvent(h.events.KNOCKER_KNOCKED_ROOM)
                    }
                }, b.knockLiveVideo = function() {
                    b.hasKnocked = !0;
                    var a = {
                        imageUrl: r(),
                        roomName: c.roomName,
                        liveVideo: !0
                    };
                    e.emit(protocol.req.KNOCK_ROOM, a), h.sendEvent(h.events.KNOCKER_KNOCKED_ROOM), j.addNewStream("0", c.selfStream)
                }, b.joinRoom = function() {
                    c.getRoomInformation(), e.$once(protocol.res.ROOM_JOINED, o), h.sendEvent(h.events.KNOCKER_JOINED_ROOM)
                }, e.$once(protocol.res.KNOCK_ACCEPTED, function(d) {
                    d && d.sessionKey && (j.disconnectAll(), a.$broadcast(i.KNOCK_ACCEPTED), c.sessionKey = d.sessionKey, b.joinRoom())
                })
            }]
        }
    }), angular.module("videoconference").directive("notificationSwitch", [function() {
        return {
            restrict: "E",
            replace: !0,
            templateUrl: "/templates/partials/notification-switch.html",
            controller: "chromeNotifierController",
            scope: {
                origin: "@"
            }
        }
    }]), angular.module("videoconference").directive("knockers", function() {
        return {
            templateUrl: "/templates/partials/knockers.html",
            restrict: "E",
            replace: !0,
            scope: {
                modal: "="
            },
            controller: ["$scope", "RoomService", "Event", "Analytics", "$log", "$rootScope", "knockerQueue", function(a, b, c, d, e, f, g) {
                a.knocker = null, a.isOpen = null, a.$watch(function() {
                    return g.knocker
                }, function(b, c) {
                    return b !== c ? (a.knocker = b, a.knocker ? !a.modal.isOpen && a.knocker ? (d.sendEvent(d.events.NEW_KNOCKER), a.modal.open(), void(a.isOpen = !0)) : void 0 : (a.isOpen = !1, void a.modal.close())) : void 0
                }), a.acceptKnocker = function(a) {
                    a.accept(), b.removeKnocker(a.clientId), d.sendEvent(d.events.ACCEPT_KNOCKER)
                }, a.rejectKnocker = function(a) {
                    a.reject(), b.removeKnocker(a.clientId), d.sendEvent(d.events.REJECT_KNOCKER)
                }
            }]
        }
    }), angular.module("videoconference").directive("audioClip", ["$rootScope", "$timeout", function(a) {
        return {
            restrict: "E",
            template: '<audio src="{{ src }}" type="audio/ogg" class="ng-hide" preload></audio>',
            scope: {
                src: "@",
                event: "@"
            },
            link: function(b, c) {
                a.$on(b.event, function() {
                    c.find("audio")[0].play()
                })
            }
        }
    }]), angular.module("videoconference").directive("urlBar", function() {
        return {
            restrict: "E",
            replace: !0,
            templateUrl: "/templates/partials/url-bar.html",
            scope: {
                value: "=?"
            },
            controller: ["$scope", "Analytics", "$http", "RoomService", "$rootScope", "RoomName", "$location", "$timeout", "browserSupport", function(a, b, c, d, e, f, g, h, i) {
                a.shouldDisplayUrlBar = function() {
                    return "Safari" !== i.webRtcDetectedBrowser
                }, a.roomNameRequirements = f.requirements, a.roomNamePattern = f.pattern, a.roomName = "", a.RoomService = d;
                var j, k, l = !1;
                a.randomizeName = function() {
                    l || c.post("/random-room-name").success(function(b) {
                        if (l = !0, void 0 !== b.roomName) {
                            k = b.roomName.replace(/^\//, "");
                            var c = 0;
                            a.suggestedRoomName = "";
                            var d = function() {
                                return a.suggestedRoomName.length !== k.length ? (a.suggestedRoomName += k[c], c++, void h(function() {
                                    d()
                                }, 40)) : void(l = !1)
                            };
                            d()
                        }
                    })
                }, a.launchRoom = function() {
                    b.sendEvent(b.events.CREATED_ROOM_FROM_FRONTPAGE), a.roomName = encodeURI(a.roomName.replace(/[_ ]/g, "-")), g.url("" !== a.roomName ? "/" + a.roomName : "/" + k)
                }, a.getRoomName = function() {
                    return "" === a.roomName ? a.suggestedRoomName : a.roomName
                }, a.btnRandomizeName = function() {
                    b.sendEvent(b.events.RANDOMIZED_ROOM_NAME), h.cancel(j), a.randomizeName(), window.document.getElementById("room-namer").focus()
                }, a.$watch("roomName", function() {
                    a.roomName = a.roomName.toLowerCase(), a.value = a.roomName
                });
                var m = function() {
                    a.randomizeName(), j = h(m, 1e4)
                };
                m(), a.$on("$destroy", function() {
                    h.cancel(j)
                })
            }]
        }
    }), angular.module("videoconference").directive("lockToTop", ["$window", function(a) {
        return {
            restrict: "A",
            link: function(b, c) {
                var d;
                angular.element(a).on("scroll", function() {
                    d || (d = c[0].offsetTop);
                    var b = a.scrollY + 5 > d;
                    return b ? void c.addClass("fixed") : void c.removeClass("fixed")
                })
            }
        }
    }]), angular.module("videoconference").directive("webRtcVideo", ["$timeout", "browserSupport", "$compile", "$log", function(a, b, c, d) {
        return {
            restrict: "E",
            template: '<div class="video-stream {{ stream.type }}"></div>',
            replace: !0,
            scope: {
                client: "=client",
                stream: "=stream"
            },
            link: function(a, e) {
                function f(a) {
                    h.replaceWith(a), h = angular.element(a)
                }

                function g() {
                    if (a.stream && a.stream.stream) {
                        var b, e;
                        d.log("Updating stream: {stream.id: %s stream.streamId: %s}", a.stream && a.stream.id, a.stream && a.stream.stream && a.stream.streamId), a.usePlugin ? (b = c(["<object", 'class="video-stream {{ stream.type }}"', 'ng-hide="client.error || !client.isVideoEnabled"', 'style="width:100%; height:100%;"', 'vc-muted="client.isLocalClient"', 'vc-splitscreen-is-aspect-ratio-source="{{ stream.isVideoEnabled }}"', 'vc-splitscreen-rotation="{{ client.rotation }}"', "ng-class=\"{'inactive': client.status == 'connection_inactive'}\"", 'id="' + a.client.id + '"', 'type="application/x-temwebrtcplugin">', '<param name="pluginId" value="' + a.stream.stream.id + '" />', '<param name="pageId" value="' + TemPageId + '" />', '<param name="streamId" value="' + a.stream.stream.id + '" />', "</object>"].join("\n")), e = b(a)[0], f(e)) : (b = c(['<video autoplay="true"', 'id="{{client.id}}"', 'class="video-stream {{ stream.type }}"', "ng-class=\"{'inactive': client.status == 'connection_disconnected'}\"", 'ng-hide="client.error"', 'vc-muted="client.isLocalClient"', 'vc-splitscreen-is-aspect-ratio-source="{{ stream.isVideoEnabled }}"', 'vc-splitscreen-rotation="{{ client.rotation }}"', ">", "</video>"].join("\n")), e = b(a)[0], f(e), attachMediaStream(e, a.stream.stream))
                    }
                }
                var h = e;
                a.usePlugin = "Safari" === b.webRtcDetectedBrowser, a.$watch(function() {
                    return a.stream && a.stream.stream
                }, g)
            }
        }
    }]), angular.module("videoconference").directive("scrollthrough", ["$timeout", function(a) {
        return {
            restrict: "A",
            link: function(b, c) {
                var d = c.find(".item"),
                    e = d.length,
                    f = 0,
                    g = function() {
                        f++, f === e && (f = 0), c.css("-webkit-transform", "translateX(-" + 100 * f + "%)").css("-moz-transform", "translateX(-" + 100 * f + "%)").css("transform", "translateX(-" + 100 * f + "%)"), a(g, 7e3)
                    };
                a(g, 7e3)
            }
        }
    }]), angular.module("videoconference").directive("shareRoom", function() {
        return {
            templateUrl: "/templates/partials/shareRoom.html",
            restrict: "E",
            scope: {},
            controller: ["$scope", "RoomService", "Analytics", "$window", function(a, b, c, d) {
                a.shareRoom = function(a, e) {
                    var f = encodeURIComponent("https://appear.in" + b.roomName);
                    switch (a.preventDefault(), e) {
                        case "twitter":
                            return d.open("https://twitter.com/intent/tweet?text=Appear%20with%20me%20in&url=" + f, "twitter-share-dialog", "width=550, height=420"), c.sendEvent(c.events.SHARE_ROOM_LINK_TO_TWITTER), !1;
                        case "facebook":
                            return d.open("https://www.facebook.com/sharer/sharer.php?u=" + f, "facebook-share-dialog", "width=626, height=436"), c.sendEvent(c.events.SHARE_ROOM_LINK_TO_FACEBOOK), !1;
                        case "googleplus":
                            return d.open("https://plus.google.com/share?url=" + f, "googleplus-share-dialog", "width=480, height=415"), c.sendEvent(c.events.SHARE_ROOM_LINK_TO_GOOGLE), !1
                    }
                }
            }]
        }
    }), angular.module("videoconference").directive("exitRoom", ["$window", function(a) {
        return {
            templateUrl: "/templates/partials/exit-room.html",
            restrict: "E",
            controller: ["$scope", "$timeout", "$http", function(b, c, d) {
                b.status = "standby";
                var e = [{
                    id: "audio_quality",
                    title: "Audio quality",
                    body: "How did you perceive the audio quality?"
                }, {
                    id: "video_quality",
                    title: "Video quality",
                    body: "How did you perceive the video quality?"
                }];
                b.chosenQuestion = _.sample(e);
                var f = function(c, e) {
                    if (!(c.text && c.text.length > constants.Questionnaire.MAX_NUMBER_OF_CHARACTERS)) {
                        var f = {
                            questionId: b.chosenQuestion.id,
                            text: c.text,
                            rating: c.rating,
                            timestamp: new Date,
                            id: b.feedbackId,
                            roomName: a.location.pathname
                        };
                        d.post("/questionnaire", f).success(e)
                    }
                };
                b.checkMessageLength = function() {
                    b.messageTooLong = this.textFeedback.length > constants.Questionnaire.MAX_NUMBER_OF_CHARACTERS
                }, b.setRating = function(a) {
                    if (b.status = "submitting", !b.ratingTest) {
                        b.ratingTest = a;
                        var c = 0;
                        "positive" === a && (c = 100), f({
                            rating: c
                        }, function(c) {
                            b.rating = a, b.feedbackId = c.id, b.status = "submitted"
                        })
                    }
                }, b.submitFeedback = function() {
                    f({
                        text: this.textFeedback
                    }, function() {
                        b.status = "end"
                    })
                }, b.postTo = function(a) {
                    var b;
                    switch (a) {
                        case "facebook":
                            b = "https://www.facebook.com/sharer/sharer.php?u=http://appear.in";
                            break;
                        case "twitter":
                            b = "http://twitter.com/?status=I+just+had+an+AMAZING+video+conversation+with+https://appear.in/.+So+easy+it+almost+hurts!";
                            break;
                        case "googleplus":
                            b = "https://plus.google.com/share?url=https://appear.in"
                    }
                    var c = window.open(b, "", "menubar=no,toolbar=no,resizable=no,scrollbars=no,height=530,width=480");
                    window.focus && c.focus()
                }
            }]
        }
    }]), angular.module("videoconference").directive("fatHeader", function() {
        return {
            templateUrl: "/templates/partials/header.html",
            restrict: "E",
            replace: !0,
            controller: ["$scope", "appearinApi", "features", "$timeout", function(a, b, c, d) {
                function e() {
                    if (!a.roomName) return void(a.shouldShowBackgroundImage = !1);
                    var c = encodeURI(a.roomName.replace(/[_ ]/g, "-")),
                        e = "/room/" + c;
                    b({
                        method: "GET",
                        url: e
                    }).then(function(b) {
                        if (200 === b.status) {
                            var c = new Image;
                            c.onload = function() {
                                a.$apply(function() {
                                    a.shouldShowBackgroundImage ? (a.shouldShowBackgroundImage = !1, d(function() {
                                        a.backgroundImageUrl = c.src, a.shouldShowBackgroundImage = !0
                                    }, 750)) : (a.backgroundImageUrl = c.src, a.shouldShowBackgroundImage = !0)
                                })
                            }, c.src = b.data.backgroundImageUrl
                        }
                    }).catch(function() {
                        a.shouldShowBackgroundImage = !1
                    })
                }
                a.features = c, a.roomName = "", a.backgroundImageUrl = "", a.shouldShowBackgroundImage = "", -1 !== window.navigator.userAgent.indexOf("Chrome") && c.userRegistration && a.$watch("roomName", _.debounce(function() {
                    a.$apply(function() {
                        e()
                    })
                }, 500))
            }]
        }
    }), angular.module("videoconference").directive("fatFooter", function() {
        return {
            templateUrl: "/templates/partials/footer.html",
            restrict: "E",
            replace: !0
        }
    }), angular.module("videoconference").directive("faqModule", function() {
        return {
            templateUrl: "/templates/partials/faq-module.html",
            restrict: "E",
            replace: !0,
            controller: ["$scope", "$timeout", "$anchorScroll", "$location", function(a, b, c, d) {
                var e = {
                    TYPING: "typing",
                    STANDBY: "standby",
                    SUBMITTING: "submitting"
                };
                a.searchStatus = e.STANDBY, a.topics = [];
                var f, g, h = 0;
                a.$watch("this.searchString", function(b, c) {
                    b && b !== c && (a.searchStatus = e.TYPING, a.searchResults = [], l())
                });
                var i = function(c) {
                        var d = function(d) {
                                b(function() {
                                    a.topics[c.position] = {
                                        title: c.name,
                                        questions: _.sortBy(d.articles, "position")
                                    }, h++, h === g && j()
                                })
                            },
                            e = "https://appearin.zendesk.com/api/v2/help_center/sections/" + c.id + "/articles.json";
                        $.ajax({
                            type: "POST",
                            url: "/hc-proxy",
                            data: {
                                url: e
                            },
                            success: d,
                            dataType: "json"
                        })
                    },
                    j = function() {
                        d.hash() && b(function() {
                            c()
                        })
                    },
                    k = function() {
                        var a = {
                                url: "https://appearin.zendesk.com/api/v2/help_center/sections.json"
                            },
                            b = function(a) {
                                g = a.sections.length, _.each(a.sections, function(a) {
                                    i(a)
                                })
                            };
                        $.ajax({
                            type: "POST",
                            url: "/hc-proxy",
                            data: a,
                            success: b,
                            dataType: "json"
                        })
                    };
                k(), a.submitSearch = function() {
                    b.cancel(f);
                    var c = function(c) {
                        b(function() {
                            a.searchResults = c.results, a.searchStatus = e.STANDBY
                        })
                    };
                    a.searchStatus = e.SUBMITTING;
                    var d = "https://appearin.zendesk.com/api/v2/help_center/articles/search.json?query=" + a.searchString;
                    $.ajax({
                        type: "POST",
                        url: "/hc-proxy",
                        data: {
                            url: d
                        },
                        success: c,
                        dataType: "json"
                    })
                };
                var l = function() {
                    b(function() {
                        b.cancel(f), f = b(function() {
                            a.submitSearch()
                        }, 1e3)
                    })
                }
            }]
        }
    }), angular.module("videoconference").directive("faqArticle", function() {
        return {
            templateUrl: "/templates/partials/faq-article.html",
            scope: {
                article: "=article"
            },
            replace: !0,
            restrict: "E",
            controller: ["$scope", "Analytics", function(a, b) {
                var c = !1;
                a.toggleRevealAnswer = function() {
                    a.isRevealed = !a.isRevealed, c || (c = !0, b.helpers.recordFaqArticleId(a.article.id))
                }
            }]
        }
    }), angular.module("videoconference").directive("contactList", function() {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/contact-list.html",
            scope: {
                isOpen: "="
            },
            require: "^modal",
            link: function(a, b, c, d) {
                d.initialize("contacts", b[0]), d.setShowCloseButton(!1)
            },
            controller: ["$scope", "$log", "User", "$rootScope", "features", "RoomService", "modalService", "$element", "$q", "Event", "serverTemplate", "objStore", "Analytics", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
                function n() {
                    1 === f.clients.length && g.openModal(t)
                }

                function o() {
                    f.clients.length > 1 && g.closeModal(t)
                }

                function p() {
                    return a.invite.errorMessage = "Something went wrong", a.invite.isMessageSent = !1, i.reject()
                }

                function q() {
                    a.invite.errorMessage = "", a.invite.isMessageSent = !0, m.helpers.contacts.recordInviteContact("SMS")
                }
                a.User = c, a.features = e, a.isUnauthorized = !0, a.isContactsLoading = !1, a.RoomService = f, a.modalService = g;
                var r = l("hasDisabledIphoneUpsell").loadOrDefault(!1);
                a.disableIphoneUpsell = function() {
                    r = !0, l("hasDisabledIphoneUpsell").save(!0)
                };
                var s = window.navigator.userAgent.indexOf("Android") > 0;
                a.shouldShowIphoneUpsell = function() {
                    return 0 === c.unregisteredContacts.length && c.data.phoneNumber && !s && !r
                };
                var t = "contacts";
                a.$watch("User.isLoggedIn", function() {
                    if (c.isLoggedIn) {
                        var b = "<%= displayName || 'Someone' %> wants to talk to you right now in https://appear.in<%= roomName %>. Click to join the conversation.";
                        k.getTemplate("call_sms.ujs.txt", b).then(function(b) {
                            a.exampleSms = b({
                                displayName: c.data.displayName,
                                roomName: f.roomName
                            })
                        })
                    }
                }), h.on("close", function() {
                    a.contactSearchString = ""
                });
                var u = a.$watch("User.isLoggedIn", function(b) {
                    b && !g.isActive() && (u(), a.isUnauthorized = !1, a.isContactsLoading = !0, c.getContacts(), n())
                });
                d.$on(j.CONTACTS_UPDATED, function() {
                    a.isContactsLoading && (a.isContactsLoading = !1)
                }), a.callContact = function(a) {
                    c.callContact(a, f.roomName)
                }, a.isAppLinkSent = !1, a.isAppLinkSending = !1, a.sendAppLinkToPhone = function() {
                    a.isAppLinkSending = !0, c.sendAppLink().then(function() {
                        a.isAppLinkSent = !0
                    }).finally(function() {
                        a.isAppLinkSending = !1
                    })
                }, a.invite = {
                    isOpen: !1,
                    errorMessage: "",
                    isMessageSent: !1,
                    isSendEnabled: !0,
                    phone: {
                        prefix: "+47",
                        number: ""
                    }
                }, a.toggleInviteDropdown = function() {
                    var b = h.find(".invite-by-sms .dropdown"),
                        c = h.find(".invite-by-sms .dropdown-wrapper").height();
                    if (a.invite.isOpen) a.invite.isOpen = !1, b.css("height", "0px");
                    else {
                        a.invite.isOpen = !0, b.css("height", c + "px");
                        var d = b.find(".phone-number")[0];
                        d && d.focus()
                    }
                }, a.submitInviteFormHandler = function() {
                    a.invite.isMessageSent ? w() : v()
                };
                var v = function() {
                        var b = a.invite.phone.prefix + a.invite.phone.number;
                        a.invite.isSendEnabled = !1, a.invite.statusMessage = "Sending...", c.inviteBySms(b, f.roomName).then(q, p).finally(function() {
                            a.invite.isSendEnabled = !0
                        })
                    },
                    w = function() {
                        var b = a.invite.phone.prefix + a.invite.phone.number;
                        c.addPhoneContact(a.invite.displayName, [b]).then(m.helpers.contacts.recordSavedAsPhoneContact).finally(function() {
                            a.invite.phone.number = "", a.invite.isMessageSent = !1, a.invite.displayName = ""
                        })
                    };
                a.$watch("invite.phone.number", function(b) {
                    b && (a.invite.isMessageSent = !1)
                }), a.$watch("invite.phone.prefix", function(b) {
                    b && (a.invite.isMessageSent = !1)
                }), a.$on(j.NEW_CLIENT, o)
            }]
        }
    }), angular.module("videoconference").directive("contactListItem", ["User", "RoomService", "$log", "Analytics", function(a, b, c, d) {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/contact-list-item.html",
            scope: {
                contact: "=",
                exampleSms: "="
            },
            link: function(e) {
                function f(a) {
                    e.inviteState = {
                        state: a,
                        timestamp: (new Date).getTime()
                    }
                }

                function g(d, g) {
                    if (e.inviteState.state !== h.IN_PROGRESS) {
                        f(h.IN_PROGRESS);
                        var i = {
                            roomName: b.roomName
                        };
                        return g && (i.phoneNumber = g), a.callContact(d, i).then(function() {
                            f(h.SUCCESS)
                        }, function(a) {
                            return c.warn("Failed to invite user: %o", a), 429 === a.status ? void f(h.THROTTLED) : void f(h.ERROR)
                        })
                    }
                }
                var h = {
                    CONFIRMATION: "confirmation",
                    IN_PROGRESS: "in-progress",
                    ERROR: "error",
                    SUCCESS: "success",
                    THROTTLED: "throttled",
                    NONE: "none"
                };
                e.isPhoneContact = "phone-contact" === e.contact.type, e.roomName = b.roomName, e.displayName = a.data.displayName, f(h.NONE), e.isPhoneContact && e.contact.phoneNumbers && e.contact.phoneNumbers[0] && (e.contact.selectedNumber = e.contact.phoneNumbers[0] || ""), e.sendSms = function() {
                    d.helpers.contacts.recordInviteContact("phone"), g(e.contact.id, e.contact.selectedNumber)
                }, e.retryCallContact = function(a) {
                    a.stopPropagation(), e.inviteState.state === h.ERROR && g(e.contact.id)
                };
                var i = function() {
                    return e.inviteState.state !== h.CONFIRMATION ? void f(h.CONFIRMATION) : (d.helpers.contacts.recordInviteContact("user"), void g(e.contact.id))
                };
                e.clickHandler = function() {
                    return e.isPhoneContact ? void(e.expanded = !e.expanded) : void i()
                }, e.closeExpanded = function() {
                    e.expanded = !1
                }
            }
        }
    }]), angular.module("videoconference").directive("user", function() {
        return {
            restrict: "E",
            replace: !0,
            scope: {
                allowContextMenu: "=contextMenu",
                showDisplayName: "=",
                showAvatar: "=",
                showLogin: "=",
                showDescription: "=",
                size: "@",
                context: "@?",
                className: "@?"
            },
            templateUrl: "/templates/partials/user.html",
            controller: ["$scope", "User", "features", "modalService", function(a, b, c, d) {
                a.User = b, a.features = c, a.modalService = d;
                var e = function() {
                    var a = ["settings", "login"].map(function(a) {
                        return d.modals[a].isOpen
                    });
                    return _.any(a)
                };
                a.isActive = function() {
                    return a.allowContextMenu && e()
                }
            }]
        }
    }), angular.module("videoconference").directive("userRegistration", function() {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/user-registration.html",
            require: "^modal",
            link: function(a, b, c, d) {
                a.getPartialPath = function(a) {
                    var b = "/templates/partials/user-registration/";
                    return b + a + ".html"
                }, a.states = ["phone_primary", "phone_secondary", "phone_notifications", "email_primary", "email_secondary", "outro"], _.extend(a, d.exports), d.initialize("registration", b[0])
            },
            controller: ["$scope", "$element", "User", "RoomService", "Analytics", "$timeout", "apiUrl", "$http", "$log", "$q", "appearinApi", "modalService", "ImageParser", "RoomAdminPanel", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
                function o(c) {
                    setTimeout(function() {
                        var d = b.find("." + a.activeState + " " + c)[0];
                        d && d.focus()
                    })
                }

                function p() {
                    o("input.code")
                }

                function q() {
                    o("input.main-input")
                }

                function r(b) {
                    b && m.isValidImage(b) && m.parseFileAsImage({
                        file: b
                    }, function(b, c) {
                        a.$apply(function() {
                            return b ? void(a.customizeRoomError = b) : (H.previewUrl = "data:image/jpeg;base64," + c, void(H.base64Data = c))
                        })
                    })
                }

                function s() {
                    a.errorTriggered = !1, f(function() {
                        a.errorTriggered = !0
                    })
                }
                a.roomName = d.roomName.substring(1), a.modalService = l, a.errors = constants.RESTErrors;
                var t = "registration";
                b.on("close", function() {
                    c.isLoggedIn && l.openModal("contacts")
                }), a.openClaimModal = function() {
                    c.isLoggedIn && !d.isClaimed && n.toggle()
                }, a.closeMigrationFlowHandler = function() {
                    a.closeModal(), a.openClaimModal()
                }, a.isMigrationFlow = function() {
                    return !!l.modals[t].isMigrationFlow
                };
                var u = {
                    PHONE_NUMBER: "phone",
                    EMAIL: "email"
                };
                a.ContactPoint = u, a.setActiveState = function(b) {
                    a.activeState = b, q(), e.helpers.userRegistration.recordSetActiveState(b)
                };
                var v = {
                    phone: {
                        isVerified: !1,
                        isSubmitted: !1,
                        verificationProperty: "number",
                        verificationCodeResent: !1
                    },
                    email: {
                        isVerified: !1,
                        isSubmitted: !1,
                        verificationCodeResent: !1
                    }
                };
                a.phone = v.phone, a.email = v.email, a.forms = {}, a.verificationCodePattern = /^\d{6}$/;
                var w = function() {
                    a.setActiveState("phone_primary"), a.email.value = "", a.phone.number = "", a.userData = {
                        displayName: "",
                        avatarImage: null,
                        phoneIsNotifiable: !0,
                        emailIsNotifiable: !0
                    }
                };
                w();
                var x = function() {
                    return a.forms[a.activeState]
                };
                a.isDataValid = function() {
                    var a = x();
                    return a && a.$valid
                };
                var y = function() {
                        return a.userData.avatarImage ? c.uploadAvatar(a.userData.avatarImage) : j.when()
                    },
                    z = function() {
                        var b = {};
                        return b.phoneNumber = a.phone.isVerified ? a.phone : void 0, b.email = a.email.isVerified ? a.email : void 0, b
                    },
                    A = function() {
                        var b = a.userData,
                            f = _.extend(_.clone(b), z());
                        return c.create(f).then(y).then(function() {
                            return a.isMigrationFlow() ? j.when() : d.claimRoomWithREST(d.roomName)
                        }).then(function() {
                            e.helpers.userRegistration.recordUserCreated()
                        }).then(function() {
                            c.migrateRoomKeys()
                        }).then(function() {
                            c.login()
                        }).catch(function(a) {
                            return i.error(a), e.sendEvent(e.events.SIGNUP_ERROR), j.reject(a || "error creating user")
                        })
                    };
                a.verifyPhoneAndCreateUser = function() {
                    e.helpers.userRegistration.recordAttemptVerifyContactPoint("phone"), G("phone").then(function() {
                        a.phone.isVerified = !0
                    }).then(A).then(function() {
                        return "phone_primary" === a.activeState ? void a.setActiveState("phone_notifications") : void a.skipToSecondaryEmail(a.phone.phoneIsNotifiable)
                    }).catch(function(b) {
                        a.phone.error = b, i.error(b)
                    })
                }, a.skipToSecondaryEmail = function(b) {
                    a.userData.phoneIsNotifiable = b, a.setActiveState("email_secondary"), a.email.value && a.sendVerificationCodeToEmailAddress(!0)
                }, a.setEmailAndContinue = function() {
                    a.email.isVerifying = !0, a.setActiveState("phone_secondary")
                };
                var B = function() {
                    var b = _.pick(a.userData, "phoneIsNotifiable", "emailIsNotifiable");
                    return c.update(b).then(function() {
                        e.helpers.userRegistration.recordNotificationChoice(b)
                    })
                };
                a.submitNotificationChoiceAndContinue = function() {
                    B().then(function() {
                        a.setActiveState("email_secondary")
                    })
                }, a.verifyEmailAndContinue = function() {
                    G("email").then(function() {
                        a.email.isVerified = !0
                    }).then(function() {
                        return c.isLoggedIn ? c.setEmail(a.email) : A()
                    }).then(B).then(function() {
                        a.setActiveState("outro")
                    }).catch(function(b) {
                        a.email.error = b, i.error(b)
                    })
                };
                var C = function(b) {
                        return function(c) {
                            var d = c.data;
                            return d && d.error === constants.RESTErrors.ContactPointAlreadyRegistered && (a[b].error = {
                                type: constants.RESTErrors.ContactPointAlreadyRegistered
                            }), d && d.error === constants.RESTErrors.InvalidCountryCode && (a[b].error = constants.RESTErrors.InvalidCountryCode), d && -1 !== constants.RESTErrors.InvalidPhoneNumberErrors.indexOf(d.error) && (a[b].error = "Invalid phone number."), j.reject(c)
                        }
                    },
                    D = function(b) {
                        return function(c) {
                            return a[b].error = void 0, c
                        }
                    },
                    E = 3e3;
                a.sendVerificationCodeToPhoneNumber = function() {
                    return e.helpers.userRegistration.recordSentVerificationCode("phone"), a.phone.value = a.phone.prefix + a.phone.number.trim(), c.sendVerificationCode("phone", a.phone.value, !0).catch(C("phone")).then(D("phone")).then(function() {
                        a.phone.isVerifying && (a.phone.verificationCodeResent = !0, f(function() {
                            a.phone.verificationCodeResent = !1
                        }, E)), a.phone.isVerifying = !0
                    }).then(p)
                }, a.sendVerificationCodeToEmailAddress = function(b) {
                    return e.helpers.userRegistration.recordSentVerificationCode("email"), c.sendVerificationCode("email", a.email.value, !0).catch(C("email")).then(D("email")).then(function() {
                        !b && a.email.isVerifying && (a.email.verificationCodeResent = !0, f(function() {
                            a.email.verificationCodeResent = !1
                        }, E)), a.email.isVerifying = !0
                    }).then(p)
                };
                var F = 0,
                    G = function(b) {
                        var d = v[b];
                        return F++, 1 === F && (a.showTryAgainLink = !0), c.verifyContactPoint(b, d.value, d.verificationCode).catch(C(b)).then(function(a) {
                            return a.data.isVerified ? void 0 : j.reject("Invalid code. Please try again.")
                        }).catch(function(b) {
                            s();
                            var c = b || "We've encountered an unexpected error. Please try again.";
                            return a.phoneVerificationError = c, j.reject(c)
                        })
                    },
                    H = {
                        isDragging: !1,
                        previewUrl: null,
                        base64Data: null,
                        defaultHelpText: "Drag images here",
                        getHelpText: function() {
                            return this.helpText || this.defaultHelpText
                        }
                    };
                H.helpText = H.defaultHelpText, a.backgroundImage = H, a.backgroundImageDragChange = function(a) {
                    H.isDragging = a, H.helpText = a ? "Good, now drop it here." : null
                }, a.fileDropped = function(a) {
                    H.isDragging = !1, r(a)
                }, a.selectFile = function(a) {
                    angular.element("#" + a).click()
                }, a.handleSelectedFile = function(a) {
                    r(a)
                }, a.submitBackgroundImage = function() {
                    var b = m.base64toBlob(H.base64Data, "image/jpeg");
                    d.submitBackgroundImage(b), a.closeModal()
                }, a.isAvatarSnapshotterActive = function(b) {
                    return a.isOpen() && a.activeState === b
                }
            }]
        }
    }), angular.module("videoconference").directive("avatarSnapshotter", ["$timeout", function(a) {
        var b = {
            STANDBY: "standby",
            SNAPPING: "snapping",
            SNAPPED: "snapped"
        };
        return {
            restrict: "E",
            scope: {
                imageData: "=",
                active: "=",
                avatarSize: "@size",
                avatarUrl: "@?",
                isSubmitted: "=?",
                customButtons: "=?"
            },
            templateUrl: "/templates/partials/avatar-snapshotter.html",
            link: function(c, d) {
                c.dimensions = null;
                var e = d.find("video")[0],
                    f = d.find("canvas")[0];
                c.size = parseInt(c.avatarSize) || 128;
                var g, h, i = function() {
                        for (var a = f.toDataURL(), b = atob(a.split(",")[1]), c = [], d = 0; d < b.length; d++) c.push(b.charCodeAt(d));
                        var e = new Blob([new Uint8Array(c)], {
                            type: "image/png"
                        });
                        return e
                    },
                    j = function() {
                        var a = c.dimensions.excessWidth / 2,
                            b = c.dimensions.excessHeight / 2,
                            d = c.dimensions.width - 2 * a,
                            f = c.dimensions.height - 2 * b;
                        try {
                            g.drawImage(e, a, b, d, f, 0, 0, c.size, c.size), h = window.requestAnimationFrame(j)
                        } catch (i) {
                            if ("NS_ERROR_NOT_AVAILABLE" !== i.name) throw i;
                            setTimeout(j, 100)
                        }
                    };
                c.paintImageToCanvas = function(a) {
                    var b = new Image;
                    b.onload = function() {
                        g.save(), g.scale(-1, 1), g.translate(-c.size, 0), g.drawImage(b, 0, 0, c.size, c.size), g.restore(), b = null
                    }, b.src = window.URL.createObjectURL(a)
                }, c.startDrawing = function() {
                    return c.isWebcamReady() ? (c.setStatus(b.SNAPPING), void j()) : void setTimeout(c.startDrawing, 100)
                }, c.stopDrawing = function() {
                    window.cancelAnimationFrame(h), h = null
                }, c.isDrawing = function() {
                    return !!h
                }, c.initializeCanvasContext = function() {
                    g = f.getContext("2d"), g.save(), g.translate(c.size, 0), g.scale(-1, 1)
                }, c.restoreCanvasContext = function() {
                    g = f.getContext("2d"), g.restore()
                }, c.setStatus = function(b) {
                    a(function() {
                        c.status = b
                    })
                };
                var k = !1;
                c.initializeStream = function(a) {
                    attachMediaStream(e, a), e.play(), k || (e.addEventListener("loadedmetadata", function() {
                        c.getVideoDimensions(e)
                    }), e.addEventListener("play", function() {
                        c.avatarUrl ? c.setStatus(b.STANDBY) : c.imageData ? c.setStatus(b.SNAPPED) : c.startDrawing()
                    }, !1), k = !0)
                }, c.terminateWebcam = function() {
                    c.stopDrawing(), c.dimensions = null
                }, c.isWebcamReady = function() {
                    return c.dimensions && c.dimensions.size
                }, c.takeAvatar = function() {
                    c.imageData = i(), c.stopDrawing(), c.setStatus(b.SNAPPED)
                }
            },
            controller: ["$scope", "$log", "RoomService", "splitscreenElements", function(a, c, d, e) {
                var f = function(b, c) {
                    var d = {};
                    return d.width = b, d.height = c, d.size = Math.min(d.width, d.height), d.excessWidth = d.width - d.size, d.excessHeight = d.height - d.size, d.scaledExcessWidth = d.excessWidth * (a.size / d.size), d
                };
                a.getVideoDimensions = function(b) {
                    var c = e.getVideoDimensions(b);
                    c[0] && c[1] || setTimeout(a.getVideoDimensions.bind(null, b), 100), a.dimensions = f.apply(null, c)
                };
                var g = function(b) {
                    a.initializeCanvasContext(), a.imageData && a.paintImageToCanvas(a.imageData), a.initializeStream(b)
                };
                a.$watch("active", function(b) {
                    b ? d.selfStream && d.selfStream.getVideoTracks().length > 0 ? g(d.selfStream) : c.error("Camera stream not available.") : (a.restoreCanvasContext(), a.terminateWebcam())
                }), a.takeAvatarOrReset = function() {
                    a.isWebcamReady() && (a.isDrawing() ? (a.isSubmitted = !1, a.takeAvatar()) : a.resetAvatar())
                }, a.resetAvatar = function() {
                    a.imageData = null, a.startDrawing()
                }, a.undo = function() {
                    a.imageData = null, a.setStatus(b.STANDBY), a.stopDrawing()
                }, a.$watch("isSubmitted", function(c) {
                    c && a.setStatus(b.STANDBY)
                })
            }]
        }
    }]), angular.module("videoconference").directive("modal", function() {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/modal.html",
            transclude: !0,
            replace: !0,
            scope: {
                fullWidth: "=",
                singleScreen: "="
            },
            controller: ["$scope", "$log", "$timeout", "modalService", function(a, b, c, d) {
                a.modalService = d, a.showCloseButton = !0, this.setShowCloseButton = function(b) {
                    a.showCloseButton = b
                }, this.initialize = function(b, c) {
                    a.type = b, d.setElement(a.type, c)
                }, a.closeModal = function() {
                    d.closeModal(a.type)
                }, a.openModal = function() {
                    d.openModal(a.type)
                }, a.isOpen = function() {
                    return d.modals[a.type].isOpen
                }, this.exports = {
                    triggerError: function(d) {
                        b.error(d), a.error = d, a.errorTriggered = !1, c(function() {
                            a.errorTriggered = !0
                        })
                    },
                    clearError: function() {
                        a.error = "", a.errorTriggered = !1
                    },
                    closeModal: a.closeModal,
                    openModal: a.openModal,
                    isOpen: a.isOpen
                }
            }]
        }
    }), angular.module("videoconference").directive("login", function() {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/login.html",
            require: "^modal",
            scope: {},
            link: function(a, b, c, d) {
                _.extend(a, d.exports), d.initialize("login", b[0]), b.on("close", function() {
                    a.resetState()
                })
            },
            controller: ["$scope", "appearinApi", "$q", "User", "$log", "modalService", "$element", "RoomService", "Analytics", function(a, b, c, d, e, f, g, h, i) {
                a.modalService = f, a.RoomService = h, a.loginCode = {
                    code: ""
                }, a.endpoint = {
                    type: "",
                    name: {
                        phone: "SMS",
                        email: "email"
                    },
                    address: h.isClaimed && h.roomName ? h.roomName.substring(1) : ""
                }, a.User = d;
                var j = {
                    ENDPOINT: "endpoint",
                    CODE: "code",
                    ALTERNATIVE: "alternative"
                };
                a.resetState = function() {
                    a.phone = {
                        prefix: "+47",
                        number: ""
                    }, a.email = {
                        value: ""
                    }, a.activeStep = j.ENDPOINT
                }, a.resetState(), a.preferredEndpoint = "", a.checkPreferredEndpoint = function(b) {
                    var c = g.find("input." + b);
                    if (0 !== c.length) return c.val().toString().length > 0 ? void(a.preferredEndpoint = b) : void(a.preferredEndpoint = "")
                };
                var k, l = function(c) {
                    b({
                        method: "POST",
                        url: "/device/link-tokens",
                        data: c
                    }).then(function() {
                        i.helpers.login.recordRequestLoginCode(k), a.activeStep = j.CODE
                    }, function(b) {
                        return 404 === b.status ? void a.triggerError("Could not find profile") : void a.triggerError("Unknown error fetching user")
                    })
                };
                a.requestLoginCodeToRoomName = function() {
                    if (a.endpoint.address) {
                        var b = {
                            roomName: "/" + a.endpoint.address
                        };
                        k = "roomName", l(b)
                    }
                }, a.requestLoginCodeToAlternative = function() {
                    if (a.preferredEndpoint) {
                        var b = {};
                        "phone-number" === a.preferredEndpoint && (k = "phoneNumber", b.phoneNumber = a.phone.prefix + a.phone.number), "email" === a.preferredEndpoint && (k = "email", b.email = a.email.value), l(b)
                    }
                }, a.resetForm = function() {
                    a.email.value = "", a.phone.number = "", a.preferredEndpoint = ""
                }, a.goToAlternative = function() {
                    a.activeStep = j.ALTERNATIVE
                }, a.goToPrevious = function() {
                    return a.activeStep === j.ALTERNATIVE ? void(a.activeStep = j.ENDPOINT) : "roomName" === k ? void(a.activeStep = j.ENDPOINT) : void(a.activeStep = j.ALTERNATIVE)
                }, a.submitLoginCode = function() {
                    for (var c = "" + a.loginCode.code; c.length < 6;) c = "0" + c;
                    var e = {
                        code: c
                    };
                    switch (k) {
                        case "phoneNumber":
                            e.phoneNumber = a.phone.prefix + a.phone.number;
                            break;
                        case "email":
                            e.email = a.email.value;
                            break;
                        case "roomName":
                            e.roomName = "/" + a.endpoint.address;
                            break;
                        default:
                            return
                    }
                    b({
                        method: "POST",
                        url: "/device/links",
                        data: e
                    }).then(function(b) {
                        return 204 === b.status && d.login().then(function() {
                            f.closeModal("login")
                        }), 400 === b.staus ? void a.triggerError("Invalid code") : void 0
                    }, function() {
                        a.triggerError("Invalid code")
                    })
                }
            }]
        }
    }), angular.module("videoconference").directive("migration", function() {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/migration.html",
            require: "^modal",
            link: function(a, b, c, d) {
                _.extend(a, d.exports), d.initialize("migration", b[0])
            },
            controller: ["$scope", "modalService", "RoomService", "User", "RoomKeyService", function(a, b, c, d, e) {
                a.startMigration = function() {
                    a.closeModal(), b.modals.registration.isMigrationFlow = !0, b.openModal("registration")
                };
                var f = "migration";
                a.closeModal = function() {
                    b.closeModal(f)
                };
                var g = e.getRoomKeysFromLocalStorage(),
                    h = _.reduce(g, function(a, b) {
                        return "string" == typeof b.token ? a : "master" !== b.token.key.type ? a : a + 1
                    }, 0),
                    i = h > 0;
                i && !d.isLoggedIn && b.openModal(f)
            }]
        }
    }), angular.module("videoconference").directive("userSettings", function() {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "/templates/partials/user-settings.html",
            require: "^modal",
            link: function(a, b, c, d) {
                d.initialize("settings", b[0]), _.extend(a, d.exports), b.on("close", function() {
                    a.resetModal()
                })
            },
            controller: ["$scope", "$timeout", "$q", "User", "modalService", function(a, b, c, d, e) {
                var f = function() {
                    a.User = angular.copy(d), a.phoneIsVerified = !!a.User.data.phoneNumber, a.emailIsVerified = !!a.User.data.email, a.data = {
                        phone: {
                            phoneNumber: a.User.data.phoneNumber,
                            prefix: ""
                        }
                    }
                };
                a.resetModal = function() {
                    d.login().then(function() {
                        f(), a.avatarIsSubmitted = !1, a.shouldShowSaveButton = !1
                    })
                }, a.isVerifyingPhoneNumber = !1, a.requestVerificationCode = function() {
                    var b = a.data.phone.prefix + a.data.phone.phoneNumber;
                    return d.sendVerificationCode("phone", b, !0).then(function() {
                        a.isVerifyingPhoneNumber = !0
                    }, function(b) {
                        if (400 === b.status) {
                            if ("the supplied phone is already registered" === b.data.message) return void a.triggerError("Phone number already in use!");
                            a.triggerError("Unknown error. Please try again.")
                        }
                    })
                }, a.savePhoneNumber = function() {
                    var b = {
                        phoneNumber: {
                            value: a.data.phone.prefix + a.data.phone.phoneNumber,
                            verificationCode: this.verificationCode
                        }
                    };
                    return d.update(b).then(function() {
                        a.isVerifyingPhoneNumber = !1, a.shouldShowSaveButton = !1
                    })
                }, a.showSaveButton = function() {
                    a.shouldShowSaveButton = !0
                }, a.modal = e.modals.settings, a.originalUser = d;
                var g = a.$watch("originalUser.isLoggedIn", function(b) {
                    b && (f(), g(), delete a.originalUser)
                });
                f(), a.saveDisplayName = function(a) {
                    return d.setDisplayName(a)
                }, a.submitVerificationCode = function() {
                    a.phoneVerificationError = "", d.verifyPhoneNumber(a.phoneVerificationCode).then(function(a) {
                        return a.data.isVerified ? d.login() : c.reject("You shall not pass!")
                    }).catch(function(b) {
                        a.phoneVerificationError = b
                    })
                }, a.saveEmail = function(a) {
                    return d.sendVerificationCode("email", a, !0)
                }, a.emailVerification = function(a) {
                    return d.update(a)
                }, a.submitAvatar = function() {
                    return a.User.data.avatarImage ? void d.uploadAvatar(a.User.data.avatarImage).then(function() {
                        return a.avatarIsSubmitted = !0, d.login().then(f)
                    }) : c.when()
                }, a.$watch("User.data.phoneIsNotifiable", function(a, b) {
                    if ((void 0 !== a || null !== a) && a !== b) {
                        var c = {
                            phoneIsNotifiable: a
                        };
                        return d.update(c)
                    }
                }), a.$watch("User.data.emailIsNotifiable", function(a, b) {
                    if ((void 0 !== a || null !== a) && a !== b) {
                        var c = {
                            emailIsNotifiable: a
                        };
                        return d.update(c)
                    }
                })
            }]
        }
    }), angular.module("videoconference").directive("autosavingInput", ["$q", "$timeout", "$log", function(a, b, c) {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/autosaving-input.html",
            transclude: !0,
            replace: !0,
            scope: {
                saveFn: "=",
                verificationFn: "=",
                model: "=",
                placeholder: "@",
                verificationPlaceholder: "@",
                saveText: "@",
                verificationText: "@",
                type: "@"
            },
            link: function(d, e) {
                var f = {
                        STANDBY: "standby",
                        LOADING: "loading",
                        VERIFYING: "verifying",
                        SAVING: "saving",
                        SAVED: "saved",
                        ERROR: "error"
                    },
                    g = {
                        VERIFICATION_ERROR: "verification_error",
                        SAVING_ERROR: "saving_error",
                        INPUT_ERROR: "input_error"
                    },
                    h = !1;
                if (d.shouldVerify = !!d.verificationFn, d.shouldVerify && !d.type) return c.error("Failed to initialize autosave field. Missing type"), void e.remove();
                d.type && ("email" === d.type && (d.inputType = "email"), "phoneNumber" === d.type && (d.inputType = "tel")), d.inputStatus = {
                    save: {
                        status: f.STANDBY,
                        isAnimating: !1
                    }
                }, d.shouldVerify && (d.inputStatus.verification = {
                    status: f.STANDBY,
                    isAnimating: !1
                });
                var i, j = d.$watch("model", function(a) {
                    a && (j(), i = angular.copy(d.model))
                });
                d.$watch("model", function(a) {
                    a === i && d.resetToInitialValue()
                }), d.resetToInitialValue = function() {
                    d.model = i, h = !1, d.shouldVerify && d.displayVerification && (d.displayVerification = !1, d.verificationCode = "")
                };
                var k = function(a) {
                    var c = function() {
                            return d.shouldVerify && d.inputStatus.save.status !== f.ERROR ? void(d.displayVerification = !0) : void(d.error = g.SAVE_ERROR)
                        },
                        e = function() {
                            return d.shouldVerify && d.inputStatus.verification.status !== f.ERROR ? void(d.displayVerification = !1) : void(d.error = g.VERIFICATION_ERROR)
                        };
                    b(function() {
                        return h = !1, d.inputStatus[a].isAnimating = !1, "save" === a ? void c() : void("verification" === a && e())
                    })
                };
                e.find(".save-form .loader")[0].addEventListener("webkitAnimationEnd", k.bind(null, "save"), !1), e.find(".save-form .loader")[0].addEventListener("animationend", k.bind(null, "save"), !1), e.find(".verification-form .loader")[0].addEventListener("webkitAnimationEnd", k.bind(null, "verification"), !1), e.find(".verification-form .loader")[0].addEventListener("animationend", k.bind(null, "verification"), !1);
                var l = [9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 45, 47, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];
                d.onKeyDown = function(a) {
                    -1 === l.indexOf(a.keyCode) && (h = !0, d.error = "")
                }, d.errorTextTranslator = function(a) {
                    switch (a) {
                        case g.VERIFICATION_ERROR:
                            return "Could not verify. Try another code?";
                        case g.SAVING_ERROR:
                            return "Could not save. Please try again later.";
                        case g.INPUT_ERROR:
                            return "Please enter a value"
                    }
                };
                var m = function(a) {
                    return 0 === a.length ? !1 : !0
                };
                d.shouldShowSaveButton = function() {
                    return m("" + d.model) ? d.inputStatus.save.isAnimating || d.inputStatus.verification && d.inputStatus.verification.isAnimating ? !1 : h ? !0 : !1 : !1
                }, d.shouldShowResetButton = function() {
                    return d.inputStatus.save.isAnimating || d.inputStatus.verification && d.inputStatus.verification.isAnimating ? !1 : h ? !0 : !1
                }, d.save = function() {
                    if (!m("" + d.model)) return void(d.error = g.INPUT_ERROR);
                    d.inputStatus.save.status = f.SAVING, d.inputStatus.save.isAnimating = !0;
                    var a = d.model.trim();
                    return d.saveFn(a).then(function() {
                        d.inputStatus.save.status = f.SAVED, d.shouldVerify || (i = d.model)
                    }, function() {
                        d.inputStatus.save.status = f.ERROR
                    }).catch(function() {
                        d.inputStatus.save.status = f.ERROR
                    })
                }, d.verify = function() {
                    var b = {};
                    return b[d.type] = {
                        value: d.model.trim(),
                        verificationCode: d.verificationCode
                    }, d.inputStatus.verification.isAnimating = !0, d.inputStatus.verification.status = f.VERIFYING, d.verificationFn(b).then(function() {
                        d.inputStatus.verification.status = f.SAVED, i = d.model
                    }, function() {
                        d.inputStatus.verification.status = f.ERROR
                    }).catch(function() {
                        return d.inputStatus.verification.status = f.ERROR, a.reject()
                    })
                }
            }
        }
    }]), angular.module("videoconference").directive("onDragChange", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                var d = 0,
                    e = function(b) {
                        return function(e) {
                            e.stopPropagation(), e.preventDefault();
                            var f = d;
                            d += b ? 1 : -1;
                            var g = d > 0;
                            f && d || a.$apply(function() {
                                var b = c.onDragChange && a[c.onDragChange];
                                b && b(g)
                            })
                        }
                    };
                b.bind("dragenter", e(!0)), b.bind("dragleave", e(!1))
            }
        }
    }), angular.module("videoconference").directive("onDragDrop", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                var d = c.onDragDrop && a[c.onDragDrop];
                b.bind("dragover", function(a) {
                    a.preventDefault()
                }), b.bind("drop", function(b) {
                    b.stopPropagation(), b.preventDefault(), a.$apply(function() {
                        var a = b.originalEvent.dataTransfer && b.originalEvent.dataTransfer.files;
                        d && d(a && a[0])
                    })
                })
            }
        }
    }), angular.module("videoconference").directive("countryCodeDropdown", ["GeoLookup", "countryCodeLookup", function(a, b) {
        return {
            restrict: "E",
            templateUrl: "/templates/partials/country-code-dropdown.html",
            replace: !0,
            scope: {
                countryCode: "=",
                phoneNumber: "=?"
            },
            link: function(c) {
                return c.countryCodes = b.getCountryList(), c.phoneNumber ? void b.fetchCountryCodeForPhoneNumber(c.phoneNumber).then(function(a) {
                    c.country = b.getCountryFromCountryCode(a.data.countryCode), c.countryCode = c.country.calling_code, c.phoneNumber = c.phoneNumber.substring(c.country.calling_code.length)
                }) : void a.get().then(function(a) {
                    c.country = b.getCountryFromCountryCode(a), c.countryCode = c.country.calling_code
                })
            },
            controller: ["$scope", function(a) {
                a.changeHandler = function() {
                    a.countryCode = a.country.calling_code
                }
            }]
        }
    }]), angular.module("videoconference").directive("loadingAnimation", function() {
        return {
            templateUrl: "/templates/partials/loading-animation.html",
            restrict: "E",
            replace: !0,
            scope: {}
        }
    }), angular.module("videoconference").directive("includeReplace", function() {
        return {
            require: "ngInclude",
            restrict: "A",
            link: function(a, b) {
                b.replaceWith(b.children())
            }
        }
    }), angular.module("videoconference").directive("mobileToolbar", function() {
        return {
            templateUrl: "/templates/partials/mobile-toolbar.html",
            restrict: "E",
            replace: !0,
            scope: {},
            controller: ["$scope", "RoomService", "modalService", "$timeout", "features", "User", function(a, b, c, d, e, f) {
                a.modalService = c, a.RoomService = b, a.features = e, a.User = f, a.isVisible = !1;
                var g, h = function(b) {
                    b || (b = 2e3), d.cancel(g), a.isVisible && (g = d(function() {
                        a.isVisible = !1
                    }, b))
                };
                a.onclick = function() {
                    a.isVisible = !a.isVisible, h(4e3)
                }, a.toggleAudio = function() {
                    h(), b.setLocalAudioEnabled(!b.getLocalClient().isAudioEnabled)
                }, a.toggleVideo = function() {
                    h(), b.setLocalVideoEnabled(!b.getLocalClient().isVideoEnabled)
                }, a.toggleRoomLock = function() {
                    h(), b.setAndBroadcastNewRoomLockStatus()
                }, a.startLoginFromContacts = function() {
                    c.toggleModal("login"), c.addEventListener("login", "close", function() {
                        return f.isLoggedIn ? void c.openModal("contacts") : void c.removeEventListener("login", "close")
                    })
                }
            }]
        }
    }), angular.module("videoconference").controller("errorController", ["$scope", "$routeParams", "RoomName", function(a, b, c) {
        a.errorName = b.errorName, a.origin = b.origin, a.roomNameRequirements = c.requirements
    }]), angular.module("videoconference").controller("webRtcErrorController", ["$scope", "$routeParams", "$location", "browserSupport", function(a, b, c, d) {
        var e = b.origin;
        return a.webRtcDetectedBrowser = d.webRtcDetectedBrowser, a.isWebRtcEnabled = d.isWebRtcEnabled(), e && d.isWebRtcEnabled() ? void c.url(e) : void 0
    }]), angular.module("videoconference").controller("frontpageController", ["$scope", "$http", "$rootScope", "$i18next", "Analytics", "features", function(a, b, c, d, e, f) {
        e.helpers.recordVisitedFrontpage({
            renderedLanguage: d.options.lng,
            browserLanguage: navigator.language,
            userAgent: navigator.userAgent
        }), c.controller = "frontpage", a.$on("$destroy", function() {
            c.controller = ""
        }), f.lng && (d.options.lng = f.lng)
    }]), angular.module("videoconference").controller("informationController", [function() {}]), angular.module("videoconference").controller("feedbackController", ["$scope", "$routeParams", "Analytics", "$http", function(a, b, c, d) {
        a.message = "", a.status = "", a.feedback = "", a.email = "", a.roomName = b.roomName || "UNKNOWN", a.numberOfClients = b.numberOfClients || "UNKNOWN", a.detectedBrowser = b.detectedBrowser || "UNKNOWN", a.disableSubmit = function() {
            return !a.email || !a.feedback
        }, a.sendFeedback = function() {
            if (!a.disableSubmit()) {
                c.sendEvent(c.events.SENT_FEEDBACK), a.message = "", this.email && 0 === this.email.length && (this.email = "Anonymous");
                var b = a.emailOptOut ? "\n\nThe user does not want to be contacted!\n\n" : "",
                    f = this.feedback + "\n\n" + this.email + b + "\n\n\n" + e();
                d.post("/feedback", {
                    text: f,
                    from: this.email,
                    subject: "User Feedback from " + this.email
                }).success(function() {
                    a.message = "Thank you! You are an amazing and beautiful person!", a.status = "success"
                }).error(function() {
                    a.message = "We are terribly sorry, but it seems something went wrong when we tried to send your feedback. Mind sending it to feedback@appear.in instead?"
                })
            }
        };
        var e = function() {
            var b = "Room name: " + a.roomName,
                c = "Detected browser: " + a.detectedBrowser,
                d = "User agent :" + navigator.userAgent,
                e = "Client count: " + a.numberOfClients,
                f = "Identity: " + (KM ? KM.i() : "no identity set");
            return b + "\n" + c + "\n" + d + "\n" + e + "\n" + f
        }
    }]), angular.module("videoconference").controller("roomController", ["$scope", "$routeParams", "serverSocket", "$timeout", "$location", "$rootScope", "RoomService", "Event", "State", "Analytics", "$window", "$log", "splitscreenRefresher", "splitscreenElements", "splitscreenLayouts", "RoomName", "isEmbedded", "browserSupport", "chromeExtension", "inRoomNotificationService", "RoomAdminPanel", "$i18next", "features", "notificationUpseller", "screenShareExtension", "MessageEventService", "modalService", "User", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B) {
        var C = e.search() || {},
            D = function(a) {
                return a.replace(e.protocol() + "://", "")
            };
        a.features = w, a.modalService = A, a.User = B;
        var E = function(a) {
            return a.split("?")[0]
        };
        if (g.roomName = p.normalize(e.path()), j.helpers.recordVisitedRoom({
                roomName: g.roomName,
                renderedLanguage: v.options.lng,
                browserLanguage: navigator.language,
                userAgent: navigator.userAgent
            }), "ios" === r.webRtcDetectedBrowser) {
            var F = function(a, b, c) {
                    var d, e = function() {
                        clearTimeout(d), k.location.replace(c)
                    };
                    k.location.href = a, window.addEventListener("pageshow", e, !1), window.addEventListener("pagehide", e, !1), d = setTimeout(function() {
                        k.location.replace(b)
                    }, 2e3)
                },
                G = "appearin:/" + e.url(),
                H = k.location.origin + "/information/ios",
                I = k.location.origin;
            return void F(G, H, I)
        }
        if (!r.isWebRtcEnabled()) {
            j.sendEvent(j.events.ERROR_WEBRTC), c.disconnectOnConnect();
            var J = e.url();
            return void e.path("/error/webrtc").search({
                origin: J
            })
        }
        var K = C.key;
        if (K) {
            try {
                var L = JSON.parse(decodeURIComponent(escape(k.atob(K))));
                g.setRoomToken(L)
            } catch (M) {}
            return void e.path(g.roomName).search({})
        }
        k.addEventListener("unload", function() {
            j.sendEvent(j.events.CLOSED_TAB)
        });
        var N = {
            NORMAL: "normal",
            SUPERSIZE: "supersize"
        };
        if (a.viewmode = N.NORMAL, a.toggleViewMode = function() {
                return a.viewmode === N.NORMAL ? void(a.viewmode = N.SUPERSIZE) : void(a.viewmode = N.NORMAL)
            }, a.supersizedClient = {}, a.supersizeClient = function(b) {
                if (b !== a.localClient) {
                    if (!w.isNewSuperSize) return void ab(b);
                    if (b === a.supersizedClient) return b.isSuperSized = !1, a.supersizedClient = {}, void(a.viewmode = N.NORMAL);
                    a.supersizedClient.isSuperSized = !1, a.supersizedClient = b, b.isSuperSized = !0, a.viewmode = N.SUPERSIZE
                }
            }, a.RoomAdminPanel = u, a.RoomService = g, C.resetToken) return void e.search("resetToken", null).path("/error/invalid-link");
        a.roomState = "", a.showScreenShareInstallInstructions = !1, a.localClient = null;
        var O = w.isVideoDisabledByDefault,
            P = w.isAudioDisabledByDefault;
        a.localClientId = "", a.clients = g.clients, a.selfStream = g.selfStream, a.isAudioDisabled = !1, a.isScreenshareEnabled = !1, a.isArrowVisibleRoomEnter = !q, a.isArrowVisibleHover = !1, f.controller = "room", a.$watch(function() {
            return g.clients.length
        }, function(a) {
            2 > a ? x.cancelIfScheduled() : x.scheduleIfNotScheduled(constants.UPSELL.DELAY_AFTER_IN_CONVERSATION)
        }), a.hideArrow = function() {
            d(function() {
                a.isArrowVisibleRoomEnter = !1
            }, 1e4)
        }, a.openClaimPanelFromPromotion = function() {
            u.open(), j.sendEvent(j.events.CLAIM_MODAL_OPENED_FROM_PROMOTION)
        }, a.exitRoom = function() {
            j.sendEvent(j.events.LEFT_USING_LEAVE_BUTTON), g.leaveRoom(), a.roomState = i.EXITED
        }, a.openPopupForType = function(b) {
            var c = "/information";
            switch (b) {
                case "feedback":
                    c += "/feedback";
                    var d = "?tab=" + b + "&roomName=" + g.roomName + "&numberOfClients=" + Object.keys(g.clients).length + "&detectedBrowser=" + a.webRtcDetectedBrowser;
                    c += d;
                    break;
                case "tos":
                    c += "/tos";
                    break;
                default:
                    c = "/"
            }
            k.open(c, "", "height=500,width=500,resizable=yes,scrollable=yes,scrollbars=yes")
        }, a.url = decodeURI(D(e.absUrl())), a.urlWithoutFeatures = decodeURI(E(a.url));
        var Q = !1;
        a.screenShareDenied = !1, a.shareRoomActive = !1, a.isFullScreen = !1, a.backgroundStyle = {}, a.isRoomCreator = "frontpageController" === f.previousController, q = q || w.isLiteModeEnabled, a.cursorHidden = !0, a.isEmbedded = q, a.isKnockEnabled = w.isKnockEnabled, a.extension = s, a.installInstructions = {
            show: !1,
            type: ""
        }, a.$on(h.EXTENSION_INSTALL, function(b, c) {
            switch (c.state) {
                case "started":
                    a.installInstructions = {
                        show: !0,
                        type: c.installReason
                    };
                    break;
                case "installed":
                    a.installInstructions = {
                        show: !1,
                        type: ""
                    };
                    break;
                case "error":
                    a.installInstructions = {
                        show: !1,
                        type: ""
                    };
                    break;
                case "loaded":
            }
        }), a.$on(h.EXTENSION_INSTALL, function(a, b) {
            var c = "extension-installed-notifications";
            "notification" === b.installReason && "loaded" === b.state && t.setNotification({
                id: c,
                type: "info",
                displayDurationMillis: 4e3,
                templateUrl: "/templates/partials/" + c + ".html"
            })
        }), a.splashScreenClickHandler = function() {
            a.roomState = i.WAITING_FOR_CONNECTION
        };
        var R, S = function() {
                a.cursorHidden = !0
            },
            T = 0,
            U = 0;
        a.showCursor = function(b) {
            var c = Math.abs(b.clientX - T),
                e = Math.abs(b.clientY - U);
            (c > 1 || e > 1) && (a.cursorHidden = !1, d.cancel(R), R = d(S, 3e3)), T = b.clientX, U = b.clientY
        };
        var V = {
            LARGE: "large",
            SMALL: "small"
        };
        a.localVideoViewState = V.LARGE, a.getNumberOfConnectedClients = function() {
            return _.filter(a.clients, function(a) {
                return !a.isChatOnly
            }).length
        }, a.webRtcDetectedBrowser = r.webRtcDetectedBrowser, a.userAgent = {}, -1 !== k.navigator.userAgent.indexOf("Macintosh") && (a.userAgent.os = "macintosh"), -1 !== k.navigator.userAgent.indexOf("Windows") && (a.userAgent.os = "windows"), -1 !== k.navigator.userAgent.indexOf("Android") ? (a.userAgent.device = "phone", a.userAgent.os = "android") : a.userAgent.device = "desktop", a.$watch("roomState", function(b) {
            switch (b) {
                case i.WAITING_FOR_CONNECTION:
                    c.connect();
                    var e = f.$on("connected", function() {
                        a.roomState = i.WAITING_FOR_ACCESS, e()
                    });
                    break;
                case i.WAITING_FOR_ACCESS:
                    $();
                    break;
                case i.WAITING_FOR_ROOM_INFORMATION:
                    g.getRoomInformation();
                    break;
                case i.READY:
                    (O || "true" === k.sessionStorage.localVideoMuted) && g.setLocalVideoEnabledByUser(!1), (P || "true" === k.sessionStorage.localAudioMuted) && g.setLocalAudioEnabled(!1), X(), d(function() {
                        m.refreshLayout()
                    }, 0)
            }
        }), a.$watch(function() {
            return g.backgroundImageUrl
        }, function(b) {
            a.backgroundStyle = b ? {
                background: "url('" + b + "') no-repeat",
                "background-size": "cover"
            } : {}
        });
        var W = !1;
        a.$watch(function() {
            return g.isSelfOwner
        }, function(a) {
            var b = "reclaim-successful-notification";
            g.isReclaiming && a && !W && (W = !0, t.setNotification({
                id: b,
                type: "info",
                displayDurationMillis: 4e3,
                templateUrl: "/templates/partials/" + b + ".html"
            }))
        }), a.$watch(g.isOwnerSummonable, function(b) {
            var c = a.getModal("summonOwner");
            b ? c.hasOpened || c.open() : c.close()
        }), a.summonOwner = function() {
            g.summonOwner().then(function() {
                a.ownerWasSummoned = !0, d(function() {
                    a.closeModal("summonOwner")
                }, 3e3)
            }).catch(function(b) {
                a.summonOwnerError = b
            })
        }, a.alreadyOwnerHandler = function() {
            A.openModal("login"), a.closeModal("summonOwner")
        }, c.$on("connect_failed", function() {
            a.roomState !== i.READY && (j.sendEvent(j.events.ERROR_CONNECTION), e.path("/error/connection"))
        });
        var X = function() {
            a.localClientId = g.selfId, a.localClient = g.getLocalClient(), a.clients = g.clients
        };
        a.modalActive = !1, a.closeModal = function(b) {
            var c = a.modals[b];
            return c ? void c.close() : void l.warn("Could not find a modal with name " + b)
        }, a.getModal = function(b) {
            return a.modals[b]
        }, a.openModal = function(b, c) {
            var d = a.modals[b];
            return d ? void d.open(c) : void l.warn("Could not find a modal with name " + b)
        };
        var Y = function(a) {
            var b = {
                attrs: {}
            };
            angular.extend(this, angular.extend(b, a))
        };
        Y.prototype.open = function(b) {
            a.modalActive = !0, this.hasOpened || (j.helpers.recordModalOpened(this.name), this.hasOpened = !0), this.isOpen = !0, b && (this.onClose = b.onClose, this.attrs = b || {})
        }, Y.prototype.close = function() {
            a.modalActive = !1, this.isOpen = !1, this.onClose && (this.onClose(), this.onClose = void 0)
        }, a.modals = {
            allowScreenShareInstructions: new Y({
                name: constants.Modals.SCREENSHARE_INSTRUCTIONS,
                hasOpened: !1,
                isOpen: !1
            }),
            knockers: new Y({
                name: constants.Modals.DISPLAYED_KNOCKER,
                hasOpened: !1,
                isOpen: !1
            }),
            summonOwner: new Y({
                name: constants.Modals.SUMMON_OWNER,
                hasOpened: !1,
                isOpen: !1
            }),
            recovery: new Y({
                name: constants.Modals.DISPLAYED_RECOVERY,
                hasOpened: !1,
                isOpen: !1
            })
        }, a.toggleLocalVideoLarge = function() {
            a.localVideoViewState === V.LARGE ? a.localVideoViewState = V.SMALL : a.localVideoViewState === V.SMALL && (a.localVideoViewState = V.LARGE)
        }, a.$on(h.EXTENSION_INSTALL, function(a, b) {
            "screenShare" === b.installReason && "loaded" === b.state && y.shareScreen()
        }), a.$on("screenShareExtension:share-screen", function(a, b) {
            return b ? void window.getUserMedia({
                audio: !1,
                video: {
                    mandatory: {
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height,
                        maxFrameRate: 3,
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: b
                    }
                }
            }, function(a) {
                g.shareScreen(a), l.log("Success setting up screen share with stream: %o", a)
            }, function(a) {
                l.log("Error setting up screen share %o", a)
            }) : void l.log("User cancelled screen share")
        }), a.$on("share-screen-help-needed", function() {
            a.openModal("allowScreenShareInstructions")
        }), a.$on(h.NEW_CLIENT, function() {
            window.playVideoHack()
        });
        var Z = function() {
            if (1 === a.clients.length) return !0;
            var b = a.clients.length;
            return _.each(a.clients, function(a) {
                return a.isLocalClient || a.isChatOnly ? void(a.isChatOnly && b--) : !1
            }), 1 === b ? !0 : !1
        };
        a.$on(h.CLIENT_LEFT, function(b, c) {
            return Z() ? w.isNewSuperSize ? (angular.element(".room-wrapper").removeClass("enlarged-view"), a.supersizedClient = {}, void(a.viewmode = N.NORMAL)) : (a.setCurrentCategory("default"), void angular.element(".room-wrapper").removeClass("enlarged-view")) : (c.clientId === a.supersizedClient.id && w.isNewSuperSize && (a.supersizedClient = _.find(a.clients, function(b) {
                return b.isChatOnly ? !1 : b.id !== a.localClientId
            })), void window.playVideoHack())
        }), a.$on(h.CLIENT_KICKED, function() {
            a.roomState = i.KICKED
        }), a.$on(h.ROOM_JOINED, function(b, c) {
            if (c && c.error) switch (c.error) {
                case protocol.err.ROOM_LOCKED:
                    j.sendEvent(j.events.ROOM_LOCKED), g.isLocked = c.isLocked, g.isClaimed = c.isClaimed, a.roomData = g.roomData, a.roomState = i.ROOM_LOCKED;
                    break;
                case protocol.err.ROOM_FULL:
                    j.sendEvent(j.events.ROOM_FULL), g.isClaimed = c.isClaimed, a.roomState = i.ROOM_FULL;
                    break;
                case protocol.err.INVALID_ROOM_NAME:
                    j.sendEvent(j.events.ROOM_INVALID), k.location = "/error/invalid-room";
                    break;
                default:
                    l.warn("Unhandled error from JOIN_ROOM: %s", c.error)
            } else window.playVideoHack(), a.roomState = i.READY
        }), a.toggleFullScreen = function() {
            if (a.isFullScreen) cancelFullScreen(), a.isFullScreen = !1;
            else {
                var b = document.body;
                getFullScreen(b), a.isFullScreen = !0
            }
            Q || (j.sendEvent(j.events.USED_FULL_SCREEN), Q = !0)
        };
        var $ = function() {
            a.roomState = i.PLEASE_GRANT_ACCESS, k.getUserMedia({
                video: !O,
                audio: !0
            }, function(b) {
                k.localStorageAdapter("client", "cameraAccessGranted", !0), d(function() {
                    g.selfStream = b, a.roomState = i.WAITING_FOR_ROOM_INFORMATION
                })
            }, function() {
                d(function() {
                    a.roomState = i.CAMERA_ACCESS_DENIED
                })
            })
        };
        window.playVideoHack = function() {
            angular.element("video").each(function(a, b) {
                d(function() {
                    b.play()
                }, 50)
            })
        }, a.$on("$destroy", function() {
            g.leaveRoom();
            var a = angular.element(document).find("body")[0];
            a.style.display = "none", a.offsetHeight = a.offsetHeight, a.style.display = "block", f.controller = ""
        }), a.getCategories = o.getCategories, a.getCurrentCategory = o.getCurrentCategory, a.setCurrentCategory = o.setCurrentCategory;
        var ab = function(a) {
            angular.element(".enlarged").removeClass("enlarged"), "enlarged" === o.getCurrentCategory() && a.id === n.getCurrentEnlarged() ? (angular.element(".room-wrapper").removeClass("enlarged-view"), o.setCurrentCategory("default"), n.putLocalVideoInCorrectPlace()) : (n.prepareEnlarge(a.id), o.setEnlargeView())
        };
        if (a.getCurrentEnlarged = function() {
                return n.getCurrentEnlarged()
            }, a.navigateToFrontPage = function() {
                window.location.href = "/"
            }, a.roomState = q ? i.SPLASH_SCREEN : i.WAITING_FOR_CONNECTION, a.kahootStyle = w.isKahoot, w.isKahoot) {
            a.kahootWidgetOpen = !0, z.addEventListener("closeDialog", function() {
                a.kahootWidgetOpen = !1
            });
            var bb = function() {
                g.sendClientMetadata({
                    type: "kahoot",
                    payload: {
                        host: {
                            id: g.selfId
                        }
                    }
                })
            };
            f.$on(h.NEW_CLIENT, bb), f.$on(h.ROOM_JOINED, bb), e.search("kahoot", null)
        }
        f.$on(h.CLIENT_METADATA_RECEIVED, function(b, c) {
            switch (c.type) {
                case "kahoot":
                    var d = g.getClient(c.payload.host.id);
                    if (a.supersizedClient && a.supersizedClient === d) break;
                    a.kahootStyle = !0, a.supersizeClient(d);
                    break;
                case "UserData":
                    var e = _.find(a.clients, function(a) {
                        return a.id === c.payload.clientId
                    });
                    e.userData = c.payload
            }
        })
    }]), angular.module("videoconference").controller("chromeNotifierController", ["$scope", "extensionNotificationSignup", "chromeExtension", "Event", function(a, b, c, d) {
        a.extensionNotificationSignup = b, a.followingUiModel = {
            installingOrFollowingRoom: c.isRoomFollowed
        }, a.$on(d.EXTENSION_INSTALL, function(b, c) {
            a.followingUiModel.installingOrFollowingRoom = "started" === c.state || "installed" === c.state || "loaded" === c.state
        }), a.$watch(function() {
            return c.isRoomFollowed
        }, function(b) {
            a.followingUiModel.installingOrFollowingRoom = b
        })
    }]), angular.module("videoconference").factory("MessageEventService", ["$rootScope", function(a) {
        var b = {},
            c = {};
        return b.addEventListener = function(a, b) {
            c[a] = b
        }, window.addEventListener("message", function(b) {
            if (void 0 !== b.data) {
                var d;
                d = "string" == typeof b.data ? b.data : b.data.type, c[d] && a.$apply(function() {
                    c[d](b)
                })
            }
        }, !1), b
    }]), angular.module("videoconference").factory("avatarProvider", ["RoomService", "$document", "Snapshooter", "serverSocket", "chromeExtension", function(a, b, c, d, e) {
        return {
            getAvatar: function() {
                var f = a.getLocalClient();
                if (!f || !f.isVideoEnabled) return null;
                var g = b[0].getElementById(d.getSelfId()),
                    h = c.takeSnapshot(g, 80, 60, 1500);
                return e.sendAvatarData({
                    avatar: h
                }), h
            },
            setAvatar: function() {}
        }
    }]), angular.module("videoconference").factory("inRoomNotificationService", function() {
        var a = null,
            b = [];
        return {
            setNotification: function(b) {
                a = b, b && (b.requiresAction = !1, b.isVisible = !0, b.displayDurationMillis = b.displayDurationMillis || 2e3)
            },
            getNotification: function() {
                return a
            },
            getCurrentActionRequired: function() {
                return b[0]
            },
            addActionRequired: function(a) {
                this.removeActionRequiredById(a.id), a.requiresAction = !0, a.isVisible = !0, b.push(a)
            },
            removeCurrentActionRequired: function() {
                if (b.length < 1) return null;
                var a = b[0];
                return b.splice(0, 1), a
            },
            removeActionRequiredById: function(a) {
                b = b.filter(function(b) {
                    return b.id !== a
                })
            }
        }
    }), angular.module("videoconference").factory("tokenStore", ["$window", function(a) {
        var b = {};
        return b.storeRoomToken = function(b, c) {
            a.localStorageAdapter && (a.localStorageAdapter(b, "key", void 0), a.localStorageAdapter(b, "token", c))
        }, b.fetchRoomToken = function(b) {
            return a.localStorageAdapter(b, "key") || a.localStorageAdapter(b, "token")
        }, b
    }]), angular.module("videoconference").factory("RoomService", ["RTCManager", "serverSocket", "Event", "Client", "Stream", "$window", "$rootScope", "$q", "$http", "$log", "Analytics", "browserSupport", "ConnectionStatus", "inRoomNotificationService", "Knocker", "screenShareExtension", "tokenStore", "PeerFactory", "features", "User", "appearinApi", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
        function v() {
            x.selfId = "", x.clients = [], x.knockers = [], x.roomData = {}, x.roomName = "", x.selfStream = void 0, x.backgroundImageUrl = void 0, x.isSelfOwner = !1, x.isSelfMember = !1, x.isMigrated = !1, x.hasOwnerId = !1, x.sessionKey = void 0, x.isReclaiming = !1, w = void 0
        }
        var w, x = {},
            y = function() {
                if (t.isLoggedIn) {
                    var a = {
                        type: "UserData",
                        payload: {
                            clientId: x.selfId,
                            displayName: t.data.displayName,
                            avatarUrl: t.data.avatarUrl
                        }
                    };
                    b.emit(protocol.req.SEND_CLIENT_METADATA, a)
                }
            };
        v(), x.getClientType = function(a) {
            var b = x.getClient(a);
            return b.isOwner ? "owner" : b.isMember ? "member" : "client"
        }, x.setRoomMembers = function(a) {
            b.emit(protocol.req.SET_MEMBERS, {
                members: a
            })
        }, x.getRoomMembers = function() {
            return x.roomData.members ? x.roomData.members.join(", ") : ""
        }, x.getLocalClient = function() {
            return w
        }, x.hasChatOnlyClients = function() {
            return _.find(x.clients, function(a) {
                return a.isChatOnly
            })
        }, x.hasWatchersOtherThan = function(a) {
            return !!x.roomData.subscriberCount || !!x.roomData.watchers && x.roomData.watchers.some(function(b) {
                return b !== a
            })
        }, x.shareScreen = function(c) {
            x.setLocalVideoEnabled(!1), w.newStream(e.type.SCREEN_SHARE, c.id).setup(c), w.isScreenSharingEnabled = !0, c.onended = function() {
                g.$apply(function() {
                    b.emit(protocol.req.END_STREAM, {
                        endedStream: c.id
                    }), w.isScreenSharingEnabled = !1, w.removeStreamByType(e.type.SCREEN_SHARE), a.removeStream(c.id, c), w.userHasExplicitlyDisabledVideo || x.setLocalVideoEnabled(!0)
                })
            }, b.emit(protocol.req.START_NEW_STREAM, {
                streamId: c.id
            }), a.addNewStream(c.id, c)
        }, x.setLocalAudioEnabled = function(a) {
            b.emitIfConnected(protocol.req.ENABLE_AUDIO, {
                enabled: a
            }), w.setAudioEnabled(a), k.helpers.recordAudioEnabled(a), f.sessionStorage.localAudioMuted = !a
        };
        var z = function(a, c) {
            w.isScreenSharingEnabled || (b.emitIfConnected(protocol.req.ENABLE_VIDEO, {
                enabled: a
            }), w.setVideoEnabled(a), k.helpers.recordVideoEnabled(a), c && (f.sessionStorage.localVideoMuted = !a, w.userHasExplicitlyDisabledVideo = !a))
        };
        x.setLocalVideoEnabledByUser = function(a) {
            z(a, !0)
        }, x.setLocalVideoEnabled = function(a) {
            z(a, !1)
        }, x.isScreenShareSupported = function() {
            return w.capabilities.screen_share && p.canInstall() ? !0 : !1
        }, x.setLocalScreenShareEnabled = function(a, b) {
            return w.capabilities.screen_share ? (k.hasSharedScreen || (k.sendEvent(k.events.USED_SCREEN_SHARE), k.hasSharedScreen = !0), a ? p.hasExtension ? void p.shareScreen() : !p.hasExtension && p.canInstall() ? void p.triggerInstall({
                reason: "screenShare"
            }) : void window.getUserMedia({
                video: {
                    mandatory: {
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height,
                        maxFrameRate: 3,
                        chromeMediaSource: "screen"
                    }
                }
            }, x.shareScreen, b) : void w.stopScreenShare()) : void 0
        }, g.$on(m.event.CLIENT_CONNECTION_STATUS_CHANGED, function(a, b) {
            var c = x.getClient(b.clientId);
            if (c) return c.isLocalClient ? void j.error("CLIENT_CONNECTION_STATUS_CHANGED events should not go to the local client!") : void c.setStatus(b)
        }), g.$on(m.event.CLIENT_CONNECTION_STATUS_CHANGED, function(a, b) {
            var d = C(b.clientId);
            d && (d.setStatus(b), g.$broadcast(c.KNOCKER_STATUS_CHANGED, {
                knocker: d,
                status: b.status,
                previous: b.previous
            }))
        }), g.$on(m.event.STREAM_ADDED, function(a, b) {
            var c = C(b.clientId);
            c && c.newStream().setup(b.stream).setAudioEnabled(!1)
        }), g.$on(m.event.STREAM_ADDED, function(a, b) {
            var c = x.getClient(b.clientId);
            if (c) {
                var d = c.getStream(b.stream.id);
                d || (d = c.getStream(0)), d.setup(b.stream, b.streamExtraId)
            }
        }), x.claimRoomWithREST = function(a) {
            return u({
                method: "POST",
                url: "/room/claim",
                data: {
                    roomName: a
                }
            }).then(function() {
                k.helpers.recordRoomClaimed(!0, x.roomName), x.isClaimed && k.sendEvent(k.events.CLIENT_BECAME_OWNER)
            })
        }, x.claimRoomWithSocket = function(a) {
            return a && a.email && (x.email = a.email, a.wantsNewsletter && i.post("/mail-subscribe/fcc8f9fc1a", {
                email: a.email
            })), b.promiseEmit(protocol.req.CLAIM_ROOM, protocol.res.OWNERS_CHANGED, a)
        }, x.claimRoom = function(a) {
            if (t.isLoggedIn) {
                var b = a && a.roomName || x.roomName;
                return x.claimRoomWithREST(b)
            }
            return x.claimRoomWithSocket(a)
        }, x.sendResetEmail = function() {
            b.emit(protocol.req.SEND_RESET_EMAIL, {
                roomName: x.roomName
            })
        }, x.setAndBroadcastNewRoomLockStatus = function() {
            x.isAllowedToLock() && b.emit(protocol.req.SET_LOCK, {
                locked: !x.isLocked
            })
        }, x.submitBackgroundImage = function(a) {
            var b = btoa(JSON.stringify(x.getRoomToken()));
            k.sendEvent(k.events.BACKGROUND_IMAGE_SUBMITTED), g.$broadcast("backgroundSent");
            var c = s.userRegistration && t.isLoggedIn ? "/room/background-image" : "/set-background-image";
            return u({
                method: "POST",
                url: c,
                data: {
                    image: a,
                    roomName: x.roomName,
                    roomKey: b
                },
                transformRequest: function(a) {
                    var b = new FormData;
                    return angular.forEach(a, function(a, c) {
                        b.append(c, a)
                    }), b
                },
                headers: {
                    "Content-Type": void 0
                }
            })
        }, x.resetBackgroundImage = function() {
            b.emit(protocol.req.RESET_BACKGROUND_IMAGE)
        }, x.getRoomToken = function() {
            var a = q.fetchRoomToken(x.roomName);
            return x.isReclaiming = x.isReclaiming || a && a.key && "recover" === a.key.type, a
        }, x.setRoomToken = function(a) {
            q.storeRoomToken(x.roomName, a)
        }, x.getRoomInformation = function() {
            if (x.roomName) {
                var a = !!w && w.streams[0],
                    b = {
                        isAudioEnabled: a ? w.streams[0].isAudioEnabled : x.selfStream && x.selfStream.getAudioTracks().length > 0,
                        isVideoEnabled: a ? w.streams[0].isVideoEnabled : x.selfStreeam && x.selfStream.getVideoTracks().length > 0
                    },
                    c = {
                        roomName: x.roomName,
                        token: x.getRoomToken(),
                        sessionKey: x.sessionKey,
                        clientRtcVersion: s.isOldRtcVersionEnabled ? 1 : 2,
                        config: b
                    };
                x.joinRoom(c)
            }
        }, x.joinRoom = function(d) {
            x.selfId && (d.selfId = x.selfId), b.emit(protocol.req.JOIN_ROOM, d).$on(protocol.res.RESET_EMAIL_SENT, function(a) {
                g.$broadcast("reset_email_sent", a)
            }).$once(protocol.res.ROOM_JOINED, function(b) {
                if (x.hasOwnerId = !!b.hasOwnerId, b.isMigrated && (x.isMigrated = b.isMigrated), b.error) return void g.$broadcast(c.ROOM_JOINED, b);
                x.selfStream && a.addNewStream("0", x.selfStream), t.isLoggedIn && d.token && t.migrateRoom(d.roomName), x.roomData = b.room, x.isLocked = b.room.isLocked;
                var f = x.selfId === b.selfId;
                x.selfId = b.selfId, x.isClaimed = b.room.isClaimed, x.addKnockers(b.room.knockers), b.room.backgroundImageUrl && (x.backgroundImageUrl = b.room.backgroundImageUrl), b.token && x.setRoomToken(b.token);
                var h = function(a) {
                    a.isLocalClient = !0, a.setStatus({
                        status: m.status.CONNECTION_SUCCESSFUL
                    }), a.capabilities.video = x.selfStream && 0 !== x.selfStream.getVideoTracks().length, a.isVideoEnabled = a.capabilities.video, a.capabilities.audio = x.selfStream && 0 !== x.selfStream.getAudioTracks().length, a.isAudioEnabled = a.capabilities.audio, "chrome" === l.webRtcDetectedBrowser && -1 === window.navigator.userAgent.indexOf("Android") && (a.capabilities.screen_share = !0), w = a, x.isSelfOwner = w.isOwner, x.isSelfOwner && g.$broadcast(c.OWNERS_CHANGED), x.isSelfMember = w.isMember
                };
                return x.roomData.clients.forEach(function(a) {
                    var c = F(a);
                    if (!f) return a.id === b.selfId ? void h(c) : void a.streams.forEach(function(a) {
                        var b = 0 === a ? e.type.CAMERA : e.type.SCREEN_SHARE;
                        c.newStream(b, a)
                    })
                }), f ? void k.sendEvent(k.events.RECONNECT_TO_ROOM) : (k.helpers.recordEnteredRoom(x.clients.length), G(), K(), A(), y(), void g.$broadcast(c.ROOM_JOINED))
            })
        }, x.addKnockers = function(b) {
            function c(b) {
                var c = new o(b.clientId, b.imageUrl, b.liveVideo);
                b.iceServers && a.accept(b.clientId, b.iceServers, !1), x.knockers.push(c)
            }
            _.each(b, c)
        }, x.removeKnocker = function(b) {
            x.knockers = _.reject(x.knockers, function(a) {
                return b === a.clientId
            }), a.disconnect(b)
        };
        var A = function() {
            b.$on(protocol.res.DEVICE_IDENTIFIED, function() {
                t.isLoggedIn && (w.userId = t.data.userId)
            }).$on(protocol.res.CLIENT_USER_ID_CHANGED, function(a) {
                var b = x.getClient(a.client.id);
                return b ? void E(b, a.client) : void 0
            }).$on(protocol.res.NEW_CLIENT, function(a) {
                k.sendEvent(k.events.NEW_CLIENT_JOINED);
                var b = x.getClient(a.client.id);
                return b ? void E(b, a.client) : (b = new d(a.client), D(b), b.isChatOnly || b.newStream(e.type.CAMERA), y(), void g.$broadcast(c.NEW_CLIENT))
            }).$on(protocol.res.CLIENT_READY, function(b) {
                function c(a) {
                    return a && a.url && a.url.indexOf("turn:") >= 0
                }
                b.iceServers && b.iceServers.iceServers && !b.iceServers.iceServers.some(c) && k.sendEvent(k.events.TURN_SERVER_NOT_SUPPLIED), a.accept(b.clientId, b.iceServers)
            }).$once(protocol.res.CLIENT_KICKED, function(a) {
                return k.sendEvent(k.events.CLIENT_KICKED), x.handleRoomExit(), a.error ? void 0 : void g.$broadcast(c.CLIENT_KICKED, a)
            }).$on(protocol.res.CLIENT_LEFT, function(b) {
                var d;
                x.clients.forEach(function(c, e) {
                    c.id === b.clientId && (a.disconnect(c.id), d = e)
                }), void 0 !== d && x.clients.splice(d, 1), g.$broadcast(c.CLIENT_LEFT, b)
            }).$on(protocol.res.NEW_STREAM_STARTED, function(a) {
                var b = x.getClient(a.clientId);
                if (!b) return void j.error("Client does not exist: " + a.clientId);
                var c = 0 === a.streamId ? e.type.CAMERA : e.type.SCREEN_SHARE;
                b.newStream(c, a.streamId)
            }).$on(protocol.res.STREAM_ENDED, function(a) {
                var b = x.getClient(a.clientId);
                return b ? void b.removeStream(a.streamId) : void j.error("Client does not exist: " + a.clientId)
            }).$on(protocol.res.AUDIO_ENABLED, function(a) {
                var b = x.getClient(a.clientId);
                return b ? void b.setAudioEnabled(a.isAudioEnabled) : void j.error("Client does not exist: " + a.clientId)
            }).$on(protocol.res.VIDEO_ENABLED, function(a) {
                var b = x.getClient(a.clientId);
                return b ? (b.setVideoEnabled(a.isVideoEnabled), void window.playVideoHack()) : void j.error("Client does not exist: " + a.clientId)
            }).$on(protocol.res.OWNERS_CHANGED, function(a) {
                function b(a) {
                    a.isOwner = !0
                }

                function d(a) {
                    x.isClaimed && a === w && k.sendEvent(k.events.CLIENT_BECAME_OWNER)
                }
                if (!a.error) {
                    if (a.deviceId) {
                        var e = x.getClientsByDeviceId(a.deviceId);
                        e.forEach(function(a) {
                            b(a), d(a)
                        }), x.isSelfOwner = w.isOwner
                    }
                    a.token && x.setRoomToken(a.token), !x.isClaimed && a.token && k.helpers.recordRoomClaimed(!!a.token, x.roomName), x.isClaimed = !0, g.$broadcast(c.OWNERS_CHANGED, a)
                }
            }).$on(protocol.res.ROOM_LOCKED, function(a) {
                return a.error && g.$broadcast("room_locked:error", a), void 0 !== a.isLocked && (x.isLocked = a.isLocked), x.isLocked ? void n.setNotification({
                    type: "info",
                    text: "This room is locked. Guests need to knock to enter.",
                    displayDurationMillis: 6e3
                }) : void n.setNotification({
                    type: "info",
                    text: "This room is now unlocked."
                })
            }).$on(protocol.res.ROOM_KNOCKED, function(a) {
                a.error || x.addKnockers([a])
            }).$on(protocol.res.KNOCKER_LEFT, function(a) {
                x.removeKnocker(a.clientId)
            }).$on(protocol.res.BACKGROUND_IMAGE_CHANGED, function(a) {
                a.error || (k.sendEvent(k.events.BACKGROUND_IMAGE_CHANGED), x.backgroundImageUrl = a.image)
            }).$on(protocol.res.SCREEN_ROTATED, function(a) {
                var b = x.getClient(a.clientId);
                return b ? void(b.rotation = a.rotation) : void j.error("Client does not exist: " + a.clientId)
            }).$on("reconnect", function() {
                k.helpers.recordSocketConnection("reconnect", b.getTransport()), x.getRoomInformation()
            }).$on(protocol.res.MEMBERS_SET, function(a) {
                a.error || (x.roomData.members = a.members)
            }).on(protocol.rtc.CREATE_PEER, function(a, b) {
                r.createPeer(a.id, a.configuration, b)
            })
        };
        x.getClient = function(a) {
            return _.findWhere(x.clients, {
                id: a
            })
        }, x.getClientsByDeviceId = function(a) {
            return _.where(x.clients, {
                deviceId: a
            })
        };
        var B = function() {
                return _.findWhere(x.clients, {
                    isOwner: !0
                })
            },
            C = function(a) {
                return _.findWhere(x.knockers, {
                    clientId: a
                })
            },
            D = function(a) {
                x.clients.push(a)
            },
            E = function(a, b) {
                a.setAudioEnabled(!!b.isAudioEnabled), a.setVideoEnabled(!!b.isVideoEnabled), a.name = b.name, a.isOwner = b.isOwner, a.isMember = b.isMember, a.userId = b.userId, a === w && (x.isSelfOwner = a.isOwner, x.isSelfMember = a.isSelfMember, a.userId !== t.data.userId && (a.userId ? t.login() : t.resetState())), a.isOwner && (x.isClaimed = !0, x.hasOwnerId = x.hasOwnerId || null !== a.userId)
            },
            F = function(a) {
                var b = x.getClient(a.id);
                return b ? b.id !== x.selfId && (b = E(b, a)) : (b = new d(a), D(b)), b
            },
            G = function() {
                x.selfStream && w.newStream(e.type.CAMERA).setup(x.selfStream), w.userData = t.data
            },
            H = 60,
            I = null,
            J = !1,
            K = function() {
                I = window.setTimeout(function() {
                    var a = x.clients.length;
                    k.helpers.recordMinuteElapsed(a), !J && a >= 2 && (k.sendEvent(k.events.IN_A_CONVERSATION), J = !0), K()
                }, 1e3 * H)
            },
            L = function() {
                null !== I && window.clearTimeout(I)
            };
        return x.kick = function(a) {
            b.emit(protocol.req.KICK_CLIENT, {
                clientId: a
            })
        }, x.handleRoomExit = function() {
            L(), b.removeAllListeners(), b.disconnect(), a.disconnectAll(), x.selfStream && x.selfStream.stop(), v()
        }, x.leaveRoom = function() {
            x.selfId && (b.emit(protocol.req.LEAVE_ROOM), x.handleRoomExit(), g.$broadcast("leave_room", {
                roomName: x.roomName
            }))
        }, x.summonOwner = function() {
            return x.isAllowedToSummonOwner() ? (k.helpers.recordSummonOwner(), u({
                url: "/room" + x.roomName + "/invite-owner",
                method: "POST"
            })) : void 0
        }, x.isOwnerSummonable = function() {
            return s.userRegistration && !x.isSelfOwner && x.isClaimed && x.hasOwnerId && !B()
        }, x.isAllowedToSummonOwner = x.isOwnerSummonable, x.sendClientMetadata = function(a) {
            b.emit(protocol.req.SEND_CLIENT_METADATA, a)
        }, x.isAllowedToFollow = function() {
            return !x.isClaimed || x.isSelfOwner || x.isSelfMember
        }, x.isAllowedToLock = function() {
            return !x.isClaimed || x.isSelfOwner || x.isSelfMember
        }, x.isAllowedToChangeBackground = function() {
            return x.isSelfOwner || x.isSelfMember
        }, b.$on(protocol.res.CLIENT_METADATA_RECEIVED, function(a) {
            return a && a.type && a.payload ? void g.$broadcast(c.CLIENT_METADATA_RECEIVED, a) : void j.error("Received malformed data.")
        }), x
    }]), angular.module("videoconference").factory("googleAnalytics", [function() {
        var a = {};
        return a.setDimension = function(a, b) {
            window.ga("set", a, b)
        }, a.sendEvent = function(a, b, c, d) {
            window.ga("send", "event", a, b, c, d)
        }, a
    }]), angular.module("videoconference").factory("kissmetrics", ["$q", "features", "$log", function(a, b, c) {
        var d = {};
        return d.identify = function(a) {
            window._kmq.push(["identify", a])
        }, d.clearIdentity = function() {
            window._kmq.push(["clearIdentity"])
        }, d.getId = function() {
            return window.KM && window.KM.i()
        }, d.record = function(a, d) {
            b.isEventLoggingEnabled && c.info("Sent KM event: %o", a), window._kmq.push(["record", a, d])
        }, d.abDeferred = function(b, c, e) {
            var f = a.defer(),
                g = setTimeout(function() {
                    f.reject(e), d.record("AB test call timed out")
                }, 1500);
            return window._kmq.push(function() {
                window.KM.ab(b, c, function(a) {
                    clearTimeout(g), f.resolve(a)
                })
            }), f
        }, d.abPromise = function() {
            return d.abDeferred.apply(null, arguments).promise
        }, d
    }]), angular.module("videoconference").factory("Intercom", ["$log", "features", function(a, b) {
        function c(b, c) {
            return window.Intercom ? void window.Intercom(b, c) : void a.warn("Missing intercom")
        }
        var d = {
            app_id: "c84mcfzg"
        };
        return {
            boot: function(a) {
                c("boot", _.defaults(a, d))
            },
            update: function(a) {
                c("update", a)
            },
            clearData: function() {
                c("shutdown")
            },
            trackEvent: function(d, e) {
                _.keys(e).length > 5 || (b.isEventLoggingEnabled && a.info("Sent IC event: %o", d), c("trackEvent", d, e))
            },
            recordPageChange: function() {
                c("update")
            }
        }
    }]), angular.module("videoconference").factory("Analytics", ["kissmetrics", "googleAnalytics", "Intercom", "AnalyticsEvents", "$log", "features", function(a, b, c, d, e, f) {
        var g = function(a, c) {
                if (!a) throw new Error("Event is required");
                b.sendEvent(a.category, a.action, a.label, c), f.isEventLoggingEnabled && e.info("Sent GA event: %o", a)
            },
            h = function(b) {
                return b && (b.googleAnalytics || b.kissmetrics) ? (b.googleAnalytics && g(b.googleAnalytics), b.kissmetrics && a.record(b.kissmetrics), void(b.intercom && c.trackEvent(b.intercom.eventName, b.intercom.eventData))) : void e.error("The event does not exist")
            },
            i = {
                recordChatHistoryButtonClick: function(a) {
                    var b = a ? d.CHAT_HISTORY_CLOSED_USING_TOGGLE : d.CHAT_HISTORY_OPENED_USING_TOGGLE;
                    h(b)
                },
                recordKickedUser: function(a, b) {
                    var c;
                    switch (a) {
                        case "member":
                            c = b ? d.OWNER_KICKED_MEMBER : d.MEMBER_KICKED_MEMBER;
                            break;
                        case "owner":
                            c = b ? d.OWNER_KICKED_OWNER : d.MEMBER_KICKED_OWNER;
                            break;
                        case "client":
                            c = b ? d.OWNER_KICKED_CLIENT : d.MEMBER_KICKED_CLIENT
                    }
                    h(c)
                },
                recordModalOpened: function(a) {
                    var b;
                    if (a) {
                        switch (a) {
                            case constants.Modals.SCREENSHARE_INSTRUCTIONS:
                                b = d.ALLOW_SCREEN_SHARE_MODAL;
                                break;
                            case constants.Modals.DISPLAYED_KNOCKER:
                                b = d.KNOCKERS_MODAL;
                                break;
                            case constants.Modals.SUMMON_OWNER:
                                b = d.SUMMON_OWNER_MODAL;
                                break;
                            default:
                                var c = a;
                                b = d.OPENED_MODAL(c)
                        }
                        h(b)
                    }
                },
                recordModalClosed: function(a) {
                    var b = d.CLOSED_MODAL(a);
                    h(b)
                },
                recordAudioEnabled: function(a) {
                    var b = a ? d.AUDIO_ENABLED : d.AUDIO_DISABLED;
                    h(b)
                },
                recordVideoEnabled: function(a) {
                    var b = a ? d.VIDEO_ENABLED : d.VIDEO_DISABLED;
                    h(b)
                },
                recordActivePanelAction: function(a, b) {
                    var c;
                    switch (a) {
                        case "admin":
                            c = b ? d.OPENED_ADMIN_PANEL : d.CLOSED_ADMIN_PANEL;
                            break;
                        case "claim":
                            c = b ? d.OPENED_CLAIM_PANEL : d.CLOSED_CLAIM_PANEL;
                            break;
                        case "reclaim":
                            c = b ? d.OPENED_RECLAIM_PANEL : d.CLOSED_RECLAIM_PANEL
                    }
                    h(c)
                },
                recordConnectionType: function(c) {
                    var e = d.CONNECTION_TYPE.googleAnalytics,
                        f = d.CONNECTION_TYPE.kissmetrics + " " + c;
                    b.sendEvent(e.category, e.action, c), a.record(f)
                },
                recordConnectionStatus: function(c) {
                    var e = d.CONNECTION_STATUS.googleAnalytics,
                        f = d.CONNECTION_STATUS.kissmetrics + " " + c;
                    b.sendEvent(e.category, e.action, c), a.record(f)
                },
                recordSendResetEmail: function(c) {
                    var e = d.SENT_RESET_EMAIL.googleAnalytics,
                        f = "Sent from " + (c ? c : "unknown page");
                    b.sendEvent(e.category, e.action, f), a.record(d.SENT_RESET_EMAIL.kissmetrics)
                },
                recordSocketConnection: function(c, f) {
                    var g, h;
                    switch (c) {
                        case "disconnect":
                            g = d.SOCKET_DISCONNECT;
                            break;
                        case "connect":
                            g = d.SOCKET_CONNECT, h = g.kissmetrics + " with protocol " + f;
                            break;
                        case "connect_failed":
                            g = d.SOCKET_CONNECT_FAILED;
                            break;
                        case "reconnect":
                            g = d.SOCKET_RECONNECT;
                            break;
                        case "reconnect_failed":
                            g = d.SOCKET_RECONNECT_FAILED;
                            break;
                        case "error":
                            g = d.SOCKET_ERROR;
                            break;
                        default:
                            return void e.error("No analytics event for connection status :" + c)
                    }
                    a.record(h || g.kissmetrics);
                    var i = g.googleAnalytics;
                    b.sendEvent(i.category, i.action, f)
                },
                recordRoomClaimed: function(b, c) {
                    b ? (a.record(d.CLIENT_CLAIMED_ROOM.kissmetrics, {
                        roomName: c
                    }), g(d.CLIENT_CLAIMED_ROOM.googleAnalytics)) : h(d.ANOTHER_CLAIMED_ROOM)
                },
                recordMemberListChanged: function(a) {
                    var b = d.MEMBERS_KEYS_CHANGED;
                    b.panel = "from " + a + " panel", h(b)
                },
                recordFollowToggle: function(a) {
                    var b;
                    switch (a) {
                        case "upsell":
                            b = d.FOLLOW_TOGGLE_UPSELL;
                            break;
                        case "claim":
                            b = d.FOLLOW_TOGGLE_CLAIM;
                            break;
                        case "topbar":
                            b = d.FOLLOW_TOGGLE_TOPBAR
                    }
                    h(b)
                },
                recordMinuteElapsed: function(a) {
                    b.setDimension("dimension5", a), g(d.MINUTE_ELAPSED.googleAnalytics, a)
                },
                recordVisitedRoom: function(b) {
                    a.record(d.VISITED_ROOM.kissmetrics, b)
                },
                recordVisitedFrontpage: function(b) {
                    a.record(d.VISITED_FRONTPAGE.kissmetrics, b)
                },
                recordFollowRoom: function(b) {
                    a.record(d.FOLLOW_ROOM.kissmetrics, {
                        roomName: b
                    }), g(d.FOLLOW_ROOM.googleAnalytics)
                },
                recordUnfollowRoom: function(b) {
                    a.record(d.UNFOLLOW_ROOM.kissmetrics, {
                        roomName: b
                    }), g(d.UNFOLLOW_ROOM.googleAnalytics)
                },
                recordEnteredRoom: function(b) {
                    b >= 2 ? a.record(d.ENTERED_EXISTING_ROOM.kissmetrics, {
                        numberOfParticipants: b
                    }) : a.record(d.ENTERED_NEW_ROOM.kissmetrics)
                },
                recordWebRTCError: function(c, e) {
                    var f = d.WEBRTC_ERROR.googleAnalytics,
                        g = d.WEBRTC_ERROR.kissmetrics + c;
                    b.sendEvent(f.category, f.action, c, e), a.record(g, {
                        error: "" + e
                    })
                },
                recordFaqArticleId: function(c) {
                    var e = d.OPENED_FAQ_QUESTION.googleAnalytics,
                        f = d.OPENED_FAQ_QUESTION.kissmetrics;
                    b.sendEvent(e.category, e.action, c), a.record(f)
                },
                recordSummonOwner: function() {
                    h(d.SUMMON_OWNER)
                },
                userRegistration: {
                    recordSetActiveState: function(a) {
                        if (a) {
                            var b = angular.copy(d.REGISTRATION.SET_ACTIVE_STATE);
                            b.googleAnalytics.label = "" + a, b.kissmetrics += a, h(b)
                        }
                    },
                    recordSentVerificationCode: function(a) {
                        if (a) {
                            var b = angular.copy(d.REGISTRATION.SENT_VERIFICATION_CODE);
                            b.googleAnalytics.label = "" + a, b.kissmetrics += a, h(b)
                        }
                    },
                    recordAttemptVerifyContactPoint: function(a) {
                        if (a) {
                            var b = angular.copy(d.REGISTRATION.ATTEMPT_VERIFY_CONTACT_POINT);
                            b.googleAnalytics.label = "" + a, b.kissmetrics += a, h(b)
                        }
                    },
                    recordUserCreated: function() {
                        h(d.REGISTRATION.USER_CREATED)
                    },
                    recordNotificationChoice: function(a) {
                        if (a) {
                            var b = _.some(a, _.identity),
                                c = angular.copy(d.REGISTRATION.SUBMITTED_NOTIFICATION_CHOICE);
                            c.googleAnalytics.label = b, c.kissmetrics += b, h(c)
                        }
                    }
                },
                contacts: {
                    recordInviteContact: function(a) {
                        if (a) {
                            var b = angular.copy(d.CONTACTS.INVITE);
                            b.googleAnalytics.label = a, b.kissmetrics += a, h(b)
                        }
                    },
                    recordSavedAsPhoneContact: function() {
                        h(d.CONTACTS.SAVED_AS_PHONE_CONTACT)
                    }
                },
                login: {
                    recordRequestLoginCode: function(a) {
                        if (a) {
                            var b = angular.copy(d.LOGIN.REQUEST_LOGIN_CODE);
                            b.googleAnalytics.label = a, b.kissmetrics += a, h(b)
                        }
                    }
                }
            };
        return {
            sendEvent: h,
            googleAnalytics: b,
            kissmetrics: a,
            events: d,
            helpers: i
        }
    }]), angular.module("videoconference").factory("RTCManager", ["$rootScope", "$timeout", "$log", "Analytics", "ConnectionStatus", "serverSocket", "features", "$interval", function(a, b, c, d, e, f, g, h) {
        function i(a) {
            void 0 === E.peerConnections[a] && (E.peerConnections[a] = {
                iceServers: {},
                iceCandidates: {
                    local: {},
                    remote: {}
                },
                pc: null,
                connectionType: null,
                connectionStatus: null,
                intervalId: null,
                stats: {
                    totalSent: 0,
                    totalRecv: 0
                }
            })
        }

        function j(a) {
            return a in E.peerConnections ? E.peerConnections[a].pc : null
        }

        function k(a) {
            return _.pick(a, "sdp", "type")
        }

        function l(b, c, d) {
            i(b);
            var j = g.disableIPv6ICE ? {} : {
                    optional: [{
                        googIPv6: !0
                    }]
                },
                k = new RTCPeerConnection(c, j);
            E.peerConnections[b].pc = k, k.onnegotiationneeded = function() {
                "new" !== k.iceConnectionState && m(b)
            }, k.onicecandidate = function(a) {
                a.candidate && (o(b, "local", a.candidate.candidate), f.emit(protocol.relay.ICE_CANDIDATE, {
                    receiverId: b,
                    message: a.candidate
                }))
            }, k.onaddstream = function(c) {
                a.$apply(function() {
                    a.$broadcast(e.event.STREAM_ADDED, {
                        clientId: b,
                        stream: c.stream
                    })
                })
            }, k.oniceconnectionstatechange = function() {
                var a;
                switch (k.iceConnectionState) {
                    case "checking":
                        a = e.status.CONNECTING;
                        break;
                    case "connected":
                    case "completed":
                        a = e.status.CONNECTION_SUCCESSFUL, E.peerConnections[b].connectionType || q(b), E.peerConnections[b].intervalId || (E.peerConnections[b].intervalId = h(function() {
                            x(b)
                        }, D));
                        break;
                    case "failed":
                        a = e.status.CONNECTION_FAILED;
                        break;
                    default:
                        return
                }
                n(b, a)
            }, (d || void 0 === d) && Object.keys(E.localStreams).forEach(function(a) {
                k.addStream(E.localStreams[a])
            })
        }

        function m(a) {
            var b = j(a);
            return b ? void b.createOffer(function(e) {
                b.setLocalDescription(e, function() {
                    f.emit(protocol.relay.SDP_OFFER, {
                        receiverId: a,
                        message: k(b.localDescription)
                    })
                }, function(a) {
                    c.warn("RTCPeerConnection.setLocalDescription() failed with local offer", a), d.helpers.recordWebRTCError("set local offer", a)
                })
            }, function(a) {
                c.warn("RTCPeerConnection.createOffer() failed to create local offer", a), d.helpers.recordWebRTCError("create local offer", a)
            }, C) : void c.warn("No RTCPeerConnection in negotiatePeerConnection()", a)
        }

        function n(c, f) {
            var g = E.peerConnections[c].connectionStatus;
            g !== f && g !== e.status.CONNECTION_FAILED && (E.peerConnections[c].connectionStatus = f, d.helpers.recordConnectionStatus(e.analyticsText[f]), b(function() {
                a.$broadcast(e.event.CLIENT_CONNECTION_STATUS_CHANGED, {
                    clientId: c,
                    status: f,
                    previous: g
                })
            }))
        }

        function o(a, b, c) {
            var d = c.split(/\s+/),
                e = d[4]; - 1 !== e.indexOf(":") && (e = "[" + e + "]");
            var f = e + ":" + d[5],
                g = d[7],
                h = E.peerConnections[a].iceCandidates[b];
            h[f] = g, h[e] || (h[e] = g)
        }

        function p(a, b, c) {
            var d = c.split(/\n+/);
            d.forEach(function(c) {
                c.match(/^a=candidate:/) && o(a, b, c)
            })
        }

        function q(a) {
            var b = j(a);
            if (!b) return void c.warn("No RTCPeerConnection in determineConnectionType()", a);
            if (void 0 !== b.getStats) try {
                3 === b.getStats.length ? r(a, b) : 1 === b.getStats.length && t(a, b)
            } catch (d) {
                c.warn("Failed to get connection type, clientId =", a, d)
            }
        }

        function r(a, b) {
            b.getStats(null, function(b) {
                var c = null;
                b.forEach(function(a) {
                    if ("candidatepair" === a.type) {
                        var d = b.get(a.componentId);
                        if (d.activeConnection && !c) {
                            var e = b.get(a.localCandidateId),
                                f = b.get(a.remoteCandidateId),
                                g = s(e.candidateType),
                                h = s(f.candidateType);
                            c = v(g, h)
                        }
                    }
                }), w(a, c)
            }, function(b) {
                c.warn("RTCPeerConnection.getStats() failed, clientId =", a, b)
            })
        }

        function s(a, b, d) {
            switch (d.candidateType) {
                case "host":
                case "serverreflexive":
                case "peerreflexive":
                    return "peer";
                case "relayed":
                    return "relay(" + d.ipAddress + ")";
                default:
                    return c.warn("Connection is using an unknown", b, "ICE candidate, clientId =", a, "candidate =", d), "unknown"
            }
        }

        function t(a, b) {
            b.getStats(function(b) {
                var c = b.result(),
                    d = null;
                c.forEach(function(b) {
                    if ("googCandidatePair" === b.type && "true" === b.stat("googActiveConnection") && !d) {
                        var c = b.stat("googLocalAddress"),
                            e = b.stat("googRemoteAddress"),
                            f = "[" === c[0] ? 6 : 4,
                            g = u(a, "local", c),
                            h = u(a, "remote", e);
                        d = v(g, h, f)
                    }
                }), w(a, d)
            })
        }

        function u(a, b, d) {
            var e = E.peerConnections[a].iceCandidates[b],
                f = d.split(/:/)[0],
                g = e[d] || e[f];
            switch (g) {
                case "host":
                case "srflx":
                case "prflx":
                    return "peer";
                case "relay":
                    return "relay(" + f + ")";
                default:
                    return c.warn("Connection is using an unknown", b, "ICE candidate, clientId =", a, "address =", d, "iceCandidates =", e), "unknown"
            }
        }

        function v(a, b, c) {
            return [a, b].sort().join("-to-") + (c && 4 !== c ? " (ipv" + c + ")" : "")
        }

        function w(a, b) {
            b || (b = "UNKNOWN (detection failed)"), c.info("Connection type to %s is %s", a, b), E.peerConnections[a].connectionType = b, d.helpers.recordConnectionType(b)
        }

        function x(a) {
            var b = j(a);
            if (!b) return void c.warn("No RTCPeerConnection in determineConnectionType()", a);
            try {
                var d = E.peerConnections[a].stats;
                3 === b.getStats.length ? y(a, b, d) : 1 === b.getStats.length && z(a, b, d)
            } catch (e) {
                c.warn("Unexpected error in checkConnectionActivity(), clientId =", a, e)
            }
        }

        function y(a, b, d) {
            b.getStats(null, function(b) {
                var c = 0,
                    e = 0;
                b.forEach(function(a) {
                    switch (a.type) {
                        case "inboundrtp":
                            a.isRemote || (e += a.bytesReceived);
                            break;
                        case "outboundrtp":
                            a.isRemote || (c += a.bytesSent)
                    }
                }), A(a, d, c, e)
            }, function(b) {
                c.warn("RTCPeerConnection.getStats() failed, clientId =", a, b)
            })
        }

        function z(a, b, c) {
            b.getStats(function(b) {
                var d = 0,
                    e = 0;
                b.result().forEach(function(a) {
                    switch (a.type) {
                        case "googCandidatePair":
                            "true" === a.stat("googWritable") && (d += +a.stat("bytesSent")), "true" === a.stat("googReadable") && (e += +a.stat("bytesReceived"))
                    }
                }), A(a, c, d, e)
            })
        }

        function A(a, b, c, d) {
            var f = Math.max(0, c - b.totalSent),
                g = Math.max(0, d - b.totalRecv);
            b.totalSent = c, b.totalRecv = d;
            var h;
            h = f || g ? e.status.CONNECTION_SUCCESSFUL : e.status.CONNECTION_INACTIVE, n(a, h)
        }

        function B() {
            f.$on(protocol.relay.READY_TO_RECEIVE_OFFER, function(a) {
                E.connect(a.clientId, a.iceServers)
            }), f.on(protocol.relay.ICE_CANDIDATE, function(a) {
                var b = j(a.clientId);
                return b ? (o(a.clientId, "remote", a.message.candidate), void b.addIceCandidate(new RTCIceCandidate(a.message))) : void c.warn("No RTCPeerConnection on ICE_CANDIDATE", a)
            }), f.on(protocol.relay.SDP_OFFER, function(a) {
                var b = j(a.clientId);
                return b ? (p(a.clientId, "remote", a.message.sdp), void b.setRemoteDescription(new RTCSessionDescription(a.message), function() {
                    b.createAnswer(function(e) {
                        b.setLocalDescription(e, function() {
                            f.emit(protocol.relay.SDP_ANSWER, {
                                receiverId: a.clientId,
                                message: k(b.localDescription)
                            })
                        }, function(a) {
                            c.warn("Could not set local description from local answer: ", a), d.helpers.recordWebRTCError("set local answer", a)
                        })
                    }, function(a) {
                        c.warn("Could not create answer to remote offer: ", a), d.helpers.recordWebRTCError("create answer", a)
                    }, C)
                }, function(a) {
                    c.warn("Could not set remote description from remote offer: ", a), d.helpers.recordWebRTCError("set remote offer", a)
                })) : void c.warn("No RTCPeerConnection on SDP_OFFER", a)
            }), f.on(protocol.relay.SDP_ANSWER, function(a) {
                var b = j(a.clientId);
                return b ? (p(a.clientId, "remote", a.message.sdp), void b.setRemoteDescription(new RTCSessionDescription(a.message), function() {}, function(a) {
                    c.warn("Could not set remote description from remote answer: ", a), d.helpers.recordWebRTCError("set remote answer", a)
                })) : void c.warn("No RTCPeerConnection on SDP_ANSWER", a)
            })
        }
        var C = {
                mandatory: {
                    OfferToReceiveAudio: !0,
                    OfferToReceiveVideo: !0
                }
            },
            D = 1e4,
            E = {};
        return E.peerConnections = {}, E.localStreams = {}, E.addNewStream = function(a, b) {
            E.localStreams[a] = b, Object.keys(E.peerConnections).forEach(function(a) {
                var c = j(a);
                c && c.addStream(b)
            })
        }, E.removeStream = function(a, b) {
            delete E.localStreams[a], Object.keys(E.peerConnections).forEach(function(a) {
                var c = j(a);
                c && c.removeStream(b)
            })
        }, E.connect = function(a, b) {
            var d = j(a);
            return d ? void c.warn("RTCPeerConnection already exists on connect()", a) : (l(a, b), void m(a))
        }, E.accept = function(a, b, d) {
            var e = j(a);
            return e ? void c.warn("RTCPeerConnection already exists on accept()", a) : (l(a, b, d), void f.emit(protocol.relay.READY_TO_RECEIVE_OFFER, {
                receiverId: a,
                iceServers: b
            }))
        }, E.disconnect = function(a) {
            var b = j(a);
            if (!b) return void c.warn("No RTCPeerConnection in RTCManager.disconnect()", a);
            try {
                b.close()
            } catch (d) {}
            h.cancel(E.peerConnections[a].intervalId), delete E.peerConnections[a]
        }, E.disconnectAll = function() {
            Object.keys(E.peerConnections).forEach(function(a) {
                E.disconnect(a)
            }), E.peerConnections = {}
        }, B(), E
    }]), angular.module("videoconference").factory("Chat", ["$rootScope", "$document", "serverSocket", "avatarProvider", function(a, b, c, d) {
        var e = ["#5E71B6", "#90D2B6", "#1C1638", "#FEFFB8", "#4C806D"],
            f = {},
            g = function(a) {
                if (!(a in f)) {
                    var b = Object.keys(f).length,
                        c = b % e.length,
                        d = e[c];
                    f[a] = d
                }
                return f[a]
            },
            h = function(a) {
                this.type = "historyMarker", this.historyLength = a
            },
            i = function(a) {
                if (a) {
                    var b = a.senderId || c.getSelfId();
                    this.type = "message", this.timestamp = a.timestamp, this.text = a.text, this.avatar = a.avatar, this.color = g(b)
                }
            },
            j = {};
        return j.entries = [], j.clearEntries = function() {
            j.entries.splice(0, j.entries.length)
        }, j.clearHistory = function() {
            c.emit(protocol.req.CLEAR_CHAT_HISTORY)
        }, j.sendMessage = function(a) {
            var b = {
                    text: a
                },
                e = d.getAvatar();
            e && (b.avatar = e), c.emit(protocol.relay.CHAT_MESSAGE, b)
        }, c.$on(protocol.relay.CHAT_MESSAGE, function(b) {
            b && !b.error && (j.entries.push(new i(b)), a.$broadcast("new_chat_message", b))
        }), c.$on(protocol.res.CHAT_HISTORY, function(b) {
            if (b && 0 !== b.length) {
                j.clearEntries();
                for (var c in b) j.entries.push(new i(b[c]));
                j.entries.push(new h(b.length)), a.$broadcast("chat_history_updated")
            }
        }), c.$on(protocol.res.CHAT_HISTORY_CLEARED, function() {
            j.clearEntries(), j.entries.push(new h(0)), a.$broadcast("chat_history_updated")
        }), c.emit(protocol.req.GET_CHAT_HISTORY), j.entries.push(new h(0)), a.$on("leave_room", function() {
            j.clearEntries()
        }), j
    }]), angular.module("videoconference").service("ImageParser", function() {
        function a(a, c) {
            function d(a, b) {
                b = b || .9;
                var e = a.toDataURL("image/jpeg", b),
                    f = e.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
                    g = atob(f).length;
                return g > c.sizeLimit && b >= .1 ? d(a, b - .1) : f
            }
            var e = b(a, c.maxWidth, c.maxHeight),
                f = document.createElement("canvas");
            return f.width = e.width, f.height = e.height, f.getContext("2d").drawImage(a, 0, 0, e.width, e.height), d(f)
        }

        function b(a, b, c) {
            var d, e, f = a.height,
                g = a.width;
            return (g > b || f > c) && (e = c, d = e / f * g, d > b && (d = b, e = d / g * f)), {
                width: d || g,
                height: e || f
            }
        }
        var c = {
            sizeLimit: 524288,
            maxWidth: 1920,
            maxHeight: 1200
        };
        this.isValidImage = function(a) {
            return -1 === a.type.indexOf("image") ? !1 : !0
        }, this.base64toBlob = function(a, b, c) {
            b = b || "", c = c || 512;
            for (var d = atob(a), e = [], f = 0; f < d.length; f += c) {
                for (var g = d.slice(f, f + c), h = new Array(g.length), i = 0; i < g.length; i++) h[i] = g.charCodeAt(i);
                var j = new Uint8Array(h);
                e.push(j)
            }
            var k = new Blob(e, {
                type: b
            });
            return k
        }, this.parseFileAsImage = function(b, d) {
            var e = _.defaults(b && b.restrictions || {}, c),
                f = b.file,
                g = new FileReader;
            g.onload = function(b) {
                var c = new Image;
                c.onload = function() {
                    var b = a(this, e);
                    return atob(b).length > e.sizeLimit ? void d("Sorry, that image was too large.") : void d(void 0, b)
                };
                var g = "data:" + f.type + ";base64," + btoa(b.target.result);
                c.src = g
            }, g.readAsBinaryString(f)
        }
    }), angular.module("videoconference").factory("RoomAdminPanel", ["Analytics", "RoomService", "$rootScope", "$timeout", "Event", "modalService", function(a, b, c, d, e, f) {
        var g = "roomAdmin",
            h = {};
        h.activePanel = null, h.panelState = null, h.isOpen = function() {
            return f.modals[g].isOpen
        }, h.type = {
            ADMIN: "admin",
            CLAIM: "claim",
            RECLAIM: "reclaim"
        };
        var i = {
            admin: {},
            claim: {},
            reclaim: {}
        };
        c.$on(e.OWNERS_CHANGED, function() {
            return b.isClaimed && !b.isSelfOwner && h.activePanel === h.type.CLAIM ? void h.close() : void 0
        }), h.setActivePanel = function(b) {
            var c = b ? b : h.activePanel;
            h.activePanel = b;
            var d = b ? "opened" : "closed",
                e = !!b;
            c && !i[c][d] && (a.helpers.recordActivePanelAction(c, e), i[c][d] = !0)
        };
        var j = function() {
            if (b.isClaimed && b.isSelfOwner || b.isSelfMember) return void(h.panelState = h.type.ADMIN);
            var a = !b.isMigrated && b.hasOwnerId;
            return !b.isClaimed || a || b.isSelfOwner ? void(h.panelState = h.type.CLAIM) : void(h.panelState = h.type.RECLAIM)
        };
        return c.$watch(function() {
            return b.isClaimed
        }, j), c.$watch(function() {
            return b.isSelfOwner
        }, j), c.$watch(function() {
            return b.isSelfMember
        }, j), h.toggle = function() {
            return h.isOpen() ? void h.close() : void h.open()
        }, h.open = function() {
            f.openModal(g), h.setActivePanel(h.panelState), d(function() {
                angular.element(".admin-panel").find("form input[autofocus]").first().focus()
            })
        }, h.close = function() {
            f.closeModal(g), h.setActivePanel(null)
        }, j(), h
    }]), angular.module("videoconference").factory("Snapshooter", [function() {
        var a = function(a, b, c, d) {
            var e = 2,
                f = e * b,
                g = e * c,
                h = angular.element('<canvas width="' + f + '" height="' + g + '" />')[0],
                i = h.getContext("2d");
            i.drawImage(a, 0, 0, f, g);
            for (var j = angular.element('<canvas width="' + b + '" height="' + c + '" />')[0], k = j.getContext("2d"), l = i.getImageData(0, 0, f, g), m = k.getImageData(0, 0, b, c), n = function(a, b) {
                    return [l.data[4 * (a + b * f) + 0], l.data[4 * (a + b * f) + 1], l.data[4 * (a + b * f) + 2]]
                }, o = function(a, c, d) {
                    m.data[4 * (a + c * b) + 0] = d[0], m.data[4 * (a + c * b) + 1] = d[1], m.data[4 * (a + c * b) + 2] = d[2], m.data[4 * (a + c * b) + 3] = 255
                }, p = function(a) {
                    var b = [0, 0, 0];
                    for (var c in a) {
                        var d = a[c];
                        b[0] += d[0], b[1] += d[1], b[2] += d[2]
                    }
                    return b[0] /= a.length, b[1] /= a.length, b[2] /= a.length, b
                }, q = 0; b > q; q++)
                for (var r = 0; c > r; r++) {
                    for (var s = [], t = q * e;
                        (q + 1) * e > t; t++)
                        for (var u = r * e;
                            (r + 1) * e > u; u++) s.push(n(t, u));
                    o(q, r, p(s))
                }
            k.putImageData(m, 0, 0);
            var v = function(a) {
                    var b = a.substring(a.indexOf(",") + 1),
                        c = 6 * b.length;
                    return Math.ceil(c / 8)
                },
                w = 1,
                x = null;
            do x = j.toDataURL("image/jpeg", w), w -= .1; while (v(x) > d && w > 0);
            return x
        };
        return {
            takeSnapshot: a
        }
    }]), angular.module("videoconference").factory("features", ["objStore", "$location", "$q", "GeoLookup", function(a, b, c, d) {
        var e = b.search(),
            f = a("features").loadOrDefault({}),
            g = function(a) {
                var b = _.clone(a);
                return _.each(b, function(a, c) {
                    a || delete b[c]
                }), b
            },
            h = function(a) {
                var b = {
                        no: new Date("2014-11-12T14:00:00+0100")
                    },
                    c = new Date;
                return a in b && c > b[a]
            },
            i = function() {
                return d.get().then(function(a) {
                    return h(a)
                })
            },
            j = c.when(!f.userRegistration && (e.enableUserRegistration || i())),
            k = {
                isUnclaimedRoomNotificationsEnabled: e.unclaimedRoomNotifications,
                isVideoDisabledByDefault: "off" === e.video,
                isAudioDisabledByDefault: "off" === e.audio,
                isLiteModeEnabled: e.lite,
                isNewSuperSize: e.supersize || navigator.userAgent.indexOf("Chrome") > 0,
                disableIPv6ICE: e.noipv6,
                isWebRtcPluginEnabled: e.webRtcPlugin,
                isKnockLiveVideoEnabled: e.knockLiveVideo,
                isOldRtcVersionEnabled: e.oldRtc,
                userRegistration: e.userRegistration || f.userRegistration,
                isKahoot: e.kahoot,
                enableUserRegistration: j,
                newMobileWeb: e.m,
                isEventLoggingEnabled: e.eventLogging
            };
        return _.defaults(g(k), f)
    }]), angular.module("videoconference").factory("Credentials", ["objStore", "$http", "apiUrl", "$timeout", "$q", function(a, b, c, d, e) {
        var f, g = a("CredentialsStorage"),
            h = {},
            i = function(a) {
                var e = c + "/devices";
                b({
                    method: "POST",
                    url: e
                }).success(function(b) {
                    g.save(b), a.resolve(b)
                }).error(function() {
                    d(i.bind(null, a), 2e3)
                })
            };
        return h.getCredentials = function() {
            if (f) return f.promise;
            f = e.defer();
            var a = g.loadOrDefault(!1);
            return a ? (f.resolve(a), f.promise) : (i(f), f.promise)
        }, h
    }]), angular.module("videoconference").factory("isEligibleForUpsell", ["chromeExtension", "features", "dismissHistory", "timeProvider", function(a, b, c, d) {
        var e = function(a, b) {
            var e = c.getHistory(a);
            return e.length < 1 ? !0 : _.last(e).when + b < d()
        };
        return function(b) {
            return constants.UPSELL.IS_ENABLED && !a.isRoomFollowed && a.canFollow() && e(b, constants.UPSELL.QUIET_PERIOD_SINCE_LAST_DISMISS)
        }
    }]).factory("notificationUpseller", ["$timeout", "features", "chromeExtension", "inRoomNotificationService", "isEligibleForUpsell", "dismissHistory", "RoomService", "timeProvider", "extensionNotificationSignup", "Analytics", function(a, b, c, d, e, f, g, h, i, j) {
        function k(b) {
            var c = "notifications-in-extension-upsell";
            return a(function() {
                e(c) && (d.addActionRequired({
                    id: c,
                    type: "info",
                    templateUrl: "/templates/partials/" + c + ".html",
                    actions: {
                        installOrFollow: function() {
                            i.installOrToggleIsRoomFollowed("upsell follow link"), d.removeActionRequiredById(c), f.add(c, {
                                roomName: g.roomName,
                                when: h(),
                                action: "install-extension"
                            })
                        }
                    },
                    onDismiss: function() {
                        f.add(c, {
                            roomName: g.roomName,
                            when: h(),
                            action: "dismiss"
                        })
                    }
                }), j.sendEvent(j.events.FOLLOW_SHOW_UPSELL))
            }, b)
        }
        var l = null;
        return {
            scheduleIfNotScheduled: function(a) {
                l || (l = k(a))
            },
            cancelIfScheduled: function() {
                l && a.cancel(l)
            }
        }
    }]), angular.module("videoconference").factory("timeProvider", [function() {
        return function() {
            return (new Date).getTime()
        }
    }]), angular.module("videoconference").factory("dismissHistory", ["multiMap", "objStore", function(a, b) {
        var c = b("dismissHistory"),
            d = a(c.loadOrDefault({}));
        return {
            add: function(a, b) {
                d.add(a, b), c.save(d.getAllItems())
            },
            getHistory: function(a) {
                return d.get(a)
            }
        }
    }]), angular.module("videoconference").factory("extensionNotificationSignup", ["chromeExtension", "Analytics", "RoomService", "$rootScope", "Event", function(a, b, c, d, e) {
        var f = function() {
                b.sendEvent(b.events.FOLLOW_TRIGGER_INSTALL), a.triggerInstall({
                    reason: "notification"
                })
            },
            g = function(d) {
                a.follow(d, c.getRoomToken()), b.helpers.recordFollowRoom(d)
            },
            h = function(c) {
                a.unfollow(c), b.helpers.recordUnfollowRoom(c)
            },
            i = function() {
                return a.isRoomFollowed ? void h(c.roomName) : void g(c.roomName)
            };
        return d.$on(e.EXTENSION_INSTALL, function(a, b) {
            "loaded" === b.state && g(c.roomName)
        }), {
            canInstallExtension: a.canInstall.bind(a),
            canFollow: a.canFollow.bind(a),
            hasExtension: function() {
                return a.hasExtension
            },
            installOrToggleIsRoomFollowed: function(c) {
                c && b.helpers.recordFollowToggle(c), a.hasExtension ? i() : f()
            }
        }
    }]), angular.module("videoconference").run(["User", function(a) {
        a.login()
    }]).factory("User", ["appearinApi", "$q", "serverSocket", "$timeout", "$log", "Analytics", "Intercom", "$window", "kissmetrics", "RoomKeyService", "$rootScope", "Event", function(a, b, c, d, e, f, g, h, i, j, k, l) {
        function m(a) {
            return a.type === constants.Contact.Type.User
        }

        function n(a) {
            return _.sortBy(a, "displayName")
        }

        function o(a) {
            return a.filter(function(a) {
                return a.lastInviteTime || a.lastConversationTime ? !0 : !1
            })
        }

        function p(a) {
            return _.sortBy(a, function(a) {
                return a = _.defaults(a, {
                    lastInviteTime: 0,
                    lastConversationTime: 0
                }), Math.max(a.lastInviteTime, a.lastConversationTime)
            }).reverse()
        }

        function q(a) {
            var b = o(a);
            return p(b).slice(0, w - 1)
        }

        function r(a) {
            return _.filter(a, function(a) {
                return a.phoneNumbers.length > 0
            })
        }

        function s(a) {
            x.data = {}, x.isLoggedIn = a ? !1 : void 0, x.registeredContacts = [], x.unregisteredContacts = [], x.recentContacts = [], g.clearData()
        }

        function t(a) {
            return {
                user_id: a.userId,
                remote_created_at: Math.round(new Date(a.created).getTime() / 1e3),
                name: a.displayName,
                email: a.email
            }
        }

        function u(a) {
            var b = h.localStorage,
                c = a.data;
            _.chain(c).keys().each(function(a) {
                b.removeItem(a)
            })
        }
        var v = "/user",
            w = 20,
            x = {};
        return x.data = {}, x.showSignupDialog = !1, c.$on(protocol.res.CONTACTS_UPDATED, function() {
            x.getContacts()
        }), x.hasContacts = function() {
            return 0 !== x.registeredContacts.length || 0 !== x.unregisteredContacts.length
        }, x.getContacts = function() {
            var b = v + "/contacts";
            return a({
                method: "GET",
                url: b
            }).then(function(a) {
                var b = _.partition(a.data.contacts, m),
                    c = r(b[1]);
                x.recentContacts = q(a.data.contacts), x.registeredContacts = n(b[0]), x.unregisteredContacts = n(c)
            }).then(function() {
                k.$broadcast(l.CONTACTS_UPDATED)
            })
        }, x.callUser = function(b, c) {
            var d = c ? {
                roomName: c
            } : {};
            return a({
                method: "POST",
                url: "/users/" + b + "/call",
                data: d
            })
        }, x.callContact = function(b, c) {
            var d = c || {};
            return a({
                method: "POST",
                url: "/user/contacts/" + b + "/call",
                data: d
            })
        }, x.create = function(c) {
            return a({
                method: "POST",
                url: "/users",
                data: c
            }).then(function(a) {
                return g.boot(t(a.data)), i.identify(a.data.userId), a.data
            }).catch(function(a) {
                return b.reject(a.data)
            })
        }, x.sendVerificationCode = function(b, c, d) {
            return a({
                method: "POST",
                url: "/verification/" + b + "/send-code",
                data: {
                    contactPoint: c,
                    isVerifying: !!d
                }
            })
        }, x.update = function(b) {
            return a({
                method: "PUT",
                url: v,
                data: b
            }).then(function(a) {
                return g.update(t(a.data)), a.data
            })
        }, x.setPhoneNumber = function(a) {
            return x.update({
                phoneNumber: a
            }).then(function() {
                return x.setSmsEndpoint(a)
            })
        }, x.setDisplayName = function(a) {
            return x.update({
                displayName: a
            })
        }, x.setPersonalRoomName = function(a) {
            return x.update({
                roomName: a
            })
        }, x.setEmail = function(a) {
            return x.update({
                email: a
            }).then(x.login)
        }, x.verifyContactPoint = function(b, c, d) {
            var e = "/verification/" + b,
                f = {
                    contactPoint: c,
                    code: "" + d
                };
            return a({
                method: "GET",
                params: f,
                url: e
            })
        }, x.sendAppLink = function() {
            return a({
                method: "POST",
                url: "/user/sendAppLink"
            })
        }, x.uploadAvatar = function(b) {
            var c = {
                    avatar: b
                },
                d = v + "/avatar",
                e = {
                    "Content-Type": void 0
                };
            return a({
                method: "PUT",
                url: d,
                data: c,
                transformRequest: function(a) {
                    var b = new FormData;
                    return angular.forEach(a, function(a, c) {
                        b.append(c, a)
                    }), b
                },
                headers: e
            })
        }, x.login = function() {
            return a({
                method: "GET",
                url: "/user"
            }).then(function(a) {
                return a.data.error ? (x.isLoggedIn = !1, b.reject(a.data.error)) : (x.isLoggedIn = !0, x.data = a.data, g.boot(t(x.data)), i.identify(x.data.userId), x.getContacts(), x.data)
            }).catch(function(a) {
                return s(!0), b.reject(a)
            })
        }, x.addContact = function(c) {
            var d = v + "/contacts";
            return a({
                method: "POST",
                url: d,
                data: [c]
            }).then(function() {
                return f.sendEvent(f.events.CONTACT_ADDED_MANUALLY), b.when()
            }).catch(function(a) {
                return f.sendEvent(f.events.CONTACT_ADDED_MANUALLY_FAILED), e.error("Could not add contact: %O", a), b.reject(a)
            })
        }, x.logout = function() {
            var b = v + "/device";
            return a({
                method: "DELETE",
                url: b
            }).then(function(a) {
                return x.resetState(), i.clearIdentity(), h.location.href = "/", a.data
            })
        }, x.migrateRoomKeys = function() {
            var c = j.getRoomKeysFromLocalStorage();
            return 0 === _.keys(c).length ? b.when() : a({
                method: "POST",
                url: v + "/migrate-roomkeys",
                data: {
                    roomKeys: c
                }
            }).then(u)
        }, x.migrateRoom = function(c) {
            var d = {};
            try {
                d[c] = JSON.parse(localStorage[c])
            } catch (e) {
                return b.when()
            }
            return 0 === _.keys(d).length ? b.when() : a({
                method: "POST",
                url: v + "/migrate-roomkeys",
                data: {
                    roomKeys: d
                }
            }).then(u)
        }, x.resetState = function() {
            var a = !0;
            s(a)
        }, x.inviteBySms = function(b, c) {
            return a({
                method: "POST",
                url: v + "/invitation",
                data: {
                    type: "sms",
                    roomName: c,
                    phoneNumber: b
                }
            })
        }, x.addPhoneContact = function(b, c) {
            var d = {
                id: uuid.v4(),
                displayName: b,
                phoneNumbers: c
            };
            return a({
                method: "POST",
                url: v + "/contacts/phonebook",
                data: [d]
            })
        }, s(), x
    }]), angular.module("videoconference").factory("modalService", ["Analytics", function(a) {
        var b, c = {
                login: {
                    analyticsName: "login",
                    isOpen: !1
                },
                settings: {
                    analyticsName: "user settings",
                    isOpen: !1
                },
                registration: {
                    analyticsName: "registration flow",
                    isOpen: !1
                },
                migration: {
                    analyticsName: "migration upsell",
                    isOpen: !1
                },
                roomAdmin: {
                    analyticsName: "room admin panel",
                    isOpen: !1
                },
                contacts: {
                    analyticsName: "contacts",
                    isOpen: !1
                }
            },
            d = "",
            e = function() {
                return _.some(c, function(a) {
                    return a.isOpen
                })
            },
            f = function(a) {
                return new CustomEvent("close", {
                    detail: {
                        message: "Closed modal " + a,
                        time: new Date
                    },
                    bubbles: !1,
                    cancelable: !0
                })
            },
            g = function(a) {
                return new CustomEvent("open", {
                    detail: {
                        message: "Opened modal " + a,
                        time: new Date
                    },
                    bubbles: !1,
                    cancelable: !0
                })
            },
            h = function(a, b) {
                c[a].events && c[a].events[b] && c[a].events[b]()
            },
            i = function(e, f) {
                if (e in c && d !== e) {
                    d && (c[d].isOpen = !1), c[e].isOpen = !0, d = e, b = f;
                    var i = c[e].element;
                    i && (i.dispatchEvent(g(e)), a.helpers.recordModalOpened(c[e].analyticsName), h(e, "open"))
                }
            },
            j = function(e) {
                if (e in c) {
                    d = "", c[e].isOpen = !1, b && (b(), b = null);
                    var g = c[e].element;
                    g && (g.dispatchEvent(f(e)), a.helpers.recordModalClosed(c[e].analyticsName), h(e, "close"))
                }
            },
            k = function(a) {
                a in c && (c[a].isOpen ? j(a) : i(a))
            },
            l = {
                "false": function() {
                    k("login")
                },
                "true": function() {
                    k("settings")
                }
            },
            m = function(a) {
                var b = JSON.stringify(a);
                l[b]()
            },
            n = function() {
                _.each(c, function(a) {
                    a.isOpen = !1
                })
            },
            o = function(a) {
                n(), a.apply(null, Array.prototype.slice.call(arguments, 1))
            },
            p = function() {
                return _.some(c, function(a) {
                    return a.isOpen
                })
            },
            q = function(a, b) {
                c[a].element = b
            },
            r = function(a, b, d) {
                a in c && (c[a].events = {}, c[a].events[b] = d)
            },
            s = function(a, b) {
                a in c && delete c[a].events[b]
            };
        return {
            openModal: i,
            modals: c,
            clickEventForState: m,
            toggleModal: k,
            closeModal: j,
            closeDropdowns: n,
            closeDropdownAndCall: o,
            isActive: p,
            setElement: q,
            isAnyModalOpen: e,
            addEventListener: r,
            removeEventListener: s
        }
    }]), angular.module("videoconference").factory("RoomKeyService", ["$window", function(a) {
        var b = {};
        return b.getRoomKeysFromLocalStorage = function() {
            var b = a.localStorage;
            return _.chain(b).keys().filter(function(a) {
                return "/" === a[0]
            }).reduce(function(a, c) {
                try {
                    a[c] = JSON.parse(b[c])
                } catch (d) {}
                return a
            }, {}).value()
        }, b
    }]), angular.module("videoconference").factory("GeoLookup", ["$q", "objStore", function(a, b) {
        var c, d = b("GeoLookupCache"),
            e = d.loadOrDefault(null),
            f = function(a) {
                return a && a.data && a.data.country && a.data.country.iso_code
            },
            g = function(a) {
                return a.country.iso_code.toLowerCase()
            },
            h = function() {
                return c || (c = a.defer(), f(e) ? c.resolve(g(e.data)) : geoip2.country(function(a) {
                    d.save({
                        timestamp: (new Date).getTime(),
                        data: a
                    }), c.resolve(g(a))
                }, function() {
                    c.resolve("no")
                })), c.promise
            };
        return {
            get: h
        }
    }]), angular.module("videoconference").factory("serverTemplate", ["appearinApi", "$q", "$log", function(a, b, c) {
        function d(d, e) {
            return a({
                method: "GET",
                url: "/notifications/template",
                params: {
                    name: d
                }
            }).then(function(a) {
                return a.data && a.data.template || b.reject()
            }).catch(function() {
                return c.warn("Unable to get server-side template %s. Using default.", d), e
            }).then(function(a) {
                return _.template(a)
            })
        }
        return {
            getTemplate: d
        }
    }]), angular.module("videoconference").factory("countryCodeLookup", ["appearinApi", function(a) {
        var b = [{
                country_code: "dz",
                calling_code: "+213",
                country_name: "Algeria (+213)"
            }, {
                country_code: "ad",
                calling_code: "+376",
                country_name: "Andorra (+376)"
            }, {
                country_code: "ao",
                calling_code: "+244",
                country_name: "Angola (+244)"
            }, {
                country_code: "ai",
                calling_code: "+1264",
                country_name: "Anguilla (+1264)"
            }, {
                country_code: "ag",
                calling_code: "+1268",
                country_name: "Antigua & Barbuda (+1268)"
            }, {
                country_code: "ar",
                calling_code: "+54",
                country_name: "Argentina (+54)"
            }, {
                country_code: "am",
                calling_code: "+374",
                country_name: "Armenia (+374)"
            }, {
                country_code: "aw",
                calling_code: "+297",
                country_name: "Aruba (+297)"
            }, {
                country_code: "au",
                calling_code: "+61",
                country_name: "Australia (+61)"
            }, {
                country_code: "at",
                calling_code: "+43",
                country_name: "Austria (+43)"
            }, {
                country_code: "az",
                calling_code: "+994",
                country_name: "Azerbaijan (+994)"
            }, {
                country_code: "bs",
                calling_code: "+1242",
                country_name: "Bahamas (+1242)"
            }, {
                country_code: "bh",
                calling_code: "+973",
                country_name: "Bahrain (+973)"
            }, {
                country_code: "bd",
                calling_code: "+880",
                country_name: "Bangladesh (+880)"
            }, {
                country_code: "bb",
                calling_code: "+1246",
                country_name: "Barbados (+1246)"
            }, {
                country_code: "by",
                calling_code: "+375",
                country_name: "Belarus (+375)"
            }, {
                country_code: "be",
                calling_code: "+32",
                country_name: "Belgium (+32)"
            }, {
                country_code: "bz",
                calling_code: "+501",
                country_name: "Belize (+501)"
            }, {
                country_code: "bj",
                calling_code: "+229",
                country_name: "Benin (+229)"
            }, {
                country_code: "bm",
                calling_code: "+1441",
                country_name: "Bermuda (+1441)"
            }, {
                country_code: "bt",
                calling_code: "+975",
                country_name: "Bhutan (+975)"
            }, {
                country_code: "bo",
                calling_code: "+591",
                country_name: "Bolivia (+591)"
            }, {
                country_code: "ba",
                calling_code: "+387",
                country_name: "Bosnia Herzegovina (+387)"
            }, {
                country_code: "bw",
                calling_code: "+267",
                country_name: "Botswana (+267)"
            }, {
                country_code: "br",
                calling_code: "+55",
                country_name: "Brazil (+55)"
            }, {
                country_code: "bn",
                calling_code: "+673",
                country_name: "Brunei (+673)"
            }, {
                country_code: "bg",
                calling_code: "+359",
                country_name: "Bulgaria (+359)"
            }, {
                country_code: "bf",
                calling_code: "+226",
                country_name: "Burkina Faso (+226)"
            }, {
                country_code: "bi",
                calling_code: "+257",
                country_name: "Burundi (+257)"
            }, {
                country_code: "kh",
                calling_code: "+855",
                country_name: "Cambodia (+855)"
            }, {
                country_code: "cm",
                calling_code: "+237",
                country_name: "Cameroon (+237)"
            }, {
                country_code: "ca",
                calling_code: "+1",
                country_name: "Canada (+1)"
            }, {
                country_code: "cv",
                calling_code: "+238",
                country_name: "Cape Verde Islands (+238)"
            }, {
                country_code: "ky",
                calling_code: "+1345",
                country_name: "Cayman Islands (+1345)"
            }, {
                country_code: "cf",
                calling_code: "+236",
                country_name: "Central African Republic (+236)"
            }, {
                country_code: "cl",
                calling_code: "+56",
                country_name: "Chile (+56)"
            }, {
                country_code: "cn",
                calling_code: "+86",
                country_name: "China (+86)"
            }, {
                country_code: "co",
                calling_code: "+57",
                country_name: "Colombia (+57)"
            }, {
                country_code: "km",
                calling_code: "+269",
                country_name: "Comoros (+269)"
            }, {
                country_code: "cg",
                calling_code: "+242",
                country_name: "Congo (+242)"
            }, {
                country_code: "ck",
                calling_code: "+682",
                country_name: "Cook Islands (+682)"
            }, {
                country_code: "cr",
                calling_code: "+506",
                country_name: "Costa Rica (+506)"
            }, {
                country_code: "hr",
                calling_code: "+385",
                country_name: "Croatia (+385)"
            }, {
                country_code: "cu",
                calling_code: "+53",
                country_name: "Cuba (+53)"
            }, {
                country_code: "cy",
                calling_code: "+90392",
                country_name: "Cyprus North (+90392)"
            }, {
                country_code: "cy",
                calling_code: "+357",
                country_name: "Cyprus South (+357)"
            }, {
                country_code: "cz",
                calling_code: "+42",
                country_name: "Czech Republic (+42)"
            }, {
                country_code: "dk",
                calling_code: "+45",
                country_name: "Denmark (+45)"
            }, {
                country_code: "dj",
                calling_code: "+253",
                country_name: "Djibouti (+253)"
            }, {
                country_code: "dm",
                calling_code: "+1809",
                country_name: "Dominica (+1809)"
            }, {
                country_code: "do",
                calling_code: "+1809",
                country_name: "Dominican Republic (+1809)"
            }, {
                country_code: "ec",
                calling_code: "+593",
                country_name: "Ecuador (+593)"
            }, {
                country_code: "eg",
                calling_code: "+20",
                country_name: "Egypt (+20)"
            }, {
                country_code: "sv",
                calling_code: "+503",
                country_name: "El Salvador (+503)"
            }, {
                country_code: "gq",
                calling_code: "+240",
                country_name: "Equatorial Guinea (+240)"
            }, {
                country_code: "er",
                calling_code: "+291",
                country_name: "Eritrea (+291)"
            }, {
                country_code: "ee",
                calling_code: "+372",
                country_name: "Estonia (+372)"
            }, {
                country_code: "et",
                calling_code: "+251",
                country_name: "Ethiopia (+251)"
            }, {
                country_code: "fk",
                calling_code: "+500",
                country_name: "Falkland Islands (+500)"
            }, {
                country_code: "fo",
                calling_code: "+298",
                country_name: "Faroe Islands (+298)"
            }, {
                country_code: "fj",
                calling_code: "+679",
                country_name: "Fiji (+679)"
            }, {
                country_code: "fi",
                calling_code: "+358",
                country_name: "Finland (+358)"
            }, {
                country_code: "fr",
                calling_code: "+33",
                country_name: "France (+33)"
            }, {
                country_code: "gf",
                calling_code: "+594",
                country_name: "French Guiana (+594)"
            }, {
                country_code: "pf",
                calling_code: "+689",
                country_name: "French Polynesia (+689)"
            }, {
                country_code: "ga",
                calling_code: "+241",
                country_name: "Gabon (+241)"
            }, {
                country_code: "gm",
                calling_code: "+220",
                country_name: "Gambia (+220)"
            }, {
                country_code: "ge",
                calling_code: "+7880",
                country_name: "Georgia (+7880)"
            }, {
                country_code: "de",
                calling_code: "+49",
                country_name: "Germany (+49)"
            }, {
                country_code: "gh",
                calling_code: "+233",
                country_name: "Ghana (+233)"
            }, {
                country_code: "gi",
                calling_code: "+350",
                country_name: "Gibraltar (+350)"
            }, {
                country_code: "gr",
                calling_code: "+30",
                country_name: "Greece (+30)"
            }, {
                country_code: "gl",
                calling_code: "+299",
                country_name: "Greenland (+299)"
            }, {
                country_code: "gd",
                calling_code: "+1473",
                country_name: "Grenada (+1473)"
            }, {
                country_code: "gp",
                calling_code: "+590",
                country_name: "Guadeloupe (+590)"
            }, {
                country_code: "gu",
                calling_code: "+671",
                country_name: "Guam (+671)"
            }, {
                country_code: "gt",
                calling_code: "+502",
                country_name: "Guatemala (+502)"
            }, {
                country_code: "gn",
                calling_code: "+224",
                country_name: "Guinea (+224)"
            }, {
                country_code: "gw",
                calling_code: "+245",
                country_name: "Guinea - Bissau (+245)"
            }, {
                country_code: "gy",
                calling_code: "+592",
                country_name: "Guyana (+592)"
            }, {
                country_code: "ht",
                calling_code: "+509",
                country_name: "Haiti (+509)"
            }, {
                country_code: "hn",
                calling_code: "+504",
                country_name: "Honduras (+504)"
            }, {
                country_code: "hk",
                calling_code: "+852",
                country_name: "Hong Kong (+852)"
            }, {
                country_code: "hu",
                calling_code: "+36",
                country_name: "Hungary (+36)"
            }, {
                country_code: "is",
                calling_code: "+354",
                country_name: "Iceland (+354)"
            }, {
                country_code: "in",
                calling_code: "+91",
                country_name: "India (+91)"
            }, {
                country_code: "id",
                calling_code: "+62",
                country_name: "Indonesia (+62)"
            }, {
                country_code: "ir",
                calling_code: "+98",
                country_name: "Iran (+98)"
            }, {
                country_code: "iq",
                calling_code: "+964",
                country_name: "Iraq (+964)"
            }, {
                country_code: "ie",
                calling_code: "+353",
                country_name: "Ireland (+353)"
            }, {
                country_code: "il",
                calling_code: "+972",
                country_name: "Israel (+972)"
            }, {
                country_code: "it",
                calling_code: "+39",
                country_name: "Italy (+39)"
            }, {
                country_code: "jm",
                calling_code: "+1876",
                country_name: "Jamaica (+1876)"
            }, {
                country_code: "jp",
                calling_code: "+81",
                country_name: "Japan (+81)"
            }, {
                country_code: "jo",
                calling_code: "+962",
                country_name: "Jordan (+962)"
            }, {
                country_code: "kz",
                calling_code: "+7",
                country_name: "Kazakhstan (+7)"
            }, {
                country_code: "ke",
                calling_code: "+254",
                country_name: "Kenya (+254)"
            }, {
                country_code: "ki",
                calling_code: "+686",
                country_name: "Kiribati (+686)"
            }, {
                country_code: "kp",
                calling_code: "+850",
                country_name: "Korea North (+850)"
            }, {
                country_code: "kr",
                calling_code: "+82",
                country_name: "Korea South (+82)"
            }, {
                country_code: "kw",
                calling_code: "+965",
                country_name: "Kuwait (+965)"
            }, {
                country_code: "kg",
                calling_code: "+996",
                country_name: "Kyrgyzstan (+996)"
            }, {
                country_code: "la",
                calling_code: "+856",
                country_name: "Laos (+856)"
            }, {
                country_code: "lv",
                calling_code: "+371",
                country_name: "Latvia (+371)"
            }, {
                country_code: "lb",
                calling_code: "+961",
                country_name: "Lebanon (+961)"
            }, {
                country_code: "ls",
                calling_code: "+266",
                country_name: "Lesotho (+266)"
            }, {
                country_code: "lr",
                calling_code: "+231",
                country_name: "Liberia (+231)"
            }, {
                country_code: "ly",
                calling_code: "+218",
                country_name: "Libya (+218)"
            }, {
                country_code: "li",
                calling_code: "+417",
                country_name: "Liechtenstein (+417)"
            }, {
                country_code: "lt",
                calling_code: "+370",
                country_name: "Lithuania (+370)"
            }, {
                country_code: "lu",
                calling_code: "+352",
                country_name: "Luxembourg (+352)"
            }, {
                country_code: "mo",
                calling_code: "+853",
                country_name: "Macao (+853)"
            }, {
                country_code: "mk",
                calling_code: "+389",
                country_name: "Macedonia (+389)"
            }, {
                country_code: "mg",
                calling_code: "+261",
                country_name: "Madagascar (+261)"
            }, {
                country_code: "mw",
                calling_code: "+265",
                country_name: "Malawi (+265)"
            }, {
                country_code: "my",
                calling_code: "+60",
                country_name: "Malaysia (+60)"
            }, {
                country_code: "mv",
                calling_code: "+960",
                country_name: "Maldives (+960)"
            }, {
                country_code: "ml",
                calling_code: "+223",
                country_name: "Mali (+223)"
            }, {
                country_code: "mt",
                calling_code: "+356",
                country_name: "Malta (+356)"
            }, {
                country_code: "mh",
                calling_code: "+692",
                country_name: "Marshall Islands (+692)"
            }, {
                country_code: "mq",
                calling_code: "+596",
                country_name: "Martinique (+596)"
            }, {
                country_code: "mr",
                calling_code: "+222",
                country_name: "Mauritania (+222)"
            }, {
                country_code: "yt",
                calling_code: "+269",
                country_name: "Mayotte (+269)"
            }, {
                country_code: "mx",
                calling_code: "+52",
                country_name: "Mexico (+52)"
            }, {
                country_code: "fm",
                calling_code: "+691",
                country_name: "Micronesia (+691)"
            }, {
                country_code: "md",
                calling_code: "+373",
                country_name: "Moldova (+373)"
            }, {
                country_code: "mc",
                calling_code: "+377",
                country_name: "Monaco (+377)"
            }, {
                country_code: "mn",
                calling_code: "+976",
                country_name: "Mongolia (+976)"
            }, {
                country_code: "ms",
                calling_code: "+1664",
                country_name: "Montserrat (+1664)"
            }, {
                country_code: "ma",
                calling_code: "+212",
                country_name: "Morocco (+212)"
            }, {
                country_code: "mz",
                calling_code: "+258",
                country_name: "Mozambique (+258)"
            }, {
                country_code: "mn",
                calling_code: "+95",
                country_name: "Myanmar (+95)"
            }, {
                country_code: "na",
                calling_code: "+264",
                country_name: "Namibia (+264)"
            }, {
                country_code: "nr",
                calling_code: "+674",
                country_name: "Nauru (+674)"
            }, {
                country_code: "np",
                calling_code: "+977",
                country_name: "Nepal (+977)"
            }, {
                country_code: "nl",
                calling_code: "+31",
                country_name: "Netherlands (+31)"
            }, {
                country_code: "nc",
                calling_code: "+687",
                country_name: "New Caledonia (+687)"
            }, {
                country_code: "nz",
                calling_code: "+64",
                country_name: "New Zealand (+64)"
            }, {
                country_code: "ni",
                calling_code: "+505",
                country_name: "Nicaragua (+505)"
            }, {
                country_code: "ne",
                calling_code: "+227",
                country_name: "Niger (+227)"
            }, {
                country_code: "ng",
                calling_code: "+234",
                country_name: "Nigeria (+234)"
            }, {
                country_code: "nu",
                calling_code: "+683",
                country_name: "Niue (+683)"
            }, {
                country_code: "nf",
                calling_code: "+672",
                country_name: "Norfolk Islands (+672)"
            }, {
                country_code: "np",
                calling_code: "+670",
                country_name: "Northern Marianas (+670)"
            }, {
                country_code: "no",
                calling_code: "+47",
                country_name: "Norway (+47)"
            }, {
                country_code: "om",
                calling_code: "+968",
                country_name: "Oman (+968)"
            }, {
                country_code: "pk",
                calling_code: "+92",
                country_name: "Pakistan (+92)"
            }, {
                country_code: "pw",
                calling_code: "+680",
                country_name: "Palau (+680)"
            }, {
                country_code: "pa",
                calling_code: "+507",
                country_name: "Panama (+507)"
            }, {
                country_code: "pg",
                calling_code: "+675",
                country_name: "Papua New Guinea (+675)"
            }, {
                country_code: "py",
                calling_code: "+595",
                country_name: "Paraguay (+595)"
            }, {
                country_code: "pe",
                calling_code: "+51",
                country_name: "Peru (+51)"
            }, {
                country_code: "ph",
                calling_code: "+63",
                country_name: "Philippines (+63)"
            }, {
                country_code: "pl",
                calling_code: "+48",
                country_name: "Poland (+48)"
            }, {
                country_code: "pt",
                calling_code: "+351",
                country_name: "Portugal (+351)"
            }, {
                country_code: "pr",
                calling_code: "+1787",
                country_name: "Puerto Rico (+1787)"
            }, {
                country_code: "qa",
                calling_code: "+974",
                country_name: "Qatar (+974)"
            }, {
                country_code: "re",
                calling_code: "+262",
                country_name: "Reunion (+262)"
            }, {
                country_code: "ro",
                calling_code: "+40",
                country_name: "Romania (+40)"
            }, {
                country_code: "ru",
                calling_code: "+7",
                country_name: "Russia (+7)"
            }, {
                country_code: "rw",
                calling_code: "+250",
                country_name: "Rwanda (+250)"
            }, {
                country_code: "sm",
                calling_code: "+378",
                country_name: "San Marino (+378)"
            }, {
                country_code: "st",
                calling_code: "+239",
                country_name: "Sao Tome & Principe (+239)"
            }, {
                country_code: "sa",
                calling_code: "+966",
                country_name: "Saudi Arabia (+966)"
            }, {
                country_code: "sn",
                calling_code: "+221",
                country_name: "Senegal (+221)"
            }, {
                country_code: "si",
                calling_code: "+381",
                country_name: "Serbia (+381)"
            }, {
                country_code: "sc",
                calling_code: "+248",
                country_name: "Seychelles (+248)"
            }, {
                country_code: "sl",
                calling_code: "+232",
                country_name: "Sierra Leone (+232)"
            }, {
                country_code: "sg",
                calling_code: "+65",
                country_name: "Singapore (+65)"
            }, {
                country_code: "sk",
                calling_code: "+421",
                country_name: "Slovak Republic (+421)"
            }, {
                country_code: "si",
                calling_code: "+386",
                country_name: "Slovenia (+386)"
            }, {
                country_code: "sb",
                calling_code: "+677",
                country_name: "Solomon Islands (+677)"
            }, {
                country_code: "so",
                calling_code: "+252",
                country_name: "Somalia (+252)"
            }, {
                country_code: "za",
                calling_code: "+27",
                country_name: "South Africa (+27)"
            }, {
                country_code: "es",
                calling_code: "+34",
                country_name: "Spain (+34)"
            }, {
                country_code: "lk",
                calling_code: "+94",
                country_name: "Sri Lanka (+94)"
            }, {
                country_code: "sh",
                calling_code: "+290",
                country_name: "St. Helena (+290)"
            }, {
                country_code: "kn",
                calling_code: "+1869",
                country_name: "St. Kitts (+1869)"
            }, {
                country_code: "sc",
                calling_code: "+1758",
                country_name: "St. Lucia (+1758)"
            }, {
                country_code: "sd",
                calling_code: "+249",
                country_name: "Sudan (+249)"
            }, {
                country_code: "sr",
                calling_code: "+597",
                country_name: "Suriname (+597)"
            }, {
                country_code: "sz",
                calling_code: "+268",
                country_name: "Swaziland (+268)"
            }, {
                country_code: "se",
                calling_code: "+46",
                country_name: "Sweden (+46)"
            }, {
                country_code: "ch",
                calling_code: "+41",
                country_name: "Switzerland (+41)"
            }, {
                country_code: "si",
                calling_code: "+963",
                country_name: "Syria (+963)"
            }, {
                country_code: "tw",
                calling_code: "+886",
                country_name: "Taiwan (+886)"
            }, {
                country_code: "tj",
                calling_code: "+7",
                country_name: "Tajikstan (+7)"
            }, {
                country_code: "th",
                calling_code: "+66",
                country_name: "Thailand (+66)"
            }, {
                country_code: "tg",
                calling_code: "+228",
                country_name: "Togo (+228)"
            }, {
                country_code: "to",
                calling_code: "+676",
                country_name: "Tonga (+676)"
            }, {
                country_code: "tt",
                calling_code: "+1868",
                country_name: "Trinidad & Tobago (+1868)"
            }, {
                country_code: "tn",
                calling_code: "+216",
                country_name: "Tunisia (+216)"
            }, {
                country_code: "tr",
                calling_code: "+90",
                country_name: "Turkey (+90)"
            }, {
                country_code: "tm",
                calling_code: "+7",
                country_name: "Turkmenistan (+7)"
            }, {
                country_code: "tm",
                calling_code: "+993",
                country_name: "Turkmenistan (+993)"
            }, {
                country_code: "tc",
                calling_code: "+1649",
                country_name: "Turks & Caicos Islands (+1649)"
            }, {
                country_code: "tv",
                calling_code: "+688",
                country_name: "Tuvalu (+688)"
            }, {
                country_code: "ug",
                calling_code: "+256",
                country_name: "Uganda (+256)"
            }, {
                country_code: "gb",
                calling_code: "+44",
                country_name: "UK (+44)"
            }, {
                country_code: "ua",
                calling_code: "+380",
                country_name: "Ukraine (+380)"
            }, {
                country_code: "ae",
                calling_code: "+971",
                country_name: "United Arab Emirates (+971)"
            }, {
                country_code: "uy",
                calling_code: "+598",
                country_name: "Uruguay (+598)"
            }, {
                country_code: "us",
                calling_code: "+1",
                country_name: "USA (+1)"
            }, {
                country_code: "uz",
                calling_code: "+7",
                country_name: "Uzbekistan (+7)"
            }, {
                country_code: "vu",
                calling_code: "+678",
                country_name: "Vanuatu (+678)"
            }, {
                country_code: "va",
                calling_code: "+379",
                country_name: "Vatican City (+379)"
            }, {
                country_code: "ve",
                calling_code: "+58",
                country_name: "Venezuela (+58)"
            }, {
                country_code: "vn",
                calling_code: "+84",
                country_name: "Vietnam (+84)"
            }, {
                country_code: "vg",
                calling_code: "+1284",
                country_name: "Virgin Islands - British (+1284)"
            }, {
                country_code: "vi",
                calling_code: "+1340",
                country_name: "Virgin Islands - US (+1340)"
            }, {
                country_code: "wf",
                calling_code: "+681",
                country_name: "Wallis & Futuna (+681)"
            }, {
                country_code: "ye",
                calling_code: "+969",
                country_name: "Yemen (North)(+969)"
            }, {
                country_code: "ye",
                calling_code: "+967",
                country_name: "Yemen (South)(+967)"
            }, {
                country_code: "zm",
                calling_code: "+260",
                country_name: "Zambia (+260)"
            }, {
                country_code: "zw",
                calling_code: "+263",
                country_name: "Zimbabwe (+263)"
            }],
            c = _.indexBy(b, "country_code"),
            d = function(b) {
                return a({
                    method: "GET",
                    url: "/utils/phone-number/" + b
                })
            },
            e = function() {
                return b
            },
            f = function(a) {
                return a = a.toLowerCase(), c[a]
            };
        return {
            fetchCountryCodeForPhoneNumber: d,
            getCountryList: e,
            getCountryFromCountryCode: f
        }
    }]), angular.module("videoconference").factory("serverSocketConfig", ["$location", function(a) {
        var b = a.protocol() + "://" + a.host() + ":" + a.port();
        return {
            host: b,
            timeout: 1e4,
            reconnectionLimit: 1 / 0,
            maxReconnectionAttempts: 10
        }
    }]), angular.module("videoconference").factory("knockerQueue", ["RoomService", "Event", "Analytics", "$log", "$rootScope", function(a, b, c, d, e) {
        var f = {
                knocker: null,
                isEmpty: function() {
                    return null !== f.knocker
                }
            },
            g = function(a) {
                return 0 === a.length ? void(f.knocker = null) : void(_.contains(a, f.knocker) && f.knocker.isReady() || (f.knocker = _.find(a, function(a) {
                    return a.isReady()
                })))
            };
        return e.$on(b.KNOCKER_STATUS_CHANGED, function(b, c) {
            c.knocker.isReady() && g(a.knockers)
        }), e.$watchCollection(function() {
            return a.knockers
        }, g), f
    }]), angular.module("videoconference").factory("serverSocket", ["$location", "$rootScope", "Analytics", "serverSocketConfig", "$q", "Credentials", function(a, b, c, d, e, f) {
        var g, h = io.connect(d.host, {
            "connect timeout": d.timeout,
            "try multiple transports": !1,
            reconnect: !0,
            "reconnection limit": d.reconnectionLimit,
            "max reconnection attempts": d.maxReconnectionAttempts,
            "auto connect": !1
        });
        return h.getSelfId = function() {
            return g
        }, h.identify = function() {
            var a = e.defer();
            return f.getCredentials().then(function(b) {
                var c = {
                    deviceCredentials: b
                };
                h.emit(protocol.req.IDENTIFY_DEVICE, c), h.$once(protocol.res.DEVICE_IDENTIFIED, function(c) {
                    return c.error ? void a.reject(c.error) : void a.resolve(b)
                })
            }).catch(a.reject), a.promise
        }, h.disconnectOnConnect = function() {
            h.once("connect", function() {
                h.disconnect()
            })
        }, h.getTransport = function() {
            return h && h.socket && h.socket.transport && h.socket.transport.name
        }, h.isConnected = function() {
            return h.socket.connected
        }, h.$on = function(a, c) {
            return h.on(a, function(a, d) {
                b.$apply(c(a, d))
            }), h
        }, h.$once = function(a, c) {
            return h.once(a, function(a, d) {
                b.$apply(c(a, d))
            }), h
        }, h.emitIfConnected = function(a, b) {
            h.isConnected() && h.emit(a, b)
        }, h.promiseEmit = function(a, b, c) {
            var d = e.defer();
            return h.emit(a, c), h.once(b, function(a) {
                a.error ? d.reject(new Error(a.error)) : d.resolve(a)
            }), d.promise
        }, h.connect = function() {
            h.socket.connect()
        }, h.$on(protocol.res.ROOM_JOINED, function(a) {
            g = a.selfId
        }), h.$on("connect", function() {
            h.identify().then(function() {
                b.$broadcast("connected")
            }, function() {
                h.disconnect()
            })
        }), h.$on("disconnect", function() {
            b.$broadcast("disconnected")
        }), h
    }]), angular.module("videoconference").factory("browserSupport", ["features", function(a) {
        return {
            webRtcDetectedBrowser: webrtcDetectedBrowser,
            isWebRtcEnabled: function() {
                return a.isWebRtcPluginEnabled || "Safari" !== webrtcDetectedBrowser ? getUserMedia && RTCPeerConnection && "prototype" in RTCPeerConnection : !1
            }
        }
    }]), angular.module("videoconference").factory("Stream", [function() {
        var a = function(a, b) {
            this.id = a, this.type = b, this.isFullScreen = !1, this.isAudioEnabled = !0, this.isVideoEnabled = !0
        };
        return a.type = {
            CAMERA: "camera",
            SCREEN_SHARE: "screen_share"
        }, a.prototype.setup = function(a, b) {
            return this.stream = a, this.streamId = a.id, void 0 !== b && (this.streamId += b), this
        }, a.prototype.setVideoEnabled = function(a) {
            this.stream.getVideoTracks().forEach(function(b) {
                b.enabled = a
            }), this.isVideoEnabled = a
        }, a.prototype.setAudioEnabled = function(a) {
            this.stream.getAudioTracks().forEach(function(b) {
                b.enabled = a
            }), this.isAudioEnabled = a
        }, a
    }]), angular.module("videoconference").factory("Client", ["ConnectionStatus", "Stream", function(a, b) {
        var c = function(b) {
            this.id = b.id, this.name = b.name, this.userId = b.userId, this.deviceId = b.deviceId, this.isOwner = b.isOwner, this.isMember = b.isMember, this.isVideoEnabled = b.isVideoEnabled, this.isAudioEnabled = b.isAudioEnabled, this.isChatOnly = b.isChatOnly, this.isScreenSharingEnabled = !1, this.rotation = b.rotation, this.isLocalClient = !1, this.numberOfStreams = 0, this.streams = [], this.capabilities = {
                audio: !1,
                video: !1,
                screen_share: !1
            }, this.status = a.status.CONNECTING, this.statusText = a.statusText[this.status], this.userHasExplicitlyDisabledVideo = !1
        };
        return c.prototype.stopScreenShare = function() {
            this.removeStreamByType(b.type.SCREEN_SHARE)
        }, c.prototype.setAudioEnabled = function(a) {
            this.isAudioEnabled = a, this.isLocalClient && this.streams.forEach(function(b) {
                b.setAudioEnabled(a)
            })
        }, c.prototype.setVideoEnabled = function(a) {
            this.isVideoEnabled = a, this.streams[0].setVideoEnabled(a)
        }, c.prototype.newStream = function(a, c) {
            var d = c ? c : this.streams.length,
                e = new b(d, a);
            return 0 !== d || this.isVideoEnabled || (e.isVideoEnabled = !1), this.streams.push(e), this.numberOfStreams++, e
        }, c.prototype.getStream = function(a) {
            return this.streams.reduce(function(b, c) {
                return c.id === a ? c : b
            }, null)
        }, c.prototype.removeStream = function(a) {
            this.streams.forEach(function(b, c) {
                b.id === a && (this.streams.splice(c, 1), this.numberOfStreams--)
            }, this)
        }, c.prototype.removeStreamByType = function(a) {
            this.streams.forEach(function(b, c) {
                b.type === a && (this.streams.splice(c, 1), this.numberOfStreams--, b.stream.stop())
            }, this)
        }, c.prototype.setStatus = function(b) {
            this.status = b.status, this.statusText = a.statusText[this.status]
        }, c
    }]), angular.module("videoconference").factory("Knocker", ["serverSocket", "Stream", "ConnectionStatus", function(a, b, c) {
        var d = function(a, b, c) {
            this.clientId = a, this.imageUrl = b, this.liveVideo = c, this.stream = null, this.status = null, this.statusText = ""
        };
        return d.prototype.newStream = function(a) {
            var c = a ? a : 0;
            return this.stream = new b(c, b.type.CAMERA), this.stream
        }, d.prototype.accept = function() {
            a.emit(protocol.req.ACCEPT_KNOCK, {
                clientId: this.clientId
            })
        }, d.prototype.reject = function() {
            a.emit(protocol.req.REJECT_KNOCK, {
                clientId: this.clientId
            })
        }, d.prototype.setStatus = function(a) {
            this.status = a.status, this.statusText = c.statusText[this.status]
        }, d.prototype.isReady = function() {
            return this.liveVideo ? this.status === c.status.CONNECTION_FAILED || this.status === c.status.CONNECTION_SUCCESSFUL ? !0 : !1 : !0
        }, d
    }]), angular.module("videoconference").factory("InstallableExtension", ["$rootScope", "Event", "$log", function(a, b, c) {
        var d = function() {
            this.hasExtension = !1, this.installState = {}
        };
        return d.prototype.canInstall = function() {
            return "undefined" != typeof chrome && "undefined" != typeof chrome.webstore
        }, d.prototype.checkForExtension = function() {
            this.hasExtension !== !0 && this.sendMessage("check-extension", void 0, "check-extension")
        }, d.prototype.isAwaitingLoadAfterInstall = function() {
            return this.hasExtension && this.installState && this.installState.awaitingLoadAfterInstall
        }, d.prototype.triggerExtensionLoaded = function() {
            this.hasExtension = !0, this.isAwaitingLoadAfterInstall() && (a.$broadcast(b.EXTENSION_INSTALL, {
                state: "loaded",
                installReason: this.installState.installReason
            }), this.installState = {})
        }, d.prototype.triggerInstall = function(d) {
            var e = d || {};
            this.installState = {
                awaitingLoadAfterInstall: !0,
                installReason: d.reason
            }, a.$broadcast(b.EXTENSION_INSTALL, {
                state: "started",
                installReason: d.reason
            });
            var f = this;
            chrome.webstore.install("https://chrome.google.com/webstore/detail/" + this.extensionId, function() {
                a.$apply(function() {
                    a.$broadcast(b.EXTENSION_INSTALL, {
                        state: "installed",
                        installReason: f.installState.installReason
                    }), e.onSuccess && e.onSuccess()
                })
            }, function(d) {
                c.debug("Error installing extension: %o", d), a.$apply(function() {
                    a.$broadcast(b.EXTENSION_INSTALL, {
                        state: "error",
                        installReason: f.installState.installReason,
                        data: d
                    }), f.installState = {}, e.onError && e.onError(d)
                })
            })
        }, d
    }]).factory("chromeExtension", ["$rootScope", "$log", "RoomService", "inRoomNotificationService", "RoomAdminPanel", "kissmetrics", "$timeout", "$window", "Event", "InstallableExtension", "MessageEventService", "Credentials", function(a, b, c, d, e, f, g, h, i, j, k, l) {
        function m() {
            return l.getCredentials().then(function(a) {
                return q.sendDeviceCredentials(a)
            })
        }
        var n = function(a, b) {
                return a && a.hasOwnProperty(b) ? a[b] : null
            },
            o = function() {
                j.call(this), this.features = {}, this.extensionId = "pokjppmpccggefgcenpngoleemajgnmo", this.extensionClientId = void 0, this.followedRooms = {}, this.isRoomFollowed = !1
            };
        o.prototype = Object.create(j.prototype), o.prototype.constructor = o, o.prototype.sendMessage = function(a, c, d) {
            b.info("ChromeNotifierAction: %s message: %o", a, c), window.postMessage({
                type: "ChromeNotifierAction",
                action: a,
                argument: c,
                callback: d
            }, "*")
        }, o.prototype.sendAvatarData = function(a) {
            this.sendMessage("new_avatar", a, "new_avatar")
        }, o.prototype.triggerInstall = function() {
            q.canFollow() && j.prototype.triggerInstall.apply(this, arguments)
        }, o.prototype.canFollow = function() {
            return this.canInstall() && c.isAllowedToFollow()
        };
        var p = function(a) {
            return function(b) {
                this.sendMessage(a, {
                    roomName: b
                })
            }
        };
        o.prototype.sendAnalyticsInformation = function(a) {
            this.sendMessage("analytics-information", a)
        }, o.prototype.unfollow = p("unfollow-room"), o.prototype.mute = p("mute-room"), o.prototype.unmute = p("unmute-room"), o.prototype.follow = function(a) {
            if (this.canFollow()) {
                var b = {
                    roomName: a,
                    token: c.getRoomToken()
                };
                this.sendMessage("follow-room", b)
            }
        }, o.prototype.sendDeviceCredentials = function(a) {
            this.sendMessage("device-credentials", {
                deviceCredentials: a
            })
        };
        var q = new o,
            r = function() {
                var a = c.roomName,
                    b = {
                        roomName: a,
                        token: c.getRoomToken()
                    };
                q.sendMessage("owner-changed", b)
            },
            s = function(a, b) {
                var c = a[b];
                q.followedRooms = a, q.currentRoom = c, q.isRoomFollowed = !!c
            };
        a.$watch(function() {
            return c.isSelfOwner
        }, function(a, b) {
            a !== b && r()
        }), a.$watch(function() {
            return c.roomName
        }, function(a) {
            s(q.followedRooms, a)
        });
        var t = function() {
                q.sendMessage("get-followed-rooms", void 0, "get-followed-rooms")
            },
            u = function() {
                if (q.hasExtension) {
                    var a = f.getId();
                    return a ? void q.sendAnalyticsInformation({
                        kissmetricsId: a
                    }) : void g(u, 1e3)
                }
            };
        return k.addEventListener("ChromeNotifierInjected", function() {
            q.checkForExtension(), u()
        }), k.addEventListener("ChromeNotifierResponse", function() {
            switch (event.data.callback) {
                case "check-extension":
                    event.data.response && (q.features = n(event.data.response, "features") || {}, q.extensionClientId = n(event.data.response, "extensionClientId")), b.log("Got chrome extension information: %o", event.data.response), t(), m(), u(), q.triggerExtensionLoaded();
                    break;
                case "connection-information":
                    b.log("Got connection information: %o", event.data.response), q.extensionClientId = event.data.response.extensionClientId;
                    break;
                case "get-followed-rooms":
                    s(event.data.response, c.roomName);
                    break;
                case "unfollowed-room":
                case "followed-room":
                case "muted-room":
                case "unmuted-room":
                case "change-owner":
                    t();
                    break;
                case "share-screen":
                    a.$broadcast("chromeExtension:share-screen", event.data.response)
            }
        }), q.checkForExtension(), q
    }]), angular.module("videoconference").factory("screenShareExtension", ["$log", "$rootScope", "InstallableExtension", "$window", "isEmbedded", function(a, b, c, d, e) {
        var f = function() {
                var a = d.navigator.appVersion.match(/Chrome\/(.*?)[.]/);
                return a ? parseInt(a[1]) : null
            },
            g = function(a) {
                return f() >= a
            },
            h = function() {
                c.call(this), this.extensionId = "bodncoafpihbhpfljcaofnebjkaiaiga"
            };
        h.prototype = Object.create(c.prototype), h.prototype.constructor = h, h.prototype.shareScreen = function() {
            this.sendMessage("share-screen", void 0)
        }, h.prototype.canInstall = function() {
            return c.prototype.canInstall() && g(34) && !e
        }, h.prototype.sendMessage = function(b, c, d) {
            a.info("ScreenShareAction: %s message: %o", b, c), window.postMessage({
                type: "ScreenShareAction",
                action: b,
                argument: c,
                callback: d
            }, "*")
        };
        var i = new h;
        return window.addEventListener("message", function(a) {
            a.source === window && void 0 !== a.data && ("ScreenShareInjected" === a.data.type ? i.checkForExtension() : "ScreenShareResponse" === a.data.type && b.$apply(function() {
                switch (a.data.callback) {
                    case "check-extension":
                        i.triggerExtensionLoaded();
                        break;
                    case "share-screen":
                        b.$broadcast("screenShareExtension:share-screen", a.data.response)
                }
            }))
        }), i.checkForExtension(), i
    }]), angular.module("videoconference").factory("objStore", ["$window", function(a) {
        return function(b) {
            return {
                loadOrDefault: function(c) {
                    if (a.localStorage[b]) try {
                        return JSON.parse(a.localStorage.getItem(b))
                    } catch (d) {}
                    return c
                },
                save: function(c) {
                    a.localStorage.setItem(b, JSON.stringify(c))
                }
            }
        }
    }]), angular.module("videoconference").factory("multiMap", function() {
        return function(a) {
            var b = a || {};
            return {
                add: function(a, c) {
                    b[a] || (b[a] = []), b[a].push(c)
                },
                get: function(a) {
                    return b[a] || []
                },
                getAllItems: function() {
                    return b
                }
            }
        }
    }), angular.module("videoconference").factory("PeerFactory", ["serverSocket", "RTCManager", "$rootScope", "ConnectionStatus", "features", function(a, b, c, d, e) {
        var f = {
                mandatory: {
                    OfferToReceiveAudio: !0,
                    OfferToReceiveVideo: !0
                }
            },
            g = function(a, b, c) {
                this.id = a, this.configuration = b, this.peerConnection = null, this.remoteStreams = {}, this._createPeerConnection(), this._setSocketListeners(), c()
            };
        return g.prototype._createPeerConnection = function() {
            var b = e.disableIPv6ICE ? {} : {
                optional: [{
                    googIPv6: !0
                }]
            };
            this.peerConnection = new RTCPeerConnection(this.configuration, b), this.peerConnection.onicecandidate = function(b) {
                b.candidate && a.emit(protocol.rtc.GOT_ICE_CANDIDATE + this.id, b.candidate)
            }.bind(this), this.peerConnection.onnegotiationneeded = function() {
                "new" !== this.peerConnection.iceConnectionState && a.emit(protocol.rtc.GOT_NEGOTIATION_NEEDED + this.id)
            }.bind(this), this.peerConnection.onaddstream = function(b) {
                var c = b.stream.id || "0";
                a.emit(protocol.rtc.GOT_STREAM + this.id, c), this.remoteStreams[c] = b.stream
            }.bind(this)
        }, g.prototype._setSocketListeners = function() {
            a.on(protocol.rtc.ADD_STREAM + this.id, function(a, c) {
                var d = b.localStreams[a];
                this.peerConnection.addStream(d), c()
            }.bind(this)), a.on(protocol.rtc.REMOVE_STREAM + this.id, function(a, b) {
                var c = this.peerConnection.getStreamById(a);
                this.peerConnection.removeStream(c), b()
            }.bind(this)), a.on(protocol.rtc.CREATE_OFFER + this.id, function(a, b) {
                this.peerConnection.createOffer(b, function() {}, f)
            }.bind(this)), a.on(protocol.rtc.CREATE_ANSWER + this.id, function(a, b) {
                this.peerConnection.createAnswer(b, function() {}, f)
            }.bind(this)), a.on(protocol.rtc.SET_LOCAL_DESCRIPTION + this.id, function(a, b) {
                this.peerConnection.setLocalDescription(new RTCSessionDescription(a), b, function() {})
            }.bind(this)), a.on(protocol.rtc.SET_REMOTE_DESCRIPTION + this.id, function(a, b) {
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(a), b, function() {})
            }.bind(this)), a.on(protocol.rtc.ADD_ICE_CANDIDATE + this.id, function(a) {
                this.peerConnection.addIceCandidate(new RTCIceCandidate(a))
            }.bind(this)), a.on(protocol.rtc.USE_STREAM + this.id, function(a) {
                c.$apply(function() {
                    c.$broadcast(d.event.STREAM_ADDED, {
                        clientId: a.clientId,
                        stream: this.remoteStreams[a.streamId] || this.remoteStreams[0],
                        streamExtraId: this.id
                    }), c.$broadcast(d.event.CLIENT_CONNECTION_STATUS_CHANGED, {
                        clientId: a.clientId,
                        status: d.status.CONNECTION_SUCCESSFUL
                    })
                }.bind(this))
            }.bind(this)), a.on(protocol.rtc.CLOSE + this.id, function() {
                this.peerConnection.onicecandidate = void 0, this.peerConnection.onnegotiationneeded = void 0, this.peerConnection.onaddstream = void 0, a.removeAllListeners(protocol.rtc.ADD_STREAM + this.id), a.removeAllListeners(protocol.rtc.REMOVE_STREAM + this.id), a.removeAllListeners(protocol.rtc.CREATE_OFFER + this.id), a.removeAllListeners(protocol.rtc.CREATE_ANSWER + this.id), a.removeAllListeners(protocol.rtc.SET_LOCAL_DESCRIPTION + this.id), a.removeAllListeners(protocol.rtc.SET_REMOTE_DESCRIPTION + this.id), a.removeAllListeners(protocol.rtc.ICE + this.id), a.removeAllListeners(protocol.rtc.USE_STREAM + this.id), a.removeAllListeners(protocol.rtc.CLOSE + this.id), this.peerConnection.close(), delete this.peerConnection
            }.bind(this))
        }, {
            createPeer: function(a, b, c) {
                return new g(a, b, c)
            }
        }
    }]), angular.module("videoconference").factory("apiUrl", ["$location", function(a) {
        function b() {
            var b = -1 !== a.host().indexOf("appear.in");
            return b ? "https://api.appear.in" : a.protocol() + "://" + a.host() + ":8090"
        }
        return b()
    }]), angular.module("videoconference").factory("appearinApi", ["$http", "$q", "Credentials", "apiUrl", function(a, b, c, d) {
        function e(e) {
            function f(c) {
                function f(a) {
                    return {
                        Authorization: "Basic " + window.btoa(a.credentials.uuid + ":" + a.hmac)
                    }
                }
                if (!c.credentials) return b.reject("no credentials");
                var g = e && e.url || "/",
                    h = _.defaults(f(c), e.headers),
                    i = _.defaults({
                        url: d + g,
                        headers: h
                    }, e);
                return a(i)
            }
            return c.getCredentials().then(f)
        }
        return e
    }]), angular.module("videoconference").filter("clientFilter", function() {
        return function(a, b) {
            return _.filter(a, function(a) {
                return a !== b ? a : void 0
            })
        }
    }), angular.module("videoconference").filter("removeChatOnlyFilter", [function() {
        return function(a) {
            return _.filter(a, function(a) {
                return !a.isChatOnly
            })
        }
    }]), angular.module("videoconference").filter("capitalize", function() {
        return function(a) {
            return a ? a.charAt(0).toUpperCase() + a.slice(1) : a
        }
    }), angular.module("videoconference").filter("timestamp", function() {
        return function(a) {
            var b = 864e5,
                c = new Date(a);
            return (new Date).getTime() - c.getTime() > b ? c.toISOString().substring(0, 10) : c.toTimeString().substring(0, 5)
        }
    }), angular.module("videoconference").factory("Event", function() {
        return {
            STATE_CHANGED: "state_changed",
            LOCAL_CAMERA_TOGGLED: "local_camera_toggled",
            LOCAL_MICROPHONE_TOGGLED: "local_microphone_toggled",
            LOCAL_SCREENSHARE_TOGGLED: "local_screenshare_toggled",
            CLIENT_LEFT: "client_left",
            NEW_CLIENT: "new_client",
            KNOCK_ACCEPTED: "knock_accepted",
            OWNERS_CHANGED: "owners_changed",
            CLIENT_KICKED: "client_kicked",
            PROMPT_FOR_ROOM_EMAIL: "prompt_for_room_email",
            IN_ROOM_NOTIFICATION_CHANGED: "in_room_notification_changed",
            EXTENSION_INSTALL: "extension_install",
            KNOCKER_STATUS_CHANGED: "knocker_status_change",
            CLIENT_METADATA_RECEIVED: "client_metadata_received",
            CONTACTS_UPDATED: "contacts_updated",
            ROOM_JOINED: "room_joined"
        }
    }), angular.module("videoconference").factory("State", function() {
        return {
            WAITING_FOR_CONNECTION: "waiting_for_connection",
            WAITING_FOR_ACCESS: "waiting_for_access",
            WAITING_FOR_ROOM_INFORMATION: "waiting_for_room_information",
            PLEASE_GRANT_ACCESS: "please_grant_access",
            CAMERA_ACCESS_DENIED: "camera_access_denied",
            FIREFOX_CONFIG_ERROR: "firefox_config_error",
            ROOM_LOCKED: "room_locked",
            ROOM_FULL: "room_full",
            READY: "ready",
            DISCONNECTING_CLIENT: "disconnecting_client",
            SPLASH_SCREEN: "splash_screen",
            KICKED: "kicked",
            EXITED: "exited"
        }
    }), angular.module("videoconference").factory("ConnectionStatus", function() {
        return {
            event: {
                CLIENT_CONNECTION_STATUS_CHANGED: "client_connection_status_changed",
                STREAM_ADDED: "stream_added"
            },
            status: {
                CONNECTING: "connecting",
                CONNECTION_FAILED: "connection_failed",
                CONNECTION_SUCCESSFUL: "connection_successful",
                CONNECTION_INACTIVE: "connection_inactive"
            },
            statusText: {
                connecting: "Right! Let's get you connected",
                connection_failed: "We're really sorry, but we are not able to connect you. There might be a problem with your network. See our FAQ for tips on how to resolve this, or contact us at feedback@appear.in",
                connection_successful: "Connected",
                connection_inactive: "No data sent or received on the network."
            },
            analyticsText: {
                connecting: "Connection started",
                connection_failed: "Connection failed",
                connection_successful: "Connection established",
                connection_inactive: "Connection inactive (no data sent/received)"
            }
        }
    }),
    function(a) {
        a.req = {
            JOIN_ROOM: "join_room",
            KICK_CLIENT: "kick_client",
            LEAVE_ROOM: "leave_room",
            START_WATCH: "start_watch",
            END_WATCH: "end_watch",
            START_NEW_STREAM: "start_new_stream",
            END_STREAM: "end_stream",
            ENABLE_AUDIO: "enable_audio",
            ENABLE_VIDEO: "enable_video",
            ROTATE_SCREEN: "rotate_screen",
            SET_LOCK: "set_lock",
            SEND_RESET_EMAIL: "send_reset_email",
            RESET_BACKGROUND_IMAGE: "reset_background_image",
            GET_CHAT_HISTORY: "get_chat_history",
            CLEAR_CHAT_HISTORY: "clear_chat_history",
            KNOCK_ROOM: "knock_room",
            ACCEPT_KNOCK: "accept_knock",
            REJECT_KNOCK: "reject_knock",
            SET_MEMBERS: "set_members",
            CLAIM_ROOM: "claim_room",
            IDENTIFY_DEVICE: "identify_device",
            SEND_CLIENT_METADATA: "send_client_metadata"
        }, a.res = {
            ROOM_JOINED: "room_joined",
            WATCH_STARTED: "watch_started",
            WATCH_KICKED: "watch_kicked",
            WATCH_ENDED: "watch_ended",
            NEW_CLIENT: "new_client",
            CLIENT_READY: "client_ready",
            CLIENT_LEFT: "client_left",
            CLIENT_KICKED: "client_kicked",
            NEW_STREAM_STARTED: "new_stream_started",
            STREAM_ENDED: "stream_ended",
            OWNERS_CHANGED: "owners_changed",
            AUDIO_ENABLED: "audio_enabled",
            VIDEO_ENABLED: "video_enabled",
            SCREEN_ROTATED: "screen_rotated",
            ROOM_LOCKED: "room_locked",
            BACKGROUND_IMAGE_CHANGED: "background_image_changed",
            RESET_EMAIL_SENT: "reset_email_sent",
            CONNECTION_INFORMATION: "connection_information",
            CHAT_HISTORY: "chat_history",
            CHAT_HISTORY_CLEARED: "chat_history_cleared",
            ROOM_KNOCKED: "room_knocked",
            KNOCKER_LEFT: "knocker_left",
            KNOCK_ACCEPTED: "knock_accepted",
            KNOCK_REJECTED: "knock_rejected",
            MEMBERS_SET: "members_set",
            DEVICE_IDENTIFIED: "device_identified",
            CONTACTS_UPDATED: "contacts_updated",
            CLIENT_METADATA_RECEIVED: "client_metadata_received",
            OWNER_NOTIFIED: "owner_notified",
            CLIENT_USER_ID_CHANGED: "client_user_id_changed",
            USER_NOTIFIED: "user_notified",
            SOCKET_USER_ID_CHANGED: "socket_user_id_changed"
        }, a.err = {
            INVALID_ROOM_NAME: "invalid_room_name",
            ROOM_LOCKED: "room_locked",
            ROOM_FULL: "room_full",
            NOT_IN_A_ROOM: "not_in_a_room",
            MISSING_PARAMETERS: "missing_parameters",
            NOT_AN_OWNER: "not_an_owner",
            ROOM_EMAIL_MISSING: "room_email_missing",
            INVALID_AVATAR: "invalid_avatar",
            INVALID_PARAMETERS: "invalid_parameters",
            TOO_LONG_TEXT: "too_long_text",
            MISSING_ROOM_NAME: "missing_room_name",
            INTERNAL_SERVER_ERROR: "internal_server_error",
            ROOM_ALREADY_CLAIMED: "room_already_claimed"
        }, a.relay = {
            READY_TO_RECEIVE_OFFER: "ready_to_receive_offer",
            SDP_OFFER: "sdp_offer",
            SDP_ANSWER: "sdp_answer",
            ICE_CANDIDATE: "ice_candidate",
            CHAT_MESSAGE: "chat_message"
        }, a.rtc = {
            CREATE_PEER: "rtc_create_peer",
            ADD_STREAM: "rtc_add_stream ",
            REMOVE_STREAM: "rtc_remove_stream ",
            CREATE_OFFER: "rtc_create_offer ",
            CREATE_ANSWER: "rtc_create_answer ",
            SET_LOCAL_DESCRIPTION: "rtc_set_local_description ",
            SET_REMOTE_DESCRIPTION: "rtc_set_remote_description ",
            ADD_ICE_CANDIDATE: "rtc_add_ice_candidate ",
            USE_STREAM: "rtc_use_stream ",
            CLOSE: "rtc_close ",
            GOT_ICE_CANDIDATE: "rtc_got_ice_candidate ",
            GOT_NEGOTIATION_NEEDED: "rtc_got_negotiation_needed ",
            GOT_STREAM: "rtc_got_stream "
        }
    }("undefined" == typeof exports ? this.protocol = {} : exports),
    function(a) {
        a.UPSELL = {
            QUIET_PERIOD_SINCE_LAST_DISMISS: 2592e6,
            DELAY_AFTER_IN_CONVERSATION: 12e4,
            IS_ENABLED: !1
        }, a.Room = {
            ROOM_FULL_THRESHOLD: 8,
            KNOCK_ROOM_FILE_SIZE: 6e4
        }, a.Time = {
            THREE_DAYS_IN_SECONDS: 259200,
            SESSION_KEY_VALIDITY_IN_SECONDS: 1800
        }, a.Validator = {
            BASE_64_JPEG: /^data:image\/jpeg;base64,[a-zA-Z0-9+\/=]+$/,
            EMAIL: /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i
        }, a.Rotation = {
            NONE: "none",
            LEFT: "left",
            RIGHT: "right",
            UPSIDE: "upside"
        }, a.RotationAngles = {
            none: 0,
            upside: 180,
            left: 90,
            right: 270
        }, a.ConnectionReason = {
            NEW_CLIENT: "new_client",
            BACKEND_RESTARTED: "backend_restart",
            CLIENT_RECONNECTED: "client_reconnection"
        }, a.Modals = {
            SCREENSHARE_INSTRUCTIONS: "screenshare_instructions",
            DISPLAYED_KNOCKER: "displayed_knocker",
            DISPLAYED_RECOVERY: "displayed_recovery",
            SUMMON_OWNER: "summon_owner",
            SIGN_IN_TO_SUMMON_OWNER: "sign_in_to_summon_owner"
        }, a.Questionnaire = {
            MAX_NUMBER_OF_CHARACTERS: 2e3
        }, a.Peers = {
            A: "A",
            B: "B"
        }, a.ConnectionType = {
            PEER_TO_PEER: "peer_to_peer",
            PUBLISHER: "publisher",
            SEND_SUBSCRIBER: "send_subscriber",
            RECV_SUBSCRIBER: "recv_subscriber"
        }, a.ConnectionClient = {
            NO_PARTICULAR_RECEIVER: "no_particular_receiver"
        }, a.PhoneContact = {
            AllowedInputFields: ["id", "displayName", "emails", "phoneNumbers"]
        }, a.Contact = {
            AllowedReturnFields: ["id", "userId", "displayName", "roomName", "avatarUrl", "type", "phoneNumbers", "lastInviteTime", "lastConversationTime"],
            RequiredInputFields: ["id", "displayName"],
            Type: {
                PhoneContact: "phone-contact",
                User: "user"
            },
            ContactPointLimitPerType: 20
        }, a.Throttle = {
            DefaultWindowSize: 3e4,
            DefaultMaxHitsDuringWindow: 10
        }, a.RESTErrors = {
            ContactPointAlreadyRegistered: "contact point already registered",
            InvalidCountryCode: "Invalid country calling code",
            InvalidPhoneNumberErrors: ["The string supplied is too short to be a phone number"]
        }
    }("undefined" == typeof exports ? this.constants = {} : exports), angular.module("videoconference").factory("AnalyticsEvents", function() {
        var a = {
            ROOM: "Room",
            RTC: "RTC",
            FRONTPAGE: "Frontpage",
            SOCKETIO: "Socket.io",
            CHAT: "Chat",
            ROOMKEYS: "RoomKeys",
            KNOCK: "Knock",
            CLAIM_ROOM: "Claim room",
            FOLLOW_ROOM: "Follow Room",
            CUSTOMIZE_ROOM: "Customize Room",
            FAQ: "FAQ",
            USER: "User",
            MODAL: "Modal",
            REGISTRATION: "Registration",
            CONTACTS: "Contacts",
            LOGIN: "Login"
        };
        return {
            OWNER_KICKED_OWNER: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Owner kicked owner"
                },
                kissmetrics: "Room: Owner kicked owner"
            },
            OWNER_KICKED_CLIENT: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Owner kicked client"
                },
                kissmetrics: "Room: Owner kicked client"
            },
            OWNER_KICKED_MEMBER: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Owner kicked member"
                },
                kissmetrics: "Room: Owner kicked member"
            },
            MEMBER_KICKED_OWNER: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Member kicked owner"
                },
                kissmetrics: "Room: Member kicked owner"
            },
            MEMBER_KICKED_CLIENT: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Member kicked client"
                },
                kissmetrics: "Room: Member kicked client"
            },
            MEMBER_KICKED_MEMBER: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Member kicked member"
                },
                kissmetrics: "Room: Member kicked member"
            },
            SENT_FEEDBACK: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Sent feedback"
                },
                kissmetrics: "Room: Sent feedback"
            },
            LEFT_USING_LEAVE_BUTTON: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Left room using the leave room button"
                },
                kissmetrics: "Room: Left room using the leave room button"
            },
            USED_FULL_SCREEN: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Used full screen"
                },
                kissmetrics: "Room: Used full screen"
            },
            SHARE_ROOM_LINK_TO_TWITTER: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Shared room link to Twitter"
                },
                kissmetrics: "Room: Shared room link to Twitter"
            },
            SHARE_ROOM_LINK_TO_FACEBOOK: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Shared room link to Facebook"
                },
                kissmetrics: "Room: Shared room link to Facebook"
            },
            SHARE_ROOM_LINK_TO_GOOGLE: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Shared room link to Google+"
                },
                kissmetrics: "Room: Shared room link to Google+"
            },
            ALLOW_SCREEN_SHARE_MODAL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "allow screen share instructions modal"
                },
                kissmetrics: "Room: allow screen share instructions modal"
            },
            KNOCKERS_MODAL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "displayed knockers modal"
                },
                kissmetrics: "Room: displayed knockers modal"
            },
            SUMMON_OWNER_MODAL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "displayed summon owner modal"
                },
                kissmetrics: "Room: displayed summon owner modal"
            },
            COPIED_LINK_TO_CLIPBOARD: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Copy to clipboard"
                },
                kissmetrics: "Room: Copy to clipboard"
            },
            OPENED_ADMIN_PANEL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "opened admin panel"
                },
                kissmetrics: "Room: opened admin panel"
            },
            CLOSED_ADMIN_PANEL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "closed admin panel"
                },
                kissmetrics: "Room: closed admin panel"
            },
            OPENED_CLAIM_PANEL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "opened claim panel"
                },
                kissmetrics: "Room: opened claim panel"
            },
            CLOSED_CLAIM_PANEL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "closed claim panel"
                },
                kissmetrics: "Room: closed claim panel"
            },
            OPENED_RECLAIM_PANEL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "opened reclaim panel"
                },
                kissmetrics: "Room: opened reclaim panel"
            },
            CLOSED_RECLAIM_PANEL: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "closed reclaim panel"
                },
                kissmetrics: "Room: closed reclaim panel"
            },
            OPENED_MODAL: function(b) {
                return {
                    googleAnalytics: {
                        category: a.MODAL,
                        action: "Opened Modal",
                        label: b
                    },
                    kissmetrics: "Modal: opened " + b
                }
            },
            CLOSED_MODAL: function(b) {
                return {
                    googleAnalytics: {
                        category: a.MODAL,
                        action: "Closed Modal",
                        label: b
                    },
                    kissmetrics: "Modal: closed " + b
                }
            },
            AUDIO_ENABLED: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Audio enabled"
                },
                kissmetrics: "Room: Audio enabled"
            },
            AUDIO_DISABLED: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Audio disabled"
                },
                kissmetrics: "Room: Audio disabled"
            },
            VIDEO_ENABLED: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Video enabled"
                },
                kissmetrics: "Room: Video enabled"
            },
            VIDEO_DISABLED: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Video disabled"
                },
                kissmetrics: "Room: Video disabled"
            },
            USED_SCREEN_SHARE: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Used feature",
                    label: "Used screen share"
                },
                kissmetrics: "Room: Used screen share"
            },
            TURN_SERVER_NOT_SUPPLIED: {
                googleAnalytics: {
                    category: a.RTC,
                    action: "Data from server",
                    label: "TURN server not supplied"
                },
                kissmetrics: "RTC: TURN server not supplied"
            },
            CONNECTION_TYPE: {
                googleAnalytics: {
                    category: a.RTC,
                    action: "Connection Type"
                },
                kissmetrics: "RTC: Connection Type"
            },
            CONNECTION_STATUS: {
                googleAnalytics: {
                    category: a.RTC,
                    action: "Connection"
                },
                kissmetrics: "RTC: Connection"
            },
            RANDOMIZED_ROOM_NAME: {
                googleAnalytics: {
                    category: a.FRONTPAGE,
                    action: "User action",
                    label: "Randomized new room name"
                },
                kissmetrics: "Frontpage: Randomized new room name"
            },
            CREATED_ROOM_FROM_FRONTPAGE: {
                googleAnalytics: {
                    category: a.FRONTPAGE,
                    action: "User action",
                    label: "Created room from frontpage"
                },
                kissmetrics: "Created room from frontpage"
            },
            SOCKET_DISCONNECT: {
                googleAnalytics: {
                    category: a.SOCKETIO,
                    action: "Disconnect"
                },
                kissmetrics: "Socket.io disconnect"
            },
            SOCKET_CONNECT: {
                googleAnalytics: {
                    category: a.SOCKETIO,
                    action: "Connect"
                },
                kissmetrics: "Socket.io connect"
            },
            SOCKET_RECONNECT: {
                googleAnalytics: {
                    category: a.SOCKETIO,
                    action: "Reconnect"
                },
                kissmetrics: "Socket.io reconnect"
            },
            SOCKET_CONNECT_FAILED: {
                googleAnalytics: {
                    category: a.SOCKETIO,
                    action: "Connect failed"
                },
                kissmetrics: "Socket.io connect failed"
            },
            SOCKET_RECONNECT_FAILED: {
                googleAnalytics: {
                    category: a.SOCKETIO,
                    action: "Reconnect failed"
                },
                kissmetrics: "Socket.io reconnect failed"
            },
            SOCKET_ERROR: {
                googleAnalytics: {
                    category: a.SOCKETIO,
                    action: "Unknown error"
                },
                kissmetrics: "Socket.io unknown error"
            },
            CHAT_HISTORY_OPENED_USING_TOGGLE: {
                googleAnalytics: {
                    category: a.CHAT,
                    action: "History opened",
                    label: "toggle button click"
                },
                kissmetrics: "Chat history opened via button"
            },
            CHAT_HISTORY_CLOSED_USING_TOGGLE: {
                googleAnalytics: {
                    category: a.CHAT,
                    action: "History closed",
                    label: "toggle button click"
                },
                kissmetrics: "Chat history closed via button"
            },
            CHAT_HISTORY_OPENED_USING_INPUT_FIELD: {
                googleAnalytics: {
                    category: a.CHAT,
                    action: "History opened",
                    label: "input field click"
                },
                kissmetrics: "Chat history opened via input field"
            },
            CHAT_MESSAGE_SENT: {
                googleAnalytics: {
                    category: a.CHAT,
                    action: "Message sent"
                },
                kissmetrics: "Chat message sent"
            },
            MEMBERS_KEYS_CHANGED: {
                googleAnalytics: {
                    category: a.ROOMKEYS,
                    action: "members list changed"
                },
                kissmetrics: "RoomKeys: members list changed"
            },
            NEW_KNOCKER: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "New knocker"
                },
                kissmetrics: "Knock: New knocker"
            },
            ACCEPT_KNOCKER: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "Accept knocker"
                },
                kissmetrics: "Knock: Accept knocker"
            },
            REJECT_KNOCKER: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "Reject knocker"
                },
                kissmetrics: "Knock: Reject knocker"
            },
            KNOCKER_TOOK_PICTURE: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "Took picture"
                },
                kissmetrics: "Knock: Took picture"
            },
            KNOCKER_RESET_PICTURE: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "Reset picture"
                },
                kissmetrics: "Knock: Reset picture"
            },
            KNOCKER_KNOCKED_ROOM: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "Knocked room"
                },
                kissmetrics: "Knock: Knocked room"
            },
            KNOCKER_JOINED_ROOM: {
                googleAnalytics: {
                    category: a.KNOCK,
                    action: "Joined knocked room"
                },
                kissmetrics: "Knock: Joined knocked room"
            },
            CLAIM_MODAL_OPENED_FROM_PROMOTION: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Claim room modal opened from promotion"
                },
                kissmetrics: "Claim room modal opened from promotion"
            },
            CHANGED_ROOM_CODE: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "User changed room code"
                },
                kissmetrics: "User changed room code"
            },
            SENT_RESET_EMAIL: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Sent reset instructions via email"
                },
                kissmetrics: "Sent reset instructions via email"
            },
            CURRENT_CLIENT_CLAIMED_ROOM: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Current client claimed the room"
                },
                kissmetrics: "Current client claimed the room"
            },
            ANOTHER_CLIENT_CLAIMED_ROOM: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Another client claimed the room"
                },
                kissmetrics: "Another client claimed the room"
            },
            BECAME_OWNER: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Current client because owner"
                },
                kissmetrics: "Current client because owner"
            },
            BACKGROUND_IMAGE_SELECT_CLICK: {
                googleAnalytics: {
                    category: a.CUSTOMIZE_ROOM,
                    action: "Background image selected",
                    label: "From file select button"
                },
                kissmetrics: "Background image selected from file selector"
            },
            BACKGROUND_IMAGE_SELECT_DROP: {
                googleAnalytics: {
                    category: a.CUSTOMIZE_ROOM,
                    action: "Background image selected",
                    label: "From drag and drop"
                },
                kissmetrics: "Background image selected from drag and drop"
            },
            BACKGROUND_IMAGE_SUBMITTED: {
                googleAnalytics: {
                    category: a.CUSTOMIZE_ROOM,
                    action: "Background image submitted"
                },
                kissmetrics: "Background image submitted",
                intercom: {
                    eventName: "Background image submitted"
                }
            },
            FOLLOW_SHOW_UPSELL: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "show upsell message"
                },
                kissmetrics: "Follow Room: show upsell message"
            },
            FOLLOW_ROOM: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "Follow"
                },
                kissmetrics: "Follow Room: Follow"
            },
            FOLLOW_TRIGGER_INSTALL: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "Trigger Install Extension"
                },
                kissmetrics: "Follow Room: Trigger Install Extension"
            },
            FOLLOW_TOGGLE_TOPBAR: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "topbar follow toggle"
                },
                kissmetrics: "Follow Room: topbar follow toggle"
            },
            FOLLOW_TOGGLE_UPSELL: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "upsell follow toggle"
                },
                kissmetrics: "Follow Room: upsell follow toggle"
            },
            FOLLOW_TOGGLE_CLAIM: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "claim follow toggle"
                },
                kissmetrics: "Follow Room: claim follow toggle"
            },
            UNFOLLOW_ROOM: {
                googleAnalytics: {
                    category: a.FOLLOW_ROOM,
                    action: "unfollow"
                },
                kissmetrics: "Follow Room: unfollow"
            },
            ERROR_WEBRTC: {
                kissmetrics: "Redirected to WebRTC error page"
            },
            CLOSED_TAB: {
                kissmetrics: "closed tab"
            },
            ERROR_CONNECTION: {
                kissmetrics: "Client redirected to /error/connection"
            },
            ROOM_LOCKED: {
                kissmetrics: "Access denied: Room is locked"
            },
            ROOM_FULL: {
                kissmetrics: "Access denied: Room is full"
            },
            ROOM_INVALID: {
                kissmetrics: "Access denied: Room is invalid"
            },
            RECONNECT_TO_ROOM: {
                kissmetrics: "Reconnected to a room"
            },
            ENTERED_EXISTING_ROOM: {
                kissmetrics: "Entered existing room"
            },
            ENTERED_NEW_ROOM: {
                kissmetrics: "Entered new room"
            },
            NEW_CLIENT_JOINED: {
                kissmetrics: "New client joined"
            },
            CLIENT_KICKED: {
                kissmetrics: "Client kicked from room"
            },
            CLIENT_BECAME_OWNER: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Current client became owner"
                },
                kissmetrics: "Current client became owner"
            },
            CLIENT_CLAIMED_ROOM: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Current client claimed the room"
                },
                kissmetrics: "Current client claimed the room"
            },
            ANOTHER_CLAIMED_ROOM: {
                googleAnalytics: {
                    category: a.CLAIM_ROOM,
                    action: "Another client claimed the room"
                },
                kissmetrics: "Another client claimed the room"
            },
            ROOM_CLAIMED: {
                kissmetrics: "Room claimed"
            },
            BACKGROUND_IMAGE_CHANGED: {
                kissmetrics: "Background image changed"
            },
            IN_A_CONVERSATION: {
                kissmetrics: "In a conversation",
                intercom: {
                    eventName: "In a conversation"
                }
            },
            VISITED_ROOM: {
                kissmetrics: "Visited room"
            },
            VISITED_FRONTPAGE: {
                kissmetrics: "Visited frontpage"
            },
            MINUTE_ELAPSED: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Minute elapsed",
                    label: "Minute elapsed in conversation"
                }
            },
            WEBRTC_ERROR: {
                googleAnalytics: {
                    category: a.RTC,
                    action: "error"
                },
                kissmetrics: "RTC: error: "
            },
            OPENED_FAQ_QUESTION: {
                googleAnalytics: {
                    category: a.FAQ,
                    action: "Opened FAQ question"
                },
                kissmetrics: "Opened FAQ question"
            },
            CONTACT_ADDED_MANUALLY: {
                googleAnalytics: {
                    category: a.CONTACTS,
                    action: "Added contact manually"
                },
                kissmetrics: "Added contact manually"
            },
            CONTACT_ADDED_MANUALLY_FAILED: {
                googleAnalytics: {
                    category: a.CONTACTS,
                    action: "Could not add contact manually"
                },
                kissmetrics: "Could not add contact manually"
            },
            SIGNUP_ERROR: {
                googleAnalytics: {
                    category: a.USER,
                    action: "Signup API call error"
                },
                kissmetrics: "Signup API call error"
            },
            SUMMON_OWNER: {
                googleAnalytics: {
                    category: a.ROOM,
                    action: "Summoned owner"
                },
                kissmetrics: "Room: Summoned owner"
            },
            REGISTRATION: {
                SET_ACTIVE_STATE: {
                    googleAnalytics: {
                        category: a.REGISTRATION,
                        action: "Changed active state",
                        label: null
                    },
                    kissmetrics: "Registration: changed active state: "
                },
                SENT_VERIFICATION_CODE: {
                    googleAnalytics: {
                        category: a.REGISTRATION,
                        action: "Sent verification code",
                        label: null
                    },
                    kissmetrics: "Registration: sent verification code: "
                },
                ATTEMPT_VERIFY_CONTACT_POINT: {
                    googleAnalytics: {
                        category: a.REGISTRATION,
                        action: "Attempted to verify contact point",
                        label: null
                    },
                    kissmetrics: "Registration: attempted to verify contact point: "
                },
                USER_CREATED: {
                    googleAnalytics: {
                        category: a.REGISTRATION,
                        action: "User created"
                    },
                    kissmetrics: "Registration: User created"
                },
                SUBMITTED_NOTIFICATION_CHOICE: {
                    googleAnalytics: {
                        category: a.REGISTRATION,
                        action: "Submitted notification choice",
                        label: null
                    },
                    kissmetrics: "Registration: submitted notification choice: "
                }
            },
            CONTACTS: {
                INVITE: {
                    googleAnalytics: {
                        category: a.CONTACTS,
                        action: "Invited contact",
                        label: null
                    },
                    kissmetrics: "Contacts: invited contact: ",
                    intercom: {
                        eventName: "Invited contact"
                    }
                },
                SAVED_AS_PHONE_CONTACT: {
                    googleAnalytics: {
                        category: a.CONTACTS,
                        action: "Saved as phone contact"
                    },
                    kissmetrics: "Contacts: saved as phone contact"
                }
            },
            LOGIN: {
                REQUEST_LOGIN_CODE: {
                    googleAnalytics: {
                        category: a.LOGIN,
                        action: "Requested login code",
                        label: null
                    },
                    kissmetrics: "Login: requested login code: "
                }
            }
        }
    }),
    function(a) {
        var b = ["templates", "styles", "scripts", "libraries", "i", "images", "information", "error", "extensions", "translations", "robots.txt"];
        a.requirements = "the room name cannot start with / or be any of these reserved words: " + b.join(", ") + ".", a.pattern = "(?!(?:" + b.join("|") + ")(?:/.*|$))([^?#]+)", a.normalize = function(a) {
            var b = ensurePrependedSlash(a);
            return (b + "").trim().toLowerCase().replace(/\/*$/, "")
        }
    }("undefined" == typeof exports ? this._RoomName = {} : exports), angular.module("videoconference").factory("RoomName", ["$window", function(a) {
        return a._RoomName
    }]);
var splitscreenElements = function(a, b) {
        var c = 640,
            d = 480,
            e = [],
            f = null,
            g = function() {
                null !== f && f()
            },
            h = function(a) {
                a.missingVideoDimensionsTimeout || (a.missingVideoDimensionsTimeout = b(function() {
                    i(a) && (b.cancel(a.missingVideoDimensionsTimeout), a.missingVideoDimensionsTimeout = null, g())
                }, 500))
            },
            i = function(a) {
                return a.videoWidth > 0 && a.videoHeight > 0
            },
            j = function(a) {
                return void 0 === a || void 0 === a.videoWidth || void 0 === a.videoHeight ? [c, d] : i(a) ? [a.videoWidth, a.videoHeight] : (h(a), [c, d])
            };
        return {
            setUpdateHandler: function(a) {
                f = a
            },
            getElementCount: function() {
                return e.length
            },
            getElementByOrdinality: function(a) {
                return e[a]
            },
            getVideoDimensions: j,
            getDimensionsByOrdinality: function(a) {
                var b = e[a];
                if (!b) return [c, d];
                var f = b.find("[vc-splitscreen-is-aspect-ratio-source=true]")[0],
                    g = j(f),
                    h = b.find("[vc-splitscreen-rotation]").attr("vc-splitscreen-rotation");
                return h === constants.Rotation.LEFT || h === constants.Rotation.RIGHT ? g.reverse() : g
            },
            registerElement: function(a) {
                e.push(a), g()
            },
            unregisterElement: function(a) {
                for (var b in e)
                    if (e[b][0] === a[0]) return e.splice(b, 1), void g()
            },
            swapElements: function(a, b) {
                var c, d;
                for (var f in e) e[f][0] === a[0] ? c = f : e[f][0] === b[0] && (d = f);
                e[c] = b, e[d] = a, g()
            },
            prepareEnlarge: function(a) {
                var b, c = e[0],
                    d = 0;
                e.forEach(function(c, e) {
                    var f = c.find("video").attr("id");
                    a === f && (d = e, b = c, b.addClass("enlarged"))
                }), e[0] = b, e[d] = c, g(), angular.element(".room-wrapper").addClass("enlarged-view")
            },
            getCurrentEnlarged: function() {
                return e[0].find("video").attr("id")
            },
            makeSureLocalVideoIsNotLarge: function() {
                if (e.length > 1 && e[0].find(".local-client").length > 0) {
                    var a = e[0],
                        b = e[1];
                    e[0] = b, e[1] = a, g()
                } else e[0].addClass("enlarged")
            },
            putLocalVideoInCorrectPlace: function() {
                var a = e[0],
                    b = e[1];
                e[0] = b, e[1] = a, g()
            }
        }
    },
    splitscreenLayouts = function(a, b) {
        var c = 0,
            d = 1,
            e = 100,
            f = function() {
                this.setCurrentCategory("enlarged")
            },
            g = function(c) {
                var d, e, f, g, h = 10,
                    i = null;
                return {
                    recalculate: function(b, i, j, k) {
                        b += h, i += h, j -= 2 * h, k -= 2 * h;
                        var l, m, n = a.getDimensionsByOrdinality(c),
                            o = n[0],
                            p = n[1];
                        o / p > j / k ? (l = j, m = p * j / o) : (m = k, l = o * k / p);
                        var q = b + (j - l) / 2,
                            r = i + (k - m) / 2;
                        return d = q, e = r, f = l, g = m, [f, g]
                    },
                    utilization: function() {
                        return f * g
                    },
                    positionElements: function() {
                        i = a.getElementByOrdinality(c), i.css({
                            left: d + "px",
                            top: e + "px",
                            width: f + "px",
                            height: g + "px",
                            "font-size": f / 50 + "pt"
                        }), b(function() {
                            i.css("transition", "left 0.5s, top 0.5s, width 0.5s, height 0.5s, font-size 0.5s")
                        }), 510 >= f ? i.addClass("mini") : i.removeClass("mini")
                    },
                    getLeafCount: function() {
                        return 1
                    }
                }
            },
            h = function(b, c, d, f) {
                var h = [],
                    i = j(b, c, d, h),
                    k = function(a) {
                        for (a -= f; h.length > a;) h.pop();
                        for (; h.length < a;) h.push(g(f + h.length))
                    };
                return {
                    recalculate: function(b, c, d, e) {
                        return k(a.getElementCount()), i.recalculate(b, c, d, e)
                    },
                    utilization: function() {
                        return i.utilization()
                    },
                    positionElements: function() {
                        i.positionElements()
                    },
                    getLeafCount: function() {
                        return e
                    }
                }
            },
            i = function(b) {
                var f = [],
                    h = null,
                    i = 0,
                    k = function(a) {
                        if (f = [], !(b > a))
                            for (var e = 2; a - 1 > e; e++) {
                                for (var h = Math.floor(a / e), i = a - h * e, k = [], l = 0, m = 0; e > m; m++) {
                                    for (var n = [], o = 0; h > o; o++) n.push(g(l++));
                                    i > 0 && (n.push(g(l++)), i--);
                                    var p = j(c, 1, !1, n);
                                    k.push(p)
                                }
                                var q = j(d, 1, !1, k);
                                f.push(q)
                            }
                    },
                    l = function(a, b, c, d) {
                        h = null, i = 0;
                        for (var e = 0; e < f.length; e++) {
                            var g = f[e];
                            g.recalculate(a, b, c, d);
                            var j = g.utilization();
                            j > i && (h = g, i = j)
                        }
                    };
                return {
                    recalculate: function(b, c, d, e) {
                        return k(a.getElementCount()), l(b, c, d, e), null !== h ? h.recalculate(b, c, d, e) : void 0
                    },
                    utilization: function() {
                        return i
                    },
                    positionElements: function() {
                        h.positionElements()
                    },
                    getLeafCount: function() {
                        return e
                    }
                }
            },
            j = function(a, b, e, f) {
                return {
                    recalculate: function(g, h, i, j) {
                        var k, l = [],
                            m = 0,
                            n = 1;
                        for (k = 0; k < f.length; k++) l.push(n), m += n, n *= b;
                        var o = [],
                            p = [],
                            q = [],
                            r = [],
                            s = g,
                            t = h;
                        for (k = 0; k < f.length; k++) {
                            q.push(s), r.push(t);
                            var u = l[k] / m;
                            a === c ? (p.push(j), o.push(i * u), s += o[k]) : a === d && (p.push(j * u), o.push(i), t += p[k])
                        }
                        var v = 0;
                        for (k in f) {
                            var w = f[k].recalculate(q[k], r[k], o[k], p[k]);
                            a === c ? v += w[0] : a === d && (v += w[1]), o[k] = w[0], p[k] = w[1]
                        }
                        if (e) {
                            s = g, t = h, a === c ? s += (i - v) / 2 : a === d && (t += (j - v) / 2);
                            for (k in f) a === c ? (f[k].recalculate(s, t, o[k], j), s += o[k]) : a === d && (f[k].recalculate(s, t, i, p[k]), t += p[k])
                        }
                        return [i, j]
                    },
                    utilization: function() {
                        var a = 0;
                        for (var b in f) a += f[b].utilization();
                        return a
                    },
                    positionElements: function() {
                        for (var a in f) f[a].positionElements()
                    },
                    getLeafCount: function() {
                        var a = 0;
                        for (var b in f) a += f[b].getLeafCount();
                        return a
                    }
                }
            },
            k = j,
            l = g,
            m = {
                "default": {
                    description: "Mixed layout",
                    layouts: [h(c, 1, !1, 0), h(d, 1, !1, 0), k(c, 4 / 3, !1, [k(d, 1, !1, [l(0), l(2)]), l(1)]), k(d, 1, !1, [k(c, 1, !1, [l(0), l(1)]), k(c, 1, !1, [l(2), l(3)])]), k(c, .75, !1, [k(d, 1, !1, [l(0), l(3)]), k(d, 1, !1, [l(1), l(2), l(4)])]), i(6)]
                },
                enlarged: {
                    description: "Supersize",
                    layouts: [k(c, .25, !1, [l(0), h(d, 1, !0, 1)]), k(d, 2.5, !1, [h(c, 1, !0, 1), l(0)])]
                }
            },
            n = "default",
            o = null,
            p = function() {
                null !== o && o()
            };
        return {
            getCategories: function() {
                return m
            },
            getCurrentCategory: function() {
                return n
            },
            setCurrentCategory: function(a) {
                n = a, p()
            },
            setUpdateHandler: function(a) {
                o = a
            },
            getBestLayout: function(b, c, d, f) {
                var g = a.getElementCount(),
                    h = null,
                    i = 0,
                    j = m[n].layouts;
                for (var k in j) {
                    var l = j[k],
                        o = l.getLeafCount();
                    if (!(e > o && o !== g)) {
                        l.recalculate(b, c, d, f);
                        var p = l.utilization();
                        (null === h || p > i) && (h = j[k], i = p)
                    }
                }
                return h
            },
            setEnlargeView: f
        }
    },
    splitscreenRefresher = function(a, b, c) {
        var d = null,
            e = function() {
                null !== d && c.cancel(d), d = c(function() {
                    d = null, g()
                }, 100)
            },
            f = 0,
            g = function() {
                c(function() {
                    var c = f,
                        d = 0,
                        e = angular.element(".video-wrapper").width() - f,
                        g = angular.element(".video-wrapper").height(),
                        h = b.getBestLayout(c, d, e, g);
                    h.positionElements(c, d, e, g), "enlarged" === b.getCurrentCategory() && a.makeSureLocalVideoIsNotLarge()
                }, 0)
            },
            h = !1;
        return {
            ensureStarted: function() {
                h || (h = !0, g(), a.setUpdateHandler(g), b.setUpdateHandler(g), $(window).resize(e))
            },
            setOffset: function(a) {
                f = a, g()
            },
            refreshLayout: g
        }
    };
angular.module("videoconference").factory("splitscreenElements", ["$timeout", "$interval", splitscreenElements]).factory("splitscreenLayouts", ["splitscreenElements", "$timeout", splitscreenLayouts]).factory("splitscreenRefresher", ["splitscreenElements", "splitscreenLayouts", "$timeout", splitscreenRefresher]).directive("vcSplitscreen", ["splitscreenElements", "splitscreenRefresher", function(a, b) {
    return function(c, d, e) {
        c.$watch(e.vcSplitscreen, function(b) {
            b === !0 ? a.registerElement(d) : (a.unregisterElement(d), d.removeAttr("style"))
        }), d.bind("$destroy", function() {
            a.unregisterElement(d), d.removeAttr("style")
        }), b.ensureStarted()
    }
}]).directive("vcSplitscreenIsAspectRatioSource", ["splitscreenRefresher", function(a) {
    return function(b, c, d) {
        d.$observe("vcSplitscreenIsAspectRatioSource", function(b) {
            "true" === b && a.refreshLayout()
        }), c[0].addEventListener("resize", function() {
            a.refreshLayout()
        })
    }
}]).directive("vcSplitscreenRotation", ["splitscreenRefresher", "splitscreenElements", function(a, b) {
    return function(c, d, e) {
        var f = function() {
            var a = d.attr("vc-splitscreen-rotation");
            if (a in constants.RotationAngles) {
                var c = constants.RotationAngles[a],
                    e = 1;
                if (a === constants.Rotation.LEFT || a === constants.Rotation.RIGHT) {
                    var f = b.getVideoDimensions(d[0]),
                        g = f[0],
                        h = f[1];
                    e = g > h ? g / h : h / g
                }
                var i = "rotate(" + c + "deg) scale(" + e + ")";
                a === constants.Rotation.NONE && (i = ""), d.css({
                    "-webkit-transform": i,
                    transform: i
                })
            }
        };
        e.$observe("vcSplitscreenRotation", function() {
            a.refreshLayout(), f()
        }), f()
    }
}]).directive("vcSplitscreenDragdrop", ["splitscreenElements", function(a) {
    return function(b, c) {
        var d = null;
        void 0 === c[0].dragDropInitialized && (c[0].dragDropInitialized = !0, c.draggable({
            cancel: ".splitscreen-not-draggable",
            revert: "invalid",
            revertDuration: 250,
            scroll: !1,
            scope: "splitscreen",
            helper: function() {
                return $('<div class="splitscreen-draggable-helper" />').width(c.width()).height(c.height())
            }
        }).droppable({
            scope: "splitscreen",
            tolerance: "pointer",
            over: function() {
                d = $('<div class="splitscreen-droppable" />'), c.append(d)
            },
            out: function() {
                d.remove()
            },
            drop: function(b, e) {
                d.remove(), a.swapElements(e.draggable, c)
            }
        }))
    }
}]).directive("vcSplitscreenOffset", ["splitscreenRefresher", function(a) {
    return function(b, c, d) {
        b.$watch(d.vcSplitscreenOffset, function(b) {
            a.setOffset(b)
        })
    }
}]);
var RTCPeerConnection = null,
    getUserMedia = null,
    attachMediaStream = null,
    reattachMediaStream = null,
    webrtcDetectedBrowser = null,
    webrtcDetectedVersion = null,
    TemPageId = Math.random().toString(36).slice(2);
if (TemPrivateWebRTCReadyCb = function() {
        arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1, 1 == arguments.callee.StaticWasInit && "function" == typeof WebRTCReadyCb && WebRTCReadyCb(), arguments.callee.StaticWasInit++
    }, plugin = plugin0, navigator.mozGetUserMedia) {
    console.log("This appears to be Firefox"), webrtcDetectedBrowser = "firefox", webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10);
    var RTCPeerConnection = function(a, b) {
        return maybeFixConfiguration(a), new mozRTCPeerConnection(a, b)
    };
    RTCSessionDescription = mozRTCSessionDescription, RTCIceCandidate = mozRTCIceCandidate, getUserMedia = navigator.mozGetUserMedia.bind(navigator), navigator.getUserMedia = getUserMedia, createIceServer = function(a, b, c) {
        var d = null,
            e = a.split(":");
        if (0 === e[0].indexOf("stun")) d = {
            url: a
        };
        else if (0 === e[0].indexOf("turn"))
            if (27 > webrtcDetectedVersion) {
                var f = a.split("?");
                (1 === f.length || 0 === f[1].indexOf("transport=udp")) && (d = {
                    url: f[0],
                    credential: c,
                    username: b
                })
            } else d = {
                url: a,
                credential: c,
                username: b
            };
        return d
    }, createIceServers = function(a, b, c) {
        var d = [];
        for (i = 0; i < a.length; i++) {
            var e = createIceServer(a[i], b, c);
            null !== e && d.push(e)
        }
        return d
    }, attachMediaStream = function(a, b) {
        return console.log("Attaching media stream"), a.mozSrcObject = b, a.play(), a
    }, reattachMediaStream = function(a, b) {
        return console.log("Reattaching media stream"), a.mozSrcObject = b.mozSrcObject, a.play(), a
    }, MediaStream.prototype.getVideoTracks || (MediaStream.prototype.getVideoTracks = function() {
        return []
    }), MediaStream.prototype.getAudioTracks || (MediaStream.prototype.getAudioTracks = function() {
        return []
    }), TemPrivateWebRTCReadyCb()
} else if (navigator.webkitGetUserMedia) {
    console.log("This appears to be Chrome"), navigator.userAgent.match(/OPR\/([0-9]+)\./) ? (webrtcDetectedBrowser = "opera", webrtcDetectedVersion = parseInt(navigator.userAgent.match(/OPR\/([0-9]+)\./)[1])) : (webrtcDetectedBrowser = "chrome", webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2])), createIceServer = function(a, b, c) {
        var d = null,
            e = a.split(":");
        return 0 === e[0].indexOf("stun") ? d = {
            url: a
        } : 0 === e[0].indexOf("turn") && (d = {
            url: a,
            credential: c,
            username: b
        }), d
    }, createIceServers = function(a, b, c) {
        var d = [];
        if (webrtcDetectedVersion >= 34) d = {
            urls: a,
            credential: c,
            username: b
        };
        else
            for (i = 0; i < a.length; i++) {
                var e = createIceServer(a[i], b, c);
                null !== e && d.push(e)
            }
        return d
    };
    var RTCPeerConnection = function(a, b) {
        return 34 > webrtcDetectedVersion && maybeFixConfiguration(a), new webkitRTCPeerConnection(a, b)
    };
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator), navigator.getUserMedia = getUserMedia, attachMediaStream = function(a, b) {
        return "undefined" != typeof a.srcObject ? a.srcObject = b : "undefined" != typeof a.mozSrcObject ? a.mozSrcObject = b : "undefined" != typeof a.src ? a.src = URL.createObjectURL(b) : console.log("Error attaching stream to element."), a
    }, reattachMediaStream = function(a, b) {
        return a.src = b.src, a
    }, TemPrivateWebRTCReadyCb()
} else if (navigator.userAgent.indexOf("PhantomJS") >= 0);
else if (navigator.userAgent.indexOf("Safari")) {
    console.log("This appears to be either Safari or IE"), webrtcDetectedBrowser = "Safari", navigator.userAgent.match(/(iPad|iPhone|iPod)/g) && (webrtcDetectedBrowser = "ios");
    var isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0,
        isFirefox = "undefined" != typeof InstallTrigger,
        isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0,
        isChrome = !!window.chrome && !isOpera,
        isIE = !1 || !!document.documentMode;
    isPluginInstalled("Tem", "TemWebRTCPlugin", defineWebRTCInterface, pluginNeededButNotInstalledCb)
} else console.log("Browser does not appear to be WebRTC-capable"), navigator.userAgent.match(/(OPR|Opera)\/([0-9]+)\./) && (webrtcDetectedBrowser = "opera", webrtcDetectedVersion = parseInt(navigator.userAgent.match(/(OPR|Opera)\/([0-9]+)\./)[2]));