import sys
import torch
from transformers import AutoModel

MODEL_NAME = "ARTPARK-IISc/SraVaani-1.0"

device = "cpu"

print(f"Loading SraVaani on: {device}")

model = AutoModel.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
).to(device).eval()

print("SraVaani loaded successfully.")

if len(sys.argv) < 2:
    print("\nUsage:")
    print("python voice/asr_test.py <audio_file.wav>")
    sys.exit(1)

audio_path = sys.argv[1]

print(f"\nTranscribing: {audio_path}")
print("Please wait...\n")

hypotheses = model.transcribe(
    audio_path,
    return_hypotheses=True
)

for hypothesis in hypotheses:
    print("================================")
    print("TRANSCRIPTION:")
    print(hypothesis.text)
    print("================================")
