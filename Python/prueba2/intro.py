n1 = 1
n2 = -2

suma= n1 + n2
print("hola mundo")
print(suma)

if suma>= 0:
    print("es positivo")
else:
    print("es negativo") 

numeros = [3, 2,3,5,6,3,7,3]

# for numero in numeros:
#     print(numero)
factorial=1
for i in range(20):
    factorial= factorial *(i+1)
    print(factorial)
i=0
while i <= 5:
    print("iterador", i)
    i+=1

diccionario= {"nombre": "Diego", "edad": 20, "is_live": True}
print(diccionario["nombre"])

def restar(n1, n2):
    resta =n1-n2
    return resta

print (restar(10,4))