from fastapi import FastAPI
from pydantic import BaseModel


class Numero(BaseModel):
    num: int

app= FastAPI()

@app.get("/")
async def index():
    return{"message": "Hello world"}

@app.post("/suma")
async def get_suma(num1: int, num2:int):
    return{"resultado":num1+num2}    

# ingrese un numero sea -0 y mayor   que me devuelva lo siguiente es par o no es par, el factorial, el resultado de dividir ese numero sobre el primer par primo

def factorial(num: int):
    factori=1
    for i in range(num):
        factori= factori *(i+1)
        
    return factori

@app.post("/numero")
async def par_impar(numero:int):
    if(numero>0 and numero<100):
        parprimo= numero/2
        if(numero%2 == 0):
            
            return{"el numero es par": numero,
                    "el factorial es": factorial(numero),
                    "par primo es: " : parprimo                    
                    }
        else:
            return{"el numero es impar": numero,
                    "el factorial es": factorial(numero), 
                    "par primo es: " : parprimo 
                    }
            
    else:
        return{"el numero no es valido"}        