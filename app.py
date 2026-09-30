import os
import subprocess
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from voice.asr import transcribe


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="GramRozgar Local SraVaani Voice API"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "status": "ok",
        "message": "GramRozgar Local SraVaani Voice API is running"
    }


# ==========================================
# VOICE PIPELINE
# ==========================================

@app.post("/pipeline/process-voice")
@app.post("/pipeline/process-voice/")
async def process_voice(
    file: UploadFile = File(...)
):

    webm_path = None
    wav_path = None

    try:

        # --------------------------------------
        # SAVE BROWSER AUDIO
        # --------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".webm"
        ) as temp:

            webm_path = temp.name

            audio_data = await file.read()

            temp.write(audio_data)


        print()
        print("====================================")
        print("        VOICE REQUEST RECEIVED")
        print("====================================")
        print(f"File: {file.filename}")
        print(f"Saved: {webm_path}")


        # --------------------------------------
        # CREATE WAV FILE
        # --------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav"
        ) as temp:

            wav_path = temp.name


        print()
        print("Converting browser audio to WAV...")


        ffmpeg_result = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                webm_path,
                "-ar",
                "16000",
                "-ac",
                "1",
                "-vn",
                wav_path,
            ],
            capture_output=True,
            text=True
        )


        if ffmpeg_result.returncode != 0:

            print("FFmpeg error:")
            print(ffmpeg_result.stderr)

            raise HTTPException(
                status_code=500,
                detail="FFmpeg audio conversion failed"
            )


        print("Audio conversion successful.")


        # --------------------------------------
        # SRAVAANI ASR
        # --------------------------------------

        print()
        print("Running SraVaani ASR...")
        print("Please wait...")


        transcription = transcribe(
            wav_path
        )


        print()
        print("====================================")
        print("TRANSCRIPTION")
        print("====================================")
        print(transcription)
        print("====================================")


        # --------------------------------------
        # RESPONSE
        # --------------------------------------

        return {
            "status": "success",
            "detected_language": "unknown",
            "transcription": transcription
        }


    except HTTPException:
        raise


    except Exception as error:

        print()
        print("VOICE PIPELINE ERROR:")
        print(error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


    finally:

        # --------------------------------------
        # CLEAN TEMP FILES
        # --------------------------------------

        for path in [
            webm_path,
            wav_path
        ]:

            if path and os.path.exists(path):

                os.remove(path)

                print(
                    f"Deleted temporary file: {path}"
                )