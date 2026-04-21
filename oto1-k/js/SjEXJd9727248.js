
      (function() {
        try {
          const atomiStaticPageMeta = {"pageId":"7RcA332WuAgFDVG9IbRf","pageName":"UP1 - Memory Pulse Hotmart","pageDomain":null};
          const ATOMI_PLATFORM_NOTIFY_URL = "https://apido.atomicat-api.com/platform/notify/s/fe";

          function atomiSerializeError(error) {
            try {
              if (!error) return { message: "Unknown error" };
              if (typeof error === "string") return { message: error };
              if (error instanceof Error) {
                return {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                };
              }
              return {
                message: error?.message || "Non-Error exception",
                raw: JSON.stringify(error),
              };
            } catch (serializationError) {
              return {
                message: "Failed to serialize error",
                serializationError: serializationError?.message,
              };
            }
          }

          function atomiReportError(error, extra = {}) {
            try {
              const payload = {
                domain: window?.location?.hostname || atomiStaticPageMeta?.pageDomain || "",
                pageUrl: window?.location?.href || "",
                pagePath: window?.location?.pathname || "",
                referrer: document?.referrer || "",
                userAgent: navigator?.userAgent || "",
                language: navigator?.language || "",
                viewport: {
                  width: window?.innerWidth,
                  height: window?.innerHeight,
                },
                timestamp: new Date().toISOString(),
                pageMeta: atomiStaticPageMeta,
                error: atomiSerializeError(error),
                extra,
              };

              const payloadString = JSON.stringify(payload);
              if (navigator?.sendBeacon) {
                const blob = new Blob([payloadString], { type: "text/plain;charset=UTF-8" });
                navigator.sendBeacon(ATOMI_PLATFORM_NOTIFY_URL, blob);
                return;
              }

              fetch(ATOMI_PLATFORM_NOTIFY_URL, {
                method: "POST",
                mode: "no-cors",
                keepalive: true,
                headers: {
                  "Content-Type": "text/plain;charset=UTF-8",
                },
                body: payloadString,
              }).catch(() => {});
            } catch (reportingError) {
              console.log(reportingError);
            }
          }

          if (typeof window !== "undefined") {
            window.atomiReportError = atomiReportError;
          }
        } catch (error) {
          console.log(error);
        }
      })();
    
      function runDelayedFunctions(data) {
        try {
          document.querySelectorAll('.atomicat-delay').forEach(el => el.classList.remove('atomicat-delay'));
          if(data?.setDisplayed){
            localStorage.setItem(data?.setDisplayed, true);
          }
          
        } catch (error) {
          console.log(error);
        }
      }
    
      function atomiGetVturbSrc() {
        try {
          var src = "";

          try {
            var pageUrl = new URL(window.location.href);
            src = pageUrl.searchParams.get("src") || "";
            if (src) return location.search != "" ? "&src=" + src : "?src=" + src;
          } catch (e) {}

          try {
            var links = document.querySelectorAll('a[href*="src="]');
            for (var i = 0; i < links.length; i++) {
              try {
                var u = new URL(links[i].href);
                var s = u.searchParams.get("src");
                if (s) return location.search != "" ? "&src=" + s : "?src=" + s;
              } catch (e2) {
                console.log(e2);
              }
            }
          } catch (e1) {}

          return "";
        } catch (error) {
          console.log(error);
        }
      }
    
          (function() {
            try {
              var vturbvideoId = "688bd29ffef6b9b87f4df054";
              var compKey = "cc45496";
              const twr = false;
              var SECONDS_TO_DISPLAY = 800;
              var attempts = 0;
              var elsDisplayed = false;
              var isWatchingSmartplayer = false;
              var isWatchingVturbV2 = false;
              var alreadyDisplayedKey = 'alreadyElsDisplayed800';
              var alreadyElsDisplayed = localStorage?.getItem(alreadyDisplayedKey);

              var showHiddenElements = function () {
                elsDisplayed = true;
                runDelayedFunctions();
                localStorage.setItem(alreadyDisplayedKey, true);
              };
              function getVideoInstance() {
                if (typeof smartplayer === 'undefined' || !(smartplayer.instances && smartplayer.instances.length)) {
                  return null;
                }
                if (smartplayer.instances.length > 1) {
                  return smartplayer.instances.find(
                    (instance) => (instance?.options?.id || instance?.analytics?.player?.options?.id) === vturbvideoId
                  );
                }
                return smartplayer.instances[0];
              };
              function getVturbSmartPlayerElement() {
                var componentContainer = document.querySelector('.a-video-' + compKey);
                if (componentContainer) {
                  var scopedPlayer = componentContainer.querySelector('vturb-smartplayer');
                  if (scopedPlayer) {
                    return scopedPlayer;
                  }
                }
                if (vturbvideoId && vturbvideoId !== 'null') {
                  return (
                    document.querySelector('vturb-smartplayer#vid-' + vturbvideoId)
                  );
                }
                return document.querySelector('vturb-smartplayer');
              }
              function getTimeFromEvent(ev) {
                if (typeof ev?.detail?.time === 'number') return ev.detail.time;
                if (typeof ev?.detail?.currentTime === 'number') return ev.detail.currentTime;
                if (typeof ev?.detail === 'number') return ev.detail;
                return null;
              }
              function handleVturbV2TimeUpdate(ev, playerRef) {
                if (elsDisplayed) return;
                var isSmartAutoPlay = !!(
                  ev?.detail?.config?.smartAutoPlay?.active ||
                  ev?.detail?.smartAutoPlay?.active ||
                  ev?.detail?.smartAutoPlay ||
                  playerRef?.config?.smartAutoPlay?.active ||
                  playerRef?.smartAutoPlay?.active ||
                  playerRef?.smartAutoPlay
                );
                if (isSmartAutoPlay) return;
                var currentTime = getTimeFromEvent(ev);
                if (typeof currentTime !== 'number') return;
                console.log('vturb v2 currentTime => ' + currentTime + ' SECONDS_TO_DISPLAY => ' + SECONDS_TO_DISPLAY);
                if (currentTime < SECONDS_TO_DISPLAY) return;
                showHiddenElements();
              }
              function startWatchVideoProgressV2(vturbPlayerElement) {
                if (!vturbPlayerElement || isWatchingVturbV2) return false;
                isWatchingVturbV2 = true;
                vturbPlayerElement.addEventListener('video:timeupdate', function (ev) {
                  handleVturbV2TimeUpdate(ev, vturbPlayerElement);
                });
                vturbPlayerElement.addEventListener('player:ready', function (e) {
                  var playerEl = e?.detail?.player;
                  if (!playerEl) return;
                  playerEl.addEventListener('video:timeupdate', function (ev) {
                    handleVturbV2TimeUpdate(ev, playerEl);
                  });
                });
                return true;
              }
              window.startWatchVideoProgress = function startWatchVideoProgress(reAttempts) {
                if (reAttempts) {
                  attempts = reAttempts;
                }
                
                console.log("vturbvideoId", vturbvideoId);
                var hasSmartplayerInstances = typeof smartplayer !== 'undefined' && smartplayer.instances && smartplayer.instances.length;
                var hasV2PlayerElement = !!getVturbSmartPlayerElement();
                if (!hasSmartplayerInstances && !hasV2PlayerElement) {
                  if (attempts >= 10) return;
                  attempts += 1;
                  return setTimeout(function () {
                    startWatchVideoProgress();
                  }, 1000);
                }
                if (hasSmartplayerInstances) {
                  console.log(smartplayer.instances);
                }
                var videoInstance = getVideoInstance();
                console.log("videoInstance", videoInstance, vturbvideoId);
                if (videoInstance?.analytics?.player?.options?.id && videoInstance?.analytics?.player?.options?.id !== vturbvideoId && attempts <= 10 && !hasV2PlayerElement) {
                  attempts += 1;
                  return setTimeout(function () {
                    startWatchVideoProgress();
                  }, 1000);
                }
                if (videoInstance && typeof videoInstance.on === 'function' && !isWatchingSmartplayer) {
                  isWatchingSmartplayer = true;
                  videoInstance.on('timeupdate', () => {
                    if (elsDisplayed || videoInstance.smartAutoPlay) return;
                    console.log("currentTime => " +videoInstance.video.currentTime +" SECONDS_TO_DISPLAY => " +SECONDS_TO_DISPLAY);
                    if (videoInstance.video.currentTime < SECONDS_TO_DISPLAY) return;
                    showHiddenElements();
                  });
                  return;
                }
                if (!videoInstance) {
                  var vturbPlayerElement = getVturbSmartPlayerElement();
                  if (startWatchVideoProgressV2(vturbPlayerElement)) {
                    return;
                  }
                }
                if (attempts <= 10 && !isWatchingSmartplayer && !isWatchingVturbV2) {
                  attempts += 1;
                  return setTimeout(function () {
                    startWatchVideoProgress();
                  }, 1000);
                }
              };
              if (alreadyElsDisplayed === 'true') {
                setTimeout(function () {
                  showHiddenElements();
                }, 100);
              } else {
                window.startWatchVideoProgress();
              }
            } catch (error) {
              console.log(error);
              if (!error.stack?.includes("SecurityError") && !error.message?.includes("SecurityError")) {
                window.atomiReportError?.(error, { source: "vturb-videojs" });
              }
            }
            
          })();
        