# (Pydantic Modellen & Validatie):
# Dit houdt al je data-validatie netjes op één centrale plek, inclusief jouw strikte letters-only patroon


from pydantic import BaseModel, EmailStr, Field




# --- PYDANTIC VALIDATIE MODELLEN (Pydantic V2) ---
class EmailAanvraag(BaseModel):
    email: EmailStr

class LoginAanvraag(BaseModel):
    email: EmailStr
    tijdelijk_wachtwoord: str = Field(..., description="De tijdelijke code die je via e-mail hebt ontvangen")

# Het data-model voor het aanmaken van leden, inclusief jouw strikte whitelist-patroon
class LidAanmakenSchema(BaseModel):
    naam: str = Field(
        ..., 
        description="De volledige naam van het nieuwe gym-lid (alleen letters toegestaan)",
        example="Jan Janssen",
        pattern=r"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäÄöÖçÇ\s\-]+$"  # Blokkeert cijfers en tekens direct aan de poort!
    )
    age: int = Field(..., description="De leeftijd van het lid (minimaal 16)", example=25, ge=16)
    email: EmailStr = Field(..., description="Het e-mailadres van het lid", example="jan.janssen@example.com")