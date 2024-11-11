import base64
import os
import struct
import shutil
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from fastapi import APIRouter

router = APIRouter()

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

def embed_text_in_exe(exe_path, text, password, output_path):
    encrypted_text = encrypt_text(text, password)
    encrypted_length = struct.pack('I', len(encrypted_text))

    with open(exe_path, 'rb') as exe:
        exe_data = exe.read()

    with open(output_path, 'wb') as exe_out:
        exe_out.write(encrypted_length)
        exe_out.write(encrypted_text)
        exe_out.write(exe_data)

def extract_text_from_exe(encrypted_exe, password):
    with open(encrypted_exe, "rb") as exe:
        exe_data = exe.read()

    encrypted_length = struct.unpack('I', exe_data[:4])[0]
    encrypted_data = exe_data[4:4 + encrypted_length]

    try:
        decrypted_text = decrypt_text(encrypted_data, password)
        return decrypted_text
    except Exception as e:
        print("Error decoding decrypted text:", e)
        return None


@router.post("/encode/")  
async def encrypt_file(
    exe_file: UploadFile = File(...),
    text: str = Form(...),
    password: str = Form(...)
):
    try:
        original_exe_path = f"temp_{exe_file.filename}"
        with open(original_exe_path, "wb") as buffer:
            shutil.copyfileobj(exe_file.file, buffer)

        encrypted_exe_path = f"encrypted_{exe_file.filename}"

        embed_text_in_exe(original_exe_path, text, password, encrypted_exe_path)

        return FileResponse(encrypted_exe_path, filename=f"encrypted_{exe_file.filename}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Encryption failed: {str(e)}")

@router.post("/decode/")  # Decrypt text from the executable
async def extract_text(
    exe_file: UploadFile = File(...),
    password: str = Form(...)
):
    try:
        input_path = f"temp_{exe_file.filename}"
        with open(input_path, "wb") as f:
            f.write(await exe_file.read())

        extracted_text = extract_text_from_exe(input_path, password)

        if not extracted_text:
            raise HTTPException(status_code=400, detail="Incorrect password or invalid file.")

        return {"extracted_text": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Decryption failed: {str(e)}")
