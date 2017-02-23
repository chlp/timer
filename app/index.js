require('file-loader?name=[name].[ext]!./index.html');
require('file-loader?name=[name].[ext]!./beep.mp3');

var $ = require('jquery');

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(document).ready(function () {
    var settings = $('#settings');
    var settingsBtn = $('#settings-btn');
    settingsBtn.click(function () {
        if (settings.css('display') === 'none') {
            settings.css('display', 'block');
            setTimeout(function () {
                settings.css('opacity', '1');
            }, 50);
        } else {
            settings.css('opacity', '0');
            setTimeout(function () {
                settings.css('display', 'none');
            }, 500);
        }
    });

    var body = $('body');
    var clockBlock = $('#clock');
    var beep = $('#beep')[0];
    var stopBtn = $('#stop-btn');
    var unmute = $('#unmute-btn');
    unmute.click(function () {
        beep.load();
    });

    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        unmute.show();
    }

    clockBlock.click(function () {
        reset();
    });
    stopBtn.click(function () {
        stop();
    });

    var countdownStartValue = 900;
    var countdownCurrentValue = 0;
    var interval;
    var startTs;

    function stylizingValue(current, first) {
        return pad(
            current.toFixed(1),
            Math.floor(first).toFixed(1).length
        );
    }

    function stop() {
        stopBtn.css('opacity', '0');
        countdownCurrentValue = countdownStartValue;
        clearInterval(interval);
        clockBlock.html(
            stylizingValue(countdownCurrentValue, countdownStartValue)
        ).css('background-color', 'rgba(255,0,0,0)');
        document.title = '⏱ ' + stylizingValue(countdownCurrentValue, countdownStartValue);
    }

    function reset() {
        stop();
        stopBtn.css('opacity', '1');
        startTs = +new Date;
        var intervalStep = 50;
        interval = setInterval(function () {
            countdownCurrentValue = countdownStartValue - (+new Date - startTs) / 1000;
            if (countdownCurrentValue <= 0) {
                body.css('background', 'red');
                setTimeout(function () {
                    body.css('background', 'transparent');
                }, 500);
                beep.play();
                stop();
                setTimeout(function () {
                    reset();
                }, 500);
            }
            var procent = (countdownStartValue - countdownCurrentValue) / countdownStartValue;
            clockBlock.html(
                stylizingValue(countdownCurrentValue, countdownStartValue)
            ).css('background-color', 'rgba(255,0,0,' + procent.toFixed(2) + ')');
            document.title = '⏱ ' + stylizingValue(countdownCurrentValue, countdownStartValue);
        }, intervalStep);
    }

    stop();

    document.addEventListener('keydown', function (event) {
        if ([32, 13].includes(event.which)) {
            reset();
        } else if ([27].includes(event.which)) {
            stop();
        }
    });
});