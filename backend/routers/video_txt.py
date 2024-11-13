import base64
import os
import struct
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from fastapi import APIRouter
import shutil
import tempfile

router = APIRouter()

MAGIC_MARKER = b'ENC_DATA'

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

def embed_text_in_video(video_path, text, password, output_path):
   
    encrypted_text = encrypt_text(text, password)
    encrypted_length = struct.pack('I', len(encrypted_text))  

    with tempfile.NamedTemporaryFile(delete=False) as temp_video:
        with open(video_path, 'rb') as video:
            video_data = video.read()
            temp_video.write(video_data)  

            temp_video.write(MAGIC_MARKER)
            temp_video.write(encrypted_length)
            temp_video.write(encrypted_text)

    return temp_video.name


def extract_text_from_video(encrypted_video, password):
 
    with open(encrypted_video, "rb") as video:
        video_data = video.read()

    marker_index = video_data.find(MAGIC_MARKER)
    
    if marker_index == -1:
        print(f"Error: Magic marker not found in the video file. File size: {len(video_data)} bytes")
        return None

    encrypted_length = struct.unpack('I', video_data[marker_index + len(MAGIC_MARKER):marker_index + len(MAGIC_MARKER) + 4])[0]
    
    encrypted_data = video_data[marker_index + len(MAGIC_MARKER) + 4:marker_index + len(MAGIC_MARKER) + 4 + encrypted_length]

    try:
        return decrypt_text(encrypted_data, password)
    except Exception as e:
        print(f"Error decoding decrypted text: {e}")
        return None

@router.post("/encode/")  
async def embed_text(
    video_file: UploadFile = File(...),
    text: str = Form(...),
    password: str = Form(...),
):
    input_path = "temp_video.mp4"
    output_path = "encrypted_video.mp4"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(video_file.file, buffer)

    encrypted_video_path = embed_text_in_video(input_path, text, password, output_path)

    return FileResponse(encrypted_video_path, media_type="video/mp4", filename="encrypted_video.mp4")

@router.post("/decode/")  
async def extract_text(
    video_file: UploadFile = File(...),
    password: str = Form(...),
):
    input_path = "temp_encrypted_video.mp4"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(video_file.file, buffer)

    extracted_text = extract_text_from_video(input_path, password)
    
    if extracted_text is None:
        raise HTTPException(status_code=400, detail="Incorrect password or invalid file.")
    
    return {"extracted_text": extracted_text}
