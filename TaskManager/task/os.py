import os
secret_key = os.urandom(24)  # Generates a random 24-byte key
print(secret_key.hex())