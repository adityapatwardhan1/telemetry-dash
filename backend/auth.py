from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

hasher = PasswordHasher()

def hash_password(plain_password):
    """
    Hashes an unhashed password using the Argon2 algorithm
    :param plain_password: The password to hash
    :type plain_password: str
    :returns The hashed form of the password
    :rtype str
    """
    if plain_password is None:
        raise Exception("No password provided...")
    return hasher.hash(plain_password)

def verify_password(plain_password, hashed_password):
    """
    Verifies that a plain password matches the hashed password
    :param plain_password: The unhashed password
    :type plain_password: str
    :param hashed_password: The hashed password string
    :type hashed_password: str
    :returns Whether the plain and hashed passwords match
    :rtype bool
    """

    try:
        result = hasher.verify(hashed_password, plain_password)
        return result
    except VerifyMismatchError:
        print("VerifyMismatchError")
        return False
    except Exception as e:
        print("An unexpected error occurred during password verification:")
        print(e)
        return False