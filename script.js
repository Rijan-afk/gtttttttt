// Tab Navigation
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.opacity = '0';
    });
    document.querySelectorAll('nav ul li a').forEach(link => link.classList.remove('active'));
    const activeTab = document.getElementById(tabId);
    activeTab.classList.add('active');
    activeTab.style.opacity = '1';
    document.querySelector(`nav ul li a[href="#${tabId}"]`).classList.add('active');
}

// Login System
function login() {
    const userId = document.getElementById('user-id').value;
    const password = document.getElementById('password').value;
    if ((userId === '1' || userId === '2') && password === '2') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('nav').style.display = 'block';
        document.getElementById('home').classList.add('active');
        document.getElementById('home').style.opacity = '1';
    } else {
        alert('Invalid User ID or Password');
    }
}

// TTS System
const synth = window.speechSynthesis;
let voices = [];
const historyList = document.getElementById('history-list');

function populateVoices() {
    voices = synth.getVoices().filter(v => v.lang.includes('hi-IN') || v.name.toLowerCase().includes('hindi'));
    const voiceSelect = document.getElementById('voice-select');
    voiceSelect.innerHTML = '<option value="" disabled selected>Select a voice</option>';
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.text = `${voice.name}${voice.name.includes('Google') || voice.name.includes('Natural') ? ' (Realistic)' : ''}`;
        voiceSelect.appendChild(option);
    });

    // Add custom voices
    const customVoices = [
        { name: 'NGR Hindi Ultra (Custom Model)', value: 'ngr-ultra' },
        { name: 'NGR Ultra Realistic (AI, ElevenLabs-like, Simulated)', value: 'ngr-ultra-realistic' }
    ];
    customVoices.forEach(custom => {
        const option = document.createElement('option');
        option.value = custom.value;
        option.text = custom.name;
        voiceSelect.appendChild(option);
    });
}

function speak() {
    const text = document.getElementById('tts-text').value;
    const voiceSelect = document.getElementById('voice-select').value;
    const volume = document.getElementById('volume').value;
    const speed = document.getElementById('speed').value;
    const status = document.getElementById('tts-status');
    const message = document.getElementById('tts-message');
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    status.appendChild(spinner);

    if (!text) {
        status.textContent = 'Status: Please enter text';
        spinner.remove();
        return;
    }

    // Save to history
    const history = JSON.parse(localStorage.getItem('ttsHistory') || '[]');
    history.unshift(text);
    if (history.length > 5) history.pop();
    localStorage.setItem('ttsHistory', JSON.stringify(history));
    updateHistory();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = speed;

    if (voiceSelect.startsWith('ngr-')) {
        message.textContent = 'This is a simulated ultra-realistic voice. For true AI voices, connect to a service like ElevenLabs.';
        const hindiVoice = voices.find(v => v.lang.includes('hi-IN')) || voices[0];
        utterance.voice = hindiVoice;
        utterance.pitch = voiceSelect === 'ngr-ultra' ? 1.2 : 1.5;
        utterance.rate = voiceSelect === 'ngr-ultra' ? 0.9 : 0.8;
    } else {
        message.textContent = '';
        utterance.voice = voices.find(v => v.name === voiceSelect);
    }

    status.textContent = 'Status: Playing... ';
    spinner.style.display = 'block';
    synth.speak(utterance);
    utterance.onend = () => {
        status.textContent = 'Status: Ready';
        spinner.remove();
    };
}

function stopSpeech() {
    synth.cancel();
    document.getElementById('tts-status').textContent = 'Status: Stopped';
    document.querySelector('.spinner')?.remove();
}

function updateHistory() {
    const history = JSON.parse(localStorage.getItem('ttsHistory') || '[]');
    historyList.innerHTML = '';
    history.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text.length > 30 ? text.substring(0, 30) + '...' : text;
        li.title = text;
        li.onclick = () => document.getElementById('tts-text').value = text;
        historyList.appendChild(li);
    });
}

// Initialize
synth.onvoiceschanged = populateVoices;
document.addEventListener('DOMContentLoaded', () => {
    populateVoices();
    updateHistory();
    showTab('home');
});
