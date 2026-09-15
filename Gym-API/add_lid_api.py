import secrets
import sqlite3
from datetime import datetime, timedelta
from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware


# Alles importeren uit mijn aparta files
from db import db_conn
from schemes import EmailAanvraag, LidAanmakenSchema, LoginAanvraag
from auth import oauth2_scheme, tijdelijk_wachtwoord_opslag, actieve_keycards, controleer_keycard





app = FastAPI(
    title="Masky Gym Secure API",
    description="Gym API beveiligd met een 30-minuten Keycard, Naam-validatie en SQLite database.",
    version="1.0.0"
)


# CORS openzetten zodat je testomgevingen (zoals VS Code Live Server) foutloos kunnen communiceren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


VAST_EMAIL = "masky.somebody33@gmail.com"  # Jouw vaste bevoegde e-mailadres



# ==================== BEVEILIGINGS ENDPOINTS =====================

@app.post("/api/v1/auth/code-aanvragen", summary="1. Vraag tijdelijk wachtwoord aan")
async def code_aanvragen(payload: EmailAanvraag):
    if payload.email.lower() != VAST_EMAIL.lower():
        raise HTTPException(status_code=403, detail="Dit e-mailadres is niet bevoegd.")
    
    tijdelijke_code = "".join(secrets.choice("0123456789") for _ in range(6))
    tijdelijk_wachtwoord_opslag["code"] = tijdelijke_code
    tijdelijk_wachtwoord_opslag["verloopt_om"] = datetime.now() + timedelta(minutes=5)
    
    # Geprint in de terminal tot de e-mailkoppeling er is
    print(f"\n[E-MAIL SIMULATIE] Verzonden naar {VAST_EMAIL}: Jouw tijdelijke code is: {tijdelijke_code}\n")
    
    return {"status": "success", "message": "Tijdelijk wachtwoord is verzonden (Zie je Python terminal!)."}



@app.post("/api/v1/auth/login", summary="2. Autoriseren (Verkrijg 30-minuten Keycard)")
async def login(payload: LoginAanvraag):
    if not tijdelijk_wachtwoord_opslag["code"] or datetime.now() > tijdelijk_wachtwoord_opslag["verloopt_om"]:
        raise HTTPException(status_code=400, detail="Geen actieve code gevonden of code is verlopen.")
    
    if payload.tijdelijk_wachtwoord != tijdelijk_wachtwoord_opslag["code"] or payload.email.lower() != VAST_EMAIL.lower():
        raise HTTPException(status_code=401, detail="Onjuist e-mailadres of onjuist tijdelijk wachtwoord.")
    
    keycard_id = secrets.token_hex(32)
    actieve_keycards[keycard_id] = datetime.now() + timedelta(minutes=30)
    tijdelijk_wachtwoord_opslag["code"] = None
    
    return {
        "access_token": keycard_id,
        "token_type": "bearer",
        "expires_in_seconds": 1800
    }



@app.post("/api/v1/auth/logout", summary="3. Deautoriseren (Unauthorize)")
async def logout(token: str = Depends(oauth2_scheme)):
    if token in actieve_keycards:
        del actieve_keycards[token]
    return {"status": "success", "message": "Succesvol gedeautoriseerd."}



# ==================== GEBRUIKELIJKE LEDEN ENDPOINTS (BEVEILIGD & PERSISTENT!) ====================

@app.post("/api/v1/leden", status_code=status.HTTP_201_CREATED, summary="Add new lid")
async def lid_aanmaken(payload: LidAanmakenSchema, token: str = Depends(controleer_keycard)):
    cursor = db_conn.cursor()
    huidige_tijd = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        # Sla het lid permanent op in de SQLite database
        cursor.execute(
            "INSERT INTO gym_members (naam, age, email, is_active, created_at) VALUES (?, ?, ?, 1, ?)",
            (payload.naam, payload.age, payload.email, huidige_tijd)
        )
        db_conn.commit()
        
        print(f"[DATABASE LOG] Nieuw lid succesvol opgeslagen: {payload.naam}")
        
        return {
            "status": "success",
            "message": f"Lid '{payload.naam}' is succesvol en permanent opgeslagen in de database!",
            "data": {
                "naam": payload.naam,
                "age": payload.age,
                "email": payload.email,
                "is_active": True,
                "created_at": huidige_tijd
            }
        }
    except sqlite3.Error as e:
        print(f"[DATABASE ERROR] {e}")
        raise HTTPException(status_code=500, detail="Interne databasefout bij het opslaan van het lid.")
