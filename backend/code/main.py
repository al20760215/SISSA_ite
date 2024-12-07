import os
import psycopg2
import bcrypt
from psycopg2 import sql
from flask import Flask, request, send_from_directory, jsonify
from flask_limiter import Limiter
from flask_cors import CORS
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt, jwt_required, get_jwt_identity
import datetime
from datetime import timedelta


app = Flask(__name__)
cors = CORS(app)
app.secret_key = os.getenv('SECRET_KEY', 'your_secret_key')
app.config["JWT_SECRET_KEY"] = app.secret_key
app.config["JWT_BLACKLIST_ENABLED"] = True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=15)  # Expiracion default de 15 min
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(days=30)    # Expiracion default de 30 días (se pueden cambiar a la hora de generar tokens especificas)

jwt = JWTManager(app)

def get_db_connection():
    conn = psycopg2.connect(
        dbname="sissa_postgres_db",  
        user="postgres",       
        password="password",  
        host="db",             
        port="5432"
    )
    return conn

@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT id, usuario, tipousuario, fechacreacion, fechavencimiento FROM usuarios")
        usuarios = cur.fetchall()

        resultado = [
            {
                "id": usuario[0],
                "usuario": usuario[1],
                "tipo_usuario": usuario[2],
                "fecha_creacion": usuario[3],
                "fecha_vencimiento": usuario[4],
            }
            for usuario in usuarios
        ]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/addusuarios', methods=['POST'])
def agregar_usuario():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        usuario = data.get('usuario')
        tipousuario = data.get('tipousuario')
        contraseña = data.get('contraseña')


        if not (usuario and tipousuario and contraseña):
            return jsonify({"msg": "Faltan campos obligatorios"}), 400

        tipos_validos = ['alumno', 'maestro', 'encargado', 'sys']
        if tipousuario not in tipos_validos:
            return jsonify({"msg": "El tipo de usuario no es válido"}), 400


        query = """
        INSERT INTO usuarios (usuario, tipousuario, contraseña)
        VALUES (%s, %s, %s)
        """
        cur.execute(query, (usuario, tipousuario, contraseña))
        conn.commit()

        return jsonify({"msg": "Usuario agregado exitosamente"}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# Validar relación de claves foráneas
def validar_relacion_foreanea(conn, tabla, id):
    cur = conn.cursor()
    query = f"SELECT 1 FROM {tabla} WHERE id = %s"
    cur.execute(query, (id,))
    existe = cur.fetchone()
    cur.close()
    return existe is not None






# configuracion de /uploads
UPLOAD_FOLDER = "/uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'docx', 'pdf'}
# Verificar si el archivo tiene una extension permitida
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Configuracion de Flask-Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["15 per day", "10 per hour"],  # Límite global (ejemplo: 10 peticiones por hora)
    headers_enabled=os.getenv("RATELIMIT_HEADERS_ENABLED", "true").lower() in ["true", "1"]
)

# Configuracion de la conexion a la base de datos
def get_db_connection():
    connection = psycopg2.connect(
        host="db",
        database=os.getenv("POSTGRES_DB","none"),
        user=os.getenv("POSTGRES_USER", "none"),
        password=os.getenv("POSTGRES_PASSWORD", "none")
    )
    return connection

# Registrar usuarios con contraseña encriptada
@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    email = request.form['email']
    password = request.form['password']
    device = request.form['device']

    # Validar que todos los campos esten presentes
    if not username or not first_name or not last_name or not email or not password or not device:
        return {"error": "todos los campos deben estar estar presentes"}

    # Verificar si el nombre de usuario o correo ya existen
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return {"error": "El nombre de usuario o email ya estan registrados."}

    # Encriptar la contraseña
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insertar los datos del nuevo usuario en la base de datos
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (username, first_name, last_name, email, password, device)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (username, first_name, last_name, email, hashed_password.decode('utf-8'), device))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Usuario registrado exitosamente."}
    except Exception as e:
        return {f"Error al registrar el usuario: {str(e)}"}

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        return {"error": "Usuario no encontrado"}, 404

    if bcrypt.checkpw(password.encode('utf-8'), user[0].encode('utf-8')):
        access_token = create_access_token(identity=username, expires_delta=timedelta(minutes=1))
        refresh_token = create_refresh_token(identity=username, expires_delta=timedelta(days=30))
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    else:
        return {"error": "Contraseña incorrecta"}, 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()
    return f"Bienvenido, {current_user}"

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

# LOGOUT con JWT, usando lista temporal en memoria (No escalable)
BLACKLIST = set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLACKLIST  # `jti` es un identificador único para el token
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Obtener el identificador único del token
    BLACKLIST.add(jti)       # Agregar el token a la lista de bloqueo
    return jsonify(msg="Logout exitoso"), 200


@app.route('/')
@limiter.limit("3 per minute")
def home():
    return "Hello world!\nAqui tienes un limite de 3 peticiones por minuto :)"

@app.route('/pagina')
def pagina():
    return "Esta es la pagina en el endpoint /pagina.\nSin limite especifico pero es Afectado por el limite global de 10 por hora c:"

@app.route('/usuarios')
@limiter.limit("2 per minute")  # Limitar la consulta de usuarios a 2 por min
def usuarios():
    # Funcion para obtener la lista de usuarios de la base de datos
    try:
        # Establece la conexion con la base de datos
        conn = get_db_connection()
        cursor = conn.cursor()
        # Consulta para obtener los usuarios
        query = sql.SQL("SELECT * FROM alumnos")
        # Ejecuta la consulta
        cursor.execute(query)
        # Obtén todos los resultados
        users = cursor.fetchall()     
        # Cierra el cursor y la conexion
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Ocurrió un error: {e}")
        return {"error": str(e)}

    return users

@app.route('/upload', methods=['POST'])
@jwt_required
def upload_file():
    if 'file' not in request.files:
        return {"error": "No se envió ningún archivo"}, 400
    file = request.files['file']
    if file.filename == '':
        return {"error": "Nombre de archivo vacío"}, 400
    if file and allowed_file(file.filename):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        if os.path.exists(file_path):
            return {"error": "El archivo ya existe"}, 400
        try:
            file.save(file_path)
            return {"message": "Archivo cargado exitosamente"}, 201
        except Exception as e:
            return {"error": f"Error al guardar el archivo: {str(e)}"}, 500
    else:
        return {"error": "Tipo de archivo no permitido"}, 400

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    if allowed_file(filename):
        try:
            return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
        except FileNotFoundError:
            return {"error": "Archivo no encontrado"}, 404
    else:
        return {"error": "Tipo de archivo no permitido"}, 400

# Manejo de usuarios bloqueados por exceder el límite
@app.errorhandler(429)
def ratelimit_handler(e):
    return {"error": "Limite de peticiones excedido. Intentelo de nuevo más tarde.  " + str(e)}, 429

# Manejo de tokens JWT expirados
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token expirado. Inicia sesión nuevamente."}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
