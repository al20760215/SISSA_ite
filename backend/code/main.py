import os
import psycopg2
import bcrypt
from psycopg2 import sql
from flask import Flask, request, send_from_directory, jsonify, send_file, render_template
from flask_limiter import Limiter
from flask_cors import CORS
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt, jwt_required, get_jwt_identity
import datetime
from datetime import timedelta
from flask import Flask, render_template_string
from weasyprint import HTML
import io

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

@app.route('/users', methods=['GET'])
def obtener_users():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT id, Username, UserType, CreationDate, ExpirationDate FROM users")
        users = cur.fetchall()

        resultado = [
            {
                "id": Username[0],
                "Username": Username[1],
                "tipo_Username": Username[2],
                "fecha_creacion": Username[3],
                "fecha_vencimiento": Username[4],
            }
            for Username in users
        ]
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/addusers', methods=['POST'])
def agregar_Username():
    data = request.get_json()
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        Username = data.get('Username')
        UserType = data.get('UserType')
        Password = data.get('Password')


        if not (Username and UserType and Password):
            return jsonify({"msg": "Faltan campos obligatorios"}), 400

        tipos_validos = ['student', 'teacher', 'supervisor', 'sys']
        if UserType not in tipos_validos:
            return jsonify({"msg": "El tipo de Username no es válido"}), 400


        query = """
        INSERT INTO users (Username, UserType, Password)
        VALUES (%s, %s, %s)
        """
        cur.execute(query, (Username, UserType, Password))
        conn.commit()

        return jsonify({"msg": "Usuario agregado exitosamente"}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()


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

# Registrar users con Password encriptada
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    Username = data.get('Username')
    UserType = data.get('UserType')
    Password = data.get('Password')

    # Validación de entrada
    if not (Username and UserType and Password):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    tipos_validos = ['student', 'teacher', 'supervisor', 'sys']
    if UserType not in tipos_validos:
        return jsonify({"error": "Tipo de Username no válido"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT id FROM users WHERE Username = %s", (Username,))
        if cur.fetchone():
            return jsonify({"error": "El nombre de Username ya está registrado"}), 409

        hashed_password = bcrypt.hashpw(Password.encode('utf-8'), bcrypt.gensalt())

        cur.execute("""
            INSERT INTO users (Username, UserType, Password)
            VALUES (%s, %s, %s)
        """, (Username, UserType, hashed_password))
        conn.commit()

        return jsonify({"msg": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al registrar el Username: {str(e)}"}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    Username = data.get('Username')
    Password = data.get('Password')

    # Validar campos obligatorios
    if not (Username and Password):
        return jsonify({"error": "Usuario y Password son obligatorios"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Buscar el Username por nombre
        cur.execute("SELECT Password FROM users WHERE Username = %s", (Username,))
        user = cur.fetchone()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        hashed_password = user[0]
        
        if isinstance(hashed_password, memoryview):
            hashed_password = bytes(hashed_password)
    
        if bcrypt.checkpw(Password.encode('utf-8'), hashed_password):
            # Generar tokens JWT
            access_token = create_access_token(identity=Username)
            refresh_token = create_refresh_token(identity=Username)
            return jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token
            }), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
    except Exception as e:
        return jsonify({"error": f"Error del servidor: {str(e)}"}), 500
    finally:
        cur.close()
        conn.close()



@app.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT id, Username, UserType, CreationDate, ExpirationDate FROM users WHERE Username = %s", (current_user,))
        user = cur.fetchone()

        if user:
            user_info = {
                "id": user[0],
                "Username": user[1],
                "tipo_Username": user[2],
                "fecha_creacion": user[3],
                "fecha_vencimiento": user[4]
            }
            return jsonify(user_info), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": f"Error al obtener la información del Username: {str(e)}"}), 500
    finally:
        cur.close()
        conn.close()


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

# Manejo de users bloqueados por exceder el límite
@app.errorhandler(429)
def ratelimit_handler(e):
    return {"error": "Limite de peticiones excedido. Intentelo de nuevo más tarde.  " + str(e)}, 429

# Manejo de tokens JWT expirados
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token expirado. Inicia sesión nuevamente."}), 401

#Para el pdf


@app.route('/generate-pdf/<int:student_id>', methods=['GET'])
def generate_pdf(student_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Obtener datos del estudiante
        cur.execute("""
            SELECT FirstName, LastName1, LastName2, ControlNumber, Address, Phone, Specialty, Semester
            FROM Students WHERE id = %s
        """, (student_id,))
        student = cur.fetchone()

        # Obtener datos de la organización
        cur.execute("""
            SELECT OrganizationName, Address, SupervisorFirstName, SupervisorLastName1, SupervisorLastName2
            FROM Organizations
            WHERE id = (SELECT OrganizationID FROM StudentProgramHistory WHERE StudentID = %s)
        """, (student_id,))
        organization = cur.fetchone()

        # Obtener historial del programa del estudiante
        cur.execute("""
            SELECT StartDate, EndDate FROM StudentProgramHistory WHERE StudentID = %s
        """, (student_id,))
        history = cur.fetchone()

        # Verificar que existan datos
        if not student or not organization or not history:
            return jsonify({"error": "Datos no encontrados"}), 404

        # Convertir datos a un diccionario
        data = {
            "Students": {
                "FirstName": student[0], "LastName1": student[1], "LastName2": student[2],
                "ControlNumber": student[3], "Address": student[4], "Phone": student[5],
                "Specialty": student[6], "Semester": student[7]
            },
            "Organizations": {
                "OrganizationName": organization[0], "Address": organization[1],
                "SupervisorFirstName": organization[2], "SupervisorLastName1": organization[3],
                "SupervisorLastName2": organization[4]
            },
            "StudentProgramHistory": {
                "StartDate": history[0], "EndDate": history[1]
            },
            "fecha_actual": datetime.datetime.now()
        }

        # Renderizar HTML con datos
        rendered_html = render_template("template.html", **data)

        # Generar PDF con WeasyPrint
        pdf_file = HTML(string=rendered_html).write_pdf()

        # Devolver el PDF como respuesta
        return send_file(
            io.BytesIO(pdf_file),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"Carta_Compromiso_{student[3]}.pdf"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
