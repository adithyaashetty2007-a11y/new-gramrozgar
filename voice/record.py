import sounddevice as sd
import soundfile as sf

SAMPLE_RATE = 16000
CHANNELS = 1
DURATION = 10
OUTPUT_FILE = "voice/test.wav"

print("====================================")
print("      GramRozgar Voice Recorder")
print("====================================")
print(f"Recording for {DURATION} seconds...")
print("Speak now!")
print()

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=CHANNELS,
    dtype="float32"
)

sd.wait()

sf.write(
    OUTPUT_FILE,
    audio,
    SAMPLE_RATE
)

print()
print("Recording complete!")
print(f"Saved to: {OUTPUT_FILE}")
