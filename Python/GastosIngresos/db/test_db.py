from session import get_session

def test_database_connection():
    try:
        # Intenta crear una sesión de base de datos
        with get_session() as session:
            # Realiza una operación de prueba, como una consulta de prueba
            result = session.execute("SELECT 1")
            # Verifica si la operación se completó con éxito
            if result:
                return("Conexión a la base de datos establecida correctamente")
            else:
                return("Error al realizar la operación en la base de datos") 
    except Exception as e:
        # Captura cualquier error que ocurra durante la conexión o la operación
        return f"Error al conectar con la base de datos: {str(e)}"
