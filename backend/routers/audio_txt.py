import base64
import wave
import struct
import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from fastapi import APIRouter
router=APIRouter()

def derive_key(password, salt):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

def encrypt_text(text, password):
    salt = os.urandom(16)
    key = derive_key(password, salt)
    nonce = os.urandom(12)

    cipher = Cipher(algorithms.AES(key), modes.GCM(nonce), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_text = encryptor.update(text.encode()) + encryptor.finalize()

    return base64.b64encode(salt + nonce + encryptor.tag + encrypted_text)

def decrypt_text(encrypted_data, password):
    combined = base64.b64decode(encrypted_data)
    salt, nonce, tag, encrypted_text = combined[:16], combined[16:28], combined[28:44], combined[44:]

    key = derive_key(password, salt)
    cipher = Cipher(algorithms.AES(key), modes.GCM(nonce, tag), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_text = decryptor.update(encrypted_text) + decryptor.finalize()

    return decrypted_text.decode()

def embed_text_in_audio(audio_path, text, password, output_path):
    encrypted_text = encrypt_text(text, password)
    encrypted_length = struct.pack('I', len(encrypted_text))

    with wave.open(audio_path, 'rb') as audio:
        params = audio.getparams()
        frames = audio.readframes(audio.getnframes())

    with wave.open(output_path, 'wb') as audio_out:
        audio_out.setparams(params)
        audio_out.writeframes(encrypted_length + encrypted_text + frames)

def extract_text_from_audio(encrypted_audio, password):
    with wave.open(encrypted_audio, "rb") as audio:
        frames = audio.readframes(audio.getnframes())
    
    encrypted_length = struct.unpack('I', frames[:4])[0]
    encrypted_data = frames[4:4 + encrypted_length]
    
    try:
        return decrypt_text(encrypted_data, password)
    except Exception as e:
        print("Error decoding decrypted text:", e)
        return None

@router.post("/encode/")
async def embed_text(
    audio_file: UploadFile = File(...),
    text: str = Form(...),
    password: str = Form(...)
):
    output_path = "encrypted_audio.wav"
    input_path = "input_audio.wav"

    with open(input_path, "wb") as f:
        f.write(await audio_file.read())
    
    embed_text_in_audio(input_path, text, password, output_path)

    return FileResponse(output_path, media_type="audio/wav", filename="encrypted_audio.wav")

@router.post("/decode/")
async def extract_text(
    audio_file: UploadFile = File(...),
    password: str = Form(...)
):
    input_path = "input_encrypted_audio.wav"

    with open(input_path, "wb") as f:
        f.write(await audio_file.read())

    extracted_text = extract_text_from_audio(input_path, password)
    
    if extracted_text is None:
        raise HTTPException(status_code=400, detail="Incorrect password or invalid file.")
    
    return {"extracted_text": extracted_text}
