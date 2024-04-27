# #con el type podemos saber que tipo de datos es
# a = 4.5; b = "4.5"
# c = [1 ,2 ,3 ,4]
# d = (1 ,2 ,3 ,4)

# print ( type ( a ) ) 
# print ( type ( b ) ) 
# print ( type ( c ) ) 
# print ( type ( d ) ) 

# #Sacar promedio de los estudiantes
# estudiantes = []
# estudiantes.append(('Juan', 'Aguila', '1400000', []))
# estudiantes.append(('Aldo', 'Verri', '1400001', []))
# estudiantes.append(('Maria', 'Pinto', '1400002', []))

# #Agrego notas
# estudiantes [0][3].append (6.5)
# estudiantes [0][3].append (7.0)
# estudiantes [0][3].append (6.7)

# estudiantes [1][3].append (3.0)
# estudiantes [1][3].append (2.7)
# estudiantes [1][3].append (3.8)

# estudiantes [2][3].append (5.7)
# estudiantes [2][3].append (7.0)
# estudiantes [2][3].append (6.2)

# for e in estudiantes :
#     promedio = sum( e [3]) /len( e [3])
#     print (e[1] ,"\t= >", promedio )





#se define primero la clase y se puede agregar a variables con la misma clase
# class persona:
#     pass

# variable1 = persona()
# variable1.nombre = "Juan"
# variable1.apellido = "Aguila"
# variable1.n_alumno = 14000000 

# # Creo otra persona
# variable_persona2= persona()
# variable_persona2.nombre = "Aldo "
# variable_persona2.apellido = "Verri "
# variable_persona2.n_alumno = 14000001 

# # Creo ´u ltimo estudiante
# variable_persona3 = persona()
# variable_persona3.nombre = "Maria"
# variable_persona3.apellido = "Pinto "
# variable_persona3.n_alumno = 14000002 

# estudiantes = []
# estudiantes.append( variable1 )
# estudiantes.append( variable_persona2 )
# estudiantes.append( variable_persona3 )

# # Muestro los nombres
# for e in estudiantes :
#     print( e.n_alumno )


#clases con constructores 

class persona:
    def constru(self, nombre, apellido, n_alumno):
        self.nombre=nombre
        self.apellido=apellido
        self.n_alumno=n_alumno
        self.notas =[]

j = persona("juan")
j.nombre = 'Juan'
j.apellido = 'Aguila'
j.n_alumno = 14000000 





