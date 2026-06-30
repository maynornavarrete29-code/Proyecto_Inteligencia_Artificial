import argparse
import face_recognition
import cv2
import numpy as np
import json
import os
import sys

class SistemaBiometricoEnVivo:
    def __init__(self, db_file="base_datos.json"):
        self.db_file = db_file
        self.encodings = []
        self.ids = []
        self.names = []
        self.cargar_datos()

    def cargar_datos(self):
        """Carga los encodings guardados desde el archivo JSON local."""
        if os.path.exists(self.db_file):
            with open(self.db_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                for identifier, payload in data.items():
                    if isinstance(payload, dict) and 'encoding' in payload:
                        self.ids.append(identifier)
                        self.names.append(payload.get('name', identifier))
                        self.encodings.append(np.array(payload['encoding']))
                    else:
                        self.ids.append(identifier)
                        self.names.append(identifier)
                        self.encodings.append(np.array(payload))
            print(f"Base de datos cargada. {len(self.ids)} usuarios registrados.")

    def guardar_datos(self):
        data = {
            identifier: {
                "name": name,
                "encoding": encoding.tolist()
            }
            for identifier, name, encoding in zip(self.ids, self.names, self.encodings)
        }
        with open(self.db_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

    def registrar_rostro_en_vivo(self, identifier, name):
        """Abre la cámara para escanear y registrar un rostro en tiempo real."""
        video_capture = cv2.VideoCapture(0)
        print(f"\n[Escáner] Iniciando cámara para registrar a: {name} ({identifier})")
        print(">> Mira a la cámara de frente y presiona la tecla 'S' para guardar.")
        print(">> Presiona 'Q' si deseas cancelar.")

        result = {"success": False, "message": "No se completó el registro."}

        while True:
            ret, frame = video_capture.read()
            if not ret:
                result = {"success": False, "message": "Error al acceder a la cámara."}
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)

            for (top, right, bottom, left) in face_locations:
                cv2.rectangle(frame, (left, top), (right, bottom), (255, 100, 0), 2)
                cv2.putText(frame, "Rostro Detectado", (left, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 100, 0), 2)

            cv2.putText(frame, "Presiona 'S' para Capturar", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            cv2.imshow('Registro FaceID - En Vivo', frame)

            tecla = cv2.waitKey(1) & 0xFF
            if tecla == ord('s') or tecla == ord('S'):
                if len(face_locations) == 1:
                    encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                    if len(encodings) > 0:
                        nuevo_encoding = encodings[0]
                        self.ids.append(identifier)
                        self.names.append(name)
                        self.encodings.append(nuevo_encoding)
                        self.guardar_datos()
                        result = {
                            "success": True,
                            "id": identifier,
                            "name": name,
                            "message": f"Rostro de '{name}' registrado correctamente."
                        }
                        break
                elif len(face_locations) > 1:
                    result = {"success": False, "message": "Hay más de un rostro en la cámara. Regístrate solo tú."}
                else:
                    result = {"success": False, "message": "No se detecta ningún rostro. Intenta de nuevo."}

            elif tecla == ord('q') or tecla == ord('Q'):
                result = {"success": False, "message": "Registro cancelado por el usuario."}
                break

        video_capture.release()
        cv2.destroyAllWindows()
        print(json.dumps(result, ensure_ascii=False))
        return result

    def verificar_rostro_en_vivo(self):
        """Abre la cámara y compara los rostros en vivo contra el archivo JSON."""
        if len(self.encodings) == 0:
            result = {"success": False, "message": "No hay usuarios registrados en el almacenamiento local."}
            print(json.dumps(result, ensure_ascii=False))
            return result

        video_capture = cv2.VideoCapture(0)
        print("\n--- Escáner de Verificación Activo ---")
        print(">> Presiona 'Q' en la ventana de video para salir.")

        result = {"success": False, "message": "No se reconoció ningún rostro."}

        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
                distancias = face_recognition.face_distance(self.encodings, encoding)
                if len(distancias) == 0:
                    continue

                mejor_match_index = np.argmin(distancias)
                if distancias[mejor_match_index] < 0.6:
                    identifier = self.ids[mejor_match_index]
                    name = self.names[mejor_match_index]
                    result = {
                        "success": True,
                        "id": identifier,
                        "name": name,
                        "distance": float(distancias[mejor_match_index]),
                        "message": f"Rostro reconocido: {name}."
                    }
                    color = (0, 255, 0)
                else:
                    color = (0, 0, 255)

                cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                cv2.putText(frame, result.get('name', 'Desconocido'), (left, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

            cv2.imshow('Verificacion FaceID - En Vivo', frame)

            if result.get('success'):
                break

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()
        print(json.dumps(result, ensure_ascii=False))
        return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='FaceID controller para BeyondDev')
    parser.add_argument('mode', choices=['register', 'verify'], help='Modo de operación: register o verify')
    parser.add_argument('--id', dest='identifier', help='Identificador único del usuario (correo electrónico)')
    parser.add_argument('--name', help='Nombre completo del usuario')
    parser.add_argument('--db', help='Ruta al archivo de base de datos JSON de rostros')
    args = parser.parse_args()

    sistema = SistemaBiometricoEnVivo(db_file=args.db if args.db else 'base_datos.json')

    if args.mode == 'register':
        if not args.identifier or not args.name:
            print(json.dumps({"success": False, "message": "Se requiere --id y --name para registrar un rostro."}, ensure_ascii=False))
            sys.exit(1)
        result = sistema.registrar_rostro_en_vivo(args.identifier, args.name)
        sys.exit(0 if result.get('success') else 1)
    elif args.mode == 'verify':
        result = sistema.verificar_rostro_en_vivo()
        sys.exit(0 if result.get('success') else 1)
