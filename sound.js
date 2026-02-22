// --- 1. محرك بيانو حقيقي باستخدام عينات صوتية ---
let audioCtx;
let masterGain;
let pianoBuffers = {};
let isPlaying = false;

// روابط عينات بيانو مجانية (يمكنك استبدالها بملفاتك)
const pianoNotes = {
    "A2": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/A2.mp3",
    "C3": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/C3.mp3",
    "E3": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/E3.mp3",
    "F2": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/F2.mp3",
    "G2": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/G2.mp3",
    "A3": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/A3.mp3",
    "C4": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/C4.mp3",
    "E4": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/E4.mp3",
    "G3": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/G3.mp3",
    "D3": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/D3.mp3",
    "B3": "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/B3.mp3"
};

async function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.4;
        masterGain.connect(audioCtx.destination);

        // تحميل جميع النغمات
        for (let note in pianoNotes) {
            const response = await fetch(pianoNotes[note]);
            const arrayBuffer = await response.arrayBuffer();
            pianoBuffers[note] = await audioCtx.decodeAudioData(arrayBuffer);
        }
    }

    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
}

function playPiano(note, time, volume = 0.5) {
    const source = audioCtx.createBufferSource();
    source.buffer = pianoBuffers[note];

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(volume, time);

    source.connect(gainNode);
    gainNode.connect(masterGain);

    source.start(time);
}

// المقطوعة نفسها ولكن بيانو حقيقي
async function playSymphony() {
    await initAudio();
    const now = audioCtx.currentTime;

    const sequence = [
        {n: "A2", t: 0}, {n: "E3", t: 0.5}, {n: "C4", t: 1},
        {n: "F2", t: 6}, {n: "A3", t: 6.5}, {n: "C4", t: 7},
        {n: "C3", t: 12}, {n: "G3", t: 12.5},
        {n: "G2", t: 18}, {n: "B3", t: 18.5}
    ];

    sequence.forEach(note => {
        playPiano(note.n, now + note.t, 0.6);
    });

    setTimeout(playSymphony, 25000);
                                 }
