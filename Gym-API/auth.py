# (Keycard- & Beveiligings-logica):
# Dit regelt de beveiliging, token-verificatie en de actieve keycard-timers


from datetime import datetime, timedelta
from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer






# Swagger herkent dit en maakt automatisch de 'Autoriseer' knop rechtsboven aan!
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")




tijdelijk_wachtwoord_opslag = {"code": None, "verloopt_om": None}
actieve_keycards = {}  # Slaat geldige tokens en hun verlooptijd op




# --- BEVEILIGINGSFUNCTIE ---
def controleer_keycard(token: str = Depends(oauth2_scheme)):
    """Controleert bij elke beveiligde actie of de 30-minuten keycard nog geldig is"""
    if token not in actieve_keycards:
        raise HTTPException(status_code=401, detail="Geen toegang: Ongeldige of ontbrekende Keycard.")
    
    if datetime.now() > actieve_keycards[token]:
        del actieve_keycards[token]
        raise HTTPException(status_code=401, detail="Keycard is verlopen (30 minuten limiet). Log opnieuw in.")
    
    return token