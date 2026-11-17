/* ============================================================
   MAGNOPVS
   ELEUSIS PATH
   T1C1 · ACTO II · EL DESCENSO

   CATÁBASIS AUDIO ENGINE v2

   - 15 second loop
   - Web Audio API
   - No MP3 / WAV required
   - Opera / Abyss / Acid / Guttural / Psychophony / Pulse
   - Starts from user interaction
   - Exposed public API:
        CatabasisAudio.start()
        CatabasisAudio.stop()
        CatabasisAudio.toggle()
        CatabasisAudio.isRunning()
   ============================================================ */

(() => {

    "use strict";


    /* =========================================================
       CONFIG
       ========================================================= */

    const LOOP = 15;

    const MASTER_VOLUME = 0.42;

    let ctx = null;

    let master = null;

    let compressor = null;

    let reverb = null;

    let running = false;

    let nextCycleTimer = null;


    /* =========================================================
       CREATE AUDIO CONTEXT
       ========================================================= */

    function initAudio() {

        if (ctx) return;


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            console.error(
                "Web Audio API no disponible."
            );

            return;

        }


        ctx = new AudioContext();


        /* MASTER */

        master =
            ctx.createGain();


        master.gain.value =
            0;


        /* COMPRESSOR */

        compressor =
            ctx.createDynamicsCompressor();


        compressor.threshold.value =
            -18;

        compressor.knee.value =
            20;

        compressor.ratio.value =
            6;

        compressor.attack.value =
            0.003;

        compressor.release.value =
            0.25;


        /* REVERB */

        reverb =
            ctx.createConvolver();


        reverb.buffer =
            createImpulseResponse(
                3.5,
                2.8
            );


        master
            .connect(compressor)
            .connect(ctx.destination);


        console.log(
            "🜏 Catábasis Audio Engine initialized."
        );

    }


    /* =========================================================
       IMPULSE RESPONSE
       ========================================================= */

    function createImpulseResponse(
        duration,
        decay
    ) {

        const length =
            ctx.sampleRate *
            duration;


        const impulse =
            ctx.createBuffer(
                2,
                length,
                ctx.sampleRate
            );


        for (
            let channel = 0;
            channel < 2;
            channel++
        ) {

            const data =
                impulse.getChannelData(
                    channel
                );


            for (
                let i = 0;
                i < length;
                i++
            ) {

                data[i] =
                    (
                        Math.random() * 2 - 1
                    ) *
                    Math.pow(
                        1 - i / length,
                        decay
                    );

            }

        }


        return impulse;

    }


    /* =========================================================
       CONNECTION HELPERS
       ========================================================= */

    function dry(node) {

        node.connect(master);

        return node;

    }


    function wet(node, amount = 0.3) {

        const send =
            ctx.createGain();


        send.gain.value =
            amount;


        node.connect(send);

        send.connect(reverb);

        reverb.connect(master);


        return node;

    }


    /* =========================================================
       OSCILLATOR
       ========================================================= */

    function oscillator(
        type,
        frequency,
        start,
        duration,
        volume,
        destination = master
    ) {

        const osc =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        osc.type =
            type;


        osc.frequency.setValueAtTime(
            frequency,
            start
        );


        gain.gain.setValueAtTime(
            0,
            start
        );


        gain.gain.linearRampToValueAtTime(
            volume,
            start + 0.08
        );


        gain.gain.setValueAtTime(
            volume,
            start + duration - 0.4
        );


        gain.gain.linearRampToValueAtTime(
            0,
            start + duration
        );


        osc
            .connect(gain)
            .connect(destination);


        osc.start(start);

        osc.stop(
            start + duration + 0.05
        );


        return {
            osc,
            gain
        };

    }


    /* =========================================================
       01 · ABYSS
       ========================================================= */

    function abyss(start) {

        const duration =
            LOOP;


        const frequencies = [
            32.70,
            36.71,
            48.99
        ];


        frequencies.forEach(
            (frequency, index) => {

                const osc =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                const filter =
                    ctx.createBiquadFilter();


                osc.type =
                    "sine";


                osc.frequency.value =
                    frequency;


                osc.detune.value =
                    index * 4 - 4;


                filter.type =
                    "lowpass";


                filter.frequency.value =
                    120;


                gain.gain.setValueAtTime(
                    0,
                    start
                );


                gain.gain.linearRampToValueAtTime(
                    0.18 / (index + 1),
                    start + 3
                );


                gain.gain.setValueAtTime(
                    0.18 / (index + 1),
                    start + 12
                );


                gain.gain.linearRampToValueAtTime(
                    0,
                    start + 15
                );


                osc
                    .connect(filter)
                    .connect(gain)
                    .connect(master);


                osc.start(start);

                osc.stop(
                    start + duration
                );

            }
        );

    }


    /* =========================================================
       02 · OPERA
       ========================================================= */

    function opera(start) {

        const duration =
            LOOP;


        /*
         * Synthetic ritual choir.
         */

        const notes = [
            293.66,
            349.23,
            440.00,
            523.25
        ];


        notes.forEach(
            (frequency, index) => {

                const osc =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                const filter =
                    ctx.createBiquadFilter();


                osc.type =
                    index === 0
                        ? "sine"
                        : "triangle";


                osc.frequency.value =
                    frequency;


                /*
                 * Slow vibrato.
                 */

                const lfo =
                    ctx.createOscillator();


                const lfoGain =
                    ctx.createGain();


                lfo.frequency.value =
                    0.17 +
                    index * 0.035;


                lfoGain.gain.value =
                    3;


                lfo
                    .connect(lfoGain)
                    .connect(osc.frequency);


                lfo.start(start);

                lfo.stop(
                    start + duration
                );


                filter.type =
                    "bandpass";


                filter.frequency.value =
                    1100 +
                    index * 250;


                filter.Q.value =
                    1.2;


                gain.gain.setValueAtTime(
                    0,
                    start
                );


                gain.gain.linearRampToValueAtTime(
                    0.055 / (index + 1),
                    start + 2.5
                );


                gain.gain.setValueAtTime(
                    0.045 / (index + 1),
                    start + 11
                );


                gain.gain.linearRampToValueAtTime(
                    0,
                    start + 15
                );


                osc
                    .connect(filter)
                    .connect(gain);


                gain.connect(master);


                /*
                 * Reverb send.
                 */

                const send =
                    ctx.createGain();


                send.gain.value =
                    0.55;


                gain.connect(send);

                send.connect(reverb);

                reverb.connect(master);


                osc.start(start);

                osc.stop(
                    start + duration
                );

            }
        );

    }


    /* =========================================================
       03 · ACID
       ========================================================= */

    function acid(start) {

        const osc =
            ctx.createOscillator();


        const filter =
            ctx.createBiquadFilter();


        const gain =
            ctx.createGain();


        osc.type =
            "sawtooth";


        filter.type =
            "lowpass";


        filter.Q.value =
            14;


        /*
         * Acid sequence.
         */

        const sequence = [
            73.42,
            73.42,
            87.31,
            98.00,
            73.42,
            110.00,
            98.00,
            82.41,
            73.42,
            87.31,
            110.00,
            98.00,
            73.42,
            65.41,
            73.42,
            87.31
        ];


        const step =
            LOOP /
            sequence.length;


        osc.frequency.setValueAtTime(
            sequence[0],
            start
        );


        sequence.forEach(
            (note, index) => {

                osc.frequency
                    .linearRampToValueAtTime(
                        note,
                        start +
                        index * step +
                        0.03
                    );

            }
        );


        /*
         * Resonance sweep.
         */

        filter.frequency.setValueAtTime(
            180,
            start
        );


        filter.frequency.linearRampToValueAtTime(
            1700,
            start + 4.5
        );


        filter.frequency.linearRampToValueAtTime(
            380,
            start + 8
        );


        filter.frequency.linearRampToValueAtTime(
            2200,
            start + 12
        );


        filter.frequency.linearRampToValueAtTime(
            180,
            start + 15
        );


        gain.gain.setValueAtTime(
            0,
            start
        );


        gain.gain.linearRampToValueAtTime(
            0.07,
            start + 1
        );


        gain.gain.setValueAtTime(
            0.07,
            start + 13
        );


        gain.gain.linearRampToValueAtTime(
            0,
            start + 15
        );


        osc
            .connect(filter)
            .connect(gain)
            .connect(master);


        osc.start(start);

        osc.stop(
            start + LOOP
        );

    }


    /* =========================================================
       04 · GUTTURAL
       ========================================================= */

    function guttural(start) {

        const osc =
            ctx.createOscillator();


        const distortion =
            ctx.createWaveShaper();


        const filter =
            ctx.createBiquadFilter();


        const gain =
            ctx.createGain();


        osc.type =
            "sawtooth";


        osc.frequency.setValueAtTime(
            43,
            start
        );


        osc.frequency.linearRampToValueAtTime(
            37,
            start + 4
        );


        osc.frequency.linearRampToValueAtTime(
            51,
            start + 8
        );


        osc.frequency.linearRampToValueAtTime(
            43,
            start + 15
        );


        filter.type =
            "lowpass";


        filter.frequency.value =
            240;


        filter.Q.value =
            5;


        const curve =
            new Float32Array(
                256
            );


        for (
            let i = 0;
            i < curve.length;
            i++
        ) {

            const x =
                (i * 2) /
                curve.length -
                1;


            curve[i] =
                Math.tanh(
                    x * 4
                );

        }


        distortion.curve =
            curve;


        distortion.oversample =
            "4x";


        gain.gain.setValueAtTime(
            0,
            start
        );


        gain.gain.linearRampToValueAtTime(
            0.055,
            start + 3
        );


        gain.gain.setValueAtTime(
            0.055,
            start + 11
        );


        gain.gain.linearRampToValueAtTime(
            0,
            start + 15
        );


        osc
            .connect(distortion)
            .connect(filter)
            .connect(gain)
            .connect(master);


        osc.start(start);

        osc.stop(
            start + 15
        );

    }


    /* =========================================================
       05 · TECHNO PULSE
       ========================================================= */

    function pulse(start) {

        const bpm =
            126;


        const beat =
            60 / bpm;


        const beats =
            Math.floor(
                LOOP / beat
            );


        for (
            let i = 0;
            i < beats;
            i++
        ) {

            const time =
                start +
                i * beat;


            const osc =
                ctx.createOscillator();


            const gain =
                ctx.createGain();


            osc.type =
                "sine";


            osc.frequency.setValueAtTime(
                95,
                time
            );


            osc.frequency.exponentialRampToValueAtTime(
                35,
                time + 0.14
            );


            const volume =
                i % 4 === 0
                    ? 0.13
                    : 0.075;


            gain.gain.setValueAtTime(
                0,
                time
            );


            gain.gain.linearRampToValueAtTime(
                volume,
                time + 0.006
            );


            gain.gain.exponentialRampToValueAtTime(
                0.001,
                time + 0.22
            );


            osc
                .connect(gain)
                .connect(master);


            osc.start(time);

            osc.stop(
                time + 0.25
            );

        }

    }


    /* =========================================================
       06 · PSYCHOPHONY
       ========================================================= */

    function psychophony(start) {

        const events = [
            1.3,
            4.2,
            7.8,
            10.7,
            13.2
        ];


        events.forEach(
            (offset, index) => {

                const time =
                    start +
                    offset;


                const osc =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                const filter =
                    ctx.createBiquadFilter();


                osc.type =
                    index % 2 === 0
                        ? "sine"
                        : "triangle";


                osc.frequency.setValueAtTime(
                    620 + index * 80,
                    time
                );


                osc.frequency.exponentialRampToValueAtTime(
                    180 + index * 30,
                    time + 1.5
                );


                filter.type =
                    "bandpass";


                filter.frequency.value =
                    800;


                filter.Q.value =
                    9;


                gain.gain.setValueAtTime(
                    0,
                    time
                );


                gain.gain.linearRampToValueAtTime(
                    0.04,
                    time + 0.12
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    time + 1.8
                );


                osc
                    .connect(filter)
                    .connect(gain)
                    .connect(master);


                /*
                 * Long echo.
                 */

                const send =
                    ctx.createGain();


                send.gain.value =
                    0.65;


                gain.connect(send);

                send.connect(reverb);

                reverb.connect(master);


                osc.start(time);

                osc.stop(
                    time + 2
                );

            }
        );

    }


    /* =========================================================
       07 · TEMPLE RESONANCE
       ========================================================= */

    function temple(start) {

        const osc =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        osc.type =
            "triangle";


        osc.frequency.value =
            146.83;


        gain.gain.setValueAtTime(
            0,
            start
        );


        gain.gain.linearRampToValueAtTime(
            0.035,
            start + 2
        );


        gain.gain.setValueAtTime(
            0.035,
            start + 8
        );


        gain.gain.linearRampToValueAtTime(
            0,
            start + 15
        );


        osc
            .connect(gain);


        gain.connect(master);


        const send =
            ctx.createGain();


        send.gain.value =
            0.8;


        gain.connect(send);

        send.connect(reverb);

        reverb.connect(master);


        osc.start(start);

        osc.stop(
            start + 15
        );

    }


    /* =========================================================
       BUILD CYCLE
       ========================================================= */

    function buildCycle(start) {

        abyss(start);

        opera(start);

        acid(start);

        guttural(start);

        pulse(start);

        psychophony(start);

        temple(start);

    }


    /* =========================================================
       START
       ========================================================= */

    async function start() {

        initAudio();


        if (!ctx) return;


        if (
            ctx.state ===
            "suspended"
        ) {

            await ctx.resume();

        }


        if (running) {

            console.log(
                "🜏 Catábasis ya está sonando."
            );

            return;

        }


        running =
            true;


        const startTime =
            ctx.currentTime +
            0.05;


        /*
         * Master fade in.
         */

        master.gain.cancelScheduledValues(
            startTime
        );


        master.gain.setValueAtTime(
            0,
            startTime
        );


        master.gain.linearRampToValueAtTime(
            MASTER_VOLUME,
            startTime + 1.2
        );


        /*
         * First cycle.
         */

        buildCycle(
            startTime
        );


        /*
         * Schedule following cycles.
         */

        scheduleNext(
            startTime
        );


        console.log(
            "🜏 CATÁBASIS · START"
        );

    }


    /* =========================================================
       LOOP
       ========================================================= */

    function scheduleNext(
        cycleStart
    ) {

        if (!running) return;


        const next =
            cycleStart +
            LOOP;


        buildCycle(
            next
        );


        nextCycleTimer =
            setTimeout(
                () => {

                    scheduleNext(
                        next
                    );

                },
                (LOOP - 1) * 1000
            );

    }


    /* =========================================================
       STOP
       ========================================================= */

    function stop() {

        if (!ctx) return;


        running =
            false;


        if (nextCycleTimer) {

            clearTimeout(
                nextCycleTimer
            );

            nextCycleTimer =
                null;

        }


        const time =
            ctx.currentTime;


        master.gain.cancelScheduledValues(
            time
        );


        master.gain.setValueAtTime(
            master.gain.value,
            time
        );


        master.gain.linearRampToValueAtTime(
            0,
            time + 0.5
        );


        console.log(
            "🜏 CATÁBASIS · STOP"
        );

    }


    /* =========================================================
       TOGGLE
       ========================================================= */

    async function toggle() {

        if (running) {

            stop();

        } else {

            await start();

        }

    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.CatabasisAudio = {

        start,

        stop,

        toggle,

        isRunning: () => running

    };


    /* =========================================================
       AUTO START AFTER USER GESTURE
       ========================================================= */

    function userGesture() {

        if (!running) {

            start();

        }

    }


    document.addEventListener(
        "pointerdown",
        userGesture,
        {
            once: true
        }
    );


    document.addEventListener(
        "keydown",
        userGesture,
        {
            once: true
        }
    );


    console.log(
        "🜏 Catábasis Audio Engine loaded."
    );

})();