import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

print(os.getenv("JWT_SECRET_KEY"))  # Print the secret key
