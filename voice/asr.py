import torch
from transformers import AutoModel

MODEL_NAME = "ARTPARK-IISc/SraVaani-1.0"

print("Loading SraVaani ASR...")

DEVICE = "cpu"

model = AutoModel.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
).to(DEVICE).eval()

print("SraVaani ASR ready.")


def transcribe(audio_path):
    """
    Transcribe an audio file using SraVaani.
    """

    hypotheses = model.transcribe(
        audio_path,
        return_hypotheses=True
    )

    if not hypotheses:
        return ""

    return hypotheses[0].text.strip()
